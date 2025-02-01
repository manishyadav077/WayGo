import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCaptain } from "../store/captainAuthSlice";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { captain, isLoggedIn } = useSelector((state) => state.captainAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    // Fetch captain profile
    const fetchCaptainProfile = async () => {
      try {
        const response = await axios.get('/api/captains/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // Update captain data in Redux
          dispatch(setCaptain(response.data.captain));
          setIsLoading(false);
        }
      } catch (err) {
        // Handle errors (e.g., invalid or expired token)
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
    };

    fetchCaptainProfile();
  }, [token, navigate, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;