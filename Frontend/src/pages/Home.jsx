import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import {
  panelRefFunction,
  usePanelAnimations,
} from "../hooks/usePanelAnimations";
import { useInputHandlers } from "../hooks/useInputHandler";
import { fetchFare, createRide } from "../services/rideService";
import {
  setVehiclePanel,
  setPanelOpen,
  setFare,
  setVehicleType,
  setConfirmRidePanel,
  setVehicleFound,
  setWaitingForDriver,
  setActiveField,
  setDestination,
  setPickup,
} from "../store/rideSlice";

import LocationSearchPanel from "../component/LocationSearchPanel";
import VehiclePanel from "../component/VehiclePanel";
import ConfirmRide from "../component/ConfirmRide";
import LookingForDriver from "../component/LookingForDriver";
import WaitingForDriver from "../component/WaitingForDriver";
import LiveTracking from "../component/LiveTracking";
import { startLoading, stopLoading } from "../store/loadingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {
    pickup,
    destination,
    fare,
    vehicleType,
    vehiclePanel,
    ride,
    confirmRidePanel,
    vehicleFound,
    waitingForDriver,
    pickupSuggestions,
    destinationSuggestions,
    activeField,
    panelOpen,
  } = useSelector((state) => state.ride);

  const userId = useSelector((state) => state.userAuth);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);

  useSocket();
  usePanelAnimations(vehiclePanelRef, vehiclePanel);
  usePanelAnimations(confirmRidePanelRef, confirmRidePanel);
  usePanelAnimations(vehicleFoundRef, vehicleFound);
  usePanelAnimations(waitingForDriverRef, waitingForDriver);
  panelRefFunction(panelRef, panelOpen);
  const { handlePickupChange, handleDestinationChange } = useInputHandlers();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      localStorage.setItem("userLocation", JSON.stringify(userLocation));
    },
    (error) => {
      console.error("🚨 Location permission denied:", error);
    }
  );

  const findTrip = async () => {
    dispatch(setVehiclePanel(true));
    dispatch(setPanelOpen(false));
    dispatch(startLoading());
    try {
      const fare = await fetchFare(
        pickup.name,
        destination.name,
        localStorage.getItem("token")
      );
      dispatch(setFare(fare));
      dispatch(stopLoading());
    } catch (error) {
      console.error("Error fetching fare:", error);
    }
  };

  const handleCreateRide = async () => {
    try {
      await createRide(
        pickup.name,
        destination.name,
        vehicleType,
        localStorage.getItem("token"),
        userId._id
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
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full z-20">
        <div className="h-[40%] p-6 bg-white relative">
          {panelOpen && (
            <h5
              ref={panelCloseRef}
              onClick={() => dispatch(setPanelOpen(false))}
              className="p-1 text-center w-[93%] absolute top-0"
            >
              <i className="text-3xl text-black ri-arrow-down-wide-line cursor-pointer"></i>
            </h5>
          )}
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form className="relative py-1" onSubmit={(e) => e.preventDefault()}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                dispatch(setPanelOpen(true));
                dispatch(setActiveField("pickup"));
              }}
              value={pickup.name}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full z-30"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                dispatch(setPanelOpen(true));
                dispatch(setActiveField("destination"));
              }}
              value={destination.name}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-1 z-30"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full cursor-pointer"
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
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
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
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={handleCreateRide}
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
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={handleCreateRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={(value) => dispatch(setVehicleFound(value))}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-40 bottom-0 bg-white px-3 py-6 pt-12"
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
