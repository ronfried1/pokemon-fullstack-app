import { motion } from "framer-motion";

export function PokemonCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      className="h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg animate-pulse flex flex-col justify-center items-center p-6"
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.05, ease: "easeInOut", duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
      <div className="w-20 h-4 bg-gray-300 rounded mb-2" />
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </motion.div>
  );
}
