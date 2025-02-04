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
    try {
      const suggestions = await fetchSuggestions(
        value,
        localStorage.getItem("token")
      );
      dispatch(setPickupSuggestions(suggestions));
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
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
