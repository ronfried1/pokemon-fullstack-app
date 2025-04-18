import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { ArrowLeft, ArrowRight, Heart, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toggleFavorite } from "../store/pokemonSlice";

interface PokemonDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({
  isOpen,
  onClose,
  isLoading = false,
}) => {
  const selectedPokemon = useAppSelector(
    (state) => state.pokemon.selectedPokemon
  );
  const favorites = useAppSelector((state) => state.pokemon.favorites);

  const details = selectedPokemon?.details as {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: any;
    stats: any[];
    species: { url: string };
    moves: any[];
    evolutions?: any[];
    height: number;
    weight: number;
    base_experience: number;
    abilities: { ability: { name: string } }[];
    description?: string;
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [optimisticIsFav, setOptimisticIsFav] = useState(false);
  const dispatch = useAppDispatch();

  // Update favorite status when selectedPokemon or favorites changes
  useEffect(() => {
    if (selectedPokemon) {
      setOptimisticIsFav(favorites.includes(selectedPokemon._id));
    }
  }, [selectedPokemon, favorites]);

  // If loading or no details, show loading state
  if ((isLoading || !details) && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[90vh] md:max-h-[85vh]">
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="text-lg">Loading Pokémon details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If dialog is closed or no details, return null
  if (!isOpen || !details || !selectedPokemon) return null;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Immediately update the optimistic state
    setOptimisticIsFav(!optimisticIsFav);

    // Dispatch the actual action
    dispatch(
      toggleFavorite({
        pokemonId: selectedPokemon._id,
        isFavorite: !optimisticIsFav,
      })
    )
      .unwrap()
      .catch(() => {
        // Revert optimistic update if the action fails
        setOptimisticIsFav(optimisticIsFav);
      });
  };

  // Get available images
  const getAvailableImages = () => {
    if (!details) return [];

    const images = [];

    if (details.sprites?.front_artwork) {
      images.push(details.sprites.front_artwork);
    }

    if (details.sprites?.front) {
      images.push(details.sprites.front);
    }

    if (details.sprites?.back) {
      images.push(details.sprites.back);
    }

    if (details.sprites?.front_shiny) {
      images.push(details.sprites.front_shiny);
    }

    if (details.sprites?.back_shiny) {
      images.push(details.sprites.back_shiny);
    }

    return images;
  };

  const images = getAvailableImages();

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const imageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
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
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[90vh] md:max-h-[85vh]">
        <ScrollArea className="h-full max-h-[calc(90vh-2rem)] md:max-h-[calc(85vh-2rem)]">
          <div className="grid md:grid-cols-2 pb-6">
            {/* Left side - Pokemon image and details */}
            <div className="flex flex-col">
              <div
                className={`relative ${gradientClass} p-4 md:p-8 flex justify-center items-center min-h-[250px] md:min-h-[350px]`}
              >
                <motion.button
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-md"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      optimisticIsFav
                        ? "fill-destructive text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.button>

                {images.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      className="absolute left-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-md"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <ArrowLeft className="h-5 w-5 text-foreground" />
                    </motion.button>

                    <motion.button
                      onClick={nextImage}
                      className="absolute right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-md"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <ArrowRight className="h-5 w-5 text-foreground" />
                    </motion.button>
                  </>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex justify-center"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 2, 0, -2, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      <img
                        src={
                          images[activeImageIndex] ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        width={200}
                        height={200}
                        className="object-contain w-[180px] h-[180px] md:w-[250px] md:h-[250px]"
                        alt={details.name}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-4 md:p-6 bg-card">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl md:text-2xl font-bold capitalize text-card-foreground">
                    {details.name}
                  </h1>
                  <span className="text-lg md:text-xl font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    #{details.id}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {details.types?.map((type) => (
                    <Badge
                      key={type.type.name}
                      className={`${
                        typeColors[type.type.name]
                      } text-white px-3 py-1`}
                    >
                      {type.type.name}
                    </Badge>
                  ))}
                </div>

                {details.description && (
                  <p className="text-card-foreground/90 mb-6 bg-muted/50 p-3 rounded-lg border border-border text-sm md:text-base">
                    {details.description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base text-card-foreground/90">
                      Height
                    </h3>
                    <p className="text-base md:text-lg bg-muted/50 p-2 rounded-lg border border-border">
                      {details.height} m
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base text-card-foreground/90">
                      Weight
                    </h3>
                    <p className="text-base md:text-lg bg-muted/50 p-2 rounded-lg border border-border">
                      {details.weight} kg
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base text-card-foreground/90">
                      Base Experience
                    </h3>
                    <p className="text-base md:text-lg bg-muted/50 p-2 rounded-lg border border-border">
                      {details.base_experience}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base text-card-foreground/90">
                      Skills
                    </h3>
                    <p className="text-base md:text-lg bg-muted/50 p-2 rounded-lg border border-border truncate">
                      {details.abilities
                        ?.map((ability) => ability.ability.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Tabs */}
            <div className="bg-muted p-4 md:p-6">
              <Tabs defaultValue="movements">
                <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-8">
                  <TabsTrigger
                    value="statistics"
                    className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Statistics
                  </TabsTrigger>
                  <TabsTrigger
                    value="movements"
                    className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Movements
                  </TabsTrigger>
                  <TabsTrigger
                    value="evolution"
                    className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Evolution
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="statistics">
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-foreground">
                      Statistics
                    </h2>
                    <div className="space-y-4 md:space-y-6">
                      {details.stats.map((stat, index) => (
                        <motion.div
                          key={stat.stat.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <div className="flex justify-between mb-1 md:mb-2">
                            <span className="text-xs md:text-sm font-medium capitalize text-foreground/90">
                              {stat.stat.name.replace(/-/g, " ")}
                            </span>
                            <span className="text-xs md:text-sm font-bold text-foreground">
                              {stat.base_stat}
                            </span>
                          </div>
                          <div className="relative h-2 md:h-3 w-full bg-muted rounded-full overflow-hidden">
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
                    <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-foreground">
                      Movements
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
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
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      {`Showing ${
                        details.moves.length < 20 ? details.moves.length : 20
                      } of ${details.moves.length} moves`}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="evolution">
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-foreground">
                      Evolution
                    </h2>
                    {details.evolutions && details.evolutions.length === 0 ? (
                      <p className="text-muted-foreground mb-4">
                        Evolution information not available in this version.
                      </p>
                    ) : (
                      <>
                        Evolution Chain
                        {details.evolutions &&
                          details.evolutions.length > 0 && (
                            <div className="mt-6">
                              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                {details.evolutions.map((evolution) => (
                                  <div
                                    key={evolution.id}
                                    className="flex flex-col items-center"
                                  >
                                    <img
                                      src={evolution.sprite}
                                      alt={evolution.name}
                                      className="h-16 w-16 md:h-24 md:w-24"
                                    />
                                    <p className="text-center capitalize text-xs md:text-base text-foreground">
                                      {evolution.name}
                                    </p>
                                    {
                                      <span className="text-[10px] md:text-xs text-muted-foreground">
                                        {evolution.condition
                                          ? evolution.condition
                                          : "level 1"}
                                      </span>
                                    }
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PokemonDetails;
