import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
// import PokemonCard from "./PokemonCard";
import { PokemonCard } from "./pokemon-card";
import PokemonDetails from "./PokemonDetails";
import { loadMorePokemon } from "../store/pokemonSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Pokemon } from "../types/pokemon";

// Loading indicator component
const LoadingSpinner = () => (
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
);

// Empty state component
const EmptyState = () => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
    <p className="mb-2 text-lg font-semibold">No Pokémon Found</p>
    <p>Try adjusting your search or filters.</p>
  </div>
);

// Error state component
const ErrorState = ({ error }: { error: string | null }) => (
  <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-center text-red-800">
    <p>Error: {error}</p>
    <p>Please try again later or contact support if the problem persists.</p>
  </div>
);

const PokemonGrid: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { filteredList, status, error, hasMore } = useAppSelector(
    (state) => state.pokemon
  );
  const dispatch = useAppDispatch();
  const isLoadingRef = useRef(false);
  const [visiblePokemon, setVisiblePokemon] = useState<Pokemon[]>(filteredList);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasLoadedDataRef = useRef(false);
  const [showContent, setShowContent] = useState(false);

  // Intersection observer setup
  const { ref: observerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: false,
  });

  // Unified useEffect for all data handling and UI updates
  useEffect(() => {
    // Part 1: Track when we first receive data
    if (filteredList && filteredList.length > 0 && !hasLoadedDataRef.current) {
      hasLoadedDataRef.current = true;

      // Wait a bit to ensure we don't flash the empty state
      setTimeout(() => {
        setShowContent(true);
      }, 150);
    }

    // Part 2: Handle loading more data when scrolling
    if (inView && status !== "loading" && hasMore && !isLoadingRef.current) {
      console.log("Loading more Pokemon...");
      isLoadingRef.current = true;
      dispatch(loadMorePokemon());
    }

    // Part 3: Track loading state changes
    isLoadingRef.current = status === "loading";

    // Part 4: Update visible Pokemon with smooth transitions
    if (filteredList) {
      if (filteredList.length > 0 && status !== "loading") {
        // For non-empty lists while not loading, use small delay for smooth transitions
        setIsUpdating(true);
        const timer = setTimeout(() => {
          setVisiblePokemon(filteredList);
          setIsUpdating(false);
        }, 100);

        return () => clearTimeout(timer);
      } else {
        // For initial loads or empty results, update immediately
        setVisiblePokemon(filteredList);
        setIsUpdating(false);
      }
    }
  }, [inView, status, hasMore, filteredList, dispatch]);

  // Event handlers
  const openDetails = useCallback(() => setIsDetailsOpen(true), []);
  const closeDetails = useCallback(() => setIsDetailsOpen(false), []);

  // We're in a loading state if:
  // 1. Status is loading or idle AND we don't have Pokemon data, OR
  // 2. We haven't marked the content as ready to show
  const isLoading =
    ((status === "idle" || status === "loading") &&
      visiblePokemon.length === 0) ||
    (visiblePokemon.length > 0 && !showContent);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (status === "failed") {
    return <ErrorState error={error} />;
  }

  // Only show empty state if:
  // 1. We have no Pokemon to display
  // 2. The status is "succeeded" (meaning a request completed successfully)
  // 3. We've already had data before (to avoid the empty flash during initial loading)
  if (
    visiblePokemon.length === 0 &&
    status === "succeeded" &&
    hasLoadedDataRef.current
  ) {
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
            <LoadingSpinner />
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
