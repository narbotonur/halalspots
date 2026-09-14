import { describe, expect, it } from "vitest";
import { directionsUrl, distanceKm, searchableText } from "./place-utils";
import { fallbackPlaces } from "../data/fallback-places";

describe("place utilities", () => {
  it("calculates useful geographic distances", () => {
    expect(distanceKm([51.1694, 71.4491], [51.1694, 71.4491])).toBe(0);
    expect(distanceKm([51.1694, 71.4491], [51.13, 71.43])).toBeGreaterThan(4);
  });

  it("searches across name, address, category and cuisine", () => {
    expect(searchableText(fallbackPlaces[0])).toContain("плов");
    expect(searchableText(fallbackPlaces[0])).toContain("ресторан");
  });

  it("builds a coordinate-only directions link", () => {
    expect(directionsUrl(fallbackPlaces[0])).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=-?\d/);
  });
});
