import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../services/socketService";
import { setRide } from "../store/rideSlice";

export const useCaptainSocket = () => {
  const dispatch = useDispatch();
  const rider = useSelector((state) => state.captainAuth);

  const socket = getSocket();

  useEffect(() => {
    if (!rider) return;

    console.log("Joining socket with:", rider?._id); 

    socket.emit("join", {
      userId: rider?._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            socket.emit("update-location-captain", {
              userId: rider?._id,
              location: userLocation,
            });

            localStorage.setItem(
              "captainLocation",
              JSON.stringify(userLocation)
            );
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    socket.on("new-ride", (data) => {
      console.log("new ride received in frontend", data)
      dispatch(setRide(data));
    });

    return () => {
      socket.off("new-ride");
      clearInterval(locationInterval);
    };
  }, [rider?._id, socket, dispatch]);
};
