import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const diseases = [
  // Ischemic
  {
    slug: "acute-coronary-syndrome",
    title: "Acute Coronary Syndrome (ACS)",
    tags: "ischemia chest pain mi nstemi stemi",
  },
  {
    slug: "stable-angina",
    title: "Stable Angina",
    tags: "ischemia chest pain exertional",
  },
  // Arrhythmias
  {
    slug: "atrial-fibrillation",
    title: "Atrial Fibrillation",
    tags: "arrhythmia af anticoag",
  },
  { slug: "atrial-flutter", title: "Atrial Flutter", tags: "arrhythmia" },
  {
    slug: "svt",
    title: "Supraventricular Tachycardia (SVT)",
    tags: "arrhythmia avnrt avrt",
  },
  {
    slug: "ventricular-tachycardia",
    title: "Ventricular Tachycardia",
    tags: "arrhythmia vt wide-complex",
  },
  {
    slug: "bradyarrhythmias-av-blocks",
    title: "Bradyarrhythmias & AV Blocks",
    tags: "arrhythmia heart block",
  },
  { slug: "syncope", title: "Syncope", tags: "arrhythmia reflex orthostatic" },
  // Heart failure / cardiomyopathy
  {
    slug: "heart-failure",
    title: "Heart Failure",
    tags: "hfref hfpef congestion",
  },
  {
    slug: "dilated-cardiomyopathy",
    title: "Dilated Cardiomyopathy",
    tags: "cardiomyopathy",
  },
  {
    slug: "hypertrophic-cardiomyopathy",
    title: "Hypertrophic Cardiomyopathy (HCM)",
    tags: "cardiomyopathy",
  },
  {
    slug: "restrictive-cardiomyopathy",
    title: "Restrictive Cardiomyopathy",
    tags: "cardiomyopathy amyloid",
  },
  // Valvular
  { slug: "aortic-stenosis", title: "Aortic Stenosis", tags: "valve murmur" },
  {
    slug: "aortic-regurgitation",
    title: "Aortic Regurgitation",
    tags: "valve murmur",
  },
  {
    slug: "mitral-regurgitation",
    title: "Mitral Regurgitation",
    tags: "valve murmur",
  },
  {
    slug: "mitral-stenosis",
    title: "Mitral Stenosis",
    tags: "valve rheumatic",
  },
  {
    slug: "tricuspid-and-pulmonic-valve-disease",
    title: "Tricuspid & Pulmonic Valve Disease",
    tags: "valve",
  },
  {
    slug: "infective-endocarditis",
    title: "Infective Endocarditis",
    tags: "valve infection duke",
  },
  // Pericardial / myocarditis
  {
    slug: "pericarditis",
    title: "Acute Pericarditis",
    tags: "pericardial st-elevation diffuse rub",
  },
  {
    slug: "pericardial-effusion-tamponade",
    title: "Pericardial Effusion & Tamponade",
    tags: "pericardial beck triad",
  },
  { slug: "myocarditis", title: "Myocarditis", tags: "troponin viral" },
  // Vascular / hypertension / lipids
  { slug: "hypertension", title: "Hypertension", tags: "bp" },
  { slug: "hyperlipidemia", title: "Hyperlipidemia", tags: "lipids" },
  {
    slug: "aortic-dissection",
    title: "Aortic Dissection",
    tags: "vascular tearing pain mediastinum",
  },
  {
    slug: "peripheral-arterial-disease",
    title: "Peripheral Arterial Disease (PAD)",
    tags: "claudication",
  },
  {
    slug: "dvt-pe-overview",
    title: "Venous Thromboembolism (DVT/PE) – Overview",
    tags: "vte",
  },
];

function DiseaseCard({ d }) {
  return (
    <Link
      to={`/diseases/cardiovascular/${d.slug}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <p className="font-semibold text-slate-900">{d.title}</p>
      <p className="text-xs text-slate-500 mt-1">{d.slug}</p>
    </Link>
  );
}

export default function Cardiovascular() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return diseases;
    return diseases.filter(
      (d) =>
        d.title.toLowerCase().includes(n) ||
        d.slug.includes(n) ||
        (d.tags && d.tags.includes(n))
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Cardiovascular
            </h1>
            <p className="mt-2 text-slate-600">
              Pick a topic to dive into a focused, exam-ready page.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cardiology topics..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DiseaseCard key={d.slug} d={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
