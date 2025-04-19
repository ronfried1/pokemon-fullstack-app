import { useCallback, useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { loadMorePokemon } from "../../../store/pokemonSlice";

/**
 * Custom hook for handling Pokemon pagination with infinite scroll
 * @returns Object with loading state and intersection observer ref
 */
export const usePagination = () => {
  const dispatch = useAppDispatch();
  const hasMore = useAppSelector((state) => state.pokemon.hasMore);
  const isLoading = useAppSelector(
    (state) => state.pokemon.status === "loading"
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  /**
   * Handle intersection observer callback
   * Triggers loading more Pokemon when the loading element is visible
   */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading && !isFetchingMore) {
        setIsFetchingMore(true);
        dispatch(loadMorePokemon())
          .unwrap()
          .finally(() => {
            setIsFetchingMore(false);
          });
      }
    },
    [dispatch, hasMore, isLoading, isFetchingMore]
  );

  // Set up the intersection observer
  useEffect(() => {
    // Disconnect the previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    // Start observing the loading element
    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    // Clean up the observer on component unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return {
    loadingRef,
    isFetchingMore,
    isLoading,
    hasMore,
  };
};

export default usePagination;
