import type { Place, PlaceCategory } from "@/lib/types";

export const categoryLabels: Record<PlaceCategory, string> = {
  restaurant: "Ресторан",
  cafe: "Кафе",
  fast_food: "Фастфуд",
  market: "Магазин",
  other: "Другое",
};

export function distanceKm(from: [number, number], to: [number, number]) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const lat = radians(to[0] - from[0]);
  const lon = radians(to[1] - from[1]);
  const a =
    Math.sin(lat / 2) ** 2 +
    Math.cos(radians(from[0])) * Math.cos(radians(to[0])) * Math.sin(lon / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function searchableText(place: Place) {
  return [place.name, place.address, categoryLabels[place.category], ...place.cuisine]
    .join(" ")
    .toLocaleLowerCase("ru");
}

export function directionsUrl(place: Place) {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.coords.join(",")}`;
}
