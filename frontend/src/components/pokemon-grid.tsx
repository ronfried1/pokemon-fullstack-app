import React, { useState, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Dialog } from "./ui/dialog";
import PokemonCard from "./pokemon-card";
import PokemonDetails from "./pokemon-details";
import usePagination from "../features/pokemon/hooks/usePagination";
import { Loader2 } from "lucide-react";
import { selectFilteredPokemon, selectIsLoading } from "../store/hooks";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { motion } from "framer-motion";
import { fetchPokemonDetails } from "../store/pokemonSlice";

/**
 * PokemonGrid component - Displays a grid of Pokemon cards with infinite scroll
 */
const PokemonGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [fetchedIds, setFetchedIds] = useState<Set<string>>(new Set());

  // Use memoized selector for filtered Pokemon
  const filteredPokemon = useAppSelector(selectFilteredPokemon);
  const globalLoading = useAppSelector(selectIsLoading);
  const selectedPokemon = useAppSelector(
    (state) => state.pokemon.selectedPokemon
  );
  const detailStatus = useAppSelector((state) => state.pokemon.status);

  // Custom hook for pagination with infinite scroll
  const { loadingRef, isFetchingMore, hasMore } = usePagination();

  // Monitor the status of loading details
  useEffect(() => {
    if (
      isLoadingDetails &&
      selectedPokemon?._id === selectedPokemonId &&
      detailStatus === "succeeded"
    ) {
      setIsLoadingDetails(false);
    }
  }, [selectedPokemon, selectedPokemonId, isLoadingDetails, detailStatus]);

  /**
   * Handle selecting a Pokemon to view details
   */
  const handleSelectPokemon = useCallback(
    (id: string) => {
      setSelectedPokemonId(id);
      setIsDetailsOpen(true);

      // Only fetch details if we haven't already fetched this Pokemon before
      // or we last fetched more than 5 minutes ago
      if (!fetchedIds.has(id)) {
        setIsLoadingDetails(true);
        dispatch(fetchPokemonDetails(id));

        // Add this ID to our cached set
        setFetchedIds((prev) => new Set(prev).add(id));
      }
    },
    [dispatch, fetchedIds]
  );

  /**
   * Handle closing the details dialog
   */
  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  // If no pokemon are available, show empty state
  if (filteredPokemon.length === 0 && !isFetchingMore && !globalLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <img
          src="/placeholder.svg"
          alt="No Pokemon found"
          className="h-40 w-40 opacity-50 mb-4"
        />
        <h3 className="text-xl font-bold mb-2">No Pokémon Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or check back later.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {filteredPokemon.map((pokemon, index) => (
          <PokemonCard
            key={pokemon._id}
            pokemon={pokemon}
            index={index}
            onSelect={handleSelectPokemon}
          />
        ))}

        {/* Add placeholder cards when loading more */}
        {(isFetchingMore || (globalLoading && filteredPokemon.length === 0)) &&
          Array(4)
            .fill(null)
            .map((_, index) => (
              <PokemonCardSkeleton key={`loading-${index}`} index={index} />
            ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div
          ref={loadingRef}
          className="flex justify-center items-center p-8 mt-8"
        >
          {isFetchingMore ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <span className="text-sm text-muted-foreground">
              Scroll to load more
            </span>
          )}
        </div>
      )}

      {/* Pokemon details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <PokemonDetails
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          isLoading={isLoadingDetails}
        />
      </Dialog>
    </>
  );
};

export default React.memo(PokemonGrid);
