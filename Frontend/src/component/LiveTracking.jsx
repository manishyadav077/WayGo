import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: -3.745,
    lng: -38.523,
  });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Initialize the map
  useEffect(() => {
    const mapInstance = L.map("map").setView(
      [currentPosition.lat, currentPosition.lng],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const markerInstance = L.marker([
      currentPosition.lat,
      currentPosition.lng,
    ]).addTo(mapInstance);
    setMap(mapInstance);
    setMarker(markerInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update position on geolocation change
  useEffect(() => {
    const updatePosition = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = { lat: latitude, lng: longitude };
      setCurrentPosition(newPosition);

      if (map && marker) {
        map.setView([latitude, longitude], 15);
        marker.setLatLng([latitude, longitude]);
      }
    };

    const watchId = navigator.geolocation.watchPosition(updatePosition);

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, marker]);

  return <div id="map" style={{ width: "100%", height: "100vh", zIndex: 10 }} />;
};

export default LiveTracking;
