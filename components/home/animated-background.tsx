"use client"

import { useEffect, useRef, useState } from "react"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const points = useRef<Point[]>([])
  const animationFrameId = useRef<number | null>(null)

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
    }

    // Initial check
    checkDarkMode()

    // Set up observer to watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    const initPoints = () => {
      points.current = []
      const numPoints = Math.floor((canvas.width * canvas.height) / 15000)

      for (let i = 0; i < numPoints; i++) {
        const lightColors = ["rgba(59, 130, 246, 0.3)", "rgba(99, 102, 241, 0.3)", "rgba(79, 70, 229, 0.3)"]

        const darkColors = ["rgba(96, 165, 250, 0.3)", "rgba(129, 140, 248, 0.3)", "rgba(124, 58, 237, 0.3)"]

        const colors = isDark ? darkColors : lightColors

        points.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const drawPoints = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw points
      points.current.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fillStyle = point.color
        ctx.fill()

        // Update position
        point.x += point.vx
        point.y += point.vy

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        // Interact with mouse
        const dx = point.x - mousePosition.current.x
        const dy = point.y - mousePosition.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const angle = Math.atan2(dy, dx)
          const force = (100 - distance) / 100
          point.vx += Math.cos(angle) * force * 0.2
          point.vy += Math.sin(angle) * force * 0.2
        }

        // Limit velocity
        const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy)
        if (speed > 2) {
          point.vx = (point.vx / speed) * 2
          point.vy = (point.vy / speed) * 2
        }
      })

      // Draw connections
      ctx.beginPath()
      for (let i = 0; i < points.current.length; i++) {
        for (let j = i + 1; j < points.current.length; j++) {
          const dx = points.current[i].x - points.current[j].x
          const dy = points.current[i].y - points.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.moveTo(points.current[i].x, points.current[i].y)
            ctx.lineTo(points.current[j].x, points.current[j].y)

            const alpha = (100 - distance) / 100
            ctx.strokeStyle = isDark ? `rgba(96, 165, 250, ${alpha * 0.2})` : `rgba(59, 130, 246, ${alpha * 0.2})`
          }
        }
      }
      ctx.stroke()

      animationFrameId.current = requestAnimationFrame(drawPoints)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    resizeCanvas()
    drawPoints()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="animated-background" aria-hidden="true" />
}
