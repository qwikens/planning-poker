import { motion } from "framer-motion";

export function BadgeRotateBorder({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="relative inline-flex p-px overflow-hidden rounded-full">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c2c2c2_0%,#505050_50%,#bebebe_100%)]" />
      <span className="inline-flex items-center justify-center w-full h-full px-3 py-1 text-xs font-medium rounded-full bg-neutral-950 text-gray-50/80 backdrop-blur-3xl">
        {children}
      </span>
    </motion.div>
  );
}
