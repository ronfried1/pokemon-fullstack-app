import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pokemon, PokemonDetail } from './schemas/pokemon.schema';

export interface PokemonResult {
  name: string;
  url: string;
  isFav: boolean;
  isViewed: boolean;
  details: PokemonDetail;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

// API response types
interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string;
    back_default: string;
  };
  species: {
    url: string;
  };
}

interface PokemonSpeciesResponse {
  evolution_chain: {
    url: string;
  };
}

interface EvolutionChainResponse {
  chain: ChainLink;
}

interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
  evolution_details: EvolutionDetail[];
}

interface EvolutionDetail {
  min_level?: number;
  item?: {
    name: string;
  };
  trigger?: {
    name: string;
  };
}

interface EvolutionData {
  id: number;
  name: string;
  sprite: string;
  condition?: string;
}

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);
  private readonly pokeApiBaseUrl = 'https://pokeapi.co/api/v2';

  constructor(
    @InjectModel('Pokemon') private pokemonModel: Model<Pokemon>,
    @InjectModel('PokemonDetail')
    private pokemonDetailModel: Model<PokemonDetail>,
  ) {}

  async getAllPokemon(offset = 0, limit = 20): Promise<PokemonResult[]> {
    const startTime = Date.now();
    try {
      let mongoData = await this.pokemonModel
        .find()
        .skip(offset)
        .limit(limit)
        .exec();

      if (mongoData.length === 0 && offset === 0) {
        // No data at all - fetch initial 150 pokemons
        const response = await axios.get<PokemonListResponse>(
          `${this.pokeApiBaseUrl}/pokemon?limit=150`,
        );

        const pokemonToSave = response.data.results.map((pokemon) => ({
          name: pokemon.name,
          url: pokemon.url,
          isFav: false,
          isViewed: false,
        }));

        await this.pokemonModel.insertMany(pokemonToSave);

        mongoData = await this.pokemonModel
          .find()
          .skip(offset)
          .limit(limit)
          .exec();
      }

      const enrichedPokemon = await Promise.all(
        mongoData.map(async (pokemon) => {
          // If details are missing, fetch and save them
          if (!pokemon.details) {
            const detailedData = await this.fetchAndSavePokemonDetails(pokemon);
            pokemon.details = detailedData?.details;
          }
          return {
            _id: pokemon._id,
            name: pokemon.name,
            url: pokemon.url,
            isFav: pokemon.isFav,
            isViewed: pokemon.isViewed,
            details: pokemon.details,
          };
        }),
      );

      const endTime = Date.now();
      this.logger.log(
        `getAllPokemon execution time: ${endTime - startTime}ms (offset: ${offset}, limit: ${limit})`,
      );

      return enrichedPokemon;
    } catch (error) {
      const endTime = Date.now();
      this.logger.error(
        `getAllPokemon failed after ${endTime - startTime}ms: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      );

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      this.logger.error(
        `Failed to fetch Pokemon from PokeAPI: ${errorMessage}`,
      );
      throw new InternalServerErrorException(
        'Failed to fetch Pokemon data from the external API',
        {
          cause: new Error(),
          description: 'Bad Gateway',
        },
      );
    }
  }

  async fetchAndSavePokemonDetails(pokemon: Pokemon) {
    const response = await axios.get(pokemon.url);
    const details = response.data;

    await this.pokemonModel.updateOne(
      { _id: pokemon._id },
      { $set: { details } },
    );

    return { details };
  }

  async getPokemonDetails(pokemonId: string): Promise<any> {
    try {
      // First check if we already have the details in our database
      const existingDetail = await this.pokemonDetailModel
        .findOne({
          pokeId: new Types.ObjectId(pokemonId),
        })
        .exec();

      if (existingDetail) {
        return existingDetail;
      }
      // console.log('pokemonId', typeof pokemonId);

      // Find the basic Pokemon info
      const pokemon = await this.pokemonModel.findById(pokemonId).exec();
      if (!pokemon) {
        throw new NotFoundException(`Pokemon with ID ${pokemonId} not found`);
      }

      // Extract the Pokemon number from the URL
      const urlParts = pokemon.url.split('/');
      const pokeNumber = urlParts[urlParts.length - 2];

      // Fetch detailed information from PokeAPI
      const response = await axios.get<PokemonApiResponse>(
        `${this.pokeApiBaseUrl}/pokemon/${pokeNumber}`,
      );

      // Get species data for evolutions
      const speciesResponse = await axios.get<PokemonSpeciesResponse>(
        response.data.species.url,
      );

      // Fetch evolution chain if available
      let evolutionChain: EvolutionData[] = [];
      if (speciesResponse.data.evolution_chain) {
        const evolutionResponse = await axios.get<EvolutionChainResponse>(
          speciesResponse.data.evolution_chain.url,
        );

        // Process evolution chain (simplified for this example)
        evolutionChain = this.processEvolutionChain(
          evolutionResponse.data.chain,
        );
      }

      // Transform the data into our structure
      const detailData = {
        id: response.data.id,
        name: response.data.name,
        types: response.data.types.map((type) => type.type.name),
        abilities: response.data.abilities.map(
          (ability) => ability.ability.name,
        ),
        height: response.data.height,
        weight: response.data.weight,
        stats: {
          hp:
            response.data.stats.find((stat) => stat.stat.name === 'hp')
              ?.base_stat || 0,
          attack:
            response.data.stats.find((stat) => stat.stat.name === 'attack')
              ?.base_stat || 0,
          defense:
            response.data.stats.find((stat) => stat.stat.name === 'defense')
              ?.base_stat || 0,
          specialAttack:
            response.data.stats.find(
              (stat) => stat.stat.name === 'special-attack',
            )?.base_stat || 0,
          specialDefense:
            response.data.stats.find(
              (stat) => stat.stat.name === 'special-defense',
            )?.base_stat || 0,
          speed:
            response.data.stats.find((stat) => stat.stat.name === 'speed')
              ?.base_stat || 0,
        },
        sprites: {
          front: response.data.sprites.front_default,
          back: response.data.sprites.back_default,
        },
        evolutions: evolutionChain,
      };

      // Save the details to our database
      const pokemonDetail = await this.pokemonDetailModel.create({
        pokeId: pokemon._id,
        details: detailData,
      });

      // Mark the Pokemon as viewed
      pokemon.isViewed = true;
      await pokemon.save();

      return pokemonDetail;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      this.logger.error(`Failed to fetch Pokemon details: ${errorMessage}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch Pokemon details',
        {
          cause: new Error(),
          description: 'Internal Server Error',
        },
      );
    }
  }

  private processEvolutionChain(chain: ChainLink): EvolutionData[] {
    const evolutions: EvolutionData[] = [];

    // Add the base form
    evolutions.push({
      id: this.getIdFromUrl(chain.species.url),
      name: chain.species.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.getIdFromUrl(chain.species.url)}.png`,
    });

    // Process evolves_to recursively
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      for (const evolution of chain.evolves_to) {
        evolutions.push({
          id: this.getIdFromUrl(evolution.species.url),
          name: evolution.species.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.getIdFromUrl(evolution.species.url)}.png`,
          condition: this.getEvolutionCondition(evolution),
        });

        // Process next evolution level if exists
        if (evolution.evolves_to && evolution.evolves_to.length > 0) {
          for (const nextEvolution of evolution.evolves_to) {
            evolutions.push({
              id: this.getIdFromUrl(nextEvolution.species.url),
              name: nextEvolution.species.name,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.getIdFromUrl(nextEvolution.species.url)}.png`,
              condition: this.getEvolutionCondition(nextEvolution),
            });
          }
        }
      }
    }

    return evolutions;
  }

  private getIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }

  private getEvolutionCondition(evolution: ChainLink): string {
    if (evolution.evolution_details && evolution.evolution_details.length > 0) {
      const details = evolution.evolution_details[0];

      if (details.min_level) {
        return `Level ${details.min_level}`;
      } else if (details.item) {
        return `Use ${details.item.name}`;
      } else if (details.trigger && details.trigger.name) {
        return `${details.trigger.name}`;
      }
    }

    return 'Unknown';
  }
}
