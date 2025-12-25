"use client"

import { MapPin } from "lucide-react"
import { getLocationString, useLocation, useWeather } from "@/hooks/use-location"
import Image from "next/image"

export function LocationDisplay() {

  const { data: locationData, isLoading: locationLoading } = useLocation()
  const { data: weatherData, isLoading: weatherLoading } = useWeather(locationData?.latitude, locationData?.longitude)

  const location = getLocationString(locationData)
  const temperature = weatherData ? `${Math.round(weatherData.temperature)}°C` : '--°C'


  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {/* Temperature */}
      {weatherLoading || !temperature ? (
        <div className="h-4 w-8 bg-muted animate-pulse rounded" />
      ) : (
        <span className="font-medium">{temperature}</span>
      )}

      {/* Weather Icon */}
      {weatherLoading ? (
        <div className="h-5 w-5 bg-muted animate-pulse rounded" />
      ) : weatherData ? (
        <WeatherIcon
          icon={weatherData.icon}
          condition={weatherData.condition}
          size={30}
        />
      ) : null}

      {/* Location */}
      <div className="flex items-center gap-1">
        <MapPin size={14} className={locationLoading ? 'animate-pulse' : ''} />
        {locationLoading ? (
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <span>{location}</span>
        )}
      </div>
    </div>
  )
}






interface WeatherIconProps {
  icon: string
  condition: string
  size?: number
}

export function WeatherIcon({ icon, condition, size = 40 }: WeatherIconProps) {
  return (
    <div className={`relative overflow-hidden`} style={{ width: size, height: size }}>
      <Image
        src={`https:${icon}`} // Weather API returns //cdn.weatherapi.com/...
        alt={condition}
        fill
        className="object-contain"
      />
    </div>
  )
}