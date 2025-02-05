import { useDispatch } from "react-redux";
import { fetchSuggestions } from "../services/rideService";
import {
  setPickup,
  setDestination,
  setPickupSuggestions,
  setDestinationSuggestions,
} from "../store/rideSlice";

export const useInputHandlers = () => {
  const dispatch = useDispatch();

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    dispatch(setPickup(value));

    // ✅ Retrieve user location from localStorage
    const storedLocation = localStorage.getItem("userLocation");
    let userLocation = storedLocation ? JSON.parse(storedLocation) : null;

    if (!userLocation || !userLocation.lat || !userLocation.lng) {
      console.warn(
        "⚠️ User location not available - using default coordinates"
      );
      userLocation = { lat: 0, lng: 0 }; // Default to (0,0) or another fallback
    }

    try {
      const suggestions = await fetchSuggestions(
        value,
        localStorage.getItem("token"),
        userLocation.lat,
        userLocation.lng
      );

      dispatch(setPickupSuggestions(suggestions));
    } catch (error) {
      console.error("❌ Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    dispatch(setDestination(value));
    try {
      const suggestions = await fetchSuggestions(
        value,
        localStorage.getItem("token")
      );
      dispatch(setDestinationSuggestions(suggestions));
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  return { handlePickupChange, handleDestinationChange };
};
