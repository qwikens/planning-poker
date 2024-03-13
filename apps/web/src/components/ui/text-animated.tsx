import { motion } from "framer-motion";

export function TextAnimatedGradient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex animate-text-gradient bg-gradient-to-r from-[#ACACAC] via-[#363636] to-[#ACACAC] bg-[200%_auto] text-scale-[13px]/[16px] text-center text-transparent font-medium bg-clip-text"
    >
      {children}
    </motion.span>
  );
}
