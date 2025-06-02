"use client";

import type React from "react";
import AnimatedBackground from "../home/animated-background";

interface PageWrapperProps {
  children: React.ReactNode;
  showAnimation?: boolean;
  className?: string;
}

export default function PageWrapper({
  children,
  showAnimation = true,
  className = "",
}: PageWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {showAnimation && <AnimatedBackground />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
