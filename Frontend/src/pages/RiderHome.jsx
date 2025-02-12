import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../component/CaptainDetails";
import RidePopUp from "../component/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../component/ConfirmRidePopUp";
import { setRide } from "../store/rideSlice";

import axios from "axios";
import { useSelector } from "react-redux";
import { useCaptainSocket } from "../hooks/useCaptainSocket";

const RiderHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  useCaptainSocket();

  const { ride } = useSelector((state) => state.ride);
  console.log("ride info", ride);

  const { _id } = useSelector((state) => state.captainAuth);

  const token = localStorage.getItem("token");
  console.log(token)

  useEffect(() => {
    if (ride) {
      console.log("New ride received:", ride);
      setRidePopupPanel(true); // ✅ Open the popup when a new ride comes in
    }
  }, [ride]);

  async function confirmRide() {
    console.log("confirmRide function is called");

    try {
      const response = await axios.post(
        "/api/rides/confirm",
        { rideId: ride?._id, captainId: _id },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      console.log("confirm ride response", response.data);

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error(
        "Error confirming ride:",
        error.response?.data || error.message
      );
    }
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
          duration: 0.5,
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className={`fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 ${
          ridePopupPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default RiderHome;
