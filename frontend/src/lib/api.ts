import axios from "axios";
import { z } from "zod";
import { Pokemon, PokemonDetail } from "../types/pokemon";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Zod schema for simplified Pokemon
const PokemonSchema = z.object({
  _id: z.string().optional().default("temp-id"),
  name: z.string(),
  url: z.string(),
  isFav: z.boolean().default(false),
  isViewed: z.boolean().default(false),
});

// Zod schema for detailed Pokemon information
const PokemonDetailSchema = z.object({
  _id: z.string(),
  pokeId: z.string(),
  details: z.object({
    id: z.number(),
    name: z.string(),
    types: z.array(z.string()),
    abilities: z.array(z.string()),
    height: z.number(),
    weight: z.number(),
    stats: z.object({
      hp: z.number(),
      attack: z.number(),
      defense: z.number(),
      specialAttack: z.number(),
      specialDefense: z.number(),
      speed: z.number(),
    }),
    sprites: z.object({
      front: z.string(),
      back: z.string().optional(),
    }),
    evolutions: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          sprite: z.string(),
          condition: z.string().optional(),
        })
      )
      .optional(),
  }),
});

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
      }));

      return PokemonListSchema.parse(processedData);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      throw error;
    }
  },

  // Fetch Pokemon details
  getPokemonDetails: async (pokemonId: string): Promise<PokemonDetail> => {
    try {
      const response = await api.get(`/pokemon/${pokemonId}/details`);
      return PokemonDetailSchema.parse(response.data);
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
