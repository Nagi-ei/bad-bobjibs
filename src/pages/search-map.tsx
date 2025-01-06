import { SearchIcon, MapPin, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BottomNav from '../components/ui/BottomNav';
import { useState, useEffect, useMemo } from 'react';
import { restaurants } from '@/data/restaurants';
import { useNavigate } from 'react-router';
import debounce from 'lodash/debounce';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_CENTER,
  MAP_CONTAINER_STYLE,
  MAP_OPTIONS,
} from '@/config/maps';

// Highlight matching text component
const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 rounded dark:bg-yellow-900/50">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchMap() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [clusterer, setClusterer] = useState<MarkerClusterer | null>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      setDebouncedQuery(query);
    }, 300);

    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  // Memoize filtered results
  const filteredRestaurants = useMemo(() => {
    const searchLower = debouncedQuery.toLowerCase();
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.description.toLowerCase().includes(searchLower) ||
        restaurant.violation.toLowerCase().includes(searchLower)
    );
  }, [debouncedQuery]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Function to get user location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          if (map) {
            map.panTo(newLocation);
            map.setZoom(15);
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  // Get initial user location
  useEffect(() => {
    getUserLocation();
  }, []);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);

    // Center map on user location if available
    if (userLocation) {
      map.setCenter(userLocation);
    }

    const newClusterer = new MarkerClusterer({
      map,
      markers: [],
    });
    setClusterer(newClusterer);

    // Add user location button
    const locationButton = document.createElement('button');
    locationButton.classList.add(
      'bg-white',
      'dark:bg-gray-800',
      'p-2',
      'rounded-full',
      'shadow-md',
      'hover:bg-gray-100',
      'dark:hover:bg-gray-700',
      'focus:outline-none',
      'transition-colors'
    );
    locationButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    `;

    locationButton.addEventListener('click', () => {
      if (userLocation) {
        map.panTo(userLocation);
        map.setZoom(15);
      }
    });

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
  };

  // Update markers when filtered results change
  useEffect(() => {
    if (!map || !clusterer || !window.google) return;

    // Clear existing markers
    clusterer.clearMarkers();

    // Create new markers
    const markers = filteredRestaurants.map((restaurant, index) => {
      const markerView = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: {
          lat: restaurant.lat || DEFAULT_CENTER.lat,
          lng: restaurant.lng || DEFAULT_CENTER.lng,
        },
        title: restaurant.name,
        content: buildMarkerContent(restaurant.severity),
      });

      markerView.addListener('click', () => {
        navigate(`/restaurant/${index}`);
      });

      return markerView;
    });

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: userLocation,
        title: 'Your Location',
        content: buildUserLocationMarker(),
      });
    }

    // Add new markers to clusterer
    clusterer.addMarkers(markers);

    // Cleanup function
    return () => {
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [filteredRestaurants, map, clusterer, navigate, userLocation]);

  // Helper function to create custom marker element
  const buildMarkerContent = (severity: string) => {
    const color = severity === 'high' ? '#ef4444' : '#eab308';
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      "></div>
    `;
    return div.firstElementChild as HTMLElement;
  };

  // Helper function to create user location marker
  const buildUserLocationMarker = () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `;
    return div.firstElementChild as HTMLElement;
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Search Header */}
      <div className="p-4 bg-background">
        <div className="relative mb-2">
          <SearchIcon className="absolute transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for restaurants..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="w-4 h-4 mr-1" />
            Map
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1">
        {viewMode === 'map' ? (
          // Map View
          <div className="absolute inset-0">
            {!isLoaded ? (
              <div className="flex items-center justify-center h-full">
                Loading Maps...
              </div>
            ) : (
              <>
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  zoom={13}
                  center={DEFAULT_CENTER}
                  options={MAP_OPTIONS}
                  onLoad={onMapLoad}
                >
                  {/* Markers are managed through the useEffect */}
                </GoogleMap>

                <button
                  onClick={getUserLocation}
                  className="absolute p-3 transition-colors rounded-full shadow-lg bottom-24 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          // List View
          <div className="absolute inset-0 pb-16 overflow-y-auto">
            <div className="p-4 space-y-4">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant, index) => (
                  <div
                    key={index}
                    className="p-4 transition-shadow border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
                    onClick={() => navigate(`/restaurant/${index}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">
                        <HighlightText
                          text={restaurant.name}
                          query={searchQuery}
                        />
                      </h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          restaurant.severity === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        <HighlightText
                          text={restaurant.violation}
                          query={searchQuery}
                        />
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <HighlightText
                        text={restaurant.description}
                        query={searchQuery}
                      />
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No restaurants found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t bg-background">
        <BottomNav />
      </div>
    </div>
  );
}
