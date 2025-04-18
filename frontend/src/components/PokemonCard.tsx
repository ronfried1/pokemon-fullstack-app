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
import { fetchPokemonDetails } from "../store/pokemonSlice";
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
    // Fetch pokemon details when card is clicked
    dispatch(fetchPokemonDetails(pokemon._id));
    onSelect();
  };

  // Extract Pokemon ID from URL for image
  const extractPokemonId = (url: string): string => {
    const urlParts = url.split("/");
    // Find the ID in the URL, which is typically the second-to-last segment
    for (let i = urlParts.length - 2; i >= 0; i--) {
      const id = parseInt(urlParts[i]);
      if (!isNaN(id)) {
        return id.toString();
      }
    }
    return "1"; // Default fallback
  };

  const pokemonId = extractPokemonId(pokemon.url);
  const dreamWorldImageUrl = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  const fallbackImageUrl = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <Card
      className="cursor-pointer transition-transform hover:scale-105"
      onClick={handleClick}
    >
      <CardHeader className="relative pb-0">
        <CardTitle className="capitalize">{pokemon.name}</CardTitle>
        {pokemon.isFav && (
          <div className="absolute right-4 top-4">
            <Badge variant="success">Favorite</Badge>
          </div>
        )}
        {pokemon.isViewed && (
          <div className="absolute right-4 bottom-0">
            <Badge variant="outline" className="bg-blue-100">
              Viewed
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-center">
          <img
            src={dreamWorldImageUrl}
            alt={pokemon.name}
            className="h-32 w-32"
            onError={(e) => {
              e.currentTarget.onerror = null;
              // Fallback to regular sprite if dream world fails
              e.currentTarget.src = fallbackImageUrl;
            }}
            loading="lazy"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={handleClick} variant="secondary" size="sm">
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
