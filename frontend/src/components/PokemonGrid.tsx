import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import PokemonCard from "./PokemonCard";
import PokemonDetails from "./PokemonDetails";
import { loadMorePokemon } from "../store/pokemonSlice";

const PokemonGrid: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { filteredList, status, error, hasMore } = useAppSelector(
    (state) => state.pokemon
  );
  const dispatch = useAppDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Pokemon state changed:", {
      filteredListLength: filteredList.length,
      status,
      hasMore,
    });
  }, [filteredList.length, status, hasMore]);

  const openDetails = () => {
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      console.log("this is the entries", entries);
      const [entry] = entries;
      if (entry.isIntersecting && status !== "loading" && hasMore) {
        console.log("Loading more Pokemon...");
        dispatch(loadMorePokemon());
      } else {
        console.log("Not loading more:", {
          isIntersecting: entry.isIntersecting,
          status,
          hasMore,
        });
      }
    },
    [dispatch, status, hasMore]
  );

  useEffect(() => {
    console.log("Setting up observer effect, hasMore:", hasMore);

    // Always clean up previous observer
    if (observerRef.current) {
      console.log("Disconnecting previous observer");
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Check if we should set up the observer
    if (!hasMore) {
      console.log("Not setting up observer because hasMore is false");
      return;
    }

    // Wait a bit to ensure the loadingRef is attached to DOM
    const timer = setTimeout(() => {
      if (loadingRef.current) {
        console.log(
          "Setting up new IntersectionObserver on:",
          loadingRef.current
        );
        observerRef.current = new IntersectionObserver(handleObserver, {
          root: null,
          rootMargin: "100px", // Increased from 20px to trigger earlier
          threshold: 0.1,
        });
        observerRef.current.observe(loadingRef.current);
      } else {
        console.log("loadingRef.current is still null");
      }
    }, 100); // Short delay to ensure DOM is updated

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        console.log("Cleanup: Disconnecting observer");
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, hasMore]);

  if (status === "loading" && filteredList.length === 0) {
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

  if (filteredList.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        <p className="mb-2 text-lg font-semibold">No Pokémon Found</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredList.map((pokemon) => (
          <PokemonCard
            key={pokemon._id}
            pokemon={pokemon}
            onSelect={openDetails}
          />
        ))}
      </div>

      <div
        ref={loadingRef}
        className="flex justify-center p-4 mt-4"
        style={{ display: hasMore ? "flex" : "none" }}
      >
        {status === "loading" ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        ) : (
          <div className="h-8 w-8"></div>
        )}
      </div>

      <PokemonDetails isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default PokemonGrid;
