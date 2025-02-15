import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useSelector } from "react-redux";
import axios from "axios";

const LiveTrackingDestination = () => {
  const { ride } = useSelector((state) => state.ride);
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("map").setView([20, 78], 5); // Default view

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (map && ride?.pickup && ride?.destination) {
      getCoordinates(ride.pickup, ride.destination)
        .then(([pickupCoords, destinationCoords]) => {
          if (routingControl) {
            map.removeControl(routingControl);
          }

          const newRoutingControl = L.Routing.control({
            waypoints: [
              L.latLng(pickupCoords.lat, pickupCoords.lon),
              L.latLng(destinationCoords.lat, destinationCoords.lon),
            ],
            routeWhileDragging: true,
          }).addTo(map);

          setRoutingControl(newRoutingControl);
        })
        .catch((error) => console.error("Error fetching coordinates:", error));
    }
  }, [map, ride]);

  return <div id="map" style={{ width: "100%", height: "100vh", zIndex: 10 }} />;
};

// Function to get latitude & longitude using Nominatim API
async function getCoordinates(pickup, destination) {
  const fetchCoords = async (place) => {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q: place, format: "json", limit: 1 },
    });
    if (res.data.length === 0) throw new Error(`Location not found: ${place}`);
    return res.data[0];
  };

  return Promise.all([fetchCoords(pickup), fetchCoords(destination)]);
}

export default LiveTrackingDestination;
