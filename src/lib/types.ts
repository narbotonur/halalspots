export type PlaceCategory = "restaurant" | "cafe" | "fast_food" | "market" | "other";

export type PlaceSource = "OpenStreetMap" | "Demo";

export type Place = {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
  category: PlaceCategory;
  cuisine: string[];
  halal: "tagged" | "community";
  delivery: boolean;
  takeaway: boolean;
  openingHours?: string;
  phone?: string;
  website?: string;
  source: PlaceSource;
  osmUrl?: string;
};

export type PlaceFilter = "all" | "tagged" | "delivery" | "favorites";
