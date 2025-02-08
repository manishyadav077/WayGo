import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../services/socketService";
import { setRide } from "../store/rideSlice";

export const useCaptainSocket = () => {
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.captainAuth);
  const socket = getSocket();

  useEffect(() => {
    if (!_id) return;

    // Join the captain to their socket room
    socket.emit("join", {
      userId: _id,
      userType: "captain",
    });

    // Function to update captain's location every 10 seconds
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: _id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    // Emit location updates every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation(); // Call once on mount

    // Listen for new ride requests
    socket.on("new-ride", (data) => {
      dispatch(setRide(data));
    });

    return () => {
      socket.off("new-ride");
      clearInterval(locationInterval);
    };
  }, [_id, socket, dispatch]);
};
