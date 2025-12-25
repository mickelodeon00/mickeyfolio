import { getLocationFromCoords, getLocationFromIP, getWeather, LocationData } from '@/app/actions/location'
import { useQuery } from '@tanstack/react-query'

// interface LocationData {
//   locality?: string
//   city?: string
//   region?: string
//   country?: string
//   countryCode?: string
//   latitude?: number
//   longitude?: number
// }

// interface WeatherData {
//   temperature: number
//   condition: string
//   icon: string
//   feelsLike: number
//   humidity: number
// }

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
    queryFn: async () => {
      try {
        const position = await getGeolocation()
        const { latitude, longitude } = position.coords
        return await getLocationFromCoords(latitude, longitude)
      } catch {
        return await getLocationFromIP()
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  })
}


export function useWeather(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return null
      return await getWeather(latitude, longitude)
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}




export const getLocationString = (data?: LocationData | null) => {
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

