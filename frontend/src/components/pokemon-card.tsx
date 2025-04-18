"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart } from "lucide-react";

// import type { Pokemon } from "@/lib/types"
import { motion } from "framer-motion";
import { Pokemon } from "../types/pokemon";
import { useAppDispatch } from "../store/hooks";
import { fetchPokemonDetails } from "../store/pokemonSlice";

const typeColors: Record<string, string> = {
  normal: "bg-gradient-to-r from-gray-400 to-gray-500",
  fire: "bg-gradient-to-r from-red-500 to-orange-500",
  water: "bg-gradient-to-r from-blue-500 to-blue-400",
  electric: "bg-gradient-to-r from-yellow-400 to-yellow-300",
  grass: "bg-gradient-to-r from-green-500 to-green-400",
  ice: "bg-gradient-to-r from-blue-300 to-blue-200",
  fighting: "bg-gradient-to-r from-red-700 to-red-600",
  poison: "bg-gradient-to-r from-purple-500 to-purple-400",
  ground: "bg-gradient-to-r from-yellow-700 to-yellow-600",
  flying: "bg-gradient-to-r from-indigo-400 to-indigo-300",
  psychic: "bg-gradient-to-r from-pink-500 to-pink-400",
  bug: "bg-gradient-to-r from-green-500 to-lime-500",
  rock: "bg-gradient-to-r from-yellow-800 to-yellow-700",
  ghost: "bg-gradient-to-r from-purple-700 to-purple-600",
  dragon: "bg-gradient-to-r from-indigo-700 to-purple-700",
  dark: "bg-gradient-to-r from-gray-800 to-gray-700",
  steel: "bg-gradient-to-r from-gray-500 to-gray-400",
  fairy: "bg-gradient-to-r from-pink-400 to-pink-300",
};

const variants = {
  hidden: { opacity: 0, y: 75 },
  visible: { opacity: 1, y: 0 },
};

export function PokemonCard({
  pokemon,
  index,
  onSelect,
}: {
  pokemon: Pokemon;
  index: number;
  onSelect: () => void;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const storedFavorites = localStorage.getItem("favorites");
    let favorites: string[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    // if (isFavorite) {
    //   favorites = favorites.filter((id) => id !== pokemon._id);
    // } else {
    //   favorites.push(pokemon._id);
    // }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Get type name accounting for different API formats
  const getTypeName = (type: any): string => {
    if (typeof type === "string") return type;
    if (type?.type?.name) return type.type.name;
    return "normal";
  };

  // Get sprite URL accounting for different API formats
  const getSpriteUrl = (details: any): string => {
    if (!details?.sprites) return "/placeholder.svg";

    // Handle different sprite formats
    if (details.sprites.other?.["official-artwork"]?.front_default) {
      return details.sprites.other["official-artwork"].front_default;
    }
    if (details.sprites.front) return details.sprites.front;
    if (details.sprites.front_default) return details.sprites.front_default;

    return "/placeholder.svg";
  };

  // Use the first type from the types array
  const mainType = pokemon.details?.types?.[0];
  const typeValue = getTypeName(mainType);
  const gradientClass =
    typeColors[typeValue] || "bg-gradient-to-r from-gray-400 to-gray-500";

  // console.log(pokemon);
  // If details aren't loaded yet, show a placeholder
  if (!pokemon.details) {
    return (
      <Card className="overflow-hidden h-full border-0 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm">
        <div className="p-5">
          <h3 className="font-bold text-xl capitalize">Loading...</h3>
        </div>
      </Card>
    );
  }
  const handleClick = () => {
    // Fetch pokemon details when card is clicked
    console.log("pokemon._id", pokemon);
    dispatch(fetchPokemonDetails(pokemon._id || ""));
    onSelect();
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.2, ease: "easeInOut", duration: 0.5 }}
      viewport={{ amount: 0 }}
      className="max-w-sm rounded relative w-full"
    >
      <motion.div
        ref={cardRef}
        className="h-full perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetRotation}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          style={{
            rotateX: isHovered ? rotation.x : 0,
            rotateY: isHovered ? rotation.y : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="h-full"
        >
          {/* <motion.div
      ref={cardRef}
      className="h-full perspective-1000 max-w-sm rounded relative w-full"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.08, ease: "easeInOut", duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
      style={{
        rotateX: isHovered ? rotation.x : 0,
        rotateY: isHovered ? rotation.y : 0,
      }}
    > */}
          <Card
            onClick={handleClick}
            className="overflow-hidden h-full border-0 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
          >
            <div
              className={`relative pt-6 px-6 ${gradientClass} rounded-t-2xl`}
            >
              <motion.button
                onClick={toggleFavorite}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </motion.button>
              <div className="flex justify-center items-center p-4">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={getSpriteUrl(pokemon.details)}
                    alt={pokemon.name}
                    width={150}
                    height={150}
                    className="object-contain drop-shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl capitalize">
                  {pokemon.name.replace(/-/g, " ")}
                </h3>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                  #{pokemon.details.id || "?"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {pokemon.details.types?.map((type, index) => {
                  const typeName = getTypeName(type);
                  return (
                    <Badge
                      key={index}
                      className={`${
                        typeColors[typeName] || "bg-gray-500"
                      } text-white px-3 py-1 text-xs font-medium`}
                    >
                      {typeName}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

{
  /* </motion.div> */
}
