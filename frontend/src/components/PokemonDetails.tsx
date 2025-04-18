"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../store/hooks";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Heart } from "lucide-react";

interface PokemonDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-purple-500",
  poison: "bg-purple-700",
  bug: "bg-lime-600",
  flying: "bg-sky-400",
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

export default function PokemonDetails({
  isOpen,
  onClose,
}: PokemonDetailsProps) {
  const details = useAppSelector(
    (state) => state.pokemon.selectedPokemon?.details
  );

  if (!details) return null;

  const gradientClass =
    typeColors[details.types?.[0]?.type?.name || "normal"] || "bg-gray-400";

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <DialogClose onClick={onClose} />
          <DialogTitle className="text-center text-2xl capitalize mb-4">
            {details.name.replace(/-/g, " ")}
          </DialogTitle>

          <DialogContent className="space-y-6">
            {/* Main Card */}
            <motion.div
              className={`rounded-2xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-md ${gradientClass} p-6`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={details.sprites?.front || "/placeholder.svg"}
                    alt={details.name}
                    width={150}
                    height={150}
                    className="drop-shadow-lg"
                  />
                </motion.div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {details.types?.map((type, index) => (
                    <Badge
                      key={index}
                      className="capitalize bg-white text-black font-semibold"
                    >
                      {typeof type === "string" ? type : type.type?.name || ""}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 bg-gray-100 rounded-xl mb-6">
                <TabsTrigger value="info" className="rounded-lg">
                  Info
                </TabsTrigger>
                <TabsTrigger value="stats" className="rounded-lg">
                  Stats
                </TabsTrigger>
                <TabsTrigger value="evolution" className="rounded-lg">
                  Evolution
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="grid grid-cols-2 gap-4 text-center"
                >
                  <div>
                    <h4 className="font-semibold text-gray-600">Height</h4>
                    <p className="text-lg">
                      {details.height ? (details.height / 10).toFixed(1) : "?"}{" "}
                      m
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600">Weight</h4>
                    <p className="text-lg">
                      {details.weight ? (details.weight / 10).toFixed(1) : "?"}{" "}
                      kg
                    </p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="font-semibold text-gray-600">Abilities</h4>
                    <p className="capitalize">
                      {details.abilities
                        ?.map((ab) =>
                          typeof ab === "string"
                            ? ab
                            : ab.ability?.name?.replace(/-/g, " ") || ""
                        )
                        .join(", ")}
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Stats Tab */}
              <TabsContent value="stats">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-4"
                >
                  {Object.entries(details.stats || {}).map(
                    ([stat, value], index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="capitalize">
                            {stat.replace(/-/g, " ")}
                          </span>
                          <span>{value as any}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(value as number) / 2}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </motion.div>
              </TabsContent>

              {/* Evolution Tab */}
              <TabsContent value="evolution">
                {details.evolutions && details.evolutions.length > 0 ? (
                  <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {details.evolutions.map((evolution) => (
                      <div
                        key={evolution.id}
                        className="flex flex-col items-center"
                      >
                        <img
                          src={evolution.sprite}
                          alt={evolution.name}
                          className="h-20 w-20"
                        />
                        <span className="capitalize mt-2">
                          {evolution.name}
                        </span>
                        {evolution.condition && (
                          <span className="text-xs text-gray-500">
                            {evolution.condition}
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No evolution data available.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </motion.div>
      </AnimatePresence>
    </Dialog>
  );
}
