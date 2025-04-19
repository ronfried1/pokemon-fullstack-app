import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pokemon } from './schemas/pokemon.schema';

export interface PokemonResult {
  name: string;
  url: string;
  isFav: boolean;
  isViewed: boolean;
  details: {
    id: number;
    name: string;
    types: any[];
    sprites: any;
    stats: any[];
    species: { url: string };
    moves: any[];
  };
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

export type PokemonSpritesOther = Record<string, Record<string, string | null>>;

// Update PokemonApiResponse interface to include all needed fields
interface PokemonApiResponse {
  id: number;
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  base_experience: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    back_shiny: string;
    back_default: string;
    other: PokemonSpritesOther;
    versions: {
      'generation-v': {
        'black-white': {
          animated: {
            back_default: string;
            front_default: string;
            back_shiny: string;
            front_shiny: string;
          };
        };
      };
    };
  };
  species: {
    url: string;
  };
  moves: any[];
}

interface EvolutionChainResponse {
  chain: ChainLink;
}

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);
  private readonly pokeApiBaseUrl = 'https://pokeapi.co/api/v2';

  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

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

  async searchPokemon(query: string, limit = 20): Promise<PokemonResult[]> {
    const startTime = Date.now();
    try {
      // Create a regex pattern for case-insensitive search
      const searchRegex = new RegExp(query, 'i');

      // Search in MongoDB by name only
      const mongoData = await this.pokemonModel
        .find({ name: searchRegex })
        .limit(limit)
        .exec();

      // Enrich the data with details if needed
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
        `searchPokemon execution time: ${endTime - startTime}ms (query: ${query}, limit: ${limit})`,
      );

      return enrichedPokemon;
    } catch (error) {
      const endTime = Date.now();
      this.logger.error(
        `searchPokemon failed after ${endTime - startTime}ms: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      );

      throw new InternalServerErrorException('Failed to search Pokemon data', {
        cause: new Error(),
        description: 'Search Error',
      });
    }
  }

  async fetchAndSavePokemonDetails(pokemon: Pokemon) {
    try {
      // Fetch basic details for the list view
      const response = await axios.get<PokemonApiResponse>(pokemon.url);
      const basicDetails = response.data;

      // Store necessary data for Pokemon cards
      const simplifiedDetails = {
        id: basicDetails.id,
        name: basicDetails.name,
        // Include full types data structure for the card component
        types: basicDetails.types,
        height: basicDetails.height,
        weight: basicDetails.weight,
        base_experience: basicDetails.base_experience,
        abilities: basicDetails.abilities,
        moves: basicDetails.moves,

        // Include full sprites object with all variations
        sprites: {
          front:
            basicDetails.sprites.other.dream_world.front_default ||
            basicDetails.sprites.other['official-artwork'].front_default ||
            basicDetails.sprites.other.home.front_default,
          back:
            basicDetails.sprites.back_default ||
            basicDetails.sprites.versions['generation-v']['black-white']
              .animated.back_default,
          front_shiny:
            basicDetails.sprites.other.home.front_shiny ||
            basicDetails.sprites.versions['generation-v']['black-white']
              .animated.front_shiny,
          back_shiny:
            basicDetails.sprites.back_shiny ||
            basicDetails.sprites.versions['generation-v']['black-white']
              .animated.back_shiny,
          front_artwork:
            basicDetails.sprites.other['official-artwork'].front_default,
        },
        // Add base stats that might be displayed in the card
        stats: basicDetails.stats,

        // Don't include evolutions or full move data to keep it lightweight
      };

      // Update the Pokemon document with the simplified details
      pokemon.details = simplifiedDetails;
      await pokemon.save();

      return { details: simplifiedDetails };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch Pokemon details: ${errorMessage}`);
      throw new InternalServerErrorException('Failed to fetch Pokemon details');
    }
  }

  async getPokemonDetails(pokemonId: string): Promise<any> {
    try {
      this.logger.log(`getPokemonDetails ${pokemonId} ${Date.now()}`);

      // Find the Pokemon by ID
      const pokemon = await this.pokemonModel
        .findById(new Types.ObjectId(pokemonId))
        .exec();
      if (!pokemon) {
        throw new NotFoundException(`Pokemon with ID ${pokemonId} not found`);
      }

      // Define a type for our Pokemon details to avoid unsafe member access
      interface PokemonDetailsType {
        id?: number;
        name?: string;
        types?: any[];
        abilities?: any[];
        stats?: any[];
        sprites?: any;
        species?: { url: string };
        moves?: any[];
        evolutions?: EvolutionData[];
        height?: number;
        weight?: number;
        base_experience?: number;
      }

      // Type assertion for details
      const details = pokemon.details as PokemonDetailsType | undefined;
      this.logger.log(
        `getPokemonDetails execution time: ${Date.now()}`,
        pokemon._id,
        details?.id,
        details?.evolutions,
      );

      // If we have full details with evolutions, just return them
      if (
        pokemon.isViewed &&
        details &&
        details.evolutions &&
        details.evolutions.length > 0
      ) {
        this.logger.log(
          `getPokemonDetails returning existing details: ${Date.now()}`,
        );
        return { details: pokemon.details, _id: pokemon._id };
      }

      // We already have basic details, so we just need to add evolutions and moves
      const pokemonDetails: PokemonDetailsType = details || {};
      let evolutionChain: EvolutionData[] = [];

      // Fetch evolution chain
      try {
        const evolutionResponse = await axios.get<EvolutionChainResponse>(
          `${this.pokeApiBaseUrl}/evolution-chain/${pokemonDetails.id}`,
        );

        // Process evolution chain
        evolutionChain = this.processEvolutionChain(
          evolutionResponse.data.chain,
        );
        this.logger.log(
          `getPokemonDetails evolutionChain: ${Date.now()}`,
          evolutionChain,
        );
      } catch (evolutionError) {
        const errorMessage =
          evolutionError instanceof Error
            ? evolutionError.message
            : 'Unknown error';
        this.logger.error(`Failed to fetch evolution chain: ${errorMessage}`);
        // Continue without evolutions if there's an error
      }

      // Add the evolution chain to the details
      pokemonDetails.evolutions = evolutionChain;

      // Save the complete details to the Pokemon document using set and markModified
      pokemon.set('details', pokemonDetails);
      pokemon.set('isViewed', true);

      // Explicitly mark the details field as modified
      pokemon.markModified('details');

      await pokemon.save();

      const detailss = pokemon.details as PokemonDetailsType | undefined;
      this.logger.log(
        `getPokemonDetails after save: ${Date.now()}`,
        detailss?.evolutions,
      );

      return { details: pokemon.details, _id: pokemon._id };
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

  // Helper method to extract ID from URL
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : 0;
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

  async getFavorites(): Promise<PokemonResult[]> {
    try {
      const mongoData = await this.pokemonModel.find({ isFav: true }).exec();

      const enrichedPokemon = await Promise.all(
        mongoData.map(async (pokemon) => {
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

      return enrichedPokemon;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to fetch favorites: ${errorMessage}`);
      throw new InternalServerErrorException('Failed to fetch favorites', {
        cause: new Error(),
        description: 'Internal Server Error',
      });
    }
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    try {
      const pokemon = await this.pokemonModel
        .findById(new Types.ObjectId(id))
        .exec();
      if (!pokemon) {
        throw new NotFoundException(`Pokemon with ID ${id} not found`);
      }

      pokemon.isFav = isFavorite;
      await pokemon.save();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to toggle favorite status: ${errorMessage}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to toggle favorite status',
        {
          cause: new Error(),
          description: 'Internal Server Error',
        },
      );
    }
  }
}
