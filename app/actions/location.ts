'use server'

export interface LocationData {
  locality?: string
  city?: string
  region?: string
  country?: string
  countryCode?: string
  latitude?: number
  longitude?: number
}

export async function getLocationFromCoords(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  )

  if (!response.ok) return null

  const data = await response.json()

  return {
    locality: data.locality,
    city: data.city,
    region: data.principalSubdivision,
    country: data.countryName,
    countryCode: data.countryCode,
    latitude,
    longitude
  } as LocationData
}

export async function getLocationFromIP() {
  const services = [
    {
      url: 'https://ipapi.co/json/',
      parse: (data: any) => ({
        locality: undefined,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude
      })
    },
    {
      url: 'https://ipwho.is/',
      parse: (data: any) => ({
        locality: undefined,
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude
      })
    },
    {
      url: 'http://ip-api.com/json/',
      parse: (data: any) => ({
        locality: undefined,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        latitude: data.lat,
        longitude: data.lon
      })
    },
  ]

  for (const service of services) {
    try {
      const response = await fetch(service.url)
      if (!response.ok) continue

      const data = await response.json()
      if (data.error) continue

      return service.parse(data) as LocationData
    } catch {
      continue
    }
  }

  return null
}

export async function getWeather(latitude: number, longitude: number) {
  const response = await fetch(
    `${process.env.WEATHER_API_BASE_URL}/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`
  )

  if (!response.ok) return null

  const data = await response.json()

  return {
    temperature: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    feelsLike: data.current.feelslike_c,
    humidity: data.current.humidity
  }
}