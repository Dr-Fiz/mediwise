import React from "react";
import { Link } from "react-router-dom";

const subjects = [
  "Acute & emergency",
  "Cancer",
  "Cardiovascular",
  "Child health",
  "Clinical haematology",
  "Clinical imaging",
  "Dermatology",
  "Ear, nose & throat (ENT)",
  "Endocrine & metabolic",
  "Gastrointestinal (incl. liver)",
  "General practice & primary healthcare",
  "Infection",
  "Medicine of older adult",
  "Mental health",
  "Musculoskeletal (incl. trauma, orthopaedics, rheumatology)",
  "Neurosciences (incl. neurosurgery)",
  "Obstetrics & gynaecology",
  "Ophthalmology",
  "Palliative & end-of-life care",
  "Perioperative medicine & anaesthesia",
  "Renal & urology",
  "Respiratory (incl. thoracic surgery)",
  "Sexual health",
  "Surgery (general, plastic, breast, OMFS, transplantation)",
];

export default function Plabable() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-600 hover:text-slate-900">← Home</Link>
            <span className="text-slate-400">/</span>
            <span className="font-semibold">PLAB</span>
            <span className="text-slate-400">/</span>
            <span>Plabable</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold">Plabable Subjects</h1>
          <p className="text-sm text-slate-600">Choose a subject to start studying.</p>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => {
            const to =
              s.toLowerCase().startsWith("acute & emergency")
                ? "/plabable/acute-emergency"
                : undefined;
            const Card = ({ children }) => (
              <div className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                {children}
              </div>
            );

            return to ? (
              <Link key={s} to={to} className="block">
                <Card>
                  <p className="font-semibold">{s}</p>
                  <p className="text-sm text-slate-600 mt-1">Study questions, notes, and quick reviews.</p>
                </Card>
              </Link>
            ) : (
              <button key={s} className="text-left">
                <Card>
                  <p className="font-semibold">{s}</p>
                  <p className="text-sm text-slate-600 mt-1">Coming soon.</p>
                </Card>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
