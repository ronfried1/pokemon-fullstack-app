import React, { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadMorePokemon } from "../store/pokemonSlice";
import { PokemonCard } from "./pokemon-card";
import { motion } from "framer-motion";
import PokemonDetails from "./pokemon-details";
import { PokemonLoader } from "./pokemon-loader";

// Empty state
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center p-20 text-gray-600"
  >
    <h2 className="text-2xl font-bold mb-4">No Pokémon Found</h2>
    <p>Try adjusting your search or filters.</p>
  </motion.div>
);

const PokemonGrid: React.FC = () => {
  const { filteredList, status, hasMore, limit, selectedPokemon } =
    useAppSelector((state) => state.pokemon);
  const dispatch = useAppDispatch();
  const { ref: observerRef, inView } = useInView();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const isInitialLoading =
    (status === "idle" || status === "loading") && filteredList.length === 0;
  const isLoadingMore = status === "loading" && filteredList.length > 0;

  // Track when details are loaded and open dialog
  useEffect(() => {
    if (
      isLoadingDetails &&
      status === "succeeded" &&
      selectedPokemon?._id === lastSelectedId
    ) {
      setIsLoadingDetails(false);
      setIsDetailsOpen(true);
    }
  }, [status, selectedPokemon, isLoadingDetails, lastSelectedId]);

  // Open details dialog after Pokemon is loaded
  const handleSelectPokemon = useCallback(
    (id: string) => {
      // If it's already the selected Pokemon, just open the dialog
      if (selectedPokemon && selectedPokemon._id === id) {
        setIsDetailsOpen(true);
        return;
      }

      // Otherwise, mark as loading and wait for the API call to complete
      setLastSelectedId(id);
      setIsLoadingDetails(true);
    },
    [selectedPokemon]
  );

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inView && hasMore && !isLoadingMore) {
        dispatch(loadMorePokemon());
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(debounceTimer);
  }, [inView, hasMore, dispatch, isLoadingMore]);

  if (isInitialLoading) {
    return <PokemonLoader />;
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center p-10 text-red-500">
        Error loading Pokémon. Please try again later.
      </div>
    );
  }

  if (status === "succeeded" && filteredList.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredList.map((pokemon, index) => (
          <PokemonCard
            key={pokemon._id}
            pokemon={pokemon}
            index={index % limit}
            onSelect={handleSelectPokemon}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={observerRef}>
          {isLoadingMore ? <PokemonLoader /> : <div className="h-8" />}
        </div>
      )}
      <PokemonDetails
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        isLoading={isLoadingDetails}
      />
    </>
  );
};

export default PokemonGrid;
