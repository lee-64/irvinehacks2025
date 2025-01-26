import React, { useEffect, useRef, useState } from 'react';

const InteractiveMap = ({
  latitude = 34.0204,
  longitude = -118.2861,
  desirability = 75
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // LA and Orange County bounds
  const bounds = [
    [33.5082, -118.9448], // Southwest corner (Orange County)
    [34.8233, -117.6462]  // Northeast corner (LA County)
  ];

  // Load Leaflet scripts
  useEffect(() => {
    if (window.L) {
      setIsScriptLoaded(true);
      return;
    }

    const mapScript = document.createElement('script');
    mapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

    const mapStylesheet = document.createElement('link');
    mapStylesheet.rel = 'stylesheet';
    mapStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';

    mapScript.onload = () => setIsScriptLoaded(true);

    document.head.appendChild(mapScript);
    document.head.appendChild(mapStylesheet);

    return () => {
      try {
        if (document.head.contains(mapScript)) {
          document.head.removeChild(mapScript);
        }
        if (document.head.contains(mapStylesheet)) {
          document.head.removeChild(mapStylesheet);
        }
      } catch (error) {
        console.error('Error cleaning up Leaflet resources:', error);
      }
    };
  }, []);

  // Initialize and update map
  useEffect(() => {
    if (!isScriptLoaded || !window.L) return;

    const initializeMap = () => {
      try {
        // Clean up existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Clean up existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Wait a tick to ensure cleanup is complete
        setTimeout(() => {
          // Create new map instance
          if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = window.L.map(mapRef.current, {
              maxBounds: bounds,  // Set maximum bounds
              minZoom: 9,        // Set minimum zoom level
              maxZoom: 18        // Set maximum zoom level
            });

            // Fit the map to LA and Orange County bounds
            mapInstanceRef.current.fitBounds(bounds);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Create custom popup content with SVG circle
            const createPopupContent = (desirabilityScore) => {
              const radius = 25;
              const circumference = 2 * Math.PI * radius;
              const progress = (desirabilityScore / 100) * circumference;
              const dashArray = `${progress} ${circumference}`;

              return `
                <div class="flex flex-col items-center p-2">
                  <div>Zip Score</div>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <!-- Background circle -->
                    <circle
                      cx="30"
                      cy="30"
                      r="${radius}"
                      fill="none"
                      stroke="#e5e7eb"
                      stroke-width="4"
                    />
                    <!-- Progress circle -->
                    <circle
                      cx="30"
                      cy="30"
                      r="${radius}"
                      fill="none"
                      stroke="#3b82f6"
                      stroke-width="4"
                      stroke-dasharray="${dashArray}"
                      stroke-dashoffset="0"
                      transform="rotate(-90 30 30)"
                    />
                    <!-- Desirability score text -->
                    <text
                      x="30"
                      y="30"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      font-size="14"
                      font-weight="bold"
                    >${desirabilityScore}</text>
                  </svg>
                </div>
              `;
            };

            markerRef.current = window.L.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup(createPopupContent(desirability))
              .openPopup();
          }
        }, 0);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      try {
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };
  }, [latitude, longitude, desirability, isScriptLoaded]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div ref={mapRef} className="h-screen w-full rounded-lg shadow-lg"></div>
      </div>
    </div>
  );
};

export default InteractiveMap;