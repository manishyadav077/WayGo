// Home.js
import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setPickup,
  setDestination,
  setFare,
  setVehicleType,
  setRide,
  setVehiclePanel,
  setConfirmRidePanel,
  setVehicleFound,
  setWaitingForDriver,
  setPickupSuggestions,
  setDestinationSuggestions,
  setActiveField,
} from "../store/rideSlice";
import LocationSearchPanel from "../component/LocationSearchPanel";
import VehiclePanel from "../component/VehiclePanel";
import ConfirmRide from "../component/ConfirmRide";
import LookingForDriver from "../component/LookingForDriver";
import WaitingForDriver from "../component/WaitingForDriver";
import LiveTracking from "../component/LiveTracking";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Refs for GSAP animations
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  // Redux state
  const {
    pickup,
    destination,
    fare,
    vehicleType,
    ride,
    vehiclePanel,
    confirmRidePanel,
    vehicleFound,
    waitingForDriver,
    pickupSuggestions,
    destinationSuggestions,
    activeField,
  } = useSelector((state) => state.ride);
  const user  = useSelector((state) => state.userAuth);
  console.log(user)
  const { socket } = useSelector((state) => state.socket);

  // Join user to socket room
  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
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

  // GSAP animations for panels
  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriver]);

  // Handle pickup and destination input changes
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    dispatch(setPickup(value));
    try {
      const response = await axios.get("/api/maps/get-suggestions", {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(setPickupSuggestions(response.data));
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    dispatch(setDestination(value));
    try {
      const response = await axios.get("/api/maps/get-suggestions", {
        params: { input: value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(setDestinationSuggestions(response.data));
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  // Find trip and calculate fare
  const findTrip = async () => {
    dispatch(setVehiclePanel(true));
    dispatch(setPanelOpen(false));
    try {
      const response = await axios.get("/api/rides/get-fare", {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(setFare(response.data));
    } catch (error) {
      console.error("Error fetching fare:", error);
    }
  };

  // Create a ride
  const createRide = async () => {
    try {
      await axios.post(
        "/api/rides/create",
        { pickup, destination, vehicleType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => dispatch(setPanelOpen(false))}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form className="relative py-3" onSubmit={(e) => e.preventDefault()}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                dispatch(setPanelOpen(true));
                dispatch(setActiveField("pickup"));
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                dispatch(setPanelOpen(true));
                dispatch(setActiveField("destination"));
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={(value) => dispatch(setPanelOpen(value))}
            setVehiclePanel={(value) => dispatch(setVehiclePanel(value))}
            setPickup={(value) => dispatch(setPickup(value))}
            setDestination={(value) => dispatch(setDestination(value))}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={(value) => dispatch(setVehicleType(value))}
          fare={fare}
          setConfirmRidePanel={(value) => dispatch(setConfirmRidePanel(value))}
          setVehiclePanel={(value) => dispatch(setVehiclePanel(value))}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={(value) => dispatch(setConfirmRidePanel(value))}
          setVehicleFound={(value) => dispatch(setVehicleFound(value))}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={(value) => dispatch(setVehicleFound(value))}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={(value) => dispatch(setVehicleFound(value))}
          setWaitingForDriver={(value) => dispatch(setWaitingForDriver(value))}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
