import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSocket, setConnected } from "../store/socketSlice";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize the socket connection
    const socket = io("http://localhost:3000"); // Replace with your backend URL

    // Set the socket in the Redux store
    dispatch(setSocket(socket));

    // Handle connection events
    socket.on("connect", () => {
      console.log("Connected to server");
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      dispatch(setConnected(false));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return children;
};

export default SocketProvider;