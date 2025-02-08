import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../services/socketService";
import { setRide } from "../store/rideSlice";

export const useCaptainSocket = () => {
  const dispatch = useDispatch();
  const  rider  = useSelector((state) => state.captainAuth);
  // console.log("id in use captain", rider._id)
  const socket = getSocket();

  useEffect(() => {
    if (!rider) return;


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

            // console.log("📍 Updating captain location:", userLocation);

          
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
            console.error("❌ Error getting location:", error.message);
          }
        );
      } else {
        console.warn("⚠️ Geolocation is not supported by this browser.");
      }
    };

 
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation(); // Call once on mount

    socket.on("new-ride", (data) => {
      dispatch(setRide(data));
    });

    return () => {
      socket.off("new-ride");
      clearInterval(locationInterval);
    };
  }, [rider?._id, socket, dispatch]);
};
