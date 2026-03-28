"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PlaceCard } from "@/components/features/PlaceCard";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/features/Map").then((mod) => mod.Map), {
  ssr: false,
});

const places = [
  {
    name: "SQ Plov",
    rating: 4.5,
    address: "Astana",
    coords: [51.1694, 71.4491] as [number, number],
  },
  {
    name: "Okadzaki",
    rating: 4.7,
    address: "Astana",
    coords: [51.13, 71.43] as [number, number],
  },
  {
    name: "Jan Sushi",
    rating: 4.3,
    address: "Astana",
    coords: [51.145, 71.42] as [number, number],
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<(typeof places)[number] | null>(null);

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#f6f6f6] overflow-hidden">
      <Navbar />

      <div className="flex h-[calc(100vh-73px)]">
        {/* Левая панель */}
        <aside className="w-[370px] min-w-[370px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <input
              className="w-full rounded-2xl border border-gray-200 bg-[#f7f7f7] px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Поиск halal places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-2 mt-3 flex-wrap">
              <button className="px-3 py-2 rounded-full bg-[#f3e8ff] text-[#9333ea] text-sm font-medium">
                Халяль
              </button>
              <button className="px-3 py-2 rounded-full bg-[#f5f5f5] text-gray-700 text-sm">
                Доставка
              </button>
              <button className="px-3 py-2 rounded-full bg-[#f5f5f5] text-gray-700 text-sm">
                4.5+
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredPlaces.map((place, i) => (
              <PlaceCard
                key={i}
                name={place.name}
                rating={place.rating}
                address={place.address}
                onClick={() => setSelectedPlace(place)}
                isSelected={selectedPlace?.name === place.name}
              />
            ))}
          </div>
        </aside>

        {/* Карта */}
        <main className="flex-1 relative">
          <Map places={filteredPlaces} selectedPlace={selectedPlace} />
        </main>
      </div>
    </div>
  );
}