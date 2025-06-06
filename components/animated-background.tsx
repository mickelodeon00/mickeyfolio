"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(22, 163, 74, 0.7), 
            rgba(15, 23, 42, 0.3)
          )`,
        }}
        animate={{
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(22, 163, 74, 0.7), 
            rgba(15, 23, 42, 0.3)
          )`,
        }}
        transition={{ type: "tween", duration: 0.3 }}
      />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-transparent via-transparent to-emerald-900/20" />
    </div>
  )
}
