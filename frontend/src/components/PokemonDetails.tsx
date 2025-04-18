import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";

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

  // return (
  //   <Dialog isOpen={isOpen} onClose={onClose}>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <div className="grid gap-4 py-4">
  //         <div className="grid grid-cols-4 items-center gap-4">Name</div>
  //         <div className="grid grid-cols-4 items-center gap-4">Username</div>
  //       </div>
  //     </DialogContent>
  //   </Dialog>
  // );
  return (
    // <Dialog isOpen={isOpen} onClose={onClose}>
    //   <div className="relative">
    //     <DialogClose onClick={onClose} />
    //     <DialogTitle className="pr-8 text-2xl capitalize">
    //       {details.name}
    //       {/* {isFavorite && (
    //         <Badge variant="success" className="ml-2">
    //           Favorite
    //         </Badge>
    //       )} */}
    //     </DialogTitle>

    //     <DialogContent>
    //       <div className="flex flex-col items-center gap-6 sm:flex-row">
    //         <div className="flex flex-col items-center">
    //           <img
    //             src={details.sprites?.front}
    //             alt={details.name}
    //             className="h-36 w-36"
    //           />
    //           <div className="mt-2 flex flex-wrap justify-center gap-1">
    //             {/* {details.types?.map((type) => (
    //               <Badge
    //                 key={type.type.name}
    //                 className={getTypeColor(type.type.name)}
    //               >
    //                 {type.type.name}
    //               </Badge>
    //             ))} */}
    //           </div>
    //         </div>

    //         <div className="flex-1">
    //           <div className="mb-4">
    //             <h3 className="mb-2 font-semibold">Info</h3>
    //             <p>Height: {details.height ? details.height / 10 : "N/A"}m</p>
    //             <p>Weight: {details.weight ? details.weight / 10 : "N/A"}kg</p>
    //           </div>

    //           <div className="mb-4">
    //             <h3 className="mb-2 font-semibold">Abilities</h3>
    //             <ul className="list-inside list-disc">
    //               {/* {details.abilities?.map((ability) => (
    //                 <li key={ability.ability.name} className="capitalize">
    //                   {ability.ability.name}
    //                 </li>
    //               ))} */}
    //             </ul>
    //           </div>

    //           <div className="mb-4">
    //             <h3 className="mb-2 font-semibold">Stats</h3>
    //             <div className="grid grid-cols-2 gap-2">
    //               <p>HP: {details.stats.hp}</p>
    //               <p>Attack: {details.stats.attack}</p>
    //               <p>Defense: {details.stats.defense}</p>
    //               <p>Speed: {details.stats.speed}</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {details.evolutions && details.evolutions.length > 0 && (
    //         <div className="mt-6">
    //           <h3 className="mb-2 font-semibold">Evolutions</h3>
    //           <div className="flex flex-wrap justify-center gap-4">
    //             {details.evolutions.map((evolution) => (
    //               <div
    //                 key={evolution.id}
    //                 className="flex flex-col items-center"
    //               >
    //                 <img
    //                   src={evolution.sprite}
    //                   alt={evolution.name}
    //                   className="h-24 w-24"
    //                 />
    //                 <p className="text-center capitalize">{evolution.name}</p>
    //                 {evolution.condition && (
    //                   <span className="text-xs text-gray-500">
    //                     {evolution.condition}
    //                   </span>
    //                 )}
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       )}

    //       <div className="mt-6 flex justify-end">
    //         {/* <Button
    //           onClick={handleToggleFavorite}
    //           variant={isFavorite ? "destructive" : "default"}
    //         >
    //           {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    //         </Button> */}
    //       </div>
    //     </DialogContent>
    //   </div>
    // </Dialog>
    // onClose={onClose} isOpen={isOpen}
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left side - Pokemon image and details */}
          <div className="flex flex-col">
            <div className="relative bg-green-500 p-6">
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
                <span className="text-lg font-semibold text-gray-600">
                  #{details.id}
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                {/* {details.types?.map((type) => (
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
                ))} */}
              </div>

              {/* <p className="text-gray-700 mb-6">{details.description}</p> */}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Height</h3>
                  <p className="text-lg">{details.height} m</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Weight</h3>
                  <p className="text-lg">{details.weight} kg</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Base Experience
                  </h3>
                  <p className="text-lg">{details.stats?.base_experience}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-700">Skills</h3>
                  <p className="text-lg">
                    {/* {details.abilities
                      ?.map((ability) => ability.ability.name)
                      .join(", ")} */}
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
                  className="data-[state=active]:bg-white"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger
                  value="movements"
                  className="data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500"
                >
                  Movements
                </TabsTrigger>
                <TabsTrigger
                  value="evolution"
                  className="data-[state=active]:bg-white"
                >
                  Evolution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="statistics">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Statistics</h2>
                  {/* Add statistics content here */}
                </div>
              </TabsContent>

              <TabsContent value="movements">
                <div>
                  <h2 className="text-xl font-bold mb-6">Movements</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* {details.moves.slice(0, 20).map((move, index) => (
                      <motion.div
                        key={move.move.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Badge
                          variant="outline"
                          className="justify-start py-2 px-3 capitalize w-full text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          {move.move.name.replace(/-/g, " ")}
                        </Badge>
                      </motion.div>
                    ))} */}
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
//                   <p className="text-lg">{pokemon.height} m</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">Weight</h3>
//                   <p className="text-lg">{pokemon.weight} kg</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">
//                     Base Experience
//                   </h3>
//                   <p className="text-lg">{pokemon.baseExperience}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2 text-gray-700">Skills</h3>
//                   <p className="text-lg">{pokemon.skills.join(", ")}</p>
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
