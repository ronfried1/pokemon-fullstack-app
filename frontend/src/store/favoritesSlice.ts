import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FavoritesState } from "../types/pokemon";
import { pokemonApi } from "../lib/api";

// Initial state
const initialState: FavoritesState = {
  list: [],
  status: "idle",
  error: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await pokemonApi.getFavorites();
    } catch (error) {
      return rejectWithValue("Failed to fetch favorites");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/add",
  async (name: string, { rejectWithValue }) => {
    try {
      await pokemonApi.addFavorite(name);
      return name;
    } catch (error) {
      return rejectWithValue(`Failed to add ${name} to favorites`);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/remove",
  async (name: string, { rejectWithValue }) => {
    try {
      await pokemonApi.removeFavorite(name);
      return name;
    } catch (error) {
      return rejectWithValue(`Failed to remove ${name} from favorites`);
    }
  }
);

// Slice
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })

      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addFavorite.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          if (!state.list.includes(action.payload)) {
            state.list.push(action.payload);
          }
        }
      )
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      })

      // Remove favorite
      .addCase(removeFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        removeFavorite.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.list = state.list.filter((name) => name !== action.payload);
        }
      )
      .addCase(removeFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Unknown error occurred";
      });
  },
});

export default favoritesSlice.reducer;
