import React, { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  selectIsLoading,
  selectError,
} from "../store/hooks";
import {
  fetchAllPokemon,
  resetFilters,
  showFavorites,
  fetchFavorites,
} from "../store/pokemonSlice";
import SearchBar from "../components/search-bar";
import PokemonGrid from "../components/pokemon-grid";
import PokemonGridSkeleton from "../components/pokemon-grid-skeleton";
import PageLayout from "../components/page-layout";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

/**
 * HomePage component - The main page of the application showing the Pokemon list
 */
const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.pokemon);
  const searchQuery = useAppSelector((state) => state.pokemon.searchQuery);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const favoriteCount = favorites.length;
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    dispatch(resetFilters());

    dispatch(fetchAllPokemon())
      .unwrap()
      .catch((error) => {
        toast({
          title: "Error loading Pokémon",
          description: error || "Failed to load Pokémon data",
          variant: "destructive",
        });
      });

    dispatch(fetchFavorites())
      .unwrap()
      .catch(() => {
        toast({
          title: "Error loading favorites",
          description: "Failed to load your favorite Pokémon",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  const handleShowAll = () => {
    dispatch(resetFilters());
  };

  const handleShowFavorites = () => {
    if (favoriteCount > 0) {
      dispatch(showFavorites());
    } else {
      toast({
        title: "No favorites yet",
        description: "Add some Pokémon to your favorites first",
      });
    }
  };

  return (
    <PageLayout title="Gotta Catch 'Em All">
      <div className="flex flex-wrap items-center gap-4 mb-8">
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

      {error ? (
        <div className="p-8 rounded-lg bg-destructive/10 text-destructive flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-10 w-10" />
          <h3 className="text-xl font-bold">Error loading Pokémon</h3>
          <p>{error}</p>
          <Button
            onClick={() => {
              dispatch(resetFilters());
              dispatch(fetchAllPokemon());
            }}
            variant="outline"
          >
            Try again
          </Button>
        </div>
      ) : isLoading && favorites.length === 0 ? (
        <PokemonGridSkeleton count={12} />
      ) : (
        <PokemonGrid />
      )}
    </PageLayout>
  );
};

export default React.memo(HomePage);
