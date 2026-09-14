import { NextResponse } from "next/server";
import type { Place, PlaceCategory } from "@/lib/types";

export const runtime = "nodejs";
export const revalidate = 3600;

type OsmElement = {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

const endpoints = [
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const query = `[out:json][timeout:20];(
  nwr["diet:halal"~"^(yes|only)$"](around:30000,51.1694,71.4491);
  nwr["halal"="yes"](around:30000,51.1694,71.4491);
);out center tags 100;`;

function clean(value: unknown, max = 120) {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, max) : "";
}

function category(tags: Record<string, string>): PlaceCategory {
  if (tags.shop) return "market";
  if (tags.amenity === "restaurant") return "restaurant";
  if (tags.amenity === "cafe") return "cafe";
  if (tags.amenity === "fast_food") return "fast_food";
  return "other";
}

export function parseOsmElement(element: OsmElement): Place | null {
  const tags = element.tags ?? {};
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  const name = clean(tags.name || tags.brand, 80);
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lon) || !element.type || !element.id) return null;
  const street = clean(tags["addr:street"]);
  const number = clean(tags["addr:housenumber"], 24);
  const district = clean(tags["addr:district"] || tags["addr:suburb"]);
  const website = clean(tags.website || tags["contact:website"], 240);
  const cuisine = clean(tags.cuisine, 140)
    .split(/[;,]/)
    .map((item) => item.trim().replaceAll("_", " "))
    .filter(Boolean)
    .slice(0, 4);
  return {
    id: `${element.type}/${element.id}`,
    name,
    address: [[street, number].filter(Boolean).join(" "), district].filter(Boolean).join(", ") || "Астана",
    coords: [lat as number, lon as number],
    category: category(tags),
    cuisine,
    halal: "tagged",
    delivery: tags.delivery === "yes",
    takeaway: tags.takeaway === "yes",
    openingHours: clean(tags.opening_hours, 180) || undefined,
    phone: clean(tags.phone || tags["contact:phone"], 60) || undefined,
    website: /^https?:\/\//i.test(website) ? website : undefined,
    source: "OpenStreetMap",
    osmUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
}

export async function GET() {
  let lastError = "Каталог временно недоступен";
  for (const endpoint of endpoints) {
    try {
      const body = new URLSearchParams({ data: query });
      const response = await fetch(endpoint, {
        method: "POST",
        body,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "HalalSpots/0.2 (+https://github.com/narbotonur/halalspots)",
        },
        signal: AbortSignal.timeout(12_000),
        next: { revalidate: 3600 },
      });
      if (!response.ok) throw new Error(`OpenStreetMap provider returned ${response.status}`);
      const payload = (await response.json()) as { elements?: OsmElement[] };
      const seen = new Set<string>();
      const places = (payload.elements ?? [])
        .map(parseOsmElement)
        .filter((place): place is Place => Boolean(place))
        .filter((place) => !seen.has(place.id) && Boolean(seen.add(place.id)))
        .slice(0, 80);
      if (places.length) {
        return NextResponse.json({ places, source: "OpenStreetMap" }, {
          headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
      lastError = "В OpenStreetMap пока нет отмеченных мест";
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  return NextResponse.json({ places: [], error: lastError }, { status: 503 });
}
