import axios from "axios";
import { z } from "zod";
import { Pokemon, PokemonDetail } from "../types/pokemon";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Define the nested details schema that both Pokemon and PokemonDetail will use
const PokemonDetailsSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    types: z
      .array(
        z.union([
          z.string(),
          z.object({
            type: z.object({
              name: z.string(),
            }),
          }),
        ])
      )
      .optional(),
    abilities: z
      .array(
        z.union([
          z.string(),
          z.object({
            ability: z.object({
              name: z.string(),
            }),
          }),
        ])
      )
      .optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    stats: z.any().optional(),
    sprites: z
      .union([
        z.object({
          front: z.string(),
          back: z.string().optional(),
        }),
        z.object({
          front_default: z.string().optional(),
          back_default: z.string().optional(),
          other: z.record(z.any()).optional(),
        }),
      ])
      .optional(),
    evolutions: z.array(z.any()).optional(),
  })
  .passthrough();

// Zod schema for simplified Pokemon
const PokemonSchema = z
  .object({
    _id: z.string().optional().default("temp-id"),
    name: z.string(),
    url: z.string(),
    isFav: z.boolean().default(false),
    isViewed: z.boolean().default(false),
    details: PokemonDetailsSchema.optional(),
  })
  .passthrough();

// Zod schema for detailed Pokemon information
const PokemonDetailSchema = z
  .object({
    _id: z.string(),
    pokeId: z.string(),
    details: PokemonDetailsSchema,
  })
  .passthrough();

const PokemonListSchema = z.array(PokemonSchema);
// Update the schema to accept either string array or objects with name property
const FavoritesListSchema = z.array(
  z.union([
    z.string(),
    z.object({
      _id: z.string(),
      name: z.string(),
      createdAt: z.string().optional(),
    }),
  ])
);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const pokemonApi = {
  // Fetch all Pokemon (basic info only)
  getAll: async (offset = 0, limit = 20): Promise<Pokemon[]> => {
    try {
      console.log(
        `API: Fetching Pokemon with offset=${offset}, limit=${limit}`
      );
      const response = await api.get(
        `/pokemon?offset=${offset}&limit=${limit}`
      );
      console.log(`API Response: Got ${response.data.length} Pokemon`);

      // Map any missing fields with defaults before validation
      const processedData = response.data.map((pokemon: any) => ({
        _id: pokemon._id || `temp-id-${pokemon.name}`,
        name: pokemon.name,
        url: pokemon.url,
        isFav: pokemon.isFav !== undefined ? pokemon.isFav : false,
        isViewed: pokemon.isViewed !== undefined ? pokemon.isViewed : false,
        details: pokemon.details || {},
      }));

      try {
        return PokemonListSchema.parse(processedData) as unknown as Pokemon[];
      } catch (zodError) {
        console.error("Zod validation error:", zodError);
        console.log(
          "Sample data causing the error:",
          JSON.stringify(processedData[0], null, 2)
        );
        throw zodError;
      }
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      throw error;
    }
  },

  // Fetch Pokemon details
  getPokemonDetails: async (pokemonId: string): Promise<PokemonDetail> => {
    try {
      const response = await api.get(`/pokemon/${pokemonId}/details`);
      try {
        return PokemonDetailSchema.parse(
          response.data
        ) as unknown as PokemonDetail;
      } catch (zodError) {
        console.error("Zod validation error in details:", zodError);
        console.log(
          "Data causing the error:",
          JSON.stringify(response.data, null, 2)
        );
        throw zodError;
      }
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
      throw error;
    }
  },

  // Fetch favorite Pokemon
  getFavorites: async (): Promise<string[]> => {
    try {
      const response = await api.get("/favorites");
      // Parse the data with our updated schema
      const favorites = FavoritesListSchema.parse(response.data);
      // Extract just the names if they're objects
      return favorites.map((fav) => (typeof fav === "string" ? fav : fav.name));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  // Add a Pokemon to favorites
  addFavorite: async (name: string): Promise<void> => {
    try {
      await api.post("/favorites", { name });
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  },

  // Remove a Pokemon from favorites
  removeFavorite: async (name: string): Promise<void> => {
    try {
      await api.delete("/favorites", { data: { name } });
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  },
};
