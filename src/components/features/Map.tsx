"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPopup } from "./MapPopup";

type Place = {
  name: string;
  coords: [number, number];
};

type Props = {
  places: Place[];
  selectedPlace: Place | null;
};

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FlyToPlace({ selectedPlace }: { selectedPlace: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo(selectedPlace.coords, 15, { duration: 1.2 });
    }
  }, [selectedPlace, map]);

  return null;
}

export const Map = ({ places, selectedPlace }: Props) => {
  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[51.1694, 71.4491]}
        zoom={13}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToPlace selectedPlace={selectedPlace} />

        {places.map((place, i) => (
          <Marker key={i} position={place.coords} icon={customIcon}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedPlace && <MapPopup name={selectedPlace.name} />}
    </div>
  );
};