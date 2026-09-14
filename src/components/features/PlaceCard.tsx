import { CheckIcon, HeartIcon, RouteIcon } from "@/components/ui/Icons";
import { categoryLabels, directionsUrl } from "@/lib/place-utils";
import type { Place } from "@/lib/types";

type Props = { place: Place; selected: boolean; favorite: boolean; distance?: number; onSelect: () => void; onFavorite: () => void };

export function PlaceCard({ place, selected, favorite, distance, onSelect, onFavorite }: Props) {
  return (
    <article className={`place-card ${selected ? "is-selected" : ""}`}>
      <button className="place-card-main" type="button" onClick={onSelect} aria-pressed={selected}>
        <span className={`place-visual visual-${place.category}`} aria-hidden="true"><span>{place.name.slice(0, 1).toLocaleUpperCase("ru")}</span></span>
        <span className="place-copy">
          <span className="place-title-row">
            <strong>{place.name}</strong>
            {distance !== undefined && <small>{distance < 1 ? `${Math.round(distance * 1000)} м` : `${distance.toFixed(1)} км`}</small>}
          </span>
          <span className="place-address">{place.address}</span>
          <span className="tag-row">
            <span className={`verification ${place.halal === "tagged" ? "verified" : "community"}`}><CheckIcon />{place.halal === "tagged" ? "Halal-тег OSM" : "Демо-данные"}</span>
            <span className="soft-tag">{categoryLabels[place.category]}</span>
          </span>
          {place.cuisine.length > 0 && <span className="cuisine-line">{place.cuisine.join(" · ")}</span>}
        </span>
      </button>
      <div className="card-actions">
        <a href={directionsUrl(place)} target="_blank" rel="noreferrer" className="route-link" aria-label={`Построить маршрут до ${place.name}`}><RouteIcon /> Маршрут</a>
        <button type="button" className={`heart-button ${favorite ? "active" : ""}`} onClick={onFavorite} aria-label={favorite ? `Удалить ${place.name} из избранного` : `Добавить ${place.name} в избранное`}><HeartIcon filled={favorite} /></button>
      </div>
    </article>
  );
}
