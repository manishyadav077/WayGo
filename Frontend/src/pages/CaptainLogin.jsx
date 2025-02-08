import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, resetForm, setCaptain } from "../store/captainAuthSlice";

import axios from "axios";
import Input from "../component/Input";

const CaptainLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password } = useSelector((state) => state.captainAuth);

  const handleInputChange = (field, value) => {
    const updatedValue = field === "vehicleCapacity" ? Number(value) : value;
    dispatch(setFormField({ field, value: updatedValue }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      email,
      password,
    };

    const response = await axios.post("/api/captain/login", captainData);
    if (response.status === 200) {
      const data = response.data;
      console.log("captain data", data)
      dispatch(
              setCaptain({
                email: data.captain.email,
                firstName: data.captain.fullname.firstname,
                lastName: data.captain.fullname.lastname,
                _id: data.captain._id,
                token: data.token,
              })
            );
      localStorage.setItem("token", data.token);
      // dispatch(resetForm());
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

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg">
           Login
          </button>
        </form>

        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Register
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

export default CaptainLogin;
