export interface Pokemon {
  _id: string; // ObjectId
  name: string;
  url: string;
  isFav: boolean;
  isViewed: boolean;
}

export interface PokemonDetail {
  _id: string; // ObjectId
  pokeId: string; // Reference to Pokemon _id (150PokeId in the diagram)
  details: {
    id: number;
    name: string;
    types: string[];
    abilities: string[];
    height: number;
    weight: number;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
    };
    sprites: {
      front: string;
      back?: string;
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
