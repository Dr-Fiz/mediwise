// src/pages/diseases/geriatrics/TopicTemplate.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopicTemplate({ title, intro, sections = [] }) {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
          {intro && <p className="mt-2 text-slate-600">{intro}</p>}
        </header>

        <main className="space-y-6">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold">{s.title}</h2>
              {Array.isArray(s.content) ? (
                <ul className="list-disc ml-5 mt-2 space-y-1 text-slate-700">
                  {s.content.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-slate-700">{s.content}</p>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
