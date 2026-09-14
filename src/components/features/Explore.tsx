"use client";

import dynamic from "next/dynamic";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ListIcon, LocateIcon, MapIcon, SearchIcon } from "@/components/ui/Icons";
import { fallbackPlaces } from "@/data/fallback-places";
import { categoryLabels, distanceKm, searchableText } from "@/lib/place-utils";
import type { Place, PlaceCategory, PlaceFilter } from "@/lib/types";
import { PlaceCard } from "./PlaceCard";

const PlacesMap = dynamic(() => import("./Map").then((module) => module.Map), { ssr: false, loading: () => <div className="map-loading">Загружаем карту…</div> });
const filters: { value: PlaceFilter; label: string }[] = [
  { value: "all", label: "Все места" }, { value: "tagged", label: "С halal-тегом" },
  { value: "delivery", label: "С доставкой" }, { value: "favorites", label: "Избранное" },
];

const favoritesEvent = "halalspots:favorites-changed";
function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(favoritesEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(favoritesEvent, callback); };
}
function favoriteSnapshot() { return localStorage.getItem("halalspots:favorites") ?? "[]"; }

export function Explore() {
  const [places, setPlaces] = useState<Place[]>(fallbackPlaces);
  const [catalog, setCatalog] = useState<"loading" | "live" | "fallback">("loading");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase("ru"));
  const [filter, setFilter] = useState<PlaceFilter>("all");
  const [category, setCategory] = useState<"all" | PlaceCategory>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const savedFavorites = useSyncExternalStore(subscribeFavorites, favoriteSnapshot, () => "[]");
  const favorites = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(savedFavorites);
      return new Set(Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : []);
    } catch { return new Set<string>(); }
  }, [savedFavorites]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/places", { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error("live catalog unavailable"); return response.json() as Promise<{ places: Place[] }>; })
      .then(({ places: livePlaces }) => { if (livePlaces.length) { setPlaces(livePlaces); setCatalog("live"); } else setCatalog("fallback"); })
      .catch((error: Error) => { if (error.name !== "AbortError") setCatalog("fallback"); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault(); searchInput.current?.focus();
      }
      if (event.key === "Escape") { setSelectedId(null); searchInput.current?.blur(); }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const visiblePlaces = useMemo(() => places
    .filter((place) => !deferredSearch || searchableText(place).includes(deferredSearch))
    .filter((place) => category === "all" || place.category === category)
    .filter((place) => filter === "all" || (filter === "tagged" && place.halal === "tagged") || (filter === "delivery" && place.delivery) || (filter === "favorites" && favorites.has(place.id)))
    .sort((a, b) => userPosition ? distanceKm(userPosition, a.coords) - distanceKm(userPosition, b.coords) : a.name.localeCompare(b.name, "ru")),
  [places, deferredSearch, category, filter, favorites, userPosition]);
  const selectedPlace = visiblePlaces.find((place) => place.id === selectedId) ?? null;

  function toggleFavorite(id: string) {
    const next = new Set(favorites); if (next.has(id)) next.delete(id); else next.add(id);
    try {
      localStorage.setItem("halalspots:favorites", JSON.stringify([...next]));
      window.dispatchEvent(new Event(favoritesEvent));
    } catch { /* Browsing in a restricted mode: keep the app usable. */ }
  }

  function locate() {
    if (!navigator.geolocation) { setLocationStatus("Геолокация не поддерживается браузером"); return; }
    setLocationStatus("Определяем ваше местоположение…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserPosition([coords.latitude, coords.longitude]); setSelectedId(null); setLocationStatus("Сортируем по расстоянию от вас"); setMobileView("map"); },
      () => setLocationStatus("Не удалось получить местоположение — проверьте разрешение браузера"),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <div className="app-shell">
      <Navbar favorites={favorites.size} onShowFavorites={() => { setFilter("favorites"); setMobileView("list"); }} />
      <main id="main" className={`explorer mobile-${mobileView}`}>
        <aside className="results-panel">
          <div className="results-head">
            <div className="title-row"><div><p className="kicker">Открывайте с уверенностью</p><h1>Халяль места рядом</h1></div><span className="result-count">{visiblePlaces.length}</span></div>
            <label className="search-field"><SearchIcon /><span className="sr-only">Поиск заведений</span><input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Название, кухня или адрес" autoComplete="off"/><kbd>Ctrl K</kbd></label>
            <div className="filter-row" aria-label="Фильтры">{filters.map((item) => <button type="button" key={item.value} className={filter === item.value ? "active" : ""} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div>
            <div className="controls-row">
              <select value={category} onChange={(event) => setCategory(event.target.value as "all" | PlaceCategory)} aria-label="Категория"><option value="all">Все категории</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <button type="button" className="locate-button" onClick={locate}><LocateIcon />Рядом со мной</button>
            </div>
            <p className={`catalog-status ${catalog}`} role="status">{catalog === "loading" ? "Обновляем каталог OpenStreetMap…" : catalog === "live" ? "Актуальные места из OpenStreetMap" : "Сеть недоступна — показаны непроверенные демо-места"}</p>
            {locationStatus && <p className="location-status" role="status">{locationStatus}</p>}
          </div>
          <div className="places-list">
            {visiblePlaces.length ? visiblePlaces.map((place) => <PlaceCard key={place.id} place={place} selected={selectedId === place.id} favorite={favorites.has(place.id)} distance={userPosition ? distanceKm(userPosition, place.coords) : undefined} onSelect={() => { setSelectedId(place.id); setMobileView("map"); }} onFavorite={() => toggleFavorite(place.id)} />) : <div className="empty-state"><span>⌁</span><h2>Ничего не найдено</h2><p>Измените запрос или сбросьте фильтры.</p><button type="button" onClick={() => { setSearch(""); setFilter("all"); setCategory("all"); }}>Сбросить фильтры</button></div>}
          </div>
          <footer className="panel-footer">Halal-тег — запись сообщества OpenStreetMap, не религиозная сертификация. Проверяйте сертификат у заведения.</footer>
        </aside>
        <section className="map-panel" aria-label="Карта халяль мест"><PlacesMap places={visiblePlaces} selectedPlace={selectedPlace} userPosition={userPosition} favorites={favorites} onSelect={(place) => setSelectedId(place.id)} onClose={() => setSelectedId(null)} onFavorite={toggleFavorite} /></section>
        <nav className="mobile-tabs" aria-label="Режим отображения"><button type="button" className={mobileView === "list" ? "active" : ""} onClick={() => setMobileView("list")}><ListIcon />Список</button><button type="button" className={mobileView === "map" ? "active" : ""} onClick={() => setMobileView("map")}><MapIcon />Карта</button></nav>
      </main>
    </div>
  );
}
