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
    stats?: any;
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
  pokeId: string; // Reference to Pokemon ID
  details: {
    id?: number;
    name?: string;
    types?: (string | { type: { name: string } })[];
    abilities?: (string | { ability: { name: string } })[];
    height?: number;
    weight?: number;
    stats?: any;
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

export interface Evolution {
  id: number;
  name: string;
  sprite: string;
  condition?: string;
}

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
