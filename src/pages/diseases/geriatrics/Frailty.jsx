// src/pages/diseases/geriatrics/Frailty.jsx
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

/** ========== Inline RichText (bold/italic + colored highlights) ========== */
function RichText({ text = "" }) {
  let html = String(text);
  html = html
    .replace(/&(?![a-zA-Z#0-9]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  html = html.replace(
    /==(.+?)==/g,
    "<mark style='background-color:#FEF3C7' class='px-1 rounded'>$1</mark>"
  );
  const colors = {
    yellow: "#FEF3C7",
    green: "#D1FAE5",
    blue: "#E0F2FE",
    red: "#FFE4E6",
    purple: "#EDE9FE",
  };
  Object.entries(colors).forEach(([name, bg]) => {
    const re = new RegExp(`\\[${name}\\]([\\s\\S]+?)\\[\\/${name}\\]`, "gi");
    html = html.replace(
      re,
      `<mark style="background-color:${bg}" class="px-1 rounded">$1</mark>`
    );
  });
  html = html
    .replace(/&lt;strong&gt;/g, "<strong>")
    .replace(/&lt;\/strong&gt;/g, "</strong>")
    .replace(/&lt;em&gt;/g, "<em>")
    .replace(/&lt;\/em&gt;/g, "</em>")
    .replace(/&lt;mark /g, "<mark ")
    .replace(/&lt;\/mark&gt;/g, "</mark>");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ============================ Question Data ============================ */
const QUESTIONS = [
  {
    id: "FR-4001",
    topic: "Geriatrics • Frailty",
    difficulty: "Easy",
    vignetteTitle: "Core definition",
    stem: "Frailty is best described as which SINGLE concept?",
    options: [
      { key: "A", text: "Aging with multimorbidity only" },
      { key: "B", text: "Irreversible cognitive decline" },
      {
        key: "C",
        text: "Syndrome of ↓ physiologic reserve → ↑ vulnerability to stressors",
      }, // correct
      { key: "D", text: "Any disability requiring a wheelchair" },
      { key: "E", text: "Same as sarcopenia" },
    ],
    correct: "C",
    explanation_detail: [
      "Frailty is a **biologic syndrome** of **reduced homeostatic reserve** and **resilience**, leading to **disproportionate adverse outcomes** after stressors.",
      "[blue]Sarcopenia[/blue] contributes to frailty but is **not identical**.",
    ],
  },
  {
    id: "FR-4002",
    topic: "Geriatrics • Frailty",
    difficulty: "Medium",
    vignetteTitle: "Phenotype vs deficit-index",
    stem: "Which SINGLE set aligns with the **Fried phenotype** of frailty?",
    options: [
      {
        key: "A",
        text: "Weight loss, exhaustion, slow gait, weak grip, low activity",
      }, // correct
      { key: "B", text: "Polypharmacy count across systems" },
      { key: "C", text: "Charlson comorbidity components" },
      { key: "D", text: "Delirium screening items" },
      { key: "E", text: "Mini-Mental State Examination items" },
    ],
    correct: "A",
    explanation_detail: [
      "The **Fried phenotype** uses five: **unintentional weight loss**, **exhaustion**, **weak grip**, **slow gait**, **low physical activity**.",
      "[green]Deficit-index[/green] (Rockwood/CFS) sums **accumulated deficits** across systems.",
    ],
  },
  {
    id: "FR-4003",
    topic: "Geriatrics • Frailty",
    difficulty: "Medium",
    vignetteTitle: "Clinical Frailty Scale (CFS)",
    stem: "An 83-year-old independent in ADLs with brisk walks and no fatigue is scored on the **CFS**. Which SINGLE level fits best?",
    options: [
      { key: "A", text: "CFS 1 – Very Fit" }, // correct
      { key: "B", text: "CFS 3 – Managing well" },
      { key: "C", text: "CFS 5 – Mildly frail" },
      { key: "D", text: "CFS 7 – Severely frail" },
      { key: "E", text: "CFS 9 – Terminally ill" },
    ],
    correct: "A",
    explanation_detail: [
      "**CFS 1**: active, energetic, fittest for age. **CFS 3** has medical problems well-controlled; **CFS ≥5** indicates degrees of frailty with dependency.",
    ],
  },
  {
    id: "FR-4004",
    topic: "Geriatrics • Frailty",
    difficulty: "Hard",
    vignetteTitle: "Interventions that move the needle",
    stem: "Which SINGLE intervention has the **strongest evidence** to improve function in frailty?",
    options: [
      { key: "A", text: "Long-term systemic corticosteroids" },
      {
        key: "B",
        text: "Multicomponent exercise: resistance + balance + gait + aerobic",
      }, // correct
      { key: "C", text: "Bed rest with high-calorie feeds" },
      { key: "D", text: "Routine antipsychotics at night" },
      { key: "E", text: "Daily IV fluids at home" },
    ],
    correct: "B",
    explanation_detail: [
      "Best data favors **multicomponent exercise** emphasizing **progressive resistance training**, **balance**, and **gait/aerobic** work. Pair with **nutrition optimization** and **CGA**.",
    ],
  },
  {
    id: "FR-4005",
    topic: "Geriatrics • Frailty",
    difficulty: "Medium",
    vignetteTitle: "Protein targets",
    stem: "A 76-year-old with frailty and weight loss starts resistance training. Which SINGLE **daily protein** target is most appropriate (normal renal function)?",
    options: [
      { key: "A", text: "0.6 g/kg/day" },
      { key: "B", text: "0.8 g/kg/day (standard RDA for adults)" },
      { key: "C", text: "1.0–1.2 g/kg/day" }, // correct
      { key: "D", text: "≥2.5 g/kg/day for all older adults" },
      { key: "E", text: "Protein restriction to prevent sarcopenia" },
    ],
    correct: "C",
    explanation_detail: [
      "Most guidelines suggest **~1.0–1.2 g/kg/day** in older adults; up to **1.2–1.5 g/kg/day** if malnourished/ill and renal function allows.",
    ],
  },
  {
    id: "FR-4006",
    topic: "Geriatrics • Frailty",
    difficulty: "Medium",
    vignetteTitle: "Hospital vulnerability",
    stem: "A frail inpatient is at risk of deconditioning and delirium. Which SINGLE **bundle element** is most protective?",
    options: [
      { key: "A", text: "Strict bed rest until discharge" },
      {
        key: "B",
        text: "Early mobilization with PT/OT and orientation (clock, glasses, hearing aids)",
      }, // correct
      { key: "C", text: "Routine benzodiazepines for sleep" },
      { key: "D", text: "NPO after midnight for entire stay" },
      { key: "E", text: "Indwelling catheter for convenience" },
    ],
    correct: "B",
    explanation_detail: [
      "Frailty care-in-hospital: **early mobilization**, **sensory optimization**, **hydration/nutrition**, **sleep hygiene**, **avoid deliriogenic meds**, **minimize tethers**.",
    ],
  },
];

/* ================================ Utils ================================ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function useIsMobile(bp = 768) {
  const [m, setM] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const onR = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [bp]);
  return m;
}

/* =============================== Modal =============================== */
function Modal({
  open,
  onClose,
  title,
  children,
  maxW = "max-w-2xl",
  overlayClass = "bg-black/30",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className={`absolute inset-0 ${overlayClass}`} onClick={onClose} />
      <div className="absolute inset-0 overflow-auto">
        <div className={`mx-auto ${maxW} p-4`}>
          <div className="relative rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <button
                onClick={onClose}
                className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== Mobile question list (modal) ============== */
function MobileQuestionList({
  open,
  onClose,
  order,
  currentIdx,
  setCurrentIdx,
  answers,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Questions" maxW="max-w-lg">
      <ol className="space-y-3">
        {order.map((qi, i) => {
          const q = QUESTIONS[qi];
          const a = answers[q.id];
          const status = !a
            ? "unanswered"
            : a === q.correct
            ? "correct"
            : "incorrect";
          const ring =
            i === currentIdx
              ? "ring-2 ring-purple-300"
              : status === "correct"
              ? "ring-2 ring-emerald-300"
              : status === "incorrect"
              ? "ring-2 ring-rose-300"
              : "";
          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentIdx(i);
                onClose();
              }}
              className={`w-full text-left rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-3 ${ring}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">Q{i + 1}</p>
                  <p className="text-sm text-slate-600 truncate">
                    {q.stem.replace(/<[^>]*>/g, "")}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">
                      {q.topic}
                    </span>
                    <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                      {q.difficulty}
                    </span>
                  </div>
                </div>
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    status === "correct"
                      ? "bg-emerald-500"
                      : status === "incorrect"
                      ? "bg-rose-500"
                      : "bg-slate-300"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </ol>
    </Modal>
  );
}

/* =============================== Results (inline) =============================== */
function ResultsView({
  answers,
  startedAt,
  endedAt,
  order,
  onReview,
  onRestart,
}) {
  const total = order.length;
  const correct = order.reduce(
    (acc, idx) =>
      acc + (answers[QUESTIONS[idx].id] === QUESTIONS[idx].correct ? 1 : 0),
    0
  );
  const pct = Math.round((correct / Math.max(total, 1)) * 100);
  const ms = Math.max(0, (endedAt || Date.now()) - (startedAt || Date.now()));
  const mins = Math.floor(ms / 60000);
  const secs = Math.round((ms % 60000) / 1000);

  const wrong = order.filter(
    (idx) =>
      answers[QUESTIONS[idx].id] &&
      answers[QUESTIONS[idx].id] !== QUESTIONS[idx].correct
  );

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Results — Frailty
        </h1>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Score</p>
            <p className="text-2xl font-bold">
              {correct} / {total}
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Percentage</p>
            <p className="text-2xl font-bold">{pct}%</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Time</p>
            <p className="text-2xl font-bold">
              {mins}m {secs}s
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2">Review incorrect questions</p>
          {wrong.length === 0 ? (
            <p className="text-slate-600">Nice — nothing wrong this round 🎯</p>
          ) : (
            <ul className="space-y-2">
              {wrong.map((idx) => {
                const q = QUESTIONS[idx];
                return (
                  <li key={q.id}>
                    <button
                      onClick={() => onReview(idx)}
                      className="text-left w-full rounded-lg border px-3 py-2 hover:bg-slate-50"
                    >
                      <span className="font-medium mr-2">
                        Q{order.indexOf(idx) + 1}.
                      </span>
                      {q.stem.replace(/<[^>]*>/g, "")}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onRestart}
            className="rounded-xl bg-purple-600 text-white px-4 py-2"
          >
            Restart
          </button>
          <Link
            to="/diseases/geriatrics"
            className="rounded-xl border px-4 py-2 hover:bg-slate-50"
          >
            ← Back to Geriatrics
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================================ Page ================================ */
export default function Frailty() {
  const isMobile = useIsMobile();

  // session/order state
  const [order, setOrder] = useState(QUESTIONS.map((_, i) => i));
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  // highlighting
  const [highlightMode, setHighlightMode] = useState(false);
  const highlightRef = useRef(null);

  const q = QUESTIONS[order[currentIdx]];
  const total = QUESTIONS.length;
  const progress = ((currentIdx + 1) / Math.max(total, 1)) * 100;

  // selection highlight
  useEffect(() => {
    if (!highlightMode) return;
    const handler = () => {
      const root = highlightRef.current;
      if (!root) return;
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      try {
        const range = sel.getRangeAt(0);
        if (!root.contains(range.commonAncestorContainer)) return;
        if (String(range).trim().length === 0) return;
        const mark = document.createElement("mark");
        mark.className = "bg-yellow-200 rounded px-0.5";
        range.surroundContents(mark);
        sel.removeAllRanges();
      } catch {}
    };
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [highlightMode]);

  const clearHighlights = () => {
    const root = highlightRef.current;
    if (!root) return;
    root.querySelectorAll("mark").forEach((m) => {
      const p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
    });
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && currentIdx < total - 1)
        setCurrentIdx((i) => i + 1);
      if (e.key === "ArrowLeft" && currentIdx > 0) setCurrentIdx((i) => i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx, total]);

  // start overlay choice
  const handleStart = (mode) => {
    const newOrder =
      mode === "random"
        ? shuffle(QUESTIONS.map((_, i) => i))
        : QUESTIONS.map((_, i) => i);
    setOrder(newOrder);
    setCurrentIdx(0);
    setAnswers({});
    setRevealed({});
    setStarted(true);
    setStartedAt(Date.now());
    setShowResults(false);
  };

  const onEndSession = () => {
    setEndedAt(Date.now());
    setShowResults(true); // show inline results
  };

  // results short-circuit
  if (showResults) {
    return (
      <ResultsView
        answers={answers}
        startedAt={startedAt}
        endedAt={endedAt}
        order={order}
        onReview={(idx) => {
          setShowResults(false);
          setCurrentIdx(order.indexOf(idx) >= 0 ? order.indexOf(idx) : 0);
        }}
        onRestart={() => handleStart("number")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-purple-700">
            Mediwise
          </Link>

          <div className="flex items-center gap-4 w-[320px]">
            <span className="text-sm text-slate-600 whitespace-nowrap">
              Question {Math.min(currentIdx + 1, total)} of {total}
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={onEndSession}
            className="rounded-xl px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((s) => !s)}
        className={[
          "fixed z-50 h-10 w-10 rounded-xl shadow-sm border bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all",
          isMobile ? "right-4 bottom-20" : "top-[120px]",
        ].join(" ")}
        style={isMobile ? {} : { left: sidebarOpen ? 316 : 12 }}
        title={sidebarOpen ? "Hide questions" : "Show questions"}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>

      {/* Layout */}
      <div className="mx-auto max-w-[1100px] px-2 md:px-4 py-4">
        <div className="relative">
          {/* Desktop sidebar */}
          <aside
            className={[
              "hidden md:block",
              "fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] w-[300px]",
              "bg-white border-r border-slate-200 shadow",
              "transition-transform",
              sidebarOpen ? "translate-x-0" : "-translate-x-[310px]",
            ].join(" ")}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-slate-200">
                <p className="font-semibold">Questions</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                    Correct
                  </span>
                  <span className="flex items-center gap-1 text-rose-700">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />{" "}
                    Incorrect
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />{" "}
                    Unanswered
                  </span>
                </div>
              </div>

              <ol className="p-3 space-y-3">
                {order.map((qi, i) => {
                  const qq = QUESTIONS[qi];
                  const a = answers[qq.id];
                  const st = !a
                    ? "unanswered"
                    : a === qq.correct
                    ? "correct"
                    : "incorrect";
                  const ring =
                    i === currentIdx
                      ? "ring-2 ring-purple-300"
                      : st === "correct"
                      ? "ring-2 ring-emerald-300"
                      : st === "incorrect"
                      ? "ring-2 ring-rose-300"
                      : "";
                  return (
                    <button
                      key={qq.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-full text-left rounded-xl border border-slate-200 bg-white hover:bg-slate-50 p-3 ${ring}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">Q{i + 1}</p>
                          <p className="text-sm text-slate-600 truncate">
                            {qq.stem.replace(/<[^>]*>/g, "")}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <span className="text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">
                              {qq.topic}
                            </span>
                            <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                              {qq.difficulty}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            st === "correct"
                              ? "bg-emerald-500"
                              : st === "incorrect"
                              ? "bg-rose-500"
                              : "bg-slate-300"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Main column */}
          <div
            className={`transition-all ${
              sidebarOpen && !isMobile ? "md:pl-[320px]" : "ml-0"
            }`}
          >
            <div className="mx-auto md:pr-[56px]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Vignette header */}
                <div className="p-5 border-b border-slate-200 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {q.vignetteTitle || "Clinical Vignette"}
                    </p>
                    <div className="mt-2">
                      <span className="mr-2 text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">
                        {q.topic}
                      </span>
                      <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">ID: {q.id}</div>
                </div>

                {/* Stem + options */}
                <div className="p-6 space-y-5" ref={highlightRef}>
                  <div
                    className="text-[15px] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: q.stem }}
                  />
                  <div className="space-y-3">
                    {q.options.map((opt) => {
                      const chosen = answers[q.id];
                      const revealedThis = !!revealed[q.id];
                      const isCorrect = opt.key === q.correct;
                      const stateStyle = revealedThis
                        ? isCorrect
                          ? "border-emerald-300 bg-emerald-50"
                          : chosen === opt.key
                          ? "border-rose-300 bg-rose-50"
                          : "border-slate-200 bg-white"
                        : "border-slate-200 bg-white hover:bg-slate-50";
                      return (
                        <label
                          key={opt.key}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer ${stateStyle}`}
                        >
                          <input
                            type="radio"
                            name={`ans-${q.id}`}
                            className="h-4 w-4 text-purple-600"
                            checked={chosen === opt.key}
                            onChange={() =>
                              setAnswers((a) => ({ ...a, [q.id]: opt.key }))
                            }
                            disabled={revealedThis}
                          />
                          <span className="text-[15px]">
                            <span className="font-medium">{opt.key}.</span>{" "}
                            {opt.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {!revealed[q.id] ? (
                      <>
                        <button
                          onClick={() =>
                            setRevealed((r) => ({ ...r, [q.id]: true }))
                          }
                          disabled={!answers[q.id]}
                          className="rounded-xl bg-purple-600 text-white px-4 py-2 disabled:opacity-50"
                        >
                          Submit Answer
                        </button>
                        <button
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [q.id]: undefined }))
                          }
                          className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                        >
                          Clear
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={
                            currentIdx >= total - 1
                              ? onEndSession
                              : () => setCurrentIdx((i) => i + 1)
                          }
                          className="rounded-xl bg-purple-600 text-white px-4 py-2"
                        >
                          {currentIdx >= total - 1
                            ? "Finish & View Results →"
                            : "Next Question →"}
                        </button>
                        <button
                          onClick={() =>
                            currentIdx > 0 && setCurrentIdx((i) => i - 1)
                          }
                          disabled={currentIdx === 0}
                          className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                        >
                          ← Previous
                        </button>
                      </>
                    )}
                  </div>

                  {/* Explanation */}
                  {revealed[q.id] && (
                    <div className="mt-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900 mb-2">
                          Explanation
                        </p>
                        <div className="space-y-2 text-slate-800">
                          {q.explanation_detail?.map((para, i) => (
                            <p key={i} className="leading-relaxed">
                              <RichText text={para} />
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile tools */}
              <div className="fixed md:hidden right-4 bottom-4 flex gap-2">
                <button
                  title="Toggle highlight mode"
                  onClick={() => setHighlightMode((v) => !v)}
                  className={`h-10 w-10 rounded-lg border shadow-sm ${
                    highlightMode
                      ? "border-purple-400 bg-purple-50 text-purple-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  🖍️
                </button>
                <button
                  title="Clear highlights"
                  onClick={clearHighlights}
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  🧽
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile question list */}
      <MobileQuestionList
        open={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        order={order}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        answers={answers}
      />

      {/* Start Overlay */}
      <StartOverlay open={!started} onPick={handleStart} />
    </div>
  );
}

/* ============================ Start Overlay ============================ */
function StartOverlay({ open, onPick }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={() => {}}
      title="Start Frailty Question Bank"
      maxW="max-w-lg"
      overlayClass="bg-white"
    >
      <p className="text-slate-600 mb-4">
        How would you like to order the questions?
      </p>
      <div className="grid gap-3">
        <button
          onClick={() => onPick("random")}
          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-left"
        >
          <p className="font-semibold text-slate-900">Randomised</p>
          <p className="text-sm text-slate-600">
            Shuffle questions for exam-style practice.
          </p>
        </button>
        <button
          onClick={() => onPick("number")}
          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-left"
        >
          <p className="font-semibold text-slate-900">By question number</p>
          <p className="text-sm text-slate-600">
            Go in sequence (Q1, Q2, Q3 …).
          </p>
        </button>
      </div>
    </Modal>
  );
}
