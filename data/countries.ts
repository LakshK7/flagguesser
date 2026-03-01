const raw = require("world-countries");
const allCountries = Array.isArray(raw)
  ? raw
  : raw.default ?? Object.values(raw);

export type Country = {
  name: string;
  code: string;
  population: number;
};

export const countries: Country[] = allCountries
  .filter((c: any) => c.flag && c.cca2)
  .map((c: any) => ({
    name: c.name.common,
    code: c.cca2.toLowerCase(),
    population: c.population ?? 0,
  }));

export function getCountryPoolByStreak(streak: number): Country[] {
  const sorted = [...countries].sort((a, b) => b.population - a.population);
  if (streak < 5) return sorted.slice(0, 50);
  if (streak < 10) return sorted.slice(0, 100);
  return sorted;
}
