import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { showFavorites, fetchFavorites } from "../store/pokemonSlice";
import SearchBar from "../components/search-bar";
import PokemonGrid from "../components/pokemon-grid";

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { favorites, list } = useAppSelector((state) => state.pokemon);
  const favoriteCount = favorites.length;

  useEffect(() => {
    dispatch(fetchFavorites()).then(() => {
      dispatch(showFavorites());
    });
  }, [dispatch, list.length]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">
          Favorite Pokémon ({favoriteCount})
        </h1>
        <SearchBar />
      </div>
      <PokemonGrid />
    </div>
  );
};

export default FavoritesPage;
