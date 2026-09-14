import type { Place } from "@/lib/types";

// Kept deliberately small and visibly marked as demo data. It is never
// presented as verified when the live OpenStreetMap request is unavailable.
export const fallbackPlaces: Place[] = [
  {
    id: "demo-sq-plov",
    name: "SQ Plov",
    address: "Астана",
    coords: [51.1694, 71.4491],
    category: "restaurant",
    cuisine: ["Плов", "Центральная Азия"],
    halal: "community",
    delivery: true,
    takeaway: true,
    source: "Demo",
  },
  {
    id: "demo-okadzaki",
    name: "Okadzaki",
    address: "Астана",
    coords: [51.13, 71.43],
    category: "restaurant",
    cuisine: ["Японская"],
    halal: "community",
    delivery: true,
    takeaway: true,
    source: "Demo",
  },
  {
    id: "demo-jan-sushi",
    name: "Jan Sushi",
    address: "Астана",
    coords: [51.145, 71.42],
    category: "restaurant",
    cuisine: ["Суши"],
    halal: "community",
    delivery: false,
    takeaway: true,
    source: "Demo",
  },
];
