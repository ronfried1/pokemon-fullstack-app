import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Pokemon } from "../types/pokemon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectPokemon } from "../store/pokemonSlice";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.list);
  const isFavorite = favorites.includes(pokemon.name);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(pokemon.name));
    } else {
      dispatch(addFavorite(pokemon.name));
    }
  };

  const handleClick = () => {
    dispatch(selectPokemon(pokemon));
    onSelect();
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
    <Card
      className="cursor-pointer transition-transform hover:scale-105"
      onClick={handleClick}
    >
      <CardHeader className="relative pb-0">
        <CardTitle className="capitalize">{pokemon.name}</CardTitle>
        {isFavorite && (
          <div className="absolute right-4 top-4">
            <Badge variant="success">Favorite</Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-center">
          <img
            src={pokemon.sprites.front}
            alt={pokemon.name}
            className="h-32 w-32"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <Badge key={type} className={getTypeColor(type)}>
              {type}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={onSelect} variant="secondary" size="sm">
          View Details
        </Button>
        <Button
          onClick={handleToggleFavorite}
          variant={isFavorite ? "destructive" : "outline"}
          size="sm"
        >
          {isFavorite ? "Remove" : "Favorite"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PokemonCard;
