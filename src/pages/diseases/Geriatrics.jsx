// src/pages/diseases/Geriatrics.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const topics = [
  // Neurocognitive
  {
    slug: "dementia-alzheimers",
    title: "Alzheimer’s disease (most common dementia)",
  },
  { slug: "vascular-dementia", title: "Vascular dementia" },
  { slug: "dementia-lewy-bodies", title: "Dementia with Lewy bodies" },
  {
    slug: "frontotemporal-dementia",
    title: "Frontotemporal dementia (Pick’s disease, etc.)",
  },
  { slug: "mci", title: "Mild cognitive impairment (MCI)" },
  { slug: "delirium", title: "Delirium" },
  { slug: "parkinsons-disease", title: "Parkinson’s disease" },
  { slug: "stroke-tia", title: "Stroke / Transient ischemic attack (TIA)" },

  // Cardiovascular
  { slug: "hypertension", title: "Hypertension" },
  { slug: "cad", title: "Coronary artery disease (CAD)" },
  {
    slug: "heart-failure-hfpef",
    title: "Heart failure (esp. diastolic HF / HFpEF)",
  },
  { slug: "atrial-fibrillation", title: "Atrial fibrillation" },
  {
    slug: "other-arrhythmias",
    title: "Other arrhythmias (e.g., heart block, tachyarrhythmias)",
  },
  { slug: "peripheral-vascular-disease", title: "Peripheral vascular disease" },

  // Respiratory
  { slug: "copd", title: "Chronic obstructive pulmonary disease (COPD)" },
  { slug: "ild", title: "Interstitial lung disease (ILD)" },
  { slug: "pneumonia", title: "Pneumonia (community- and hospital-acquired)" },
  { slug: "aspiration-pneumonia", title: "Aspiration pneumonia" },

  // Endocrine & bone
  { slug: "t2dm", title: "Type 2 diabetes mellitus" },
  { slug: "hypothyroidism", title: "Hypothyroidism" },
  { slug: "hyperthyroidism", title: "Hyperthyroidism" },
  { slug: "osteoporosis", title: "Osteoporosis" },
  { slug: "vitamin-d-deficiency", title: "Vitamin D deficiency" },
  { slug: "dyslipidemia", title: "Dyslipidemia" },

  // Renal & GU
  { slug: "ckd", title: "Chronic kidney disease (CKD)" },
  {
    slug: "urinary-incontinence",
    title: "Urinary incontinence (urge, stress, overflow, functional)",
  },
  { slug: "bph", title: "Benign prostatic hyperplasia (BPH)" },
  { slug: "prostate-cancer", title: "Prostate cancer" },
  {
    slug: "recurrent-utis",
    title: "Recurrent urinary tract infections (UTIs)",
  },

  // MSK & rheum
  { slug: "osteoarthritis", title: "Osteoarthritis" },
  { slug: "rheumatoid-arthritis", title: "Rheumatoid arthritis" },
  { slug: "gout", title: "Gout" },
  { slug: "falls", title: "Falls" },
  { slug: "frailty", title: "Frailty syndromes" },
  { slug: "hip-fractures", title: "Hip fractures" },

  // GI & nutrition
  { slug: "gerd", title: "Gastroesophageal reflux disease (GERD)" },
  { slug: "chronic-constipation", title: "Chronic constipation" },
  { slug: "diverticular-disease", title: "Diverticular disease" },
  { slug: "colorectal-cancer", title: "Colorectal cancer" },
  { slug: "malnutrition", title: "Malnutrition" },

  // Mental health
  { slug: "depression", title: "Depression" },
  { slug: "anxiety-disorders", title: "Anxiety disorders" },
  { slug: "late-life-psychosis", title: "Late-life psychosis" },

  // Hem/Onc
  { slug: "anemia-of-chronic-disease", title: "Anemia of chronic disease" },
  { slug: "iron-deficiency-anemia", title: "Iron deficiency anemia" },
  { slug: "multiple-myeloma", title: "Multiple myeloma" },
  { slug: "lymphoma", title: "Lymphoma" },
  { slug: "lung-cancer", title: "Lung cancer" },
  { slug: "breast-cancer", title: "Breast cancer" },

  // Infectious
  { slug: "influenza", title: "Influenza" },
  { slug: "herpes-zoster", title: "Herpes zoster (shingles)" },
  { slug: "sepsis", title: "Sepsis (often atypical presentation)" },
  { slug: "tuberculosis", title: "Tuberculosis (reactivation)" },

  // Safety & care issues
  {
    slug: "polypharmacy",
    title: "Polypharmacy (drug interactions, side effects)",
  },
  { slug: "pressure-ulcers", title: "Pressure ulcers" },
  { slug: "immobility-syndromes", title: "Immobility syndromes" },
];

function TopicCard({ t }) {
  return (
    <Link
      to={`/diseases/geriatrics/${t.slug}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <p className="font-semibold text-slate-900">{t.title}</p>
      <p className="text-xs text-slate-500 mt-1">{t.slug}</p>
    </Link>
  );
}

export default function Geriatrics() {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  // This points back to MediwiseHome.jsx (mounted at "/")
  const HOME_PATH = "/";

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return topics;
    return topics.filter(
      (t) => t.title.toLowerCase().includes(n) || t.slug.includes(n)
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => nav(HOME_PATH)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>

        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Geriatrics</h1>
            <p className="mt-2 text-slate-600">
              Pick a topic to open its dedicated page.
            </p>
          </div>
          <div className="w-full md:w-80">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search geriatrics topics..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TopicCard key={t.slug} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
