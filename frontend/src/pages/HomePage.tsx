import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllPokemon,
  resetFilters,
  showFavorites,
  fetchFavorites,
} from "../store/pokemonSlice";
import SearchBar from "../components/SearchBar";
import PokemonGrid from "../components/PokemonGrid";
import { Button } from "../components/ui/button";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, favorites } = useAppSelector((state) => state.pokemon);
  const searchQuery = useAppSelector((state) => state.pokemon.searchQuery);
  const favoriteCount = favorites.length;
  console.log("favorites", favorites.length);

  useEffect(() => {
    console.log("HomePage useEffect", status);
    if (status === "idle") {
      dispatch(resetFilters());
      dispatch(fetchAllPokemon());
      dispatch(fetchFavorites());
    }
    // Always reset filters when mounting HomePage
  }, [dispatch, status]);

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleShowFavorites = () => {
    if (favoriteCount > 0) {
      dispatch(showFavorites());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">Gotta Catch 'Em All</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow">
            <SearchBar />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAll}
              disabled={!searchQuery && favoriteCount === 0}
              className="h-10"
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowFavorites}
              disabled={favoriteCount === 0}
              className="h-10"
            >
              Show Favorites ({favoriteCount})
            </Button>
          </div>
        </div>
      </div>

      <PokemonGrid />
    </div>
  );
};

export default HomePage;
