import { motion } from "framer-motion";

export function PokemonLoader() {
  return (
    <div className="flex justify-center items-center py-12">
      <motion.div
        className="pokeball-loader"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 0.8,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
