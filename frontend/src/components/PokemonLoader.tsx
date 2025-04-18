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
          repeatType: "mirror",
          duration: 0.7,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
