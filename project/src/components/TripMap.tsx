import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '@/lib/nominatim';
import type { TripRoute } from '@/lib/osrm';

const ROUTE_COLOR = '#4D9AE5';
const ORIGIN_COLOR = '#113571';
const DESTINATION_COLOR = '#F29022';

const markerIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<span class="block h-4 w-4 rounded-full border-[3px] border-white shadow-md" style="background:${color}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

interface TripMapProps {
  origin: Place;
  destination: Place;
  route: TripRoute | null;
}

export default function TripMap({ origin, destination, route }: TripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const timer = window.setTimeout(() => map.invalidateSize(), 400);
    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const originPoint: L.LatLngTuple = [origin.latitude, origin.longitude];
    const destinationPoint: L.LatLngTuple = [destination.latitude, destination.longitude];

    if (route) {
      L.polyline(route.geometry, { color: ROUTE_COLOR, weight: 5, opacity: 0.95 }).addTo(layer);
    }
    L.marker(originPoint, { icon: markerIcon(ORIGIN_COLOR) }).addTo(layer);
    L.marker(destinationPoint, { icon: markerIcon(DESTINATION_COLOR) }).addTo(layer);

    const bounds = L.latLngBounds(route ? route.geometry : [originPoint, destinationPoint]);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [origin, destination, route]);

  return <div ref={containerRef} className="h-full w-full" />;
}
