import { CheckIcon, CloseIcon, HeartIcon, RouteIcon, ShareIcon } from "@/components/ui/Icons";
import { categoryLabels, directionsUrl } from "@/lib/place-utils";
import type { Place } from "@/lib/types";

type Props = { place: Place; favorite: boolean; onClose: () => void; onFavorite: () => void };

export function MapPopup({ place, favorite, onClose, onFavorite }: Props) {
  async function share() {
    try {
      const url = place.osmUrl ?? directionsUrl(place);
      if (navigator.share) await navigator.share({ title: place.name, text: place.address, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* Cancelling the system share sheet is not an app error. */ }
  }
  return (
    <section className="map-detail" aria-label={`Информация о ${place.name}`}>
      <div className={`detail-visual visual-${place.category}`}><span>{place.name.slice(0, 1).toUpperCase()}</span></div>
      <div className="detail-body">
        <div className="detail-heading">
          <div><div className="eyebrow">{categoryLabels[place.category]}</div><h2>{place.name}</h2></div>
          <button type="button" className="icon-button detail-close" onClick={onClose} aria-label="Закрыть карточку"><CloseIcon /></button>
        </div>
        <p className="detail-address">{place.address}</p>
        <div className="detail-meta">
          <span className={`verification ${place.halal === "tagged" ? "verified" : "community"}`}><CheckIcon />{place.halal === "tagged" ? "Отмечено halal в OSM" : "Непроверенное демо"}</span>
          {place.delivery && <span className="soft-tag">Доставка</span>}
          {place.takeaway && <span className="soft-tag">С собой</span>}
        </div>
        {place.openingHours && <p className="opening-hours"><b>Часы:</b> {place.openingHours}</p>}
        <div className="detail-actions">
          <a className="primary-action" href={directionsUrl(place)} target="_blank" rel="noreferrer"><RouteIcon />Построить маршрут</a>
          <button type="button" className={`icon-button ${favorite ? "active" : ""}`} onClick={onFavorite} aria-label="Избранное"><HeartIcon filled={favorite} /></button>
          <button type="button" className="icon-button" onClick={() => void share()} aria-label="Поделиться"><ShareIcon /></button>
        </div>
      </div>
    </section>
  );
}
