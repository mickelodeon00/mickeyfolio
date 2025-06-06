"use client"

import { useState } from "react"
import Image from "next/image"

export function SpotifyWidget() {
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-full flex items-center p-1 pr-4 text-sm">
      <div className="relative h-10 w-10 mr-3">
        <Image
          src="/placeholder.svg?height=40&width=40"
          alt="Album cover"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <div className="w-2 h-3 flex gap-0.5">
              <div className="w-0.5 h-full bg-white animate-pulse" />
              <div className="w-0.5 h-full bg-white animate-pulse [animation-delay:0.2s]" />
            </div>
          ) : (
            <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-white ml-0.5" />
          )}
        </div>
      </div>
      <div>
        <div className="font-medium">Off the Knob</div>
        <div className="text-xs text-muted-foreground">Mason Kash</div>
      </div>
    </div>
  )
}
