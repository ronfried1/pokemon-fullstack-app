import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllPokemon, resetFilters } from "../store/pokemonSlice";
import { fetchFavorites } from "../store/favoritesSlice";
import SearchBar from "../components/SearchBar";
import PokemonGrid from "../components/PokemonGrid";
import { Button } from "../components/ui/button";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.pokemon);
  const favorites = useAppSelector((state) => state.favorites.list);
  const searchQuery = useAppSelector((state) => state.pokemon.searchQuery);

  useEffect(() => {
    console.log("HomePage useEffect");
    if (status === "idle") {
      dispatch(fetchAllPokemon());
      dispatch(fetchFavorites());
    }
  }, [dispatch, status]);

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleShowFavorites = () => {
    if (favorites.length > 0) {
      dispatch(resetFilters());

      // Wait for resetFilters to be applied
      setTimeout(() => {
        import("../store/pokemonSlice").then((module) => {
          dispatch(module.filterByFavorites(favorites));
        });
      }, 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">All Pokémon</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow">
            <SearchBar />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAll}
              disabled={!searchQuery && favorites.length === 0}
              className="h-10"
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowFavorites}
              disabled={favorites.length === 0}
              className="h-10"
            >
              Show Favorites ({favorites.length})
            </Button>
          </div>
        </div>
      </div>

      <PokemonGrid />
    </div>
  );
};

export default HomePage;
