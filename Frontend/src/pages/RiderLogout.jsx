import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RiderLogout = () => {
  const token = localStorage.getItem("captain-token");
  const navigate = useNavigate();

  axios
    .get("/api/captains/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("captain-token");
        navigate("/captain-login");
      }
    });
  return <div>CaptainLogout</div>;
};

export default RiderLogout;
