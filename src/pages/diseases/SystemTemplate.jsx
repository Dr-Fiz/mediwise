import React from "react";

export default function SystemTemplate({ title, intro, sections = [] }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
          {intro && <p className="mt-2 text-slate-600">{intro}</p>}
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1">
            <nav className="rounded-2xl border border-slate-200 bg-white p-4 sticky top-24">
              <p className="font-semibold mb-2">On this page</p>
              <ul className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a className="hover:underline" href={`#${s.id}`}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="md:col-span-2 space-y-8">
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-bold">{s.title}</h2>
                {Array.isArray(s.content) ? (
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-slate-700">
                    {s.content.map((item, i) => (
                      <li key={i}>{item}</li>
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
    </div>
  );
}
