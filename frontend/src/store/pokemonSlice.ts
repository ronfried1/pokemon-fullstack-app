import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon, PokemonState } from "../types/pokemon";
import { pokemonApi } from "../lib/api";

// Initial state
const initialState: PokemonState = {
  list: [],
  filteredList: [],
  selectedPokemon: null,
  status: "idle",
  error: null,
  searchQuery: "",
};

// Async thunks
export const fetchAllPokemon = createAsyncThunk(
  "pokemon/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await pokemonApi.getAll();
    } catch (error) {
      return rejectWithValue("Failed to fetch Pokemon");
    }
  }
);

// Slice
const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<Pokemon | null>) => {
      state.selectedPokemon = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;

      if (action.payload === "") {
        state.filteredList = state.list;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredList = state.list.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.types.some((type) => type.toLowerCase().includes(query))
        );
      }
    },
    filterByFavorites: (state, action: PayloadAction<string[]>) => {
      if (action.payload.length === 0) {
        state.filteredList = state.list;
      } else {
        state.filteredList = state.list.filter((pokemon) =>
          action.payload.includes(pokemon.name)
        );
      }
    },
    resetFilters: (state) => {
      state.filteredList = state.list;
      state.searchQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllPokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
          state.filteredList = action.payload;
        }
      )
      .addCase(fetchAllPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      });
  },
});

export const {
  selectPokemon,
  setSearchQuery,
  filterByFavorites,
  resetFilters,
} = pokemonSlice.actions;
export default pokemonSlice.reducer;
