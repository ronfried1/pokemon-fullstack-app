import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllPokemon', () => {
    it('should return an array of 150 pokemon', async () => {
      // Mock data
      const mockPokemonList = {
        data: {
          count: 1000,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=150&limit=150',
          previous: null,
          results: Array(150)
            .fill(0)
            .map((_, i) => ({
              name: `pokemon-${i + 1}`,
              url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
            })),
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockPokemonList);

      const result = await service.getAllPokemon();

      // Verify the function was called with the expected argument
      expect(mockedAxios.get.mock.calls[0][0]).toBe(
        'https://pokeapi.co/api/v2/pokemon?limit=150',
      );
      expect(result).toEqual(mockPokemonList.data.results);
      expect(result.length).toBe(150);
    });

    it('should throw an InternalServerErrorException when the API call fails', async () => {
      // Mock a failed API call
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getAllPokemon()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
