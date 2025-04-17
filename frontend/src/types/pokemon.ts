export interface Pokemon {
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
  selectedPokemon: Pokemon | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string;
}

export interface FavoritesState {
  list: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
