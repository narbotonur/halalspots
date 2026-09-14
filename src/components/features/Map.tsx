"use client";

import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPopup } from "./MapPopup";
import type { Place } from "@/lib/types";

type Props = {
  places: Place[]; selectedPlace: Place | null; userPosition: [number, number] | null;
  favorites: Set<string>; onSelect: (place: Place) => void; onClose: () => void; onFavorite: (id: string) => void;
};

function MapController({ selectedPlace, userPosition }: Pick<Props, "selectedPlace" | "userPosition">) {
  const map = useMap();
  useEffect(() => {
    if (selectedPlace) map.flyTo(selectedPlace.coords, Math.max(map.getZoom(), 15), { duration: 0.8 });
    else if (userPosition) map.flyTo(userPosition, 14, { duration: 0.8 });
  }, [selectedPlace, userPosition, map]);
  return null;
}

function markerIcon(place: Place, selected: boolean) {
  const initial = place.name.slice(0, 1).toLocaleUpperCase("ru").replace(/[<>]/g, "");
  return L.divIcon({ className: "halal-marker-wrap", html: `<span class="halal-marker ${selected ? "selected" : ""}"><b>${initial}</b></span>`, iconSize: selected ? [48, 54] : [40, 46], iconAnchor: selected ? [24, 52] : [20, 44] });
}

export function Map({ places, selectedPlace, userPosition, favorites, onSelect, onClose, onFavorite }: Props) {
  const icons = useMemo(() => new globalThis.Map(places.map((place) => [place.id, markerIcon(place, selectedPlace?.id === place.id)])), [places, selectedPlace]);
  return (
    <div className="map-root">
      <MapContainer center={[51.1694, 71.4491]} zoom={12} zoomControl className="map-canvas">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController selectedPlace={selectedPlace} userPosition={userPosition} />
        {userPosition && <CircleMarker center={userPosition} radius={8} pathOptions={{ color: "#fff", fillColor: "#1677ff", fillOpacity: 1, weight: 3 }}><Tooltip>Вы здесь</Tooltip></CircleMarker>}
        {places.map((place) => <Marker key={place.id} position={place.coords} icon={icons.get(place.id)!} eventHandlers={{ click: () => onSelect(place) }} zIndexOffset={selectedPlace?.id === place.id ? 500 : 0}><Tooltip direction="top" offset={[0, -38]}>{place.name}</Tooltip></Marker>)}
      </MapContainer>
      <div className="map-attribution-note">Данные мест: OpenStreetMap contributors</div>
      {selectedPlace && <MapPopup place={selectedPlace} favorite={favorites.has(selectedPlace.id)} onClose={onClose} onFavorite={() => onFavorite(selectedPlace.id)} />}
    </div>
  );
}
