import React, { useState } from "react";
import { useAppSelector } from "../store/hooks";
import PokemonCard from "./PokemonCard";
import PokemonDetails from "./PokemonDetails";

const PokemonGrid: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { filteredList, status, error } = useAppSelector(
    (state) => state.pokemon
  );

  const openDetails = () => {
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  if (status === "loading") {
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
            key={pokemon.id}
            pokemon={pokemon}
            onSelect={openDetails}
          />
        ))}
      </div>

      <PokemonDetails isOpen={isDetailsOpen} onClose={closeDetails} />
    </>
  );
};

export default PokemonGrid;
