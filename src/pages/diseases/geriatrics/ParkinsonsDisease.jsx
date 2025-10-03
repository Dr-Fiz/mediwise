// src/pages/diseases/geriatrics/ParkinsonsDisease.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

/** ---------------- Inline RichText (bold/italics + color chips) ---------------- */
function RichText({ text = "" }) {
  let html = String(text);

  // escape raw < > & but keep our tags
  html = html
    .replace(/&(?![a-zA-Z#0-9]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // **bold** and *italic* / _italic_
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // ==yellow highlight==
  html = html.replace(
    /==(.+?)==/g,
    "<mark style='background-color:#FEF3C7' class='px-1 rounded'>$1</mark>"
  );

  // [yellow]...[/yellow], [green]...[/green], etc.
  const palette = {
    yellow: "#FEF3C7",
    green: "#D1FAE5",
    blue: "#E0F2FE",
    red: "#FFE4E6",
    purple: "#EDE9FE",
  };
  Object.entries(palette).forEach(([name, bg]) => {
    const re = new RegExp(`\\[${name}\\]([\\s\\S]+?)\\[\\/${name}\\]`, "gi");
    html = html.replace(
      re,
      `<mark style="background-color:${bg}" class="px-1 rounded">$1</mark>`
    );
  });

  // unescape our intended tags
  html = html
    .replace(/&lt;strong&gt;/g, "<strong>")
    .replace(/&lt;\/strong&gt;/g, "</strong>")
    .replace(/&lt;em&gt;/g, "<em>")
    .replace(/&lt;\/em&gt;/g, "</em>")
    .replace(/&lt;mark /g, "<mark ")
    .replace(/&lt;\/mark&gt;/g, "</mark>");

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ------------------------ Parkinson’s Question Bank ------------------------ */
const QUESTIONS = [
  {
    id: "PD-DEF-60001",
    topic: "Geriatrics • Parkinson’s disease — Definition & Core Concept",
    difficulty: "Medium",
    vignetteTitle: "What exactly is Parkinson’s disease (PD)?",
    stem: "A 68-year-old accountant develops a 2-year history of right-hand rest tremor, slowness in buttoning shirts, softer voice, and reduced arm swing on the right. Exam shows 4–6 Hz pill-rolling rest tremor (R>L), bradykinesia on finger tapping, cogwheel rigidity, and a narrow-based gait with decreased right arm swing. Cognition is intact. Which statement best captures the **core definition** of Parkinson’s disease?",
    options: [
      {
        key: "A",
        text: "A neurodegenerative synucleinopathy defined clinically by bradykinesia plus rest tremor and/or rigidity, with supportive features and clear responsiveness to dopaminergic therapy",
      },
      {
        key: "B",
        text: "An autoimmune demyelinating disease of the CNS causing relapsing focal deficits",
      },
      {
        key: "C",
        text: "A primary cerebellar degeneration with early ataxia and gaze-evoked nystagmus",
      },
      {
        key: "D",
        text: "A psychiatric condition characterized by functional tremor and normal neurologic examination",
      },
      {
        key: "E",
        text: "A vasculopathy with stepwise upper motor neuron signs after TIAs",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Parkinson’s disease (PD)** is a **neurodegenerative synucleinopathy** with **loss of dopaminergic neurons** in the **substantia nigra pars compacta**.",
      "- **Clinical definition:** **Bradykinesia** (slowness with decrement/sequence effect) **plus** either **rest tremor (4–6 Hz)** or **rigidity**; postural instability is typically **late**.",
      "- **Supportive features:** **Unilateral onset**, persistent **asymmetry**, **excellent levodopa response**, **levodopa-induced dyskinesias**, and **olfactory loss**.",
      "- **Exclusion “red flags”** suggest atypical parkinsonism (early falls, vertical gaze palsy, rapid progression, poor levodopa response).",
      "- [yellow]Essentials:[/yellow] **Bradykinesia + (rest tremor/rigidity)** with **dopaminergic responsiveness** → PD. 🚶‍♂️🧠",
      "**2️⃣ Why the other options are wrong**",
      "- **B (MS):** Immune-mediated **demyelination** with **relapses** and disseminated lesions; not a basal ganglia synucleinopathy.",
      "- **C (Cerebellar ataxia):** **Gait ataxia**, dysmetria, nystagmus—not **bradykinesia with rest tremor/cogwheeling**.",
      "- **D (Functional):** Inconsistent exam signs with distractibility/entrainment; PD has **objective**, reproducible signs and **levodopa response**.",
      "- **E (Vascular):** **Stepwise** UMN signs and frontal gait from **subcortical infarcts**; PD onset is **gradual** with **rest tremor** and **asymmetry**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Clinical diagnosis** — document **bradykinesia** (sequence effect on tapping), **rest tremor/rigidity**, **asymmetry**; smell testing optional. **Confirms?** ✅ PD likely by criteria.",
      "- **Next Diagnostic step:** **Levodopa trial** (clear motor benefit supports PD). Consider **MRI brain** only to exclude structural mimics if atypical features exist. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (when uncertainty):** **DaTscan (I-123 FP-CIT)** showing [blue]reduced striatal DAT uptake[/blue] distinguishes **degenerative parkinsonism** from **essential/functional tremor** (does **not** separate PD from atypical parkinsonism). **Confirms?** ✅ Supports presynaptic dopaminergic deficit.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & exercise[/green] (aerobic + resistance + balance), **physical/occupational therapy**, constipation/sleep counseling.",
      "- **First Line:** For motor symptoms impacting life: **levodopa/carbidopa** (most effective); alternatives/adjuncts: **dopamine agonists**, **MAO-B inhibitors**; **amantadine** for dyskinesias.",
      "- **Gold Standard (advanced motor fluctuations/dyskinesia):** **Deep brain stimulation (DBS)** of **STN** or **GPi** in appropriate candidates; [green]optimize levodopa timing[/green].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregation (Lewy pathology) in **substantia nigra** → **dopamine depletion** in **dorsal striatum**.",
      "- Circuit effects: **↑ indirect pathway / ↓ direct pathway** → **bradykinesia/rigidity**; resting tremor linked to **brainstem–thalamic loops**.",
      "- Nonmotor systems (olfactory bulb, autonomic, limbic) are involved early → **hyposmia**, **constipation**, **REM sleep behavior disorder** in many.",
      "- [blue]Levodopa[/blue] replenishes dopamine, **improving bradykinesia/rigidity/tremor**; chronic exposure may cause **dyskinesias** (striatal plasticity changes).",
      "**6️⃣ Symptoms — core pattern recognition**",
      "- **Bradykinesia** 🐢 → slow initiation, **decrement** on repetitive tasks.",
      "- **Rest tremor** ✋ (4–6 Hz), **asymmetric** (R>L), decreases with action.",
      "- **Rigidity** 🧱 (lead-pipe/cogwheel), **reduced arm swing**, hypomimia, hypophonia.",
      "- **Nonmotor** 🌙🦠 → hyposmia, constipation, RBD, depression/anxiety, pain, autonomic changes (orthostasis).",
      "- [purple]Pearl:[/purple] ==If it starts **asymmetrically** with **rest tremor** and **bradykinesia**, and **loves levodopa**, think **PD**==",
    ],
  },
  {
    id: "PD-SX-60002",
    topic:
      "Geriatrics • Parkinson’s disease — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle:
      "Spot the Parkinson’s pattern: asymmetric rest tremor, bradykinesia, rigidity",
    stem: "A 67-year-old right-handed teacher notices 18 months of right-hand rest tremor that eases with action, slowing when typing, smaller handwriting, and a softer voice. Family notes reduced right arm swing and mild stooping. She struggles with buttoning by evening and feels constipated. Sense of smell has faded over years. Which clinical constellation best identifies Parkinson’s disease?",
    options: [
      {
        key: "A",
        text: "Wide-based gait with early falls, vertical gaze palsy, and poor levodopa response",
      },
      {
        key: "B",
        text: "Stepwise executive dysfunction with urinary urgency after TIAs",
      },
      {
        key: "C",
        text: "Cerebellar ataxia with intention tremor and dysmetria",
      },
      {
        key: "D",
        text: "Asymmetric 4–6 Hz rest tremor that improves with action, bradykinesia with sequence effect, rigidity, hypophonia/hypomimia, micrographia; nonmotor features like hyposmia, constipation, RBD",
      },
      {
        key: "E",
        text: "Fluctuating attention with early well-formed visual hallucinations and symmetric parkinsonism",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Parkinson's disease (PD)** presents with **bradykinesia** plus **rest tremor** and/or **rigidity**, typically **asymmetric** at onset.",
      "- Classic symptom signatures: **4–6 Hz rest tremor** that **diminishes with action**, **sequence effect** (speed/amplitude decrement) on repetitive tasks, **micrographia**, **hypophonia**, **hypomimia**, and **reduced arm swing**.",
      "- **Nonmotor** prodromes frequently accompany: **hyposmia**, **constipation**, **REM sleep behavior disorder (RBD)**, anxiety/depression, pain, and autonomic symptoms (orthostasis).",
      "- **Levodopa responsiveness** is common and supportive. [yellow]==Asymmetric rest tremor + bradykinesia + rigidity with levodopa benefit → PD==[/yellow] 🚶‍♂️🧠",
      "**2️⃣ Why the other options are wrong**",
      "- **A (PSP):** Early falls, **vertical gaze palsy**, axial rigidity, poor levodopa response → **atypical parkinsonism**, not PD.",
      "- **B (VaD):** **Stepwise** course with executive/gait issues post-TIAs—vascular cognitive impairment, not PD motor syndrome.",
      "- **C (Cerebellar):** **Intention** tremor and ataxia (dysmetria) point to cerebellum, not basal ganglia **rest** tremor/rigidity.",
      "- **E (DLB):** Early **fluctuations** and **well-formed visual hallucinations** with symmetric parkinsonism favor **DLB**; PD hallucinations usually arise later or from meds.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Clinical exam** showing **bradykinesia** (sequence effect on tapping/hand open-close) **plus** rest tremor/rigidity; document **asymmetry**. **Confirms?** ✅ PD likely.",
      "- **Next Diagnostic step:** **Levodopa trial** (objective benefit supports PD). **MRI brain** only if atypical features (early falls, gaze palsy, rapid progression). **Confirms?** ➕ Supportive/excludes mimics.",
      "- **Best Diagnostic Step (if doubt):** **DaTscan (I-123 FP-CIT)** → [blue]reduced striatal DAT uptake[/blue] indicates **degenerative parkinsonism** (distinguishes from essential/functional tremor). **Confirms?** ✅ Supports presynaptic deficit.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Exercise is medicine[/green] — aerobic, resistance, balance; **PT/OT**, speech therapy (LSVT LOUD), constipation plan, sleep optimization.",
      "- **First Line:** **Levodopa/carbidopa** for meaningful motor impact; consider **MAO-B inhibitor** or **dopamine agonist** based on age/comorbidities; **amantadine** for dyskinesia.",
      "- **Gold Standard (advanced fluctuations/dyskinesia):** **DBS** (STN/GPi) in appropriate candidates; [green]individualize levodopa timing and fractionation[/green].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregates in **substantia nigra pars compacta** → **dopamine depletion** in dorsal striatum.",
      "- Circuit shift: **↑ indirect** and **↓ direct** basal ganglia pathway activity → **bradykinesia/rigidity**; tremor linked to pallido–thalamo–brainstem loops.",
      "- Early involvement of **olfactory/autonomic/REM** nuclei explains **hyposmia**, **constipation**, **RBD**.",
      "**6️⃣ Symptoms — quick pattern map**",
      "- **Bradykinesia** 🐢 → slow initiation, **decrement** on repetitive tasks.",
      "- **Rest tremor** ✋ 4–6 Hz, **asymmetric**, improves with action.",
      "- **Rigidity** 🧱 with **cogwheeling**, reduced arm swing, **stooped posture**.",
      "- **Hypomimia/hypophonia/micrographia** 🎭🗣️✍️.",
      "- **Nonmotor** 🌙🦠 → **hyposmia**, **constipation**, **RBD**, mood/autonomic symptoms.",
      "- [purple]Pearl:[/purple] ==Asymmetry + rest tremor + sequence-effect bradykinesia is your PD fingerprint==",
    ],
  },
  {
    id: "PD-SIGNS-60003",
    topic: "Geriatrics • Parkinson’s disease — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to Parkinson’s disease?",
    stem: "A 69-year-old develops 2 years of right-hand tremor and slowness. On exam: 4–6 Hz pill-rolling rest tremor (R>L) that decreases with action, bradykinesia with clear decrement on rapid finger taps (sequence effect), cogwheel rigidity at the right wrist, hypomimia, hypophonia, and reduced right arm swing with a narrow-based gait. Pull test shows one corrective step without falling. Which **examination sign cluster** best fits Parkinson’s disease?",
    options: [
      {
        key: "A",
        text: "Wide-based gait with early frequent falls, vertical gaze palsy, retrocollis, and poor levodopa response",
      },
      {
        key: "B",
        text: "Irregular, distractible tremor that entrains to contralateral rhythmic tapping with otherwise normal tone",
      },
      {
        key: "C",
        text: "Asymmetric 4–6 Hz rest tremor that lessens with action, bradykinesia with sequence effect, cogwheel rigidity, hypomimia/hypophonia, and reduced arm swing; postural instability late",
      },
      {
        key: "D",
        text: "Prominent limb ataxia with intention tremor, dysmetria, and gaze-evoked nystagmus",
      },
      {
        key: "E",
        text: "Spasticity with hyperreflexia, extensor plantar responses, and scissoring gait",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Core PD motor triad:** **bradykinesia** 🐢 with **sequence effect** (progressive decrement on repetitive movements) **plus** **rest tremor** ✋ (4–6 Hz, “pill-rolling,” **decreases with action**) and/or **rigidity** 🧱 (lead-pipe/cogwheel).",
      "- **Asymmetry at onset** (R>L) and **reduced arm swing** are highly **supportive** bedside clues; **postural instability** typically **emerges later**.",
      "- **Facial hypomimia** 🎭 and **hypophonia** 🗣️ are common soft signs of hypokinetic state.",
      "- [yellow]Pattern lock:[/yellow] **Asymmetric rest tremor + sequence-effect bradykinesia + rigidity** with a narrow-based gait → **PD**.",
      "**2️⃣ Why the other options are wrong**",
      "- **A (PSP):** **Early falls**, **vertical gaze palsy**, axial rigidity, and **poor levodopa response** → **progressive supranuclear palsy**, not PD.",
      "- **B (Functional tremor):** **Distractible**, **entrainable** tremor with normal tone/posture suggests a **functional** etiology, not degenerative parkinsonism.",
      "- **D (Cerebellar):** **Intention tremor**, dysmetria, and nystagmus indicate **cerebellar ataxia**, not PD’s **rest** tremor and rigidity.",
      "- **E (Pyramidal):** **Spasticity**, **hyperreflexia**, **Babinski** = **UMN** signs (e.g., myelopathy, stroke), not PD (a basal ganglia disorder).",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Clinical exam** documenting **bradykinesia** (decrement on tapping/hand open–close), **rest tremor/rigidity**, and **asymmetry**. **Confirms?** ✅ PD likely by clinical criteria.",
      "- **Next Diagnostic step:** **Levodopa trial** (objective improvement supports PD). **MRI brain** only if atypical signs (early falls, gaze palsy, rapid progression). **Confirms?** ➕ Supportive/excludes mimics.",
      "- **Best Diagnostic Step (if uncertainty):** **DaTscan (I-123 FP-CIT)** → [blue]reduced striatal DAT uptake[/blue] indicates **presynaptic dopaminergic deficit** (distinguishes PD from **essential/functional tremor**). **Confirms?** ✅ Supports degenerative parkinsonism.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Exercise is disease-modifying-adjacent[/green] — aerobic + resistance + balance; **PT/OT**, **speech therapy** (LSVT LOUD), constipation/sleep plans.",
      "- **First Line:** **Levodopa/carbidopa** for meaningful motor impairment; alternatives/adjuncts: **MAO-B inhibitors**, **dopamine agonists**; **amantadine** for dyskinesias.",
      "- **Gold Standard (advanced motor complications):** **Deep brain stimulation (STN/GPi)** in appropriate candidates; [green]optimize levodopa timing and fractionation[/green].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregation in **substantia nigra pars compacta** → **dopamine depletion** in **dorsal striatum**.",
      "- Basal ganglia circuitry shifts (**↑ indirect / ↓ direct pathway**) produce **bradykinesia/rigidity**; rest tremor involves **pallido–thalamo–brainstem** loops.",
      "- Nonmotor nuclei involvement explains **hypomimia, hypophonia**, and autonomic features; **postural instability** reflects later axial network involvement.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Bradykinesia with sequence effect** 🐢 → amplitude/speed **decrement** on rapid taps.",
      "- **Rest tremor** ✋ 4–6 Hz **decreases with action**; re-emerges with posture (re-emergent tremor).",
      "- **Rigidity** 🧱 (lead-pipe/cogwheel) ± **Froment’s maneuver** accentuation.",
      "- **Asymmetry & reduced arm swing** ↔ narrow-based hypokinetic gait; **pull test** normal or mildly impaired **early**.",
      "- **Hypomimia/hypophonia/micrographia** 🎭🗣️✍️ complete the PD bedside constellation.",
      "- [purple]Pearl:[/purple] ==If it’s **asymmetric**, **resting**, and **decrements** with repetition, your exam is whispering **Parkinson’s**==",
    ],
  },
  {
    id: "PD-REDFLAGS-60004",
    topic: "Geriatrics • Parkinson’s disease — Red Flags",
    difficulty: "Medium",
    vignetteTitle: "When it’s not typical PD: spot the red flags",
    stem: "A 71-year-old with 6 months of symmetric bradykinesia and rigidity (minimal rest tremor) has repeated backward falls, early dysphagia with choking, urinary retention requiring catheterization, and lightheadedness with standing (BP drop 35/18 mmHg). Exam shows vertical saccade slowing and impaired downgaze. There has been **little response** to an adequate levodopa trial. Which feature cluster most strongly signals a RED FLAG for atypical or secondary parkinsonism rather than idiopathic PD?",
    options: [
      {
        key: "A",
        text: "Unilateral rest tremor that improves with action, micrographia, and good levodopa response over 2 years",
      },
      {
        key: "B",
        text: "Gradual asymmetric onset with reduced arm swing and hyposmia",
      },
      {
        key: "C",
        text: "Early recurrent falls, vertical gaze palsy, severe autonomic failure (urinary retention/orthostasis), symmetric onset with poor levodopa response",
      },
      {
        key: "D",
        text: "Mild constipation and REM sleep behavior disorder with classic rest tremor",
      },
      {
        key: "E",
        text: "Levodopa-induced dyskinesias after years of treatment",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Early postural instability/falls**, **vertical gaze palsy**, and **severe autonomic failure** (urinary retention, dramatic orthostatic hypotension) are hallmark **red flags** for **atypical parkinsonism** (e.g., **PSP** for gaze palsy/early falls; **MSA** for profound dysautonomia).",
      "- **Symmetric onset** without a classic rest tremor plus **poor or transient levodopa response** further argue **against idiopathic PD**.",
      "- **Rapid progression** with early **bulbar symptoms** (dysphagia/stridor) and **axial rigidity** points to non-PD syndromes that require different counseling and workup.",
      "- [yellow]Pattern lock:[/yellow] **Falls early + gaze palsy + dysautonomia + poor levodopa** → **not typical PD**. 🚩",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Classic **idiopathic PD**: unilateral rest tremor, micrographia, **good levodopa response**—**not** a red flag.",
      "- **B:** **Asymmetric** onset with hyposmia is **supportive of PD**, not concerning.",
      "- **D:** **Constipation** and **RBD** can precede **typical PD**; without other danger signs, they aren’t red flags.",
      "- **E:** **Levodopa-induced dyskinesias** occur in long-standing PD and **support dopaminergic responsiveness**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** Reassess **history/exam** for red flags: **early falls**, **vertical gaze palsy**, **rapid progression**, **bulbar dysfunction**, **disproportionate dysautonomia**, **pyramidal/cerebellar signs**, **poor levodopa response**. **Confirms?** ❌ Raises suspicion for atypical/secondary causes.",
      "- **Next Diagnostic step →** **MRI brain** with attention to **midbrain atrophy (‘hummingbird sign’), putaminal rim changes**, **cerebellar/pons atrophy**; **spine MRI** if myelopathy signs; **orthostatic vitals**/**autonomic testing** (QSART/tilt) for MSA. **Confirms?** ➕ Provides syndrome-specific support/excludes structural causes.",
      "- **Best Diagnostic Step →** **Targeted ancillary tests** by phenotype: **DaTscan** (confirms presynaptic dopaminergic deficit but won’t separate PD from atypicals), **FDG-PET** (network patterns), **EMG laryngoscopy** if stridor, **CSF** only if inflammatory/normal-pressure hydrocephalus (NPH) suspected. **Confirms?** ✅ Refines diagnosis and rules out mimics.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Safety first[/green] — **fall prevention**, swallowing evaluation (**speech & swallow**), **orthostatic management** (salt, fluids, compression, **midodrine/droxidopa**), bowel/bladder plan.",
      "- **First Line:** Trial **optimized levodopa** (even if limited), **PT/OT**, **speech therapy**; for MSA dysautonomia use **autonomic-focused therapy**; for PSP prioritize **gaze/axial strategies** and assistive devices.",
      "- **Gold Standard:** [green]Early goals-of-care & multidisciplinary care[/green] with a **movement-disorders specialist**; [red]avoid dopamine-blocking drugs[/red] (metoclopramide, typical antipsychotics). Consider **botulinum toxin** for dystonia, **feeding strategies** if aspiration risk.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Idiopathic PD:** **α-synuclein** loss in **substantia nigra** → **dopamine depletion**; usually **asymmetric**, **rest tremor**, **good levodopa**.",
      "- **Atypicals:**\n  - **PSP (tauopathy):** **Vertical gaze palsy**, **early falls**, axial rigidity → poor levodopa.\n  - **MSA (synucleinopathy):** **Severe autonomic failure**, cerebellar or parkinsonian variant, stridor.\n  - **CBD (tauopathy):** **Asymmetric apraxia**, **alien limb**, cortical sensory loss.\n  - **DLB (synucleinopathy):** **Early hallucinations/fluctuations** with parkinsonism.\n  - **VaP (vascular):** **Lower-body parkinsonism**, stepwise progression, WM disease.",
      "- **Secondary causes:** **Drug-induced** (antipsychotics), **normal-pressure hydrocephalus**, **Wilson disease** (younger), **structural/vascular** lesions.",
      "**6️⃣ Red-flag checklist — escalate workup when you see…**",
      "- **Early frequent falls** (≤3 years), **vertical gaze palsy**, **axial rigidity**. ",
      "- **Severe autonomic failure** (urinary retention, orthostatic hypotension), **stridor**.",
      "- **Symmetric onset**, **absence of rest tremor**, **rapid progression**, **poor levodopa response**.",
      "- **Cerebellar signs**, **pyramidal signs**, **cortical signs** (apraxia, alien limb), **early dysphagia**.",
      "- **Red flags for secondary causes:** abrupt onset (stroke), exposure to **D2 blockers**, **NPH** triad, structural lesions on imaging.",
      "- [purple]Pearl:[/purple] ==If it falls early, looks vertical, faints on standing, and shrugs at levodopa—**rethink PD**==",
    ],
  },
  {
    id: "PD-DDX-60005",
    topic: "Geriatrics • Parkinson’s disease — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle:
      "Rest tremor, sequence-effect slowness: which diagnosis fits best?",
    stem: "A 66-year-old right-handed machinist has 18 months of right-hand 4–6 Hz rest tremor that eases with action. He reports slowness with buttoning and smaller handwriting. Family notes reduced right arm swing and mild stoop. Exam: asymmetric rest tremor (R>L), bradykinesia with decrement on rapid finger taps, cogwheel rigidity at the right wrist, hypomimia, hypophonia, narrow-based gait with reduced right arm swing; pull test requires one step. Cognition intact. Which diagnosis best explains this presentation?",
    options: [
      { key: "A", text: "Essential tremor (ET)" },
      {
        key: "B",
        text: "Drug-induced parkinsonism (antipsychotic/metoclopramide exposure)",
      },
      { key: "C", text: "Parkinson’s disease (idiopathic)" },
      { key: "D", text: "Progressive supranuclear palsy (PSP)" },
      { key: "E", text: "Cerebellar outflow tremor from degeneration or MS" },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Asymmetric onset** with **4–6 Hz pill-rolling *rest* tremor** that **improves with action**, plus **bradykinesia with sequence effect** and **rigidity**, is the archetypal **Parkinson’s disease (PD)** profile. ",
      "- Narrow-based **hypokinetic gait** with **reduced arm swing** and soft signs (**hypomimia**, **hypophonia**) reinforce PD. ",
      "- **Postural instability** is mild/late (single corrective step), also consistent with early PD rather than atypicals. ",
      "- [yellow]Pattern lock:[/yellow] **Bradykinesia + (rest tremor/rigidity)** with **asymmetry** and **levodopa responsiveness** (when tried) → **PD**. 🚶‍♂️🧠",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Essential tremor:** Typically **bilateral action/postural tremor** (hands/head/voice), **improves with alcohol**, **no bradykinesia/rigidity**, and **no true rest tremor** as the dominant feature.",
      "- **B. Drug-induced parkinsonism:** Tends to be **symmetric** and **lacks classic rest tremor**; history of **D2 blocker** (antipsychotic/metoclopramide) exposure is key—absent here.",
      "- **D. PSP:** **Early falls**, **vertical gaze palsy**, **axial rigidity**, and **poor levodopa response**; tremor is usually minimal and **postural instability is early**, unlike this case.",
      "- **E. Cerebellar tremor:** **Intention tremor**, **ataxia**, dysmetria, **wide-based gait**; not an **asymmetric rest tremor** with cogwheeling and sequence-effect slowness.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Clinical diagnosis** — document **bradykinesia** (decrement on repetitive tasks) **plus** rest tremor/rigidity; note **asymmetry**. **Confirms?** ✅ PD likely.",
      "- **Next Diagnostic step:** Trial **levodopa/carbidopa** to demonstrate **objective motor benefit**; **smell testing** optional; **review meds** for dopamine blockers. **Confirms?** ➕ Supports PD or reveals mimics.",
      "- **Best Diagnostic Step (if doubt):** **DaTscan (I-123 FP-CIT)** → [blue]reduced striatal DAT uptake[/blue] confirms **presynaptic dopaminergic deficit** (distinguishes PD from **ET/functional tremor**, but not from atypicals). **Confirms?** ✅ Supports degenerative parkinsonism.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education + exercise[/green] (aerobic/resistance/balance), **PT/OT**, speech therapy PRN; manage constipation/sleep, fall prevention.",
      "- **First Line:** **Levodopa/carbidopa** for meaningful motor impact; alternatives/adjuncts: **MAO-B inhibitor**, **dopamine agonist** (younger/low psychosis risk); **amantadine** for dyskinesias.",
      "- **Gold Standard (advanced motor complications):** **DBS** of **STN** or **GPi** in appropriate candidates; [green]optimize levodopa timing/fractionation[/green].",
      "**5️⃣ Full Pathophysiology Explained (DDx lens)**",
      "- **PD:** **α-synuclein** pathology in **SNpc** → **dopamine loss** in dorsal striatum → **↑ indirect/↓ direct** pathway → **bradykinesia/rigidity**; brainstem–thalamo loops contribute to **rest tremor**.",
      "- **ET:** Cerebellothalamic network oscillation → **action** tremor without basal ganglia hypokinesia.",
      "- **Drug-induced:** **D2 blockade** at striatum → symmetric parkinsonism, often resolves with withdrawal.",
      "- **PSP:** **Tauopathy** with midbrain degeneration → **vertical gaze palsy**, axial rigidity, early falls.",
      "- **Cerebellar tremor:** Dentato–rubro–thalamic pathway lesions → **intention tremor** + ataxia.",
      "**6️⃣ Symptoms — quick pattern map**",
      "- **PD:** **Asymmetric** rest tremor ✋ + **sequence-effect bradykinesia** 🐢 + **rigidity** 🧱; narrow-based hypokinetic gait.",
      "- **ET:** **Bilateral action/postural tremor** 🫱, better with alcohol, no rigidity/bradykinesia.",
      "- **Drug-induced:** **Symmetric** parkinsonism after **D2 blockers** 💊.",
      "- **PSP:** **Early falls** ↘️ + **vertical gaze palsy** 👀.",
      "- **Cerebellar:** **Intention tremor/ataxia** 🎯🚶.",
      "- [purple]Pearl:[/purple] ==A tremor that **rests**, a movement that **decrements**, and an onset that’s **asymmetric**—that’s your PD fingerprint==",
    ],
  },
  {
    id: "PD-INV-60006",
    topic: "Geriatrics • Parkinson’s disease — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test when you suspect Parkinson’s disease",
    stem: "A 65-year-old develops 18 months of right-hand 4–6 Hz rest tremor, slowness with a sequence effect on repetitive tapping, and cogwheel rigidity. Gait is narrow-based with reduced right arm swing. There are no early falls, gaze palsy, or red flags. Which **single best initial investigation** should you pursue?",
    options: [
      {
        key: "A",
        text: "Clinical examination establishing bradykinesia plus rest tremor and/or rigidity, with a documented response to levodopa trial",
      },
      { key: "B", text: " MRI brain with and without contrast" },
      { key: "C", text: "DaTscan (I-123 FP-CIT) dopamine transporter SPECT" },
      { key: "D", text: "FDG-PET brain metabolic imaging" },
      {
        key: "E",
        text: "Serum copper/ceruloplasmin and 24-hour urinary copper",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Parkinson’s disease is a *clinical* diagnosis**: the best initial step is a **focused neurologic exam** demonstrating **bradykinesia** *plus* **rest tremor and/or rigidity** with **asymmetry**.",
      "- A **levodopa trial** that produces clear, objective improvement is a **supportive bedside biomarker** for idiopathic PD.",
      "- Early routine imaging adds little when **no red flags** are present; start by **clinically confirming the phenotype**.",
      "- [yellow]Essentials:[/yellow] **History + exam ± levodopa response** are the **first-line investigation**. 🧠🩺",
      "**2️⃣ Why the other options are wrong**",
      "- **B. MRI brain:** Useful to **exclude structural/atypical causes** *when red flags exist*, but not first-line in a classic PD presentation.",
      "- **C. DaTscan:** Confirms a **presynaptic dopaminergic deficit** and helps distinguish PD from **essential/functional tremor**, yet it is **ancillary** after the clinical exam.",
      "- **D. FDG-PET:** Research/complex atypical cases tool; **not** an initial test for straightforward PD.",
      "- **E. Copper studies:** For **Wilson disease** in younger/atypical cases; **low-yield** in a typical 65-year-old PD picture.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **Clinical exam** documenting **bradykinesia** (sequence effect) + **rest tremor/rigidity**, **asymmetry**, and absence of **red flags**. **Confirms?** ✅ Yes—PD likely.",
      "- **Next Diagnostic step →** **Levodopa/carbidopa trial** with objective benefit (timed tapping, UPDRS). **Confirms?** ➕ Supports idiopathic PD.",
      "- **Best Diagnostic Step (if uncertainty) →** **DaTscan** showing [blue]↓ striatal DAT uptake[/blue] to separate **degenerative parkinsonism** from **ET/functional**. **Confirms?** ✅ Supports presynaptic deficit (doesn’t distinguish PD vs atypicals).",
      "- **Adjuncts →** **MRI** only if **atypical features** (early falls, gaze palsy, rapid progression) or secondary causes suspected.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Exercise is medicine[/green] (aerobic/resistance/balance), **PT/OT**, speech therapy (LSVT), constipation/sleep optimization, education.",
      "- **First Line:** **Levodopa/carbidopa** for functional impact; consider **MAO-B inhibitor** or **dopamine agonist** based on age/comorbidities; **amantadine** for dyskinesia.",
      "- **Gold Standard (advanced motor complications):** **Deep brain stimulation (STN/GPi)** with optimized **levodopa timing/fractionation**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregates in **substantia nigra pars compacta** → **dopamine loss** in dorsal striatum.",
      "- Basal ganglia **circuit imbalance** (↑ indirect / ↓ direct pathway) drives **bradykinesia/rigidity**; **rest tremor** arises from oscillations in pallido–thalamo–brainstem loops.",
      "- **Levodopa** restores synaptic dopamine → **improves hypokinesia and rigidity**, validating the dopaminergic mechanism.",
      "**6️⃣ Symptoms — think of PD when you see…**",
      "- **Asymmetric rest tremor** ✋ + **sequence-effect bradykinesia** 🐢 + **rigidity** 🧱.",
      "- **Micrographia, hypophonia, hypomimia** 🎭; **narrow-based gait** with reduced arm swing.",
      "- [purple]Pearl:[/purple] ==If the **exam** already spells PD, make that your **first test**—then use DaTscan/MRI only when the story is fuzzy==",
    ],
  },
  {
    id: "PD-GOLD-60007",
    topic: "Geriatrics • Parkinson’s disease — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle:
      "What definitively establishes Parkinson’s disease etiology?",
    stem: "A 68-year-old with 3 years of asymmetric rest tremor, bradykinesia with decrement, and rigidity has clear improvement on levodopa. MRI is unremarkable. DaTscan shows reduced striatal uptake. Family asks: “What is the *gold standard* test that proves this is Parkinson’s disease?”",
    options: [
      {
        key: "A",
        text: "MRI brain with and without contrast showing normal structure",
      },
      {
        key: "B",
        text: "DaTscan (I-123 FP-CIT) with reduced striatal dopamine transporter uptake",
      },
      {
        key: "C",
        text: "Marked clinical response to levodopa documented on UPDRS",
      },
      {
        key: "D",
        text: "Transcranial sonography showing substantia nigra hyperechogenicity",
      },
      {
        key: "E",
        text: "Neuropathology demonstrating α-synuclein–positive Lewy bodies/neurites in substantia nigra and related circuits sufficient to explain parkinsonism",
      },
    ],
    correct: "E",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gold standard = tissue diagnosis**: **α-synuclein–positive Lewy bodies/neurites** in **substantia nigra pars compacta** and related pathways on neuropathology. 🔬",
      "- Histopathology directly identifies the **synucleinopathy** underlying PD and distinguishes it from mimics/atypicals; it also quantifies **co-pathology**.",
      "- In life we rely on **clinical criteria + supportive tests**, but definitive proof is **post-mortem** (biopsy is rarely indicated).",
      "- [yellow]Bottom line:[/yellow] **DaTscan, MRI, and levodopa response support** PD; **Lewy bodies confirm** it.",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI:** Useful to **exclude structural causes**; cannot prove PD.",
      "- **B. DaTscan:** Shows **presynaptic dopaminergic deficit**, but doesn’t specify **PD vs atypical parkinsonism**.",
      "- **C. Levodopa response:** Highly supportive, not definitive; some atypicals respond early.",
      "- **D. TCS SN hyperechogenicity:** Supportive in some cohorts, **not diagnostic** nor universally available.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **Clinical criteria**: **bradykinesia** + (**rest tremor**/**rigidity**) with **asymmetry**, no red flags. **Confirms?** ✅ Likely PD.",
      "- **Next Diagnostic step →** **Levodopa trial** with objective improvement; **MRI** if atypical features to rule out mimics. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (when in doubt) →** **DaTscan** ([blue]↓ striatal DAT[/blue]) to distinguish **degenerative parkinsonism** from **ET/functional**. **Confirms?** ✅ Supports but not definitive.",
      "- **Gold Standard →** **Neuropathology** showing **Lewy pathology** in SNpc and related circuits. **Confirms?** ✅✅ Definitive.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Exercise + rehab[/green] (aerobic/resistance/balance), **PT/OT**, **speech therapy** (LSVT), constipation/sleep plans.",
      "- **First Line:** **Levodopa/carbidopa** (most effective); **MAO-B inhibitors** or **dopamine agonists** as alternatives/adjuncts; **amantadine** for dyskinesia.",
      "- **Gold Standard (advanced motor complications):** **DBS** (STN/GPi) in suitable candidates; [green]optimize levodopa timing/fractionation[/green].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregates in **SNpc** → **dopamine loss** in dorsal striatum → **↑ indirect / ↓ direct** basal ganglia pathway activity → **bradykinesia/rigidity**; tremor from oscillatory thalamo–brainstem loops.",
      "- Spread to **olfactory/autonomic/limbic** circuits explains **hyposmia**, **constipation**, **RBD**, mood/autonomic symptoms.",
      "**6️⃣ Symptoms — pattern recognition link**",
      "- **Asymmetric rest tremor** ✋, **sequence-effect bradykinesia** 🐢, **rigidity** 🧱, narrow-based hypokinetic gait; **levodopa responsiveness**.",
      "- [purple]Pearl:[/purple] ==In clinic, **examination + levodopa** drives diagnosis; in pathology, **Lewy bodies** settle the debate==",
    ],
  },
  {
    id: "PD-ETIO-60008",
    topic: "Geriatrics • Parkinson’s disease — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle: "What actually causes Parkinson’s disease?",
    stem: "A 66-year-old with asymmetric rest tremor, bradykinesia, and rigidity asks, “What causes Parkinson’s—and why me?” He has long-standing hyposmia and constipation. No antipsychotic use or toxin exposure. MRI is unremarkable. Which underlying **etiology** best explains his syndrome?",
    options: [
      {
        key: "A",
        text: "Autoimmune demyelination with oligoclonal bands in CSF",
      },
      {
        key: "B",
        text: "α-Synuclein aggregation (Lewy bodies/neurites) causing nigrostriatal dopaminergic neuron loss; multifactorial with aging, genetic susceptibility (e.g., LRRK2/GBA), and environmental factors",
      },
      {
        key: "C",
        text: "Acute lacunar infarcts of the internal capsule causing stepwise parkinsonism",
      },
      {
        key: "D",
        text: "Primary cerebellar degeneration producing intention tremor and ataxia",
      },
      {
        key: "E",
        text: "Pure dopamine deficiency from dietary restriction without structural brain change",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Parkinson’s disease (PD)** is a **synucleinopathy**: misfolded **α-synuclein** accumulates as **Lewy bodies/neurites**, especially in the **substantia nigra pars compacta**, leading to **dopaminergic neuron loss** and **striatal dopamine depletion**.",
      "- Etiology is **multifactorial**: **aging** (mitochondrial stress), **genetic susceptibility** (e.g., **LRRK2**, **GBA**, PRKN/PINK1, SNCA), and **environmental hits** (pesticides, solvents; lower smoking/caffeine exposure correlates inversely).",
      "- **Prodromal nonmotor features** (hyposmia, constipation, REM sleep behavior disorder) reflect **early brainstem/autonomic involvement** before motor signs.",
      "- [yellow]Essentials:[/yellow] **α-syn aggregation + DA neuron loss** across a background of **age + genes + environment** explains typical PD.",
      "**2️⃣ Why the other options are wrong**",
      "- **A (MS):** Immune **demyelination** with relapses; not a basal ganglia **synucleinopathy**.",
      "- **C (Vascular parkinsonism):** **Stepwise** course, **lower-body gait** predominance, poor levodopa response, extensive WM disease—different from idiopathic PD.",
      "- **D (Cerebellar degeneration):** **Ataxia/intention tremor** dominate; PD has **rest tremor/bradykinesia/rigidity**.",
      "- **E (Dietary dopamine):** Peripheral intake doesn’t cause isolated central DA deficiency; PD is **neurodegenerative**, not nutritional.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Clinical criteria** — **bradykinesia** + (rest tremor/rigidity), **asymmetry**, nonmotor prodrome. **Confirms?** ✅ PD likely.",
      "- **Next Diagnostic step:** **Levodopa trial** (objective benefit supports idiopathic PD); **MRI** only if atypical features. **Confirms?** ➕ Excludes mimics.",
      "- **Best Diagnostic Step (when uncertain):** **DaTscan** showing [blue]↓ striatal DAT uptake[/blue] → presynaptic dopaminergic deficit (distinguishes PD from ET/functional). **Confirms?** ✅ Supports PD biology (not specific vs atypicals).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Exercise & rehab[/green] (aerobic/resistance/balance), education, **PT/OT**, constipation/sleep strategies.",
      "- **First Line:** **Levodopa/carbidopa**; consider **MAO-B inhibitor** or **dopamine agonist** based on age/psychiatric risk; **amantadine** for dyskinesias.",
      "- **Gold Standard (advanced motor complications):** **DBS (STN/GPi)** with optimized levodopa timing/fractionation; manage nonmotor symptoms systematically.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Molecular:** Misfolded **α-synuclein** aggregates → **proteostasis failure**, **mitochondrial dysfunction**, **oxidative stress**, **impaired autophagy**.",
      "- **Anatomy:** Earliest involvement in **olfactory bulb** and **dorsal motor nucleus of the vagus** → **hyposmia/constipation**; later **SNpc** loss → motor triad; limbic/cortical spread explains mood/cognitive features.",
      "- **Circuitry:** **↓ direct** and **↑ indirect** basal ganglia pathways → **bradykinesia/rigidity**; **tremor** from oscillatory pallido–thalamo–brainstem loops.",
      "- **Genetics:** **LRRK2** (dominant) often typical PD; **GBA** increases risk and cognitive complications; **PINK1/PRKN** (recessive) in early-onset forms.",
      "- [blue]Concept link:[/blue] Aging lowers neuronal resilience; genes and toxins tilt the balance toward **α-syn** misfolding → PD.",
      "**6️⃣ Symptoms — cause → effect mapping**",
      "- **α-syn in olfactory/autonomic nuclei** → **hyposmia**, **constipation**, **RBD** (prodrome).",
      "- **SNpc neuron loss** → **bradykinesia/rigidity**, **rest tremor**; **levodopa** responsiveness.",
      "- **Limbic/cortical spread** → mood/cognitive/autonomic issues later.",
      "- [purple]Pearl:[/purple] ==Think PD when **α-syn biology** meets **asymmetric bradykinesia + rest tremor** on a canvas of **age + genes + environment**==",
    ],
  },
  {
    id: "PD-COMP-60009",
    topic: "Geriatrics • Parkinson’s disease — Complications",
    difficulty: "Medium",
    vignetteTitle:
      "What high-impact complications should you anticipate in Parkinson’s disease?",
    stem: "A 72-year-old with 6 years of Parkinson’s disease (PD) on levodopa/carbidopa develops wearing-off periods with unpredictable ‘offs,’ peak-dose dyskinesias, increasing falls, constipation, urinary urgency, REM sleep behavior disorder, and low mood. His spouse notes orthostatic lightheadedness and quieter voice. Which complication profile requires proactive prevention and targeted management in PD?",
    options: [
      {
        key: "A",
        text: "Only static motor symptoms that remain stable for life",
      },
      {
        key: "B",
        text: "Primarily cerebellar ataxia and diplopia without autonomic or psychiatric features",
      },
      {
        key: "C",
        text: "Motor fluctuations (wearing-off, ‘on–off’), levodopa-induced dyskinesias, falls/fragility fractures, aspiration pneumonia, autonomic failure (orthostatic hypotension, constipation, urinary dysfunction), neuropsychiatric complications (depression, anxiety, psychosis, ICDs), and cognitive decline",
      },
      {
        key: "D",
        text: "Rapid dementia within weeks of diagnosis in all patients",
      },
      {
        key: "E",
        text: "Exclusive cardiac complications without neurological involvement",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **PD** evolves beyond the initial motor triad into **motor** and **nonmotor** complication clusters that drive disability and admissions.",
      "- **Motor**: **wearing-off**, **unpredictable offs**, **peak-dose dyskinesias**, **freezing of gait**, and **falls** with **fragility fractures**.",
      "- **Nonmotor**: **autonomic failure** (orthostatic hypotension, constipation, urinary dysfunction, sialorrhea), **neuropsychiatric** (depression, anxiety, **psychosis**, **impulse-control disorders** with dopamine agonists), **sleep** (RBD, insomnia), **pain**, **hypophonia/dysarthria**, and **progressive cognitive decline**.",
      "- These complications are **common, predictable, and modifiable** with regimen tuning, rehab, and safety bundles. [yellow]==Complication management is the art of PD care==[/yellow].",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** PD **progresses** with dynamic complications; symptoms are **not** static.",
      "- **B:** Cerebellar ataxia/diplopia point away from idiopathic PD (think MSA-C, ataxias, or brainstem lesions), and omit key PD complications.",
      "- **D:** Dementia risk increases over years, **not weeks**; course is variable and not universal early.",
      "- **E:** PD complications are **neurologic + systemic**; limiting to cardiac misses the major morbidity drivers.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **Complication screen** each visit: **falls/freezing**, **wearing-off timing diary**, **dyskinesia severity**, **orthostatic vitals**, bowel/bladder review, **mood/anxiety/psychosis**, **sleep (RBD/insomnia)**, **ICD behaviors**. **Confirms?** ❌ Flags problem domains.",
      "- **Next Diagnostic step →** Targeted tests: **videofluoroscopic swallow** if aspiration risk, **autonomic testing** (tilt/QSART) for refractory orthostasis, **bone density** if falls, **MoCA** for cognition, **sleep study** for RBD/OSA. **Confirms?** ➕ Quantifies complication burden.",
      "- **Best Diagnostic Step →** For advanced motor complications, **on–off assessment** with timed UPDRS and **levodopa challenge** ± **apomorphine test**; consider **DBS workup** (neuropsych + MRI). **Confirms?** ✅ Guides advanced therapy.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Safety & rehab bundle[/green] — **fall prevention** (PT for cueing strategies, balance; home hazards), **speech/swallow therapy** (LSVT LOUD; diet texture), **bowel regimen** (fiber/osmotics), **orthostatic protocol** (fluids/salt/compression/slow position changes).",
      "- **First Line (medical tuning):** [green]Optimize dopaminergic therapy[/green] — **fractionate levodopa**, add **COMT inhibitor** or **MAO-B inhibitor**, consider **on-demand on-boosters** (inhaled levodopa or subQ apomorphine). Treat **dyskinesia** with **amantadine** (ER if available). Manage **depression/anxiety** (SSRI/SNRI) and **psychosis** with **pimavanserin** or **quetiapine**; address **ICDs** by **reducing dopamine agonists**.",
      "- **Gold Standard (advanced fluctuations/dyskinesia):** **Deep Brain Stimulation (STN/GPi)** or **LCIG/CSA** (levodopa intestinal gel or continuous subcutaneous apomorphine) in suitable candidates; [green]multidisciplinary care** (MDT) for cognition, autonomic failure, palliative planning[/green]. [red]Avoid dopamine blockers[/red] (metoclopramide, typical antipsychotics).",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Dopamine replacement kinetics** → **pulsatile stimulation** causes **maladaptive plasticity** → **dyskinesias**; disease progression widens the **therapeutic window mismatch** → **wearing-off/on–off**.",
      "- **Basal ganglia–brainstem network changes** and **sensory cueing deficits** yield **freezing of gait**; cholinergic deficits and orthostatic/autonomic dysfunction drive **falls and syncope**.",
      "- **Lewy pathology** spreads to **limbic/cortical** and **autonomic** circuits → **psychosis, mood disorders, cognitive decline, constipation, hypotension**.",
      "- **Swallowing/respiratory** muscle discoordination → **aspiration pneumonia**, a major mortality driver.",
      "**6️⃣ Complications — prevention & treatment map**",
      "- **Motor fluctuations/dyskinesia** 🎚️ → **levodopa fractionation**, **COMT/MAO-B**, **amantadine**, **DBS/infusions**.",
      "- **Falls/fractures** 🦴 → **PT cueing**, home safety, hip protectors, vitamin D/bone health, review sedatives.",
      "- **Aspiration pneumonia** 🫁 → swallow therapy, texture modification, upright meals, oral hygiene.",
      "- **Orthostatic hypotension** 📉 → fluids/salt, compression, **midodrine/droxidopa**, review antihypertensives.",
      "- **Constipation/urinary dysfunction** 🚽 → fiber/osmotics, scheduled toileting; antimuscarinics or **mirabegron** for OAB (watch cognition).",
      "- **Psychosis/ICDs** 🧠 → reduce dopamine agonists; **pimavanserin/quetiapine**; counsel caregivers.",
      "- **Cognitive decline** 🧩 → **cholinesterase inhibitor** (rivastigmine) if DLB/PDD features; simplify meds; environment cues.",
      "- [purple]Pearl:[/purple] ==Treat **complications** like co-bosses: one adjusts **dopamine**, the other fixes **safety/autonomics**==",
    ],
  },
  {
    id: "PD-EPI-60010",
    topic: "Geriatrics • Parkinson’s disease — Epidemiology",
    difficulty: "Medium",
    vignetteTitle:
      "How common is Parkinson’s disease, and who tends to get it?",
    stem: "Your movement disorders clinic is preparing a service plan and asks for a snapshot of Parkinson’s disease (PD) burden: frequency by age, sex differences, age at onset, early-onset proportion, and broad outcome trends. Which statement best captures the **epidemiology** of PD?",
    options: [
      {
        key: "A",
        text: "PD is extremely rare (<0.01%) and occurs mainly in teenagers; rates fall with age.",
      },
      {
        key: "B",
        text: "PD accounts for ~1% of people ≥60 years, incidence and prevalence rise steeply with age, there is a slight male predominance, typical onset is in the 60s (10–15% <50), and many eventually develop cognitive and autonomic complications.",
      },
      {
        key: "C",
        text: "PD is the most common cause of dementia worldwide and occurs equally at all ages and sexes.",
      },
      {
        key: "D",
        text: "PD occurs only after exposure to antipsychotics and resolves fully once the drug is stopped.",
      },
      {
        key: "E",
        text: "PD prevalence is higher in women, peaks in the 30s, and is primarily cerebellar in origin.",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Age-linked burden:** PD affects roughly **~1% of those ≥60** and **~3% of those ≥80**; both **incidence and prevalence** climb with age. [yellow]==Aging is the biggest risk factor==[/yellow].",
      "- **Typical onset:** **Late middle age to 60s–70s**; **early-onset PD** (~**10–15%** of cases) presents **<50**.",
      "- **Sex:** **Slight male predominance** (~1.2–1.6:1) seen in many cohorts.",
      "- **Course/outcomes:** Over years many develop **motor complications**, **autonomic dysfunction**, **neuropsychiatric symptoms**, and **Parkinson disease dementia** in a substantial subset.",
      "- **Global health:** PD prevalence is **rising worldwide** with population aging and better ascertainment. 🧭📈",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** PD is **not ultra-rare** and is **exceptional** in teens; **risk rises**, not falls, with age.",
      "- **C:** PD is **not** the most common dementia (**Alzheimer’s** is); PD risk **isn’t equal** across ages/sexes.",
      "- **D:** That describes **drug-induced parkinsonism**, a **secondary**, often **reversible** condition—**not idiopathic PD**.",
      "- **E:** PD shows **male > female** in many studies, peaks in **older** adults, and is a **basal ganglia synucleinopathy**, **not cerebellar**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step (population level):** Track **age-stratified incidence/prevalence**, **sex ratios**, and **age at onset** in your catchment. **Confirms?** ❌ Surveillance perspective only.",
      "- **Next Diagnostic step (clinic quality):** Measure **time-to-diagnosis**, **levodopa responsiveness**, and **rates of motor/nonmotor complications** (falls, psychosis, PDD). **Confirms?** ➕ Informs service design.",
      "- **Best Diagnostic Step (registry build):** Create a **PD registry** capturing **onset age, phenotype, genetics when available, and outcomes** to benchmark care and plan resources. **Confirms?** ✅ Enables continuous improvement.",
      "**4️⃣ Management / Treatment (system planning)**",
      "- **Initial Management:** [green]Capacity for rehab[/green] — PT/OT/speech, fall clinics, constipation/orthostasis pathways; caregiver training.",
      "- **First Line:** [green]Medication access[/green] — levodopa, MAO-B/COMT inhibitors, on-demand rescue (inhaled levodopa/subQ apomorphine); depression/anxiety/psychosis services.",
      "- **Gold Standard:** [green]Advanced therapies program[/green] — **DBS** (STN/GPi) and **device-aided infusions** (LCIG/CSA); **cognitive/autonomic** clinics. [red]System-wide avoidance of dopamine blockers[/red].",
      "**5️⃣ Full Pathophysiology Explained (epi lens)**",
      "- **α-Synuclein** pathology + **aging** (mitochondrial/oxidative stress) drive population risk; **genetics** (LRRK2, GBA, PRKN/PINK1) explain a **subset**; **environmental exposures** (e.g., certain pesticides/solvents) shape **regional variation**.",
      "- As populations **age**, **PD prevalence grows** and downstream needs (falls, dementia, autonomic care) expand.",
      "**6️⃣ Symptoms — epidemiology → phenotype link**",
      "- **Older onset** → more **postural instability/gait** issues; **younger onset** → more **dyskinesia** risk over time.",
      "- **Male slant** aligns with observed clinic demographics; anticipate **bone health** and **fall prevention** demands.",
      "- [purple]Planning pearl:[/purple] ==If your service area is aging, budget now for **rehab, cognition, autonomic care, and DBS access**==",
    ],
  },
  {
    id: "PD-RISK-60011",
    topic: "Geriatrics • Parkinson’s disease — Risk Factors",
    difficulty: "Medium",
    vignetteTitle: "Who’s primed for Parkinson’s? Risk profile at a glance",
    stem: "A 62-year-old man asks about his risk for Parkinson’s disease (PD). His father had PD diagnosed at 72. He worked with pesticides in his 20s–30s, rarely drinks coffee, and never smoked. He has long-standing hyposmia and constipation, but no antipsychotic exposure or head trauma. Which cluster best captures **elevated PD risk**?",
    options: [
      {
        key: "A",
        text: "Advanced age; male sex; family history or genetic susceptibility (e.g., LRRK2, GBA); environmental exposures (certain pesticides/solvents, rural well water); prodromal nonmotor features (hyposmia, constipation, REM sleep behavior disorder); traumatic brain injury; low caffeine/smoking",
      },
      {
        key: "B",
        text: "High aerobic fitness, bilingualism, and university education",
      },
      { key: "C", text: "Exclusive cerebellar disease and early diplopia" },
      {
        key: "D",
        text: "Long-term antipsychotic use with symmetric parkinsonism that resolves on withdrawal",
      },
      {
        key: "E",
        text: "Acute viral illness in adolescence fully resolved without sequelae",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Age** is the strongest risk factor; PD prevalence rises from **~1% ≥60** to **~3% ≥80**. [yellow]==Aging drives risk==[/yellow].",
      "- **Male sex** and **family history/genetics** (e.g., **LRRK2**, **GBA**, PRKN/PINK1, **SNCA** multiplications) increase susceptibility.",
      "- **Environmental exposures**: certain **pesticides** (e.g., paraquat), **solvents** (e.g., trichloroethylene), **rural living/well water** have been associated with higher risk.",
      "- **Prodromal nonmotor features**—**hyposmia**, **constipation**, **REM sleep behavior disorder (RBD)**—flag **preclinical synucleinopathy**.",
      "- **Other associations:** **Traumatic brain injury**, and observational **inverse correlations** with **caffeine** and **smoking** (not treatment recommendations).",
      "**2️⃣ Why the other options are wrong**",
      "- **B:** Fitness/education/bilingualism relate to **reserve/overall health**, not established PD risk elevation.",
      "- **C:** Cerebellar/diplopia points away from PD (think ataxias/brainstem lesions).",
      "- **D:** Describes **drug-induced parkinsonism** (secondary, often reversible) rather than **idiopathic PD risk**.",
      "- **E:** A remote, uncomplicated viral illness is **not a recognized major PD risk**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **Risk/Prodrome screen**: ask about **RBD**, **hyposmia**, **constipation**, **family history**, **toxin exposures**, **TBI**. **Confirms?** ❌ Stratifies risk only.",
      "- **Next Diagnostic step →** If strong prodromal features: targeted tests — **polysomnography** for **RBD**, **orthostatic vitals**; consider **olfaction testing**. **Confirms?** ➕ Supports prodromal state.",
      "- **Best Diagnostic Step (if motor signs emerge) →** **Clinical exam** for **bradykinesia + rest tremor/rigidity**; if uncertain, **DaTscan** for [blue]presynaptic dopaminergic deficit[/blue]. **Confirms?** ✅ Supports degenerative parkinsonism.",
      "**4️⃣ Management / Treatment (risk-stage)**",
      "- **Initial Management:** [green]Risk counseling[/green] — sleep safety for **RBD** (bedroom hazard-proofing), address **constipation** and **orthostasis**, avoid **dopamine blockers** (metoclopramide/typical antipsychotics).",
      "- **First Line (lifestyle):** [green]Exercise is protective-adjacent[/green] — regular **aerobic + resistance + balance** training; optimize **vitamin D**/**bone health**; consider **caffeine** within general health limits if already used (not as therapy).",
      "- **Gold Standard (once motor PD diagnosed):** **Levodopa/carbidopa** tailored to function; **PT/OT/speech**; escalate per course (COMT/MAO-B, DBS when appropriate).",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** misfolding/aggregation + **aging mitochondrial stress** + **genetic variants** (e.g., **LRRK2**, **GBA**) + **environmental toxicants** → **SNpc neuron loss** and **striatal dopamine depletion**.",
      "- **Prodromal sites** (olfactory bulb, dorsal motor nucleus of vagus) explain **hyposmia/constipation**; **RBD** reflects early **pontine REM** circuit involvement.",
      "- [blue]Epidemiologic nuance[/blue]: **Caffeine/smoking** show **inverse associations** in cohorts; mechanism hypotheses include **adenosine A2A** antagonism for caffeine and **nicotinic receptor** effects for nicotine.",
      "**6️⃣ Risk checklist — memorize the big levers**",
      "- **Ageing** (60s–70s typical), **male sex**.",
      "- **Family history/genetics**: **LRRK2**, **GBA**, PRKN/PINK1, SNCA.",
      "- **Environmental**: **pesticides/solvents**, rural **well water**.",
      "- **Prodromal nonmotor**: **RBD**, **hyposmia**, **constipation**, **depression/anxiety**, **autonomic** clues.",
      "- **Other**: **TBI**; **low caffeine/smoking** are epidemiologic signals only.",
      "- [purple]Pearl:[/purple] ==If a patient stacks **age + male + family history + pesticides** and has **hyposmia/constipation/RBD**, keep PD on your radar==",
    ],
  },
];

/* --------------------------- Utils ---------------------------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const SAFE_EXPR = /^[0-9+\-*/().\s^%]*$/;
function evalMath(expr) {
  if (!SAFE_EXPR.test(expr)) throw new Error("Invalid characters");
  const replaced = expr.replace(
    /(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g,
    "Math.pow($1,$2)"
  );
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${replaced || 0});`)();
}

/* --------------------------- Modal ---------------------------- */
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

/* ------------------------ Lab Values ------------------------- */
function LabValues() {
  const labs = [
    { name: "Hb", value: "M 13–17 g/dL • F 12–15" },
    { name: "WBC", value: "4–11 ×10⁹/L" },
    { name: "Platelets", value: "150–400 ×10⁹/L" },
    { name: "Na⁺", value: "135–145 mmol/L" },
    { name: "K⁺", value: "3.5–5.0 mmol/L" },
    { name: "Cl⁻", value: "98–106 mmol/L" },
    { name: "HCO₃⁻", value: "22–28 mmol/L" },
    { name: "Urea", value: "2.5–7.1 mmol/L" },
    { name: "Creatinine", value: "M 60–110 • F 45–90 µmol/L" },
    { name: "Glucose (fasting)", value: "3.9–5.5 mmol/L" },
    { name: "Lactate", value: "0.5–2.2 mmol/L" },
    { name: "INR", value: "0.8–1.2 (lab-dependent)" },
    { name: "pH (ABG)", value: "7.35–7.45" },
    { name: "PaCO₂", value: "4.7–6.0 kPa" },
    { name: "PaO₂ (room air)", value: "10–13 kPa" },
    { name: "Troponin (99th %ile)", value: "lab-specific cut-off" },
  ];
  return (
    <div className="max-h-[60vh] overflow-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-600">
            <th className="py-2 pr-3">Test</th>
            <th className="py-2">Reference Range</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((r) => (
            <tr key={r.name} className="border-t border-slate-200">
              <td className="py-2 pr-3 font-medium">{r.name}</td>
              <td className="py-2 text-slate-700">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-3">
        Ranges vary by lab and context; this is for quick revision.
      </p>
    </div>
  );
}

/* ------------------------ Calculator ------------------------ */
function Calculator() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("");
  const keys = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "(",
    ")",
    "+",
    "^",
  ];
  const press = (t) => setExpr((e) => e + t);
  const doEval = () => {
    try {
      setOut(String(evalMath(expr)));
    } catch {
      setOut("Error");
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e.g. (12.5*3)/4"
        />
        <button
          onClick={() => {
            setExpr("");
            setOut("");
          }}
          className="rounded-lg border px-3"
        >
          Clear
        </button>
        <button
          onClick={doEval}
          className="rounded-lg bg-purple-600 text-white px-4"
        >
          =
        </button>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="rounded-lg border py-2 hover:bg-slate-50"
          >
            {k}
          </button>
        ))}
      </div>
      <div className="text-sm text-slate-600">
        Result: <span className="font-semibold text-slate-900">{out}</span>
      </div>
    </div>
  );
}

/* ----------------------- Responsive helpers ---------------------- */
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return mobile;
}

function MobileQuestionList({
  open,
  onClose,
  order,
  currentIdx,
  setCurrentIdx,
  answers,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Questions"
      maxW="max-w-lg"
      overlayClass="bg-black/30"
    >
      <ol className="space-y-3">
        {order.map((qi, i) => {
          const id = QUESTIONS[qi].id;
          const a = answers[id];
          const st = !a
            ? "unanswered"
            : a === QUESTIONS[qi].correct
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
              key={id}
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
                    {QUESTIONS[qi].stem.replace(/<[^>]*>/g, "")}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">
                      {QUESTIONS[qi].topic}
                    </span>
                    <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                      {QUESTIONS[qi].difficulty}
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
    </Modal>
  );
}

/* ---------------------- Results Modal ---------------------- */
function ResultsModal({ open, onClose, answers, order, elapsedMs, jumpTo }) {
  const total = order.length;
  const score = useMemo(
    () =>
      order.reduce(
        (s, qi) =>
          s + (answers[QUESTIONS[qi].id] === QUESTIONS[qi].correct ? 1 : 0),
        0
      ),
    [answers, order]
  );
  const pct = Math.round((score / Math.max(total, 1)) * 100);
  const wrong = useMemo(
    () =>
      order
        .map((qi, i) => ({
          i,
          q: QUESTIONS[qi],
          chosen: answers[QUESTIONS[qi].id],
        }))
        .filter(({ q, chosen }) => chosen && chosen !== q.correct),
    [answers, order]
  );
  const mm = Math.floor(elapsedMs / 60000);
  const ss = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <Modal open={open} onClose={onClose} title="Results" maxW="max-w-2xl">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Marks</p>
            <p className="text-2xl font-bold">
              {score} / {total}
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Percentage</p>
            <p className="text-2xl font-bold">{pct}%</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-600">Time</p>
            <p className="text-2xl font-bold">
              {mm}:{String(ss).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <p className="font-semibold mb-2">Questions to review</p>
          {wrong.length === 0 ? (
            <p className="text-slate-600 text-sm">
              No incorrect answers — great job 🎉
            </p>
          ) : (
            <ul className="space-y-2">
              {wrong.map(({ i, q, chosen }) => (
                <li
                  key={q.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      Q{i + 1} — {q.vignetteTitle || "Vignette"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Chosen: <span className="font-semibold">{chosen}</span> •
                      Correct:{" "}
                      <span className="font-semibold">{q.correct}</span>
                    </p>
                  </div>
                  <button
                    className="shrink-0 rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
                    onClick={() => {
                      jumpTo(i);
                      onClose();
                    }}
                  >
                    Go to question →
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* --------------------------- Page --------------------------- */
export default function ParkinsonsDisease() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  // session/order
  const [order, setOrder] = useState(QUESTIONS.map((_, i) => i));
  const [started, setStarted] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showLabs, setShowLabs] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // timing
  const startRef = useRef(null);
  const endRef = useRef(null);

  // highlighting
  const [highlightMode, setHighlightMode] = useState(false);
  const highlightRef = useRef(null);

  const q = QUESTIONS[order[currentIdx]];
  const total = QUESTIONS.length;
  const progress = ((currentIdx + 1) / Math.max(total, 1)) * 100;

  /* highlight selection */
  const applySelectionHighlight = () => {
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
    } catch {
      const prev = root.getAttribute("contenteditable");
      root.setAttribute("contenteditable", "true");
      // deprecated but acceptable fallback
      document.execCommand("hiliteColor", false, "#FEF08A");
      if (prev !== null) root.setAttribute("contenteditable", prev);
      else root.removeAttribute("contenteditable");
    }
  };
  useEffect(() => {
    if (!highlightMode) return;
    const handler = () => applySelectionHighlight();
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [highlightMode]);

  const clearHighlights = () => {
    const root = highlightRef.current;
    if (!root) return;
    root.querySelectorAll("mark").forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
  };

  /* start mode */
  const handlePickMode = (mode) => {
    const newOrder =
      mode === "random"
        ? shuffle(QUESTIONS.map((_, i) => i))
        : QUESTIONS.map((_, i) => i);
    setOrder(newOrder);
    setCurrentIdx(0);
    setAnswers({});
    setRevealed({});
    setStarted(true);
    startRef.current = Date.now();
    endRef.current = null;
  };

  /* keyboard nav */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && currentIdx < total - 1)
        setCurrentIdx((i) => i + 1);
      if (e.key === "ArrowLeft" && currentIdx > 0) setCurrentIdx((i) => i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx, total]);

  /* actions */
  const choose = (opt) => setAnswers((a) => ({ ...a, [q.id]: opt }));
  const submit = () => setRevealed((r) => ({ ...r, [q.id]: true }));
  const next = () => {
    const last = currentIdx >= total - 1;
    if (!last) setCurrentIdx((i) => i + 1);
  };
  const prev = () => currentIdx > 0 && setCurrentIdx((i) => i - 1);

  /* finished state */
  const finished = currentIdx === total - 1 && !!revealed[q.id];
  useEffect(() => {
    if (finished && !endRef.current) endRef.current = Date.now();
  }, [finished, q?.id, revealed, currentIdx, total]);

  const elapsedMs = useMemo(() => {
    if (startRef.current == null) return 0;
    const end = endRef.current || Date.now();
    return Math.max(0, end - startRef.current);
  }, [showResults, revealed, currentIdx]);

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
            onClick={() => nav("/diseases/geriatrics")}
            className="rounded-xl px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Sidebar toggle: mobile bottom-right; desktop left edge */}
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

      {/* Content Row */}
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

              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => setShowLabs(true)}
                  className="flex-1 rounded-xl border px-3 py-2 hover:bg-slate-50"
                >
                  Lab values
                </button>
                <button
                  onClick={() => setShowCalc(true)}
                  className="flex-1 rounded-xl border px-3 py-2 hover:bg-slate-50"
                >
                  Calculator
                </button>
              </div>
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

                  {q.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={q.image}
                        alt="Figure"
                        className="w-full block"
                      />
                    </div>
                  )}

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
                          onClick={submit}
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
                          onClick={next}
                          disabled={currentIdx >= total - 1}
                          className="rounded-xl bg-purple-600 text-white px-4 py-2 disabled:opacity-50"
                        >
                          Next Question →
                        </button>
                        <button
                          onClick={prev}
                          disabled={currentIdx === 0}
                          className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                        >
                          ← Previous
                        </button>
                        {currentIdx === total - 1 && (
                          <button
                            onClick={() => setShowResults(true)}
                            className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                          >
                            Results
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Explanation */}
                  {revealed[q.id] && (
                    <div className="mt-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
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

              {/* Right tool rail (desktop only) */}
              <div className="fixed right-4 top-[140px] md:flex md:flex-col md:gap-3 hidden">
                <button
                  title="Calculator"
                  onClick={() => setShowCalc(true)}
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700"
                >
                  🧮
                </button>
                <button
                  title="Lab values"
                  onClick={() => setShowLabs(true)}
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700"
                >
                  🧪
                </button>
                <button
                  title="Toggle highlight mode"
                  onClick={() => setHighlightMode((v) => !v)}
                  className={`h-10 w-10 rounded-lg border shadow-sm hover:bg-slate-50 ${
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
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700"
                >
                  🧽
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={showLabs}
        onClose={() => setShowLabs(false)}
        title="Common Lab Values"
      >
        <LabValues />
      </Modal>
      <Modal
        open={showCalc}
        onClose={() => setShowCalc(false)}
        title="Calculator"
      >
        <Calculator />
      </Modal>

      {/* Mobile question list */}
      <MobileQuestionList
        open={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        order={order}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        answers={answers}
      />

      {/* Results */}
      <ResultsModal
        open={showResults}
        onClose={() => setShowResults(false)}
        answers={answers}
        order={order}
        elapsedMs={(() => {
          if (startRef.current == null) return 0;
          const end = endRef.current || Date.now();
          return Math.max(0, end - startRef.current);
        })()}
        jumpTo={(i) => setCurrentIdx(i)}
      />

      {/* Start overlay */}
      <StartOverlay open={!started} onPick={handlePickMode} />
    </div>
  );
}

/* ----------------------- Start Overlay ---------------------- */
function StartOverlay({ open, onPick }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => {}}
      title="Start Parkinson’s Disease Bank"
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
