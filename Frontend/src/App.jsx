import React from "react";
import { Route, Routes } from "react-router-dom";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/captain-register" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
      </Routes>
    </div>
  );
};

export default App;
