import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, resetForm } from "../store/captainAuthSlice";

import axios from "axios";
import Input from "../component/Input";

const CaptainSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    email,
    password,
    firstName,
    lastName,
    vehicleColor,
    vehiclePlate,
    vehicleCapacity,
    vehicleType,
  } = useSelector((state) => state.captainAuth);

  const handleInputChange = (field, value) => {
    const updatedValue = field === "vehicleCapacity" ? Number(value) : value;
    dispatch(setFormField({ field, value: updatedValue }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType,
      },
    };

    const response = await axios.post("/api/captain/register", captainData);
    if (response.status === 201) {
      const data = response.data;
      localStorage.setItem("token", data.token);
      dispatch(resetForm());
      navigate("/captain-home");
    }
  };

  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-3"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt=""
        />

        <form onSubmit={submitHandler}>
          <h3 className="text-lg w-full font-medium mb-2">
            What's our Captain's name
          </h3>
          <div className="flex gap-4 mb-7">
            <Input
              label="First Name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className="mb-7"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            className="mb-7"
          />

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <Input
              label="Vehicle Color"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) =>
                handleInputChange("vehicleColor", e.target.value)
              }
              required
            />
            <Input
              label="Vehicle Plate"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) =>
                handleInputChange("vehiclePlate", e.target.value)
              }
              required
            />
          </div>
          <div className="flex gap-4 mb-7">
            <Input
              label="Vehicle Capacity"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) =>
                handleInputChange("vehicleCapacity", e.target.value)
              }
              required
            />
            <Input
              label="Vehicle Type"
              type="select"
              value={vehicleType}
              onChange={(e) => handleInputChange("vehicleType", e.target.value)}
              required
              options={[
                { value: "car", label: "Car" },
                { value: "auto", label: "Auto" },
                { value: "motorcycle", label: "Moto" },
              ]}
            />
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg">
            Create Captain Account
          </button>
        </form>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
