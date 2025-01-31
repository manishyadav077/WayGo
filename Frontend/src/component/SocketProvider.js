import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSocket, setConnected } from "../store/socketSlice";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSocket()); // Initialize socket in Redux store

    const socket = io(`${import.meta.env.VITE_BASE_URL}`);

    socket.on("connect", () => {
      console.log("Connected to server");
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      dispatch(setConnected(false));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return children; // No need for context, Redux manages state
};

export default SocketProvider;
