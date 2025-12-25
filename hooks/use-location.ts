// hooks/useUserLocation.ts
import { useQuery } from '@tanstack/react-query'

interface LocationData {
  locality?: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  latitude?: number
  longitude?: number
}

interface WeatherData {
  temperature: number
  condition: string
  icon: string
  feelsLike: number
  humidity: number
}

const getGeolocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"))
    }
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export function useLocation() {
  return useQuery({
    queryKey: ['userLocation'],
    queryFn: async (): Promise<LocationData> => {
      try {
        // Try browser geolocation
        const position = await getGeolocation()
        const { latitude, longitude } = position.coords

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()

        return {
          locality: data.locality || undefined,
          city: data.city || undefined,
          region: data.principalSubdivision || undefined,
          country: data.countryName || undefined,
          countryCode: data.countryCode || undefined,
          latitude,
          longitude
        }
      } catch (error) {
        // Fallback to IP geolocation
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()


        return {
          locality: data.region || undefined,
          city: data.city || undefined,
          region: data.region || undefined,
          country: data.country_name || undefined,
          countryCode: data.country_code || undefined,
          latitude: data.latitude || undefined,
          longitude: data.longitude || undefined
        }
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  })
}


export function useWeather(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: async (): Promise<WeatherData> => {
      if (!latitude || !longitude) {
        throw new Error('Location required')
      }

      const response = await fetch(
        `${process.env.WEATHER_API_BASE_URL}/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`
      )

      if (!response.ok) throw new Error('Weather fetch failed')

      const data = await response.json()


      return {
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        feelsLike: data.current.feelslike_c,
        humidity: data.current.humidity
      }
    },
    enabled: !!latitude && !!longitude, // Only run when we have coordinates
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
}




export const getLocationString = (data?: LocationData) => {
  if (!data) return 'Location unavailable'

  const parts: string[] = []

  // Collect unique values in order: locality, city, region
  const localityCity = []

  if (data.locality && data.city && data.locality !== data.city) {
    localityCity.push(data.locality, data.city)
  } else if (data.city) {
    localityCity.push(data.city)
  } else if (data.locality) {
    localityCity.push(data.locality)
  }

  // Join locality and city with space (no comma between them)
  if (localityCity.length > 0) {
    parts.push(localityCity.join(' '))
  }

  // Add region if it's different from city and locality
  if (data.region &&
    data.region !== data.city &&
    data.region !== data.locality) {
    parts.push(data.region)
  }

  // Add country code
  if (data.countryCode) {
    parts.push(data.countryCode)
  }

  return parts.filter(Boolean).join(', ') || 'Location unavailable'
}

