import React from "react";
import { Routes, Route } from "react-router-dom";

/* =========================
 * Home & Vendor Pages
 * ========================= */
import MediwiseHome from "./MediwiseHome.jsx";
import Plabable from "./pages/Plabable.jsx";
import PlabableAcuteEmergency from "./pages/PlabableAcuteEmergency.jsx";

/* =========================
 * Diseases by System (Top-Level)
 * ========================= */
import Cardiovascular from "./pages/diseases/Cardiovascular.jsx";
import Respiratory from "./pages/diseases/Respiratory.jsx";
import Gastrointestinal from "./pages/diseases/Gastrointestinal.jsx";
import Renal from "./pages/diseases/Renal.jsx";
import Endocrine from "./pages/diseases/Endocrine.jsx";
import Neurology from "./pages/diseases/Neurology.jsx";
import Msk from "./pages/diseases/Msk.jsx";
import Hematology from "./pages/diseases/Hematology.jsx";
import Oncology from "./pages/diseases/Oncology.jsx";
import Infectious from "./pages/diseases/Infectious.jsx";
import AllergyImmunology from "./pages/diseases/AllergyImmunology.jsx";
import Psychiatry from "./pages/diseases/Psychiatry.jsx";
import Dermatology from "./pages/diseases/Dermatology.jsx";
import Reproductive from "./pages/diseases/Reproductive.jsx";
import Pediatrics from "./pages/diseases/Pediatrics.jsx";
import Ophthalmology from "./pages/diseases/Ophthalmology.jsx";
import Ent from "./pages/diseases/Ent.jsx";
import Geriatrics from "./pages/diseases/Geriatrics.jsx";
import Emergency from "./pages/diseases/Emergency.jsx";
import Toxicology from "./pages/diseases/Toxicology.jsx";
import Palliative from "./pages/diseases/Palliative.jsx";

/* =========================
 * Geriatrics — Topic Pages
 * (Add more as you create them)
 * ========================= */
import DementiaAlzheimers from "./pages/diseases/geriatrics/DementiaAlzheimers.jsx";
import VascularDementia from "./pages/diseases/geriatrics/VascularDementia.jsx";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<MediwiseHome />} />

      {/* Vendors */}
      <Route path="/plabable" element={<Plabable />} />
      <Route
        path="/plabable/acute-emergency"
        element={<PlabableAcuteEmergency />}
      />

      {/* Diseases by System */}
      <Route path="/diseases/cardiovascular" element={<Cardiovascular />} />
      <Route path="/diseases/respiratory" element={<Respiratory />} />
      <Route path="/diseases/gastrointestinal" element={<Gastrointestinal />} />
      <Route path="/diseases/renal" element={<Renal />} />
      <Route path="/diseases/endocrine" element={<Endocrine />} />
      <Route path="/diseases/neurology" element={<Neurology />} />
      <Route path="/diseases/msk" element={<Msk />} />
      <Route path="/diseases/hematology" element={<Hematology />} />
      <Route path="/diseases/oncology" element={<Oncology />} />
      <Route path="/diseases/infectious" element={<Infectious />} />
      <Route
        path="/diseases/allergy-immunology"
        element={<AllergyImmunology />}
      />
      <Route path="/diseases/psychiatry" element={<Psychiatry />} />
      <Route path="/diseases/dermatology" element={<Dermatology />} />
      <Route path="/diseases/reproductive" element={<Reproductive />} />
      <Route path="/diseases/pediatrics" element={<Pediatrics />} />
      <Route path="/diseases/ophthalmology" element={<Ophthalmology />} />
      <Route path="/diseases/ent" element={<Ent />} />
      <Route path="/diseases/geriatrics" element={<Geriatrics />} />
      <Route path="/diseases/emergency" element={<Emergency />} />
      <Route path="/diseases/toxicology" element={<Toxicology />} />
      <Route path="/diseases/palliative" element={<Palliative />} />

      {/* Geriatrics — Individual Topics */}
      <Route
        path="/diseases/geriatrics/dementia-alzheimers"
        element={<DementiaAlzheimers />}
      />
      <Route
        path="/diseases/geriatrics/vascular-dementia"
        element={<VascularDementia />}
      />
    </Routes>
  );
}
