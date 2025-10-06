// src/pages/nvu-subjects/NVU.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/** ---------- Data (single source of truth) ---------- */
const SUBJECTS = [
  { key: "cardiovascular", title: "Cardiovascular" },
  { key: "respiratory", title: "Respiratory" },
  { key: "gastrointestinal", title: "Gastrointestinal & Hepatology" },
  { key: "renal", title: "Renal/Genitourinary" },
  { key: "endocrine", title: "Endocrine" },
  { key: "neurology", title: "Neurology" },
  { key: "msk", title: "MSK/Rheumatology" },
  { key: "hematology", title: "Hematology" },
  { key: "oncology", title: "Oncology" },
  { key: "infectious", title: "Infectious Diseases" },
  { key: "allergy-immunology", title: "Allergy & Immunology" },
  { key: "psychiatry", title: "Psychiatry" },
  { key: "dermatology", title: "Dermatology" },
  { key: "reproductive", title: "Reproductive (Ob/Gyn)" },
  { key: "pediatrics", title: "Pediatrics" },
  { key: "ophthalmology", title: "Ophthalmology" },
  { key: "ent", title: "ENT (Otolaryngology)" },
  { key: "geriatrics", title: "Geriatrics" },
  { key: "emergency", title: "Emergency Medicine" },
  { key: "toxicology", title: "Toxicology" },
  { key: "palliative", title: "Palliative Care" },
];

// quick lookup map
const TITLES = SUBJECTS.reduce((acc, s) => {
  acc[s.key] = s.title;
  return acc;
}, {});

/** ---------- Views (index + subject) in one file ---------- */

// Subject index: /nvu
function NVUIndex() {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return SUBJECTS;
    return SUBJECTS.filter(
      (s) => s.title.toLowerCase().includes(n) || s.key.includes(n)
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back to home */}
        <div className="mb-4">
          <button
            onClick={() => nav("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>

        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">NVU</h1>
            <p className="mt-2 text-slate-600">
              Choose a medical subject to continue.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search subjects..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.key}
              to={`/nvu/${s.key}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-slate-900">{s.title}</p>
              <p className="text-xs text-slate-500 mt-1">{s.key}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Subject chooser: /nvu/:subject
function NVUSubjectView() {
  const { subject } = useParams();
  const nav = useNavigate();
  const title = TITLES[subject] || subject;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => nav("/nvu")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
        <p className="mt-2 text-slate-600">Choose a mode to continue.</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <button
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition"
            onClick={() => alert("MCQ Mode coming soon")}
          >
            <p className="text-xl font-bold text-slate-900">MCQ</p>
            <p className="text-sm text-slate-600 mt-1">
              Multiple-choice practice questions.
            </p>
          </button>

          {/* OSCE now navigates to /nvu/:subject/osce — e.g. /nvu/geriatrics/osce */}
          <button
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm hover:shadow-md transition"
            onClick={() => nav(`/nvu/${subject}/osce`)}
          >
            <p className="text-xl font-bold text-slate-900">OSCE</p>
            <p className="text-sm text-slate-600 mt-1">
              Clinical stations and scenarios.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

/** ---------- Single exported component that auto-selects view ---------- */
export default function NVU() {
  const { subject } = useParams();
  return subject ? <NVUSubjectView /> : <NVUIndex />;
}
