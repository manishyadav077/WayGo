import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setFormField, setCaptain, resetForm } from "../store/captainAuthSlice";
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

    try {
      const response = await axios.post("/api/captain/register", captainData);

      if (response.status === 201) {
        const data = response.data;
        // Extract captain data from the response
        const { _id, email, fullname, token } = data.captain;

        // Dispatch setCaptain to store captain data in Redux
        dispatch(
          setCaptain({
            email: email,
            firstName: fullname.firstname,
            lastName: fullname.lastname,
            _id: _id, // Store the _id
            token: token, // Store the token
          })
        );

        // Optional: Store token in localStorage for persistence
        localStorage.setItem("token", token);

        // Navigate to the captain home page
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      dispatch(resetForm());
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Captain Signup</h2>

        <form onSubmit={submitHandler}>
          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>

          {/* Vehicle Information */}
          <h3 className="text-lg font-semibold mt-6 mb-3">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Submit Button */}
          <button className="mt-6 bg-black text-white font-semibold rounded-lg px-4 py-2 w-full text-lg hover:bg-gray-900 transition">
            Create Captain Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

        {/* Footer */}
        <p className="text-xs text-center mt-6">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
