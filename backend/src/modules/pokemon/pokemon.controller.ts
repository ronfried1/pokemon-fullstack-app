import { Controller, Get, Query, Param } from '@nestjs/common';
import { PokemonService, PokemonResult } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getAllPokemon(
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ): Promise<PokemonResult[]> {
    return this.pokemonService.getAllPokemon(Number(offset), Number(limit));
  }

  @Get('search')
  async searchPokemon(
    @Query('query') query: string,
    @Query('limit') limit = 20,
  ): Promise<PokemonResult[]> {
    return this.pokemonService.searchPokemon(query, Number(limit));
  }

  @Get(':id/details')
  async getPokemonDetails(@Param('id') id: string) {
    return this.pokemonService.getPokemonDetails(id);
  }
}
