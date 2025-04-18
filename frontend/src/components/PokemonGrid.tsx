import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { PokemonCard } from "./pokemon-card";
import PokemonDetails from "./PokemonDetails";
import { loadMorePokemon } from "../store/pokemonSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Pokemon } from "../types/pokemon";

// Loading indicator component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { filteredList, status, error, hasMore } = useAppSelector(
    (state) => state.pokemon
  );
  const dispatch = useAppDispatch();
  const { ref: observerRef, inView } = useInView({
    threshold: 0.2,
    rootMargin: "100px",
  });

  const [visiblePokemon, setVisiblePokemon] = useState<Pokemon[]>(filteredList);

  const isInitialLoading =
    (status === "idle" || status === "loading") && filteredList.length === 0;
  const isLoadingMore = status === "loading" && filteredList.length > 0;

  // Open and close details
  const openDetails = useCallback(() => setIsDetailsOpen(true), []);
  const closeDetails = useCallback(() => setIsDetailsOpen(false), []);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      dispatch(loadMorePokemon());
    }
  }, [inView, hasMore, dispatch, isLoadingMore]);

  // Update visible list
  useEffect(() => {
    setVisiblePokemon(filteredList);
  }, [filteredList]);

  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center p-10 text-red-500">
        Error loading Pokémon. Please try again later.
      </div>
    );
  }

  if (visiblePokemon.length === 0 && status === "succeeded") {
    return <EmptyState />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="pokemon-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4"
        >
          {visiblePokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.02 },
              }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PokemonCard pokemon={pokemon} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div ref={observerRef}>
          {isLoadingMore ? <LoadingSpinner /> : <div className="h-8" />}
        </div>
      )}

      <PokemonDetails isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default PokemonGrid;
