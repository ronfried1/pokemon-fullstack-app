import axios from "axios";
import { z } from "zod";
import { Pokemon } from "../types/pokemon";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Zod schema for Pokemon
const PokemonSchema = z.object({
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
});

const PokemonListSchema = z.array(PokemonSchema);
const FavoritesListSchema = z.array(z.string());

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const pokemonApi = {
  // Fetch all Pokemon
  getAll: async (): Promise<Pokemon[]> => {
    try {
      const response = await api.get("/pokemon");
      return PokemonListSchema.parse(response.data);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      throw error;
    }
  },

  // Fetch favorite Pokemon
  getFavorites: async (): Promise<string[]> => {
    try {
      const response = await api.get("/favorites");
      return FavoritesListSchema.parse(response.data);
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
