import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Pokemon, PokemonState, PokemonDetail } from "../types/pokemon";
import { pokemonApi } from "../lib/api";

// Initial state
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

// Async thunks
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

export const toggleFavorite = createAsyncThunk(
  "pokemon/toggleFavorite",
  async (
    { pokemonId, isFavorite }: { pokemonId: string; isFavorite: boolean },
    { rejectWithValue }
  ) => {
    try {
      console.log("toggleFavorite: ", pokemonId, isFavorite);
      await pokemonApi.toggleFavorite(pokemonId, isFavorite);
      return { pokemonId, isFavorite };
    } catch (error) {
      return rejectWithValue(
        `Failed to ${isFavorite ? "add" : "remove"} Pokemon from favorites`
      );
    }
  }
);

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

export const loadMorePokemon = createAsyncThunk(
  "pokemon/loadMore",
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log("loadMorePokemon: Loading...");
      const state = getState() as { pokemon: PokemonState };
      const { page, limit, list, searchQuery } = state.pokemon;
      const offset = page * limit;

      // If we have a search query active, don't load more
      if (searchQuery) {
        console.log("loadMorePokemon: Search active, not loading more");
        return [];
      }

      // If we already have all the pokemon, no need to fetch more
      if (list.length <= offset) {
        console.log(`loadMorePokemon: Fetching from API at offset=${offset}`);
        return await pokemonApi.getAll(offset, limit);
      } else {
        // Just return a slice of the existing data
        console.log(`loadMorePokemon: Using cached data from offset=${offset}`);
        return list.slice(offset, offset + limit);
      }
    } catch (error) {
      return rejectWithValue("Failed to load more Pokemon");
    }
  }
);

export const fetchPokemonCards = createAsyncThunk(
  "pokemon/fetchCards",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pokemon: PokemonState };
      const { page, limit } = state.pokemon;

      const response = await fetch(
        `/api/pokemon?offset=${page * limit}&limit=${limit}`
      );
      const pokemons: Pokemon[] = await response.json();

      return pokemons;
    } catch (error) {
      return rejectWithValue("Failed to fetch Pokémon cards");
    }
  }
);

// Fetch Pokemon details async thunk
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

// Search Pokemon async thunk
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

// Slice
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
      .addCase(fetchAllPokemon.pending, (state) => {
        console.log("fetchAllPokemon: Loading...");
        state.status = "loading";
      })
      .addCase(
        fetchAllPokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          console.log(
            `fetchAllPokemon: Succeeded with ${action.payload.length} Pokémon`
          );
          state.status = "succeeded";
          state.list = action.payload;
          state.filteredList = action.payload.slice(0, state.limit);

          // Always set hasMore to true when we get a full page of results
          // The server might have more data that we're not seeing yet
          state.hasMore = action.payload.length >= state.limit;
          console.log("Setting hasMore to:", state.hasMore);
        }
      )
      .addCase(fetchAllPokemon.rejected, (state, action) => {
        console.log(`fetchAllPokemon: Failed with error: ${action.payload}`);
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })
      .addCase(loadMorePokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadMorePokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          console.log(
            `loadMorePokemon: Got ${action.payload.length} more Pokémon`
          );
          state.status = "succeeded";
          state.page += 1;

          if (
            state.searchQuery ||
            state.filteredList.length < state.list.length
          ) {
            // Apply the same filters as in setSearchQuery or filterByFavorites
            if (state.searchQuery) {
              const query = state.searchQuery.toLowerCase();
              const allFiltered = state.list.filter(
                (pokemon) => pokemon.name.toLowerCase().includes(query)
                // Note: filtering by types is removed as they aren't available in the basic Pokemon object
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
              console.log("Filter applied, hasMore set to:", state.hasMore);
            }
          } else {
            // No filters, just add more pokemon
            const newPokemons = action.payload;

            if (newPokemons.length === 0) {
              state.hasMore = false;
            } else {
              state.filteredList = [...state.filteredList, ...newPokemons];
              // We need to check if we received fewer items than requested
              state.hasMore = newPokemons.length >= state.limit;
            }
            console.log("No filters, hasMore set to:", state.hasMore);
          }
        }
      )
      .addCase(loadMorePokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPokemonDetails.fulfilled,
        (state, action: PayloadAction<PokemonDetail>) => {
          state.status = "succeeded";
          state.selectedPokemon = action.payload;

          // Mark the Pokemon as viewed in the list
          const pokemon = state.list.find((p) => p._id === action.payload._id);
          if (pokemon) {
            pokemon.isViewed = true;
          }
        }
      )
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })
      .addCase(fetchPokemonCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPokemonCards.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
          state.filteredList = action.payload.slice(0, state.limit);
          state.hasMore = action.payload.length >= state.limit;
        }
      )
      .addCase(fetchPokemonCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })
      // Add cases for the search thunk
      .addCase(searchPokemon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        searchPokemon.fulfilled,
        (state, action: PayloadAction<Pokemon[]>) => {
          state.status = "succeeded";
          state.filteredList = action.payload;
          state.hasMore = action.payload.length >= state.limit;
        }
      )
      .addCase(searchPokemon.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.favorites = action.payload;
          // Update isFav property for all Pokemon in both lists
          const updatePokemonFavorites = (list: Pokemon[]) => {
            list.forEach((pokemon) => {
              pokemon.isFav = state.favorites.includes(pokemon._id);
            });
          };
          updatePokemonFavorites(state.list);
          updatePokemonFavorites(state.filteredList);
        }
      )
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { pokemonId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(pokemonId);
        } else {
          state.favorites = state.favorites.filter((id) => id !== pokemonId);
        }

        // Update both list and filteredList
        const updatePokemon = (list: Pokemon[]) => {
          const pokemon = list.find((p) => p._id === pokemonId);
          if (pokemon) {
            pokemon.isFav = isFavorite;
          }
        };

        updatePokemon(state.list);
        updatePokemon(state.filteredList);
      });
  },
});

export const { selectPokemon, setSearchQuery, showFavorites, resetFilters } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
