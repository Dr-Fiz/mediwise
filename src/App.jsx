import React from "react";
import { Routes, Route } from "react-router-dom";
import MediwiseHome from "./MediwiseHome.jsx";
import Plabable from "./pages/Plabable.jsx";
import PlabableAcuteEmergency from "./pages/PlabableAcuteEmergency.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MediwiseHome />} />
      <Route path="/plabable" element={<Plabable />} />
      <Route path="/plabable/acute-emergency" element={<PlabableAcuteEmergency />} />
    </Routes>
  );
}
