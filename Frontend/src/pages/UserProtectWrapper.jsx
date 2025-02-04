import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]); // ✅ `useEffect` will re-run when `token` changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
