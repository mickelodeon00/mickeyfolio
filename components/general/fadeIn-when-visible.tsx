// components/FadeInWhenVisible.tsx
"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  variants?: Variants;
  threshold?: number;
  waitForContent?: boolean; // New prop to wait for content
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
  waitForContent = false,
}: Props) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold });
  const [hasContent, setHasContent] = useState(!waitForContent);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is ready
  useEffect(() => {
    if (!waitForContent || !contentRef.current) return;

    const checkContent = () => {
      const element = contentRef.current;
      if (!element) return;

      // Check if element has actual rendered content
      const hasText =
        element.textContent && element.textContent.trim().length > 0;
      const hasElements = element.children.length > 0;
      const hasHeight = element.scrollHeight > 50; // Reasonable height threshold

      if (hasText || hasElements || hasHeight) {
        setHasContent(true);
      }
    };

    // Use MutationObserver to watch for content changes
    const observer = new MutationObserver(() => {
      checkContent();
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial check
    checkContent();

    return () => observer.disconnect();
  }, [waitForContent]);

  useEffect(() => {
    if (inView && hasContent) {
      controls.start("visible");
    }
  }, [controls, inView, hasContent]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
}
