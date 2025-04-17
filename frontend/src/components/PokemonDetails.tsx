import React from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";

interface PokemonDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const pokemon = useAppSelector((state) => state.pokemon.selectedPokemon);
  const favorites = useAppSelector((state) => state.favorites.list);

  if (!pokemon) return null;

  const isFavorite = favorites.includes(pokemon.name);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(pokemon.name));
    } else {
      dispatch(addFavorite(pokemon.name));
    }
  };

  // Helper to get badge color based on Pokemon type
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      fire: "bg-red-500",
      water: "bg-blue-500",
      grass: "bg-green-500",
      electric: "bg-yellow-500",
      psychic: "bg-purple-500",
      poison: "bg-purple-700",
      bug: "bg-lime-600",
      flying: "bg-sky-300",
      fighting: "bg-orange-700",
      rock: "bg-stone-600",
      ground: "bg-amber-700",
      ghost: "bg-indigo-600",
      ice: "bg-cyan-400",
      dragon: "bg-indigo-700",
      normal: "bg-gray-400",
      fairy: "bg-pink-400",
      steel: "bg-slate-400",
      dark: "bg-gray-800",
    };

    return `${typeColors[type.toLowerCase()] || "bg-gray-400"} text-white`;
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        <DialogClose onClick={onClose} />
        <DialogTitle className="pr-8 text-2xl capitalize">
          {pokemon.name}
          {isFavorite && (
            <Badge variant="success" className="ml-2">
              Favorite
            </Badge>
          )}
        </DialogTitle>

        <DialogContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex flex-col items-center">
              <img
                src={pokemon.sprites.front}
                alt={pokemon.name}
                className="h-36 w-36"
              />
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {pokemon.types.map((type) => (
                  <Badge key={type} className={getTypeColor(type)}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h3 className="mb-2 font-semibold">Info</h3>
                <p>Height: {pokemon.height / 10}m</p>
                <p>Weight: {pokemon.weight / 10}kg</p>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 font-semibold">Abilities</h3>
                <ul className="list-inside list-disc">
                  {pokemon.abilities.map((ability) => (
                    <li key={ability} className="capitalize">
                      {ability}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 font-semibold">Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>HP: {pokemon.stats.hp}</p>
                  <p>Attack: {pokemon.stats.attack}</p>
                  <p>Defense: {pokemon.stats.defense}</p>
                  <p>Speed: {pokemon.stats.speed}</p>
                </div>
              </div>
            </div>
          </div>

          {pokemon.evolutions && pokemon.evolutions.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">Evolutions</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {pokemon.evolutions.map((evolution) => (
                  <div
                    key={evolution.id}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={evolution.sprite}
                      alt={evolution.name}
                      className="h-24 w-24"
                    />
                    <p className="text-center capitalize">{evolution.name}</p>
                    {evolution.condition && (
                      <span className="text-xs text-gray-500">
                        {evolution.condition}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleToggleFavorite}
              variant={isFavorite ? "destructive" : "default"}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default PokemonDetails;
