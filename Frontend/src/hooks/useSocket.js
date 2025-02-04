import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../services/socketService";
import {
  setRide,
  setVehicleFound,
  setWaitingForDriver,
} from "../store/rideSlice";

export const useSocket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userAuth);
  const socket = getSocket();

  // Join user to socket room
  useEffect(() => {
    socket?.emit("join", { userType: "user", userId: user._id });
  }, [user, socket]);

  // Socket event listeners
  useEffect(() => {
    socket.on("ride-confirmed", (ride) => {
      dispatch(setVehicleFound(false));
      dispatch(setWaitingForDriver(true));
      dispatch(setRide(ride));
    });

    socket.on("ride-started", (ride) => {
      dispatch(setWaitingForDriver(false));
      navigate("/riding", { state: { ride } });
    });

    return () => {
      socket.off("ride-confirmed");
      socket.off("ride-started");
    };
  }, [socket, dispatch, navigate]);
};
