import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tailwind gradient classes for Pokemon types
 */
export const typeColors: Record<string, string> = {
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

/**
 * Get type name accounting for different API formats
 */
export const getTypeName = (type: any): string => {
  if (typeof type === "string") return type;
  if (type?.type?.name) return type.type.name;
  return "normal";
};

/**
 * Get sprite URL accounting for different API formats
 */
export const getSpriteUrl = (details: any): string => {
  if (!details?.sprites) return "/placeholder.svg";

  // Handle different sprite formats
  if (details.sprites.other?.["official-artwork"]?.front_default) {
    return details.sprites.other["official-artwork"].front_default;
  }
  if (details.sprites.front) return details.sprites.front;
  if (details.sprites.front_default) return details.sprites.front_default;

  return "/placeholder.svg";
};
