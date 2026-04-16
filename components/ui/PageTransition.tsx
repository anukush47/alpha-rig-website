"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const transition = {
  duration: 0.3,
  ease: "easeInOut" as const,
};

/**
 * PageTransition
 * Wraps page content with a subtle fade + slide animation on route change.
 * Uses the pathname as the AnimatePresence key so each route gets its own
 * enter/exit cycle.
 *
 * Framer Motion v12 no longer requires mode="wait" for basic transitions —
 * the default concurrent mode handles this cleanly. We still use it to avoid
 * the incoming page being visible while the outgoing one fades.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
