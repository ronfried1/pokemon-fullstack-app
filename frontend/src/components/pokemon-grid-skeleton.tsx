import React from "react";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";

/**
 * Props for the PokemonGridSkeleton component
 */
interface PokemonGridSkeletonProps {
  count?: number;
}

/**
 * Skeleton loading state for the PokemonGrid
 * Shows a placeholder grid of loading Pokemon cards
 */
export const PokemonGridSkeleton: React.FC<PokemonGridSkeletonProps> = ({
  count = 12,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
    </div>
  );
};

export default PokemonGridSkeleton;
