"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

export function LocationDisplay() {
  const [temperature, setTemperature] = useState("32°C")
  const [location, setLocation] = useState("Lagos, NG")

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <span>{temperature}</span>
      <MapPin size={14} className="inline" />
      <span>{location}</span>
    </div>
  )
}
