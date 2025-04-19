import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon, PokemonState, PokemonDetail } from "../types/pokemon";
import { pokemonApi } from "../lib/api";

/**
 * Initial state for the Pokemon slice
 */
const initialState: PokemonState = {
  list: [],
  filteredList: [],
  selectedPokemon: null,
  status: "idle",
  error: null,
  searchQuery: "",
  page: 1,
  hasMore: true,
  limit: 12,
  totalCount: 0,
  favorites: [],
};

/**
 * Fetch favorites from the API
 */
export const fetchFavorites = createAsyncThunk<string[]>(
  "pokemon/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await pokemonApi.getFavorites();
      return favorites.map((pokemon) => pokemon._id);
    } catch (error) {
      return rejectWithValue("Failed to fetch favorites");
    }
  }
);

/**
 * Toggle a Pokemon as favorite/unfavorite
 */
export const toggleFavorite = createAsyncThunk(
  "pokemon/toggleFavorite",
  async (
    { pokemonId, isFavorite }: { pokemonId: string; isFavorite: boolean },
    { rejectWithValue }
  ) => {
    try {
      await pokemonApi.toggleFavorite(pokemonId, isFavorite);
      return { pokemonId, isFavorite };
    } catch (error) {
      return rejectWithValue(
        `Failed to ${isFavorite ? "add" : "remove"} Pokemon from favorites`
      );
    }
  }
);

/**
 * Fetch all Pokemon with pagination
 */
export const fetchAllPokemon = createAsyncThunk(
  "pokemon/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pokemon: PokemonState };
      const { limit } = state.pokemon;
      return await pokemonApi.getAll(0, limit);
    } catch (error) {
      return rejectWithValue("Failed to fetch Pokemon");
    }
  }
);

/**
 * Load more Pokemon for infinite scrolling
 */
export const loadMorePokemon = createAsyncThunk(
  "pokemon/loadMore",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pokemon: PokemonState };
      const { page, limit, list, searchQuery } = state.pokemon;
      const offset = page * limit;

      // If we have a search query active, don't load more
      if (searchQuery) {
        return [];
      }

      // If we already have all the pokemon, no need to fetch more
      if (list.length <= offset) {
        return await pokemonApi.getAll(offset, limit);
      } else {
        // Just return a slice of the existing data
        return list.slice(offset, offset + limit);
      }
    } catch (error) {
      return rejectWithValue("Failed to load more Pokemon");
    }
  }
);

/**
 * Fetch Pokemon details
 */
export const fetchPokemonDetails = createAsyncThunk(
  "pokemon/fetchDetails",
  async (pokemonId: string, { rejectWithValue }) => {
    try {
      return await pokemonApi.getPokemonDetails(pokemonId);
    } catch (error) {
      return rejectWithValue("Failed to fetch Pokemon details");
    }
  }
);

/**
 * Search Pokemon by name
 */
export const searchPokemon = createAsyncThunk(
  "pokemon/search",
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pokemon: PokemonState };
      const { limit } = state.pokemon;
      return await pokemonApi.searchPokemon(query, limit);
    } catch (error) {
      return rejectWithValue("Failed to search Pokémon");
    }
  }
);

/**
 * Helper function to update Pokemon favorites status in a list
 */
const updatePokemonFavorites = (
  list: Pokemon[],
  favorites: string[]
): Pokemon[] => {
  return list.map((pokemon) => ({
    ...pokemon,
    isFav: favorites.includes(pokemon._id),
  }));
};

/**
 * Pokemon slice with reducers and async thunk handling
 */
const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<PokemonDetail | null>) => {
      state.selectedPokemon = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;

      if (action.payload === "") {
        state.filteredList = state.list.slice(0, state.limit);
        state.hasMore = state.list.length > state.limit;
      }
    },
    showFavorites: (state) => {
      state.page = 1;
      const favorites = state.list.filter((pokemon) =>
        state.favorites.includes(pokemon._id)
      );
      state.filteredList = favorites.slice(0, state.limit);
      state.hasMore = favorites.length > state.limit;
    },
    resetFilters: (state) => {
      state.page = 1;
      state.searchQuery = "";
      state.status = "idle";

      if (state.list.length > 0) {
        state.filteredList = state.list.slice(0, state.limit);
        state.hasMore = state.list.length > state.limit;
      } else {
        state.filteredList = [];
        state.hasMore = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all Pokemon
      .addCase(fetchAllPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllPokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
          state.filteredList = action.payload.slice(0, state.limit);

          // Always set hasMore to true when we get a full page of results
          state.hasMore = action.payload.length >= state.limit;

          // Update favorites status
          state.list = updatePokemonFavorites(state.list, state.favorites);
          state.filteredList = updatePokemonFavorites(
            state.filteredList,
            state.favorites
          );
        }
      )
      .addCase(fetchAllPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })

      // Load more Pokemon
      .addCase(loadMorePokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadMorePokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";
          state.page += 1;

          if (
            state.searchQuery ||
            state.filteredList.length < state.list.length
          ) {
            // Apply the same filters as in setSearchQuery or filterByFavorites
            if (state.searchQuery) {
              const query = state.searchQuery.toLowerCase();
              const allFiltered = state.list.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(query)
              );

              state.filteredList = allFiltered.slice(
                0,
                state.page * state.limit
              );
              state.hasMore = allFiltered.length > state.page * state.limit;
            } else {
              // We have some other filter applied
              const currentFiltered = state.filteredList;

              if (action.payload.length === 0) {
                state.hasMore = false;
              } else {
                state.filteredList = [...currentFiltered, ...action.payload];
                // We need to check if we received fewer items than requested
                state.hasMore = action.payload.length >= state.limit;
              }
            }
          } else {
            // No filters, just add more pokemon
            const newPokemons = updatePokemonFavorites(
              action.payload,
              state.favorites
            );
            state.filteredList = [...state.filteredList, ...newPokemons];
            state.hasMore = action.payload.length >= state.limit;
          }
        }
      )
      .addCase(loadMorePokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to load more Pokemon";
      })

      // Fetch Pokemon details
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPokemonDetails.fulfilled,
        (state, action: PayloadAction<PokemonDetail>) => {
          state.status = "succeeded";
          state.selectedPokemon = action.payload;

          // Also update the Pokemon in the list if it exists
          const pokemonInList = state.list.find(
            (p) => p._id === action.payload._id
          );

          if (pokemonInList) {
            pokemonInList.details = action.payload.details;
          }
        }
      )
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch Pokemon details";
      })

      // Search Pokemon
      .addCase(searchPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        searchPokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";

          // Update the filtered list with search results
          state.filteredList = updatePokemonFavorites(
            action.payload,
            state.favorites
          );

          // Update hasMore based on results
          state.hasMore = action.payload.length >= state.limit;
        }
      )
      .addCase(searchPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to search Pokemon";
      })

      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        // Don't change main status for favorites loading
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.favorites = action.payload;

          // Update favorite status in lists
          state.list = updatePokemonFavorites(state.list, action.payload);
          state.filteredList = updatePokemonFavorites(
            state.filteredList,
            action.payload
          );
        }
      )
      .addCase(fetchFavorites.rejected, (state) => {
        // Don't change main status for favorites failure
      })

      // Toggle favorite
      .addCase(
        toggleFavorite.fulfilled,
        (
          state,
          action: PayloadAction<{ pokemonId: string; isFavorite: boolean }>
        ) => {
          const { pokemonId, isFavorite } = action.payload;

          // Update favorites list
          if (isFavorite) {
            state.favorites.push(pokemonId);
          } else {
            state.favorites = state.favorites.filter((id) => id !== pokemonId);
          }

          // Update Pokemon in lists
          state.list = state.list.map((pokemon) => {
            if (pokemon._id === pokemonId) {
              return { ...pokemon, isFav: isFavorite };
            }
            return pokemon;
          });

          state.filteredList = state.filteredList.map((pokemon) => {
            if (pokemon._id === pokemonId) {
              return { ...pokemon, isFav: isFavorite };
            }
            return pokemon;
          });

          // Update selected Pokemon if it's the one being toggled
          if (
            state.selectedPokemon &&
            state.selectedPokemon._id === pokemonId
          ) {
            state.selectedPokemon = {
              ...state.selectedPokemon,
              isFav: isFavorite,
            };
          }
        }
      );
  },
});

export const { selectPokemon, setSearchQuery, showFavorites, resetFilters } =
  pokemonSlice.actions;

export default pokemonSlice.reducer;
