import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleFavorite } from "../../../store/pokemonSlice";

/**
 * Custom hook for handling optimistic updates on favorites
 * @param pokemonId - ID of the Pokemon
 * @returns [isFavorite, toggleFavoriteHandler]
 */
export const useFavorites = (pokemonId: string) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.pokemon.favorites);

  // Calculate initial state based on global state
  const isFavorite = favorites.includes(pokemonId);
  const [optimisticIsFav, setOptimisticIsFav] = useState(isFavorite);

  // Track the previous Pokemon ID to detect changes
  const [prevPokemonId, setPrevPokemonId] = useState(pokemonId);

  // Update local state when favorites or pokemonId changes
  useEffect(() => {
    const newFavState = favorites.includes(pokemonId);

    // Update local state when favorites change or when pokemonId changes
    if (newFavState !== optimisticIsFav || pokemonId !== prevPokemonId) {
      setOptimisticIsFav(newFavState);
      setPrevPokemonId(pokemonId);
    }
  }, [favorites, pokemonId, optimisticIsFav, prevPokemonId]);

  /**
   * Toggle favorite status with optimistic update
   */
  const handleToggleFavorite = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Only proceed if we have a valid pokemonId
    if (!pokemonId) return;

    // Immediately update the optimistic state
    setOptimisticIsFav(!optimisticIsFav);

    // Dispatch the actual action
    dispatch(
      toggleFavorite({
        pokemonId,
        isFavorite: !optimisticIsFav,
      })
    )
      .unwrap()
      .catch(() => {
        // Revert optimistic update if the action fails
        setOptimisticIsFav(optimisticIsFav);
      });
  };

  return [optimisticIsFav, handleToggleFavorite] as const;
};

export default useFavorites;
