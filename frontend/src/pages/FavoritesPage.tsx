import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAllPokemon, filterByFavorites } from "../store/pokemonSlice";
import { fetchFavorites } from "../store/favoritesSlice";
import SearchBar from "../components/SearchBar";
import PokemonGrid from "../components/PokemonGrid";

const FavoritesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.pokemon);
  const favorites = useAppSelector((state) => state.favorites.list);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllPokemon());
      dispatch(fetchFavorites());
    } else if (status === "succeeded") {
      dispatch(filterByFavorites(favorites));
    }
  }, [dispatch, status, favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">
          Favorites
          {favorites.length > 0 && (
            <span className="ml-2 text-gray-500">({favorites.length})</span>
          )}
        </h1>
        <div className="flex-grow">
          <SearchBar />
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No Favorite Pokémon</h2>
          <p className="mb-4 text-gray-500">
            You haven't added any Pokémon to your favorites yet.
          </p>
          <p className="text-gray-500">
            Browse the Pokémon list and click the "Favorite" button to add them
            here.
          </p>
        </div>
      ) : (
        <PokemonGrid />
      )}
    </div>
  );
};

export default FavoritesPage;
