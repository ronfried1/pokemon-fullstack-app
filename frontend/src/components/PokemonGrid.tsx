import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
// import PokemonCard from "./PokemonCard";
import { PokemonCard } from "./pokemon-card";
import PokemonDetails from "./PokemonDetails";
import { loadMorePokemon } from "../store/pokemonSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PokemonGrid: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { filteredList, status, error, hasMore, page } = useAppSelector(
    (state) => state.pokemon
  );
  const dispatch = useAppDispatch();
  const loadingRef = useRef(false);
  const [visiblePokemon, setVisiblePokemon] = useState(filteredList);
  const [isUpdating, setIsUpdating] = useState(false);

  // Using react-intersection-observer hook
  const { ref: observerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: false,
  });

  // Load more pokemon when the loading element comes into view
  useEffect(() => {
    // Prevent multiple rapid triggers
    if (inView && status !== "loading" && hasMore && !loadingRef.current) {
      console.log("Loading more Pokemon...");
      loadingRef.current = true;
      dispatch(loadMorePokemon());
    }
  }, [inView, dispatch, status, hasMore]);

  // Reset loading ref when status changes
  useEffect(() => {
    if (status !== "loading") {
      loadingRef.current = false;
    }
  }, [status]);

  // Update visible pokemon with a small delay for smoother transitions
  useEffect(() => {
    // Always update visiblePokemon when filteredList changes
    if (filteredList) {
      if (filteredList.length > 0 && status !== "loading") {
        // If we have data and we're not loading, use the small delay
        setIsUpdating(true);
        const timer = setTimeout(() => {
          setVisiblePokemon(filteredList);
          setIsUpdating(false);
        }, 100);

        return () => clearTimeout(timer);
      } else {
        // In other cases (initial load or empty results), update immediately
        setVisiblePokemon(filteredList);
      }
    }
  }, [filteredList, status]);

  const openDetails = () => {
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  if (status === "loading" && visiblePokemon.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-center text-red-800">
        <p>Error: {error}</p>
        <p>
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  if (visiblePokemon.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        <p className="mb-2 text-lg font-semibold">No Pokémon Found</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {visiblePokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.02 }, // Reduced delay
              }}
            >
              {/* <PokemonCard pokemon={pokemon} onSelect={openDetails} /> */}
              <PokemonCard pokemon={pokemon} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div ref={observerRef} className="mt-4 flex justify-center p-4">
          {status === "loading" || isUpdating ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          ) : (
            <div className="h-8 w-8"></div>
          )}
        </div>
      )}

      <PokemonDetails isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default PokemonGrid;
