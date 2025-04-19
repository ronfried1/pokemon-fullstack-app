import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { createSelector } from "@reduxjs/toolkit";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Selector for filtered Pokemon list based on current state
 */
export const selectFilteredPokemon = createSelector(
  [(state: RootState) => state.pokemon.filteredList],
  (filteredList) => filteredList
);

/**
 * Selector for favorite Pokemon
 */
export const selectFavoritePokemon = createSelector(
  [
    (state: RootState) => state.pokemon.list,
    (state: RootState) => state.pokemon.favorites,
  ],
  (list, favorites) => list.filter((pokemon) => favorites.includes(pokemon._id))
);

/**
 * Selector for loading state
 */
export const selectIsLoading = createSelector(
  [(state: RootState) => state.pokemon.status],
  (status) => status === "loading"
);

/**
 * Selector for error state
 */
export const selectError = createSelector(
  [(state: RootState) => state.pokemon.error],
  (error) => error
);
