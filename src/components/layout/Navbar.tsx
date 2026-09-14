import { HeartIcon, PinIcon } from "@/components/ui/Icons";

type Props = { favorites: number; onShowFavorites: () => void };

export function Navbar({ favorites, onShowFavorites }: Props) {
  return (
    <header className="topbar">
      <a className="brand" href="#main" aria-label="HalalSpots — на главную">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Halal<span>Spots</span></span>
      </a>
      <div className="topbar-actions">
        <div className="city-pill"><PinIcon />Астана</div>
        <button className="saved-button" type="button" onClick={onShowFavorites} aria-label={`Избранные места: ${favorites}`}>
          <HeartIcon filled={favorites > 0} />
          <span className="saved-copy">Избранное</span>
          {favorites > 0 && <span className="saved-count">{favorites}</span>}
        </button>
      </div>
    </header>
  );
}
