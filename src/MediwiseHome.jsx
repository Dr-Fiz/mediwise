import React, { useState } from "react";
import { Link } from "react-router-dom";

const exams = [
  { key: "UKMLA", title: "UKMLA", desc: "High-yield SBAs aligned with the MLA blueprint." },
  { key: "PLAB",  title: "PLAB",  desc: "Targeted practice and explanations to ace PLAB 1." },
  { key: "USMLE", title: "USMLE", desc: "Systems-based mastery for Step 1/2." },
];

const plabVendors = [
  { title: "Plabable", href: "/plabable", blurb: "Exam-style stems, concise notes, smart filters." },
  { title: "Pastest",  href: "#pastest",  blurb: "Large bank, analytics, timed mocks." },
];

const usmleVendors = [
  { title: "B&B (Boards & Beyond)", href: "#bnb",    blurb: "Concept-first videos + checks." },
  { title: "UWorld",                 href: "#uworld", blurb: "Gold-standard NBME-style Qs." },
];

function ProviderRow({ heading, subtitle, options }) {
  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3">
        <h4 className="text-xl md:text-2xl font-bold text-slate-900">{heading}</h4>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((o) => (
          <div key={o.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-lg text-slate-900">{o.title}</p>
                <p className="text-sm text-slate-600 mt-1">{o.blurb}</p>
              </div>

              {/* Use Link for internal routes; <a> for external/anchors */}
              {o.href.startsWith("/") ? (
                <Link
                  to={o.href}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold
                             bg-gradient-to-r from-emerald-400 to-sky-400 text-emerald-950 shadow"
                >
                  Open <span>→</span>
                </Link>
              ) : (
                <a
                  href={o.href}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold
                             bg-gradient-to-r from-emerald-400 to-sky-400 text-emerald-950 shadow"
                >
                  Open <span>→</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feature({ title, blurb }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600 mt-1">{blurb}</p>
    </div>
  );
}

export default function MediwiseHome() {
  const [selectedExam, setSelectedExam] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-300 to-sky-400 shadow-sm flex items-center justify-center text-emerald-950 font-extrabold">MW</div>
            <div>
              <p className="text-xl font-extrabold tracking-tight">Mediwise</p>
              <p className="text-xs text-slate-500 -mt-0.5">Study smarter. Score higher.</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#exams" className="hover:text-slate-900 transition">Exams</a>
            <a href="#why" className="hover:text-slate-900 transition">Why Mediwise</a>
            <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80rem_40rem_at_20%_-10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(60rem_30rem_at_80%_10%,rgba(56,189,248,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <h1 className="text-4xl md:text-6xl font-black leading-tighter tracking-tight max-w-3xl">
            Master your exam with a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">wise</span>{" "}
            plan.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-700 max-w-3xl">
            Curated question banks for UKMLA, PLAB, and USMLE—organized, beautiful, and laser-focused on exam-day performance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-full py-1 px-3 text-sm">Green / Blue Theme</span>
            <span className="border border-sky-200 bg-sky-50 text-sky-700 rounded-full py-1 px-3 text-sm">View-Only • No Login</span>
            <span className="border border-slate-200 bg-white text-slate-700 rounded-full py-1 px-3 text-sm">High-Yield • Clean UI</span>
          </div>
          <a href="#exams" className="inline-flex items-center gap-2 mt-8 rounded-2xl shadow bg-gradient-to-r from-emerald-400 to-sky-400 text-emerald-950 font-bold px-5 py-3">
            Explore Question Banks →
          </a>
        </div>
      </section>

      {/* Exams */}
      <section id="exams" className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-extrabold">Choose your exam</h2>
          <p className="text-sm text-slate-600">Click a card to reveal provider options.</p>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {exams.map((e) => (
            <div
              key={e.key}
              onClick={() => setSelectedExam(e.key)}
              className={["group cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md", selectedExam === e.key ? "ring-2 ring-emerald-400/60" : ""].join(" ")}
            >
              <div className="p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold">{e.title}</p>
                  <p className="text-slate-600 mt-1">{e.desc}</p>
                </div>
                <button className="rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2 text-sm">
                  {selectedExam === e.key ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {selectedExam === "UKMLA" && (
            <ProviderRow
              heading="UKMLA Question Bank"
              subtitle="Mapped to the MLA content map with SBAs and practical clinical scenarios."
              options={[{ title: "Explore UKMLA Bank", href: "#ukmla", blurb: "Blueprint-aligned practice sets and explanations." }]}
            />
          )}
          {selectedExam === "PLAB" && (
            <ProviderRow
              heading="PLAB Providers"
              subtitle="Pick your preferred platform and start practicing."
              options={plabVendors}
            />
          )}
          {selectedExam === "USMLE" && (
            <ProviderRow
              heading="USMLE Providers"
              subtitle="Choose a resource that fits your study style."
              options={usmleVendors}
            />
          )}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-3xl p-8 md:p-10 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-extrabold">Why Mediwise?</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <Feature title="Organized & Aesthetic" blurb="Clutter-free layout with smooth spacing for focus." />
            <Feature title="High-Yield Focus" blurb="Mapped to exam blueprints—no fluff, just what moves the needle." />
            <Feature title="Green/Blue Accents" blurb="A calm yet energizing palette used sparingly on white." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="font-semibold">Mediwise</p>
              <p className="text-sm text-slate-600">
                For feedback or partnerships, email{" "}
                <a className="underline underline-offset-4 text-sky-700" href="mailto:hello@mediwise.app">
                  hello@mediwise.app
                </a>
              </p>
            </div>
            <div className="md:text-right text-sm text-slate-600">© {new Date().getFullYear()} Mediwise. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
