import { useEffect, useState } from 'react';
import { searchPlaces, type Place } from '@/lib/nominatim';

export const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 500;

export type SuggestionStatus = 'idle' | 'loading' | 'ready' | 'error';

export function usePlaceSuggestions(query: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [status, setStatus] = useState<SuggestionStatus>('idle');

  useEffect(() => {
    const trimmed = query.trim();
    if (!enabled || trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    const timer = window.setTimeout(() => {
      searchPlaces(trimmed, controller.signal)
        .then((places) => {
          setSuggestions(places);
          setStatus('ready');
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setSuggestions([]);
          setStatus('error');
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled]);

  return { suggestions, status };
}
