import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { setConnected } from "../store/socketSlice";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocket(); // Get the singleton socket instance

    socket.on("connect", () => {
      console.log("Connected to server");
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      dispatch(setConnected(false));
    });

    return () => {
      disconnectSocket(); // Clean up on unmount
    };
  }, [dispatch]);

  return children;
};

export default SocketProvider;
