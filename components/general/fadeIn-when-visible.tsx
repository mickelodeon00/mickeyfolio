// components/FadeInWhenVisible.tsx
"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  variants?: Variants;
  threshold?: number;
};

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FadeInWhenVisible({
  children,
  variants = defaultVariants,
  threshold = 0.15,
}: Props) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
