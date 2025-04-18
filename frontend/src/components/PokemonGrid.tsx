import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { PokemonCard } from "./pokemon-card";
import { loadMorePokemon } from "../store/pokemonSlice";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PokemonDetails from "./PokemonDetails";

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
  const { filteredList, status, error, hasMore, limit } = useAppSelector(
    (state) => state.pokemon
  );
  const dispatch = useAppDispatch();
  const { ref: observerRef, inView } = useInView();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isInitialLoading =
    (status === "idle" || status === "loading") && filteredList.length === 0;
  const isLoadingMore = status === "loading" && filteredList.length > 0;

  // // Open and close details
  const openDetails = useCallback(() => setIsDetailsOpen(true), []);
  const closeDetails = useCallback(() => setIsDetailsOpen(false), []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inView && hasMore && !isLoadingMore) {
        dispatch(loadMorePokemon());
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(debounceTimer);
  }, [inView, hasMore, dispatch, isLoadingMore]);

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

  if (status === "succeeded" && filteredList.length === 0) {
    return <EmptyState />;
  }
  console.log("filteredList", filteredList);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredList.map((pokemon, index) => (
          <PokemonCard
            key={pokemon._id}
            pokemon={pokemon}
            index={index % limit}
            onSelect={openDetails}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={observerRef}>
          {/* {isLoadingMore ? <LoadingSpinner /> : <div className="h-8" />} */}
        </div>
      )}
      <PokemonDetails isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default PokemonGrid;
