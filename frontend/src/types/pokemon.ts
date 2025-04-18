import { JSX } from "react";

export interface Pokemon {
  _id: string; // ObjectId
  name: string;
  url: string;
  isFav: boolean;
  isViewed: boolean;
  details?: {
    id?: number;
    name?: string;
    types?: (string | { type: { name: string } })[];
    abilities?: (string | { ability: { name: string } })[];
    height?: number;
    weight?: number;
    stats?: {
      base_stat: number;
      effort: number;
      stat: {
        name: string;
        url: string;
      };
    }[];
    sprites?: {
      front?: string;
      back?: string;
      front_default?: string;
      back_default?: string;
      other?: Record<string, any>;
    };
    evolutions?: Evolution[];
  };
}

export interface PokemonDetail {
  _id: string; // Document ID
  details: {
    id?: number;
    name: string;
    types?: { type: { name: string } }[];
    abilities?: { ability: { name: string } }[];
    base_experience?: number;
    height?: number;
    weight?: number;
    stats: {
      base_stat: number;
      effort: number;
      stat: {
        name: string;
        url: string;
      };
    }[];
    sprites: {
      front: string;
      back: string;
      front_default: string;
      front_shiny: string;
      back_default: string;
      back_shiny: string;
      other: Record<string, any>;
    };
    evolutions?: Evolution[];
    moves: { move: { name: string; url: string } }[]; // Note: backend uses 'movments' instead of 'moves'
    species: {
      url: string;
    };
  };
}

export interface Evolution {
  id: number;
  name: string;
  sprite: string;
  condition?: string;
}

export type PokemonCard = JSX.Element;

export interface PokemonState {
  list: Pokemon[];
  filteredList: Pokemon[];
  selectedPokemon: PokemonDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string;
  page: number;
  limit: number;
  hasMore: boolean;
  totalCount: number;
}

export interface FavoritesState {
  list: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// export interface Evolution {
//   id: number;
//   name: string;
//   sprite: string;
//   condition?: string;
// }

// export interface PokemonDetails {
//   id?: number;
//   name?: string;
//   types?: { type: { name: string } }[];
//   abilities?: { ability: { name: string } }[];
//   height?: number;
//   weight?: number;
//   stats?: { base_stat: number; stat: { name: string } }[];
//   sprites?: {
//     front_default?: string;
//     back_default?: string;
//     other?: Record<string, any>;
//   };
//   evolutions?: Evolution[];
// }

// export interface Pokemon {
//   _id: string; // Document ID from MongoDB
//   name: string;
//   url: string;
//   isFav: boolean;
//   isViewed: boolean;
//   details?: PokemonDetails; // Full details if fetched
// }

// export interface PokemonDetail {
//   _id: string;
//   pokeId: string; // Reference to the Pokemon's MongoDB ID
//   details: PokemonDetails;
// }

// export interface PokemonState {
//   list: Pokemon[];
//   filteredList: Pokemon[];
//   selectedPokemon: PokemonDetail | null;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
//   searchQuery: string;
//   page: number;
//   limit: number;
//   hasMore: boolean;
// }

// export interface FavoritesState {
//   list: string[]; // List of favorite Pokémon IDs
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }
