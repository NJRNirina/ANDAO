export interface Place {
  label: string;
  latitude: number;
  longitude: number;
}

export interface PlaceSelection {
  text: string;
  place: Place | null;
}

const parsePlaces = (data: unknown): Place[] => {
  if (!Array.isArray(data)) return [];
  return data.flatMap((item): Place[] => {
    if (typeof item !== 'object' || item === null) return [];
    const { display_name, lat, lon } = item as Record<string, unknown>;
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (typeof display_name !== 'string' || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return [];
    }
    return [{ label: display_name, latitude, longitude }];
  });
};

export async function searchPlaces(query: string, signal: AbortSignal): Promise<Place[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=mg&limit=5`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Recherche de lieux indisponible (${response.status})`);
  return parsePlaces(await response.json());
}
