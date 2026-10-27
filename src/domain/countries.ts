export type Country = {
  code: string
  name: string
  short: string
}

export const countries = [
  { code: 'US', name: 'United States', short: 'US' },
  { code: 'GB', name: 'United Kingdom', short: 'UK' },
  { code: 'IE', name: 'Ireland', short: 'IE' },
  { code: 'ES', name: 'Spain', short: 'ES' },
  { code: 'PT', name: 'Portugal', short: 'PT' },
  { code: 'FR', name: 'France', short: 'FR' },
  { code: 'DE', name: 'Germany', short: 'DE' },
  { code: 'DK', name: 'Denmark', short: 'DK' },
  { code: 'SE', name: 'Sweden', short: 'SE' },
  { code: 'IT', name: 'Italy', short: 'IT' },
  { code: 'JP', name: 'Japan', short: 'JP' },
  { code: 'AU', name: 'Australia', short: 'AU' },
  { code: 'CA', name: 'Canada', short: 'CA' },
  { code: 'ZA', name: 'South Africa', short: 'ZA' },
  { code: 'AE', name: 'United Arab Emirates', short: 'AE' },
  { code: 'KR', name: 'South Korea', short: 'KR' },
  { code: 'MX', name: 'Mexico', short: 'MX' },
  { code: 'NZ', name: 'New Zealand', short: 'NZ' },
] as const satisfies readonly Country[]

export function isCountryCode(code: string): boolean {
  return countries.some((country) => country.code === code)
}

export function formatLocation(city: string, countryCode: string): string {
  const country = countries.find((item) => item.code === countryCode)
  const region = country?.short ?? ''
  const place = city.trim()
  if (place && region) return `${place}, ${region}`
  return place || region
}
