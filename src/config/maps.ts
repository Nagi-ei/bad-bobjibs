export const GOOGLE_MAPS_LIBRARIES: ('places' | 'marker')[] = [
  'places',
  'marker',
];

export const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978, // Seoul City Hall coordinates
};

export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
  controlSize: 24,
  zoomControlOptions: {
    position: 3, // RIGHT_BOTTOM = 3
  },
};
