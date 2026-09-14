import { afterEach, describe, expect, it, vi } from "vitest";
import { GET, parseOsmElement } from "./route";

afterEach(() => vi.unstubAllGlobals());

describe("OpenStreetMap place parser", () => {
  it("accepts useful POIs and strips markup from untrusted tags", () => {
    const place = parseOsmElement({
      type: "node", id: 42, lat: 51.1, lon: 71.4,
      tags: { name: "<b>Cafe</b>", amenity: "cafe", "diet:halal": "yes", website: "javascript:alert(1)", cuisine: "coffee;regional" },
    });
    expect(place?.name).toBe("bCafe/b");
    expect(place?.website).toBeUndefined();
    expect(place?.cuisine).toEqual(["coffee", "regional"]);
    expect(place?.osmUrl).toBe("https://www.openstreetmap.org/node/42");
  });

  it("rejects nameless or coordinate-less entries", () => {
    expect(parseOsmElement({ type: "node", id: 1, lat: 51, lon: 71, tags: {} })).toBeNull();
    expect(parseOsmElement({ type: "node", id: 1, tags: { name: "Cafe" } })).toBeNull();
  });

  it("fails over between fixed providers and returns validated places", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ elements: [{
        type: "node", id: 7, lat: 51.1, lon: 71.4,
        tags: { name: "Test cafe", amenity: "cafe", "diet:halal": "yes" },
      }] }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await GET();
    expect(response.status).toBe(200);
    expect((await response.json()).places).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/^https:\/\//);
  });

  it("returns a controlled 503 instead of fabricating live results", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("busy", { status: 503 })));
    const response = await GET();
    expect(response.status).toBe(503);
    expect((await response.json()).places).toEqual([]);
  });
});
