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
};

// Async thunks
export const fetchAllPokemon = createAsyncThunk(
  "pokemon/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pokemon: PokemonState };
      const { page, limit } = state.pokemon;
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
      const { page, limit, list } = state.pokemon;
      const offset = page * limit;

      // If we already have all the pokemon, no need to fetch more
      if (list.length <= offset) {
        return await pokemonApi.getAll(offset, limit);
      } else {
        // Just return a slice of the existing data (useful for filtered views)
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
      state.page = 1; // Reset pagination when search changes

      if (action.payload === "") {
        state.filteredList = state.list.slice(0, state.limit);
        state.hasMore = state.list.length > state.limit;
      } else {
        const query = action.payload.toLowerCase();
        const allFiltered = state.list.filter(
          (pokemon) => pokemon.name.toLowerCase().includes(query)
          // Note: filtering by types is removed as they aren't available in the basic Pokemon object
        );

        state.filteredList = allFiltered.slice(0, state.limit);
        state.hasMore = allFiltered.length > state.limit;
      }
    },
    filterByFavorites: (state, action: PayloadAction<string[]>) => {
      state.page = 1; // Reset pagination when filters change

      if (action.payload.length === 0) {
        state.filteredList = state.list.slice(0, state.limit);
        state.hasMore = state.list.length > state.limit;
      } else {
        const allFiltered = state.list.filter((pokemon) =>
          action.payload.includes(pokemon.name)
        );

        state.filteredList = allFiltered.slice(0, state.limit);
        state.hasMore = allFiltered.length > state.limit;
      }
    },
    resetFilters: (state) => {
      state.page = 1; // Reset pagination when filters are reset
      state.filteredList = state.list.slice(0, state.limit);
      state.hasMore = state.list.length > state.limit;
      state.searchQuery = "";
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
          const pokemon = state.list.find(
            (p) => p._id === action.payload.pokeId
          );
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

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { Pokemon, PokemonDetail, PokemonState } from "../types/pokemon";
// import { pokemonApi } from "../lib/api";

// const initialState: PokemonState = {
//   list: [],
//   filteredList: [],
//   selectedPokemon: null,
//   status: "idle",
//   error: null,
//   searchQuery: "",
//   page: 1,
//   limit: 15,
//   hasMore: true,
// };

// export const fetchAllPokemon = createAsyncThunk(
//   "pokemon/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await pokemonApi.getAll(0, 150); // Fetch 150 once, cache in frontend
//     } catch (error) {
//       return rejectWithValue("Failed to fetch Pokémon");
//     }
//   }
// );

// export const loadMorePokemon = createAsyncThunk(
//   "pokemon/loadMore",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as { pokemon: PokemonState };
//       const { page, limit, list, searchQuery } = state.pokemon;

//       const filteredList = searchQuery
//         ? list.filter((pokemon) =>
//             pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         : list;

//       const offset = page * limit;
//       const nextPokemons = filteredList.slice(offset, offset + limit);

//       return nextPokemons;
//     } catch (error) {
//       return rejectWithValue("Failed to load more Pokémon");
//     }
//   }
// );

// export const fetchPokemonDetails = createAsyncThunk(
//   "pokemon/fetchDetails",
//   async (pokemonId: string, { rejectWithValue }) => {
//     try {
//       return await pokemonApi.getPokemonDetails(pokemonId);
//     } catch (error) {
//       return rejectWithValue("Failed to fetch Pokémon details");
//     }
//   }
// );

// const pokemonSlice = createSlice({
//   name: "pokemon",
//   initialState,
//   reducers: {
//     selectPokemon: (state, action: PayloadAction<PokemonDetail | null>) => {
//       state.selectedPokemon = action.payload;
//     },
//     setSearchQuery: (state, action: PayloadAction<string>) => {
//       state.searchQuery = action.payload;
//       state.page = 1;

//       const query = action.payload.toLowerCase();
//       const filtered = state.list.filter((pokemon) =>
//         pokemon.name.toLowerCase().includes(query)
//       );

//       state.filteredList = filtered.slice(0, state.limit);
//       state.hasMore = filtered.length > state.limit;
//     },
//     resetFilters: (state) => {
//       state.searchQuery = "";
//       state.page = 1;
//       state.filteredList = state.list.slice(0, state.limit);
//       state.hasMore = state.list.length > state.limit;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllPokemon.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchAllPokemon.fulfilled,
//         (state, action: PayloadAction<Pokemon[]>) => {
//           state.status = "succeeded";
//           state.list = action.payload;
//           state.filteredList = action.payload.slice(0, state.limit);
//           state.hasMore = action.payload.length > state.limit;
//         }
//       )
//       .addCase(fetchAllPokemon.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = (action.payload as string) || "Unknown error";
//       })
//       .addCase(loadMorePokemon.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         loadMorePokemon.fulfilled,
//         (state, action: PayloadAction<Pokemon[]>) => {
//           state.status = "succeeded";
//           state.page += 1;

//           if (state.searchQuery) {
//             state.filteredList = [...state.filteredList, ...action.payload];
//             state.hasMore = action.payload.length >= state.limit;
//           } else {
//             state.filteredList = [...state.filteredList, ...action.payload];
//             state.hasMore = action.payload.length >= state.limit;
//           }
//         }
//       )
//       .addCase(loadMorePokemon.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = (action.payload as string) || "Unknown error";
//       })
//       .addCase(
//         fetchPokemonDetails.fulfilled,
//         (state, action: PayloadAction<PokemonDetail>) => {
//           if (
//             state.selectedPokemon &&
//             state.selectedPokemon.pokeId === action.payload.pokeId
//           ) {
//             state.selectedPokemon = action.payload;
//           }
//         }
//       );
//   },
// });

// export const { selectPokemon, setSearchQuery, resetFilters } =
//   pokemonSlice.actions;
// export default pokemonSlice.reducer;
