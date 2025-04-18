import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface PokemonDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const details = useAppSelector(
    (state) => state.pokemon.selectedPokemon?.details
  );

  const favorites = useAppSelector((state) => state.favorites.list);

  if (!details) return null;

  // const { details } = pokemon;
  // const isFavorite = favorites.includes(details.name);

  const handleToggleFavorite = () => {
    // if (isFavorite) {
    //   dispatch(removeFavorite(details.name));
    // } else {
    //   dispatch(addFavorite(details.name));
    // }
  };

  const toggleFavorite = () => {
    // setIsFavorite(!isFavorite)
  };

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
  const mainType = details.types?.[0]?.type.name || "normal";
  const gradientClass =
    typeColors[mainType] || "bg-gradient-to-r from-gray-400 to-gray-500";
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="hidden">
        {details.name} - {details.id}
      </DialogTitle>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left side - Pokemon image and details */}
          <div className="flex flex-col">
            <div className={`relative ${gradientClass} p-6`}>
              <button
                onClick={toggleFavorite}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white"
              >
                <Heart
                  className={`h-5 w-5 ${
                    false ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>

              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <button className="p-2 rounded-full bg-white/80 hover:bg-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button className="p-2 rounded-full bg-white/80 hover:bg-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-center items-center h-[300px]">
                <img
                  src={
                    details.sprites?.other?.["official-artwork"]
                      ?.front_default || "/placeholder.svg?height=250&width=250"
                  }
                  width={250}
                  height={250}
                  className="object-contain"
                  alt={details.name}
                />
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold capitalize">
                  {details.name}
                </h1>
                <span className="text-xl font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  #{details.id}
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                {details.types?.map((type) => (
                  <Badge
                    key={type.type.name}
                    className={`${
                      type.type.name === "grass"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    } text-white px-3 py-1`}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>

              {/* <p className="text-gray-700 mb-6">{details.description}</p> */}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Height</h3>
                  <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {details.height} m
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Weight</h3>
                  <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {details.weight} kg
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Base Experience
                  </h3>
                  <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {details.base_experience}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Skills</h3>
                  <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {details.abilities
                      ?.map((ability) => ability.ability.name)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Tabs */}
          <div className="bg-gray-50 p-6">
            <Tabs defaultValue="movements">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="statistics"
                  className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger
                  value="movements"
                  className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Movements
                </TabsTrigger>
                <TabsTrigger
                  value="evolution"
                  className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  Evolution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="statistics">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Statistics</h2>
                  <div className="space-y-6">
                    {details.stats.map((stat, index) => (
                      <motion.div
                        key={stat.stat.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium capitalize">
                            {stat.stat.name.replace(/-/g, " ")}
                          </span>
                          <span className="text-sm font-bold">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              stat.base_stat < 50
                                ? "bg-gradient-to-r from-red-500 to-red-400"
                                : stat.base_stat < 90
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                : "bg-gradient-to-r from-green-500 to-green-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(stat.base_stat / 255) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="movements">
                <div>
                  <h2 className="text-xl font-bold mb-6">Movements</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.moves.slice(0, 20).map((move, index) => (
                      <motion.div
                        key={move.move.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Badge
                          variant="outline"
                          className="justify-start py-2 px-3 capitalize w-full text-left bg-secondary/50 hover:bg-secondary transition-colors duration-200"
                        >
                          {move.move.name.replace(/-/g, " ")}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Showing 20 of 86 moves
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="evolution">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Evolution</h2>
                  {/* Add evolution content here */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PokemonDetails;

// "use client";

// import { useState } from "react";

// import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// interface PokemonDialogProps {
//   open: boolean;
//   onClose: (open: boolean) => void;
//   pokemon?: {
//     id: number;
//     name: string;
//     types: string[];
//     description: string;
//     height: number;
//     weight: number;
//     baseExperience: number;
//     skills: string[];
//     image: string;
//     moves: string[];
//   };
// }

// export function PokemonDialog({ open, onClose, pokemon }: PokemonDialogProps) {
//   const [isFavorite, setIsFavorite] = useState(false);

//   if (!pokemon) return null;

//   const toggleFavorite = () => {
//     setIsFavorite(!isFavorite);
//   };

//   return (
//     <Dialog onClose={() => onClose(false)} isOpen={true}>
//       <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
//         <div className="grid md:grid-cols-2">
//           {/* Left side - Pokemon image and details */}
//           <div className="flex flex-col">
//             <div className="relative bg-green-500 p-6">
//               <button
//                 onClick={toggleFavorite}
//                 className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white"
//               >
//                 <Heart
//                   className={`h-5 w-5 ${
//                     isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
//                   }`}
//                 />
//               </button>

//               <div className="absolute left-4 top-1/2 -translate-y-1/2">
//                 <button className="p-2 rounded-full bg-white/80 hover:bg-white">
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 <button className="p-2 rounded-full bg-white/80 hover:bg-white">
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="flex justify-center items-center h-[300px]">
//                 <img
//                   src={pokemon.image || "/placeholder.svg?height=250&width=250"}
//                   width={250}
//                   height={250}
//                   className="object-contain"
//                   alt={pokemon.name}
//                 />
//               </div>
//             </div>

//             <div className="p-6 bg-white">
//               <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-bold capitalize">
//                   {pokemon.name}
//                 </h1>
//                 <span className="text-lg font-semibold text-gray-600">
//                   #{pokemon.id}
//                 </span>
//               </div>

//               <div className="flex gap-2 mb-4">
//                 {pokemon.types.map((type) => (
//                   <Badge
//                     key={type}
//                     className={`${
//                       type === "grass" ? "bg-green-500" : "bg-purple-500"
//                     } text-white px-3 py-1`}
//                   >
//                     {type}
//                   </Badge>
//                 ))}
//               </div>

//               <p className="text-gray-700 mb-6">{pokemon.description}</p>

//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">Height</h3>
//                      <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">{pokemon.height} m</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">Weight</h3>
//                      <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">{pokemon.weight} kg</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">
//                     Base Experience
//                   </h3>
//                      <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">{pokemon.baseExperience}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">Skills</h3>
//                      <p className="text-lg bg-gray-50 p-2 rounded-lg border border-gray-100">{pokemon.skills.join(", ")}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Tabs */}
//           <div className="bg-gray-50 p-6">
//             <Tabs defaultValue="movements">
//               <TabsList className="grid w-full grid-cols-3 mb-8">
//                 <TabsTrigger
//                   value="statistics"
//                   className="data-[state=active]:bg-white"
//                 >
//                   Statistics
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="movements"
//                   className="data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500"
//                 >
//                   Movements
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="evolution"
//                   className="data-[state=active]:bg-white"
//                 >
//                   Evolution
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="statistics">
//                 <div className="space-y-4">
//                   <h2 className="text-xl font-bold mb-4">Statistics</h2>
//                   {/* Add statistics content here */}
//                 </div>
//               </TabsContent>

//               <TabsContent value="movements">
//                 <div>
//                   <h2 className="text-xl font-bold mb-6">Movements</h2>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Razor Wind</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Swords Dance</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Cut</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Bind</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Vine Whip</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Headbutt</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Tackle</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Body Slam</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Take Down</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Double Edge</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Growl</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Strength</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Mega Drain</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Leech Seed</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Growth</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Razor Leaf</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Solar Beam</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Poison Powder</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Sleep Powder</span>
//                     </div>
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <span>Petal Dance</span>
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-4 text-center">
//                     Showing 20 of 86 moves
//                   </p>
//                 </div>
//               </TabsContent>

//               <TabsContent value="evolution">
//                 <div className="space-y-4">
//                   <h2 className="text-xl font-bold mb-4">Evolution</h2>
//                   {/* Add evolution content here */}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
