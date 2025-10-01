// src/pages/diseases/geriatrics/DementiaAlzheimers.jsx
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

/* ------------------------ Alzheimer’s Question Bank ------------------------ */
/* Add images in /public and set q.image = "/file.png" if you want figures */
const QUESTIONS = [
  {
    id: "AD-CORE-20001",
    topic: "Geriatrics • Alzheimer’s disease — Core Clinical Pattern",
    difficulty: "Medium",
    vignetteTitle: "Which diagnosis best fits the hippocampal memory syndrome?",
    stem: "A 74-year-old retired accountant has 2.5 years of gradually progressive memory decline. Family notes repeated questions, misplacing items, and getting lost on familiar routes. Language and behavior are relatively preserved early; no hallucinations or parkinsonism. Exam: oriented to person, not to date; recalls 0/3 after 5 minutes with poor cueing benefit. MoCA 20/30 (episodic memory and visuospatial deficits). MRI shows bilateral hippocampal and mesial temporal atrophy with relative sparing of frontal and occipital lobes. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Alzheimer’s disease (amnestic presentation)" },
      { key: "B", text: "Vascular dementia (multi-infarct)" },
      { key: "C", text: "Dementia with Lewy bodies (DLB)" },
      { key: "D", text: "Frontotemporal dementia—behavioral variant (bvFTD)" },
      { key: "E", text: "Normal-pressure hydrocephalus (NPH)" },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Insidious, progressive episodic memory impairment** with poor cueing benefit is classic for **amnestic Alzheimer’s disease (AD)**.",
      "- MRI pattern: [blue]**bilateral hippocampal/mesial temporal atrophy**[/blue] (medial temporal lobe) with relative sparing of frontal/occipital early → highly compatible with AD.",
      "- Early **navigation problems**, **misplacing items**, and **repeating questions** reflect hippocampal consolidation deficits.",
      "- Lack of early prominent **behavioral disinhibition**, **parkinsonism**, or **visual hallucinations** argues against FTD/DLB.",
      "- [yellow]Pattern lock:[/yellow] gradual memory-first decline + hippocampal atrophy + poor cueing = **AD**. 🧠🗺️",

      "**2️⃣ Why the other options are wrong**",
      "- **B. Vascular dementia:** Often **stepwise** decline with focal deficits; MRI shows **strategic infarcts** or confluent white-matter disease—not isolated hippocampal atrophy.",
      "- **C. DLB:** Core features are **visual hallucinations**, **cognitive fluctuations**, and **parkinsonism**; plus REM sleep behavior disorder—absent here.",
      "- **D. bvFTD:** **Early personality/behavior change**, disinhibition/apathy, and frontal/insular atrophy, with **relative memory sparing** initially—mismatch.",
      "- **E. NPH:** Triad = **gait disturbance** (magnetic), **urinary incontinence**, **subcortical cognitive slowing** + MRI with **ventriculomegaly**—not present.",

      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) emphasizing **delayed recall** and cueing → poor recall with limited cueing benefit. **Confirms?** ❌ Suggests AD pattern.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]hippocampal/mesial temporal atrophy[/blue]; exclude mass/subdural/strategic stroke. **Confirms?** ➕ Supports AD; rules out mimics.",
      "- **Best Diagnostic Step (in vivo biomarker confirmation):** **CSF AD biomarkers** (↓Aβ42/Aβ42-40 ratio, ↑p-tau, ↑t-tau) **or** **amyloid PET** ± **tau PET**. **Confirms?** ✅ Biomarker-consistent AD.",
      "- **Adjuncts:** Thyroid/B12, CMP, CBC to exclude reversible contributors; depression screen; sleep apnea screening if indicated.",

      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving/meds/finances), caregiver education, advance care planning, exercise + Mediterranean-style diet.",
      "- **First Line:** [green]Symptomatic cognitive therapy[/green] — **cholinesterase inhibitor** (donepezil/rivastigmine/galantamine) for mild–moderate AD; **memantine** for moderate–severe or add-on.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green] (OT/PT, cognitive rehab, caregiver support). Consider **disease-modifying anti-amyloid mAbs** only if **biomarker-positive**, appropriate stage, and patient can meet monitoring/ARIA risk protocols. [red]Avoid anticholinergics and sedatives when possible[/red].",

      "**5️⃣ Full Pathophysiology Explained**",
      "- **Amyloid-β (Aβ)** dysmetabolism → extracellular **Aβ plaques**; **tau** hyperphosphorylation → intracellular **neurofibrillary tangles**.",
      "- Pathology spreads in a **Braak-like pattern** from transentorhinal/hippocampal regions → association cortices, explaining memory-first decline.",
      "- Synaptic dysfunction and neuroinflammation drive progressive network failure → atrophy on MRI, hypometabolism on FDG-PET.",
      "- [blue]Hippocampal circuit disruption[/blue] impairs encoding/consolidation → poor delayed recall and weak cueing response.",

      "**6️⃣ Symptoms — pattern recognition**",
      "- **Forgetting recent events / repeating questions** 📝 → hippocampal consolidation failure.",
      "- **Poor response to cues** 🧩 → storage (not retrieval) problem, consistent with AD.",
      "- **Topographical disorientation** 🗺️ → parahippocampal/retrosplenial network involvement.",
      "- **Language/behavior relatively preserved early** 💬 → contrasts with PPA/FTD.",
      "- [purple]Think AD when you see:[/purple] ==gradual amnestic decline + hippocampal atrophy + poor cueing==.",
    ],
  },
  {
    id: "AD-SX-20002",
    topic:
      "Geriatrics • Alzheimer’s disease — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle: "Spot the amnestic Alzheimer pattern",
    stem: "A 75-year-old retired teacher has 3 years of insidious memory decline. Family reports repeated questions, misplacing items, getting lost on familiar routes, and difficulty recalling recent conversations despite intact attention. Language is mostly fluent, with occasional word-finding pauses but intact grammar. No early hallucinations, REM sleep behavior disorder, parkinsonism, or major personality change. Exam: poor delayed recall with minimal cueing benefit; constructional copying mildly impaired. MRI shows bilateral hippocampal/mesial temporal atrophy. Which clinical constellation best identifies the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Early behavioral disinhibition, apathy, hyperorality; relatively spared episodic memory",
      },
      {
        key: "B",
        text: "Recurrent visual hallucinations, fluctuating attention, spontaneous parkinsonism, REM sleep behavior disorder",
      },
      {
        key: "C",
        text: "Gait disturbance with urinary urgency/incontinence and subcortical cognitive slowing; ventriculomegaly",
      },
      {
        key: "D",
        text: "Gradual, progressive **episodic memory** loss with poor cueing, navigation problems, and hippocampal atrophy; language/behavior relatively preserved early",
      },
      {
        key: "E",
        text: "Nonfluent, effortful agrammatic speech with apraxia of speech; left inferior frontal atrophy",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Alzheimer’s disease (amnestic presentation)** is defined by **progressive episodic memory impairment**—failure of encoding/storage—leading to repeated questions and misplacing items.",
      "- **Poor cueing benefit** distinguishes storage failure (AD) from retrieval failures seen in depression or subcortical states.",
      "- Early **topographical disorientation** (getting lost) reflects medial temporal–parahippocampal network involvement.",
      "- **Language and behavior relatively preserved early** fits AD more than FTD or PPA at onset.",
      "- Imaging tie-in: [blue]**hippocampal/mesial temporal atrophy**[/blue] supports the clinical pattern. [yellow]Pattern lock = amnestic AD[/yellow] 🧠📉",
      "**2️⃣ Why the other options are wrong**",
      "- **A (bvFTD):** Early **behavioral disinhibition/apathy** and eating changes with relative memory sparing → frontal/insular syndrome, not memory-first AD.",
      "- **B (DLB):** **Visual hallucinations**, **fluctuations**, **parkinsonism**, and **REM sleep behavior disorder** define DLB; absent here.",
      "- **C (NPH):** Triad of **gait disturbance**, **urinary incontinence**, **cognitive slowing** with **ventriculomegaly**—not the hippocampal amnestic picture.",
      "- **E (nfvPPA):** **Nonfluent agrammatic speech** and apraxia localize to left IFG/insular networks; this case has fluent language and memory-led decline.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) emphasizing **delayed recall** and cueing. **Confirms?** ❌ Suggests AD when recall is poor with minimal cueing benefit.",
      "- **Next Diagnostic step:** 🧠 MRI brain → [blue]**hippocampal/mesial temporal atrophy**[/blue]; exclude mass/subdural/strategic stroke. **Confirms?** ➕ Supports AD pattern.",
      "- **Best Diagnostic Step (biomarker confirmation):** **CSF AD profile** (↓Aβ42 or ↓Aβ42/40, ↑p-tau, ↑t-tau) **or** **amyloid PET** ± **tau PET**. **Confirms?** ✅ Biomarker-consistent AD.",
      "- **Adjuncts:** TSH/B12/CBC/CMP, depression screen, sleep apnea screening; consider FDG-PET (posterior cingulate/precuneus hypometabolism) if needed.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving, meds, finances), caregiver education, exercise and Mediterranean-style diet, vascular risk control.",
      "- **First Line:** [green]Cognitive symptom therapy[/green] — **cholinesterase inhibitor** for mild–moderate AD; **memantine** for moderate–severe or add-on.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green] (OT/PT, cognitive rehab, caregiver support). Consider **anti-amyloid monoclonals** only if **biomarker-positive**, appropriate stage, and monitoring feasible; [red]avoid anticholinergics and minimize sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Amyloid-β** accumulation (plaques) and **tau** hyperphosphorylation (neurofibrillary tangles) drive synaptic dysfunction and neurodegeneration.",
      "- Spread follows a **Braak-like trajectory** from transentorhinal/hippocampal regions to association cortices—explains memory-first symptoms.",
      "- [blue]Hippocampal circuit failure[/blue] → impaired encoding/consolidation → **poor delayed recall** with minimal cueing improvement.",
      "- Network loss yields **mesial temporal atrophy** on MRI and posterior cingulate/precuneus hypometabolism on FDG-PET.",
      "**6️⃣ Symptoms — Clinical Presentation map**",
      "- **Forgetting recent events / repeating questions** 📝 → storage (encoding) failure in hippocampus.",
      "- **Poor cueing benefit** 🧩 → true amnestic deficit, not just retrieval.",
      "- **Topographical disorientation** 🗺️ → parahippocampal/retrosplenial involvement.",
      "- **Word-finding pauses** 💬 (mild, early) with intact grammar → secondary to memory/semantic access strain, not primary aphasia.",
      "- **Relatively preserved behavior early** 🙂 → contrasts with bvFTD; **no early hallucinations/parkinsonism** → contrasts with DLB.",
      "- [purple]Think AD when you see:[/purple] ==gradual amnestic decline + poor cueing + hippocampal atrophy==.",
    ],
  },
  {
    id: "AD-SIGNS-20003",
    topic: "Geriatrics • Alzheimer’s disease — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to amnestic Alzheimer’s disease?",
    stem: "A 76-year-old former math teacher has 3 years of gradually progressive forgetfulness. On exam, she is oriented to person but misses the date and clinic location. Immediate registration is intact (3/3), but delayed recall at 5 minutes is 0/3 and improves only minimally with category cues. Category (animal) fluency is 8 in 60 seconds while letter (F) fluency is 12. She has mild constructional difficulty on clock drawing and intersecting pentagons. Naming is mostly intact with occasional circumlocutions. Neurological exam is otherwise nonfocal; gait is normal. Which set of **examination signs** best fits the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Prominent disinhibition and utilization behavior; intact delayed recall with strong cueing benefit; frontal release signs early",
      },
      {
        key: "B",
        text: "Fluctuating attention, recurrent visual hallucinations, spontaneous parkinsonism, visuospatial neglect",
      },
      {
        key: "C",
        text: "Magnetic gait with start hesitation, urinary urgency/incontinence, impaired attention/processing speed; ventriculomegaly on imaging",
      },
      {
        key: "D",
        text: "Poor delayed recall with minimal cueing benefit; semantic (category) fluency worse than phonemic; constructional apraxia on clock/pentagons; otherwise nonfocal neuro exam",
      },
      {
        key: "E",
        text: "Nonfluent agrammatic speech with apraxia of speech; effortful output; left inferior frontal signs",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Amnestic Alzheimer’s disease (AD)** shows **hippocampal storage failure** → **poor delayed recall** that **does not normalize with cues**.",
      "- **Semantic (category) fluency < phonemic (letter) fluency** is typical early as temporal semantic networks are affected.",
      "- **Constructional apraxia** on **clock drawing**/intersecting pentagons reflects early visuospatial network involvement.",
      "- General neuro exam is **nonfocal** early; gait usually normal until late. [yellow]Pattern lock: memory-first + poor cueing + constructional errors = AD[/yellow].",
      "- Imaging often reveals [blue]medial temporal (hippocampal) atrophy[/blue], aligning with these signs. 🧠🕒",
      "**2️⃣ Why the other options are wrong**",
      "- **A (bvFTD signs):** Early **behavioral disinhibition/utilization** with **intact episodic storage** and good cueing benefit → frontal syndrome, not amnestic AD.",
      "- **B (DLB signs):** **Fluctuations**, **visual hallucinations**, **parkinsonism**, and marked visuospatial neglect define DLB—absent here.",
      "- **C (NPH signs):** **Magnetic gait** and urinary symptoms dominate with subcortical slowing; exam and vignette lack gait/continence issues.",
      "- **E (nfvPPA signs):** **Nonfluent agrammatic speech** with apraxia of speech localizes to left IFG/insular networks—language output, not memory, is primary.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) with emphasis on **delayed recall** and **cueing**. **Confirms?** ❌ Suggests AD when cueing fails.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]hippocampal/mesial temporal atrophy[/blue]; exclude structural mimics. **Confirms?** ➕ Supports AD pattern.",
      "- **Best Diagnostic Step (biomarker confirmation):** **CSF AD profile** (↓Aβ42/42–40, ↑p-tau, ↑t-tau) **or** **amyloid PET** ± **tau PET**. **Confirms?** ✅ Biomarker-consistent AD.",
      "- **Adjuncts:** Labs (TSH/B12/CMP/CBC), depression screen, sleep study if OSA suspected; FDG-PET (posterior cingulate/precuneus hypometabolism) if needed.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure and safety planning[/green] (driving, meds, finances), caregiver education, exercise, Mediterranean-style diet, vascular risk control.",
      "- **First Line:** [green]Cholinesterase inhibitor** for mild–moderate AD; **memantine** for moderate–severe or add-on[/green]; cognitive rehab, routines, environmental supports.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green]. Consider **anti-amyloid monoclonals** only if **biomarker-positive** and appropriate for risks/monitoring; [red]minimize anticholinergics/sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Aβ plaques** and **tau tangles** disrupt hippocampal circuits, causing **encoding/consolidation failure** → hallmark **poor delayed recall**.",
      "- Spread from **transentorhinal/hippocampal** regions to association cortices yields **constructional apraxia** and semantic fluency decline.",
      "- Network loss appears as **mesial temporal atrophy** on MRI and posterior cingulate/precuneus hypometabolism on FDG-PET.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Poor delayed recall with minimal cueing benefit** 🧩 → hippocampal storage failure.",
      "- **Category fluency < letter fluency** 🐶 < F-words → semantic network early hit.",
      "- **Constructional apraxia** 🕒🔺 → clock/pentagon errors from parietal–temporal network spread.",
      "- **Anomia (mild) with circumlocutions** 💬 → secondary naming strain; grammar intact early.",
      "- **Nonfocal neuro exam; normal gait early** 🚶 → contrasts with NPH/DLB.",
      "- [purple]Think AD when the bedside exam shows:[/purple] ==poor recall + poor cueing + semantic fluency drop + constructional errors==",
    ],
  },
  {
    id: "AD-REDFLAGS-20004",
    topic: "Geriatrics • Alzheimer’s disease — Red Flags",
    difficulty: "Medium",
    vignetteTitle: "When it's not typical Alzheimer’s: spot the red flags",
    stem: "A 73-year-old woman is referred with 4 months of rapidly worsening memory and attention. Family reports new daily headaches, a witnessed focal seizure last week, and low-grade fevers. She has intermittent confusion and drowsiness through the day. Exam: disoriented, mild right arm drift, and neck stiffness; fundoscopy suggests papilledema. Which feature set signals a RED FLAG that requires urgent re-evaluation rather than a standard Alzheimer’s workup?",
    options: [
      {
        key: "A",
        text: "3-year gradual episodic memory decline with poor cueing and hippocampal atrophy on MRI",
      },
      {
        key: "B",
        text: "Early visual hallucinations, cognitive fluctuations, and spontaneous parkinsonism without fever",
      },
      {
        key: "C",
        text: "Subacute (weeks–months) decline with headache, fever, seizure, and papilledema",
      },
      {
        key: "D",
        text: "Slowly progressive forgetfulness over 2 years with normal neuro exam and negative depression screen",
      },
      {
        key: "E",
        text: "Mild amnestic complaints with stable function and normal neuro exam for 18 months",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Rapid/subacute time course (weeks–months)** is atypical for Alzheimer’s, which evolves over years.",
      "- **Systemic/inflammatory signs** like **fever** and **headache** point toward infectious, inflammatory, or neoplastic CNS disease.",
      "- **Early seizures** and **papilledema** imply cortical irritability and raised intracranial pressure—[red]urgent imaging and CSF workup are mandatory[/red].",
      "- These features fit **encephalitis, abscess, tumor, venous thrombosis, vasculitis, or CAA-related inflammation**, not typical AD.",
      "- [yellow]Safety pearl:[/yellow] When the clock speeds up and the body is “hot,” think **not Alzheimer’s**. 🚨",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Classic **amnestic AD** pattern (years-long decline + hippocampal atrophy) → not a red-flag scenario.",
      "- **B:** Suggests **Lewy body dementia** (DLB) rather than AD, but without fever/ICP/seizure it’s not an **urgent** red flag—it's an alternative neurodegenerative dx.",
      "- **D:** Slow progression with benign exam fits routine cognitive clinic evaluation, not emergency workup.",
      "- **E:** Mild, stable subjective complaints without objective decline → consider MCI/monitoring; no urgent red flags.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** [red]Stabilize ABCs[/red]; check glucose; focused neuro exam. **Confirms?** ❌ Safety first.",
      "- **Next Diagnostic step:** **Urgent non-contrast CT head** (rule out bleed/mass) → proceed to **MRI brain with and without contrast** ± **MRV** if venous thrombosis suspected. **Confirms?** ➕ Identifies structural/inflammatory causes.",
      "- **Best Diagnostic Step:** **Lumbar puncture** after imaging excludes mass effect → CSF cell count, protein/glucose, cultures, **HSV/VZV PCR**, autoimmune encephalitis panel; **EEG** for seizures/encephalopathy. **Confirms?** ✅ Etiologic diagnosis.",
      "- **Adjuncts:** CBC, CMP, ESR/CRP, blood cultures; autoimmune/vasculitis serologies; consider **CTA/CTV** if vascular concern.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Seizure control[/green] (benzodiazepine → levetiracetam), head elevation, analgesia, antipyretics, DVT prophylaxis as appropriate.",
      "- **First Line (empiric while pending tests):** Start **IV acyclovir** if encephalitis suspected; add **broad-spectrum antibiotics** if bacterial meningitis/abscess possible; manage ICP (e.g., mannitol/hypertonic saline per protocol).",
      "- **Gold Standard:** **Cause-specific therapy** once confirmed (antivirals/antibiotics, immunotherapy for autoimmune encephalitis, anticoagulation for CVST, neurosurgical management for mass/abscess).",
      "**5️⃣ Full Pathophysiology Explained (why these are red flags)**",
      "- **Alzheimer’s** is a **slow neurodegenerative** process (Aβ plaques, tau tangles) without early fever, seizures, or raised ICP.",
      "- **Infectious/autoimmune/neoplastic** processes cause **inflammation, edema, mass effect**, and **cortical hyperexcitability** → headaches, fever, seizures, papilledema.",
      "- **Time course matters:** **weeks–months** = inflammatory/neoplastic; **years** = degenerative.",
      "- [purple]Mnemonic:[/purple] “**FAST + HOT + ELECTRIC + PRESSURE**” → Fast decline, fever, seizures, papilledema = **not AD**.",
      "**6️⃣ Red-flag checklist — shift to urgent workup when you see…**",
      "- **Acute/subacute onset** or **stepwise** decline.",
      "- **Fever, new headache, meningism**, or **systemic illness** (weight loss, night sweats).",
      "- **Seizures**, **papilledema**, or new **focal deficits**.",
      "- **Rapidly fluctuating consciousness** or delirium out of proportion.",
      "- **Cancer/immunosuppression**, **anticoagulation/trauma**, or signs of **vasculitis/CNS infection**.",
      "- [blue]If any present → abandon routine AD pathway and pursue **acute neurology/infectious/oncology** algorithms immediately[/blue].",
    ],
  },
  {
    id: "AD-DDX-20005",
    topic: "Geriatrics • Alzheimer’s disease — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle: "Parsing the differentials in an amnestic dementia",
    stem: "A 74-year-old retired pharmacist has 3 years of gradually progressive forgetfulness. Family reports repeated questions, misplacing items, getting lost on familiar routes, and difficulty recalling recent conversations despite intact attention. Language is fluent with mild word-finding pauses; behavior and sleep are unremarkable. Exam: poor delayed recall with minimal cueing benefit; mild constructional errors. MRI shows bilateral hippocampal/mesial temporal atrophy with relative sparing of frontal lobes. Which diagnosis best explains this presentation?",
    options: [
      { key: "A", text: "Alzheimer’s disease (amnestic presentation)" },
      { key: "B", text: "Dementia with Lewy bodies (DLB)" },
      { key: "C", text: "Behavioral-variant frontotemporal dementia (bvFTD)" },
      {
        key: "D",
        text: "Vascular dementia (multi-infarct or small-vessel disease)",
      },
      {
        key: "E",
        text: "Major depressive disorder with cognitive impairment (pseudodementia)",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gradual, insidious episodic memory decline** with poor cueing benefit points to a **storage** (hippocampal) problem characteristic of AD.",
      "- MRI pattern of [blue]**hippocampal/mesial temporal atrophy**[/blue] matches amnestic Alzheimer’s; frontal lobes relatively spared early.",
      "- **Navigation problems** and **repetition of questions** reflect impaired consolidation in hippocampal networks.",
      "- Relative preservation of early **behavior**, **sleep**, and **parkinsonism** makes FTD/DLB less likely.",
      "- [yellow]Pattern lock:[/yellow] memory-first decline + poor cueing + hippocampal atrophy = **Alzheimer’s** 🧠📉",
      "**2️⃣ Why the other options are wrong**",
      "- **B (DLB):** Core features are **visual hallucinations**, **cognitive fluctuations**, **spontaneous parkinsonism**, and **REM sleep behavior disorder**—absent here; hippocampal atrophy is not the dominant early imaging pattern.",
      "- **C (bvFTD):** Early **behavior/personality change**, disinhibition/apathy, dietary changes, and frontal/insular atrophy; memory may be relatively spared early—mismatch with amnestic presentation.",
      "- **D (Vascular dementia):** Often **stepwise** course with focal deficits; MRI shows **strategic infarcts** or confluent **white-matter disease**, not isolated hippocampal atrophy.",
      "- **E (Pseudodementia):** Depressed mood, variable effort, and **improved recall with cues** are typical; structural atrophy pattern is not expected.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) emphasizing delayed recall and cueing; poor recall with minimal cueing benefit suggests AD; **Confirms?** ❌",
      "- **Next Diagnostic step:** 🧠 MRI brain to assess [blue]medial temporal (hippocampal) atrophy[/blue] and exclude structural mimics; **Confirms?** ➕",
      "- **Best Diagnostic Step:** **CSF AD biomarkers** (↓Aβ42 or ↓Aβ42/40, ↑p-tau, ↑t-tau) or **amyloid PET** ± **tau PET** for in-vivo confirmation; **Confirms?** ✅",
      "- **Adjuncts:** Labs (TSH, B12, CBC/CMP), depression screen, sleep apnea screening; FDG-PET (posterior cingulate/precuneus hypometabolism) if needed.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving, meds, finances), caregiver education, exercise, Mediterranean-style diet, vascular risk control.",
      "- **First Line:** [green]Cholinesterase inhibitor[/green] (donepezil/rivastigmine/galantamine) for mild–moderate AD; [green]memantine[/green] for moderate–severe or add-on; cognitive rehab and structured routines.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green]; consider **anti-amyloid monoclonals** only if **biomarker-positive**, appropriate stage, and monitoring/ARIA risk management feasible; [red]minimize anticholinergics and sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained (DDx focus)**",
      "- **AD:** Aβ plaques and tau tangles disrupt hippocampal circuits → **encoding/storage failure** → poor cueing.",
      "- **DLB:** α-synuclein (Lewy bodies) in brainstem/limbic/neocortex → hallucinations, fluctuations, parkinsonism; visuospatial deficits early.",
      "- **bvFTD:** Tau/TDP-43 pathology in frontal/insular networks → behavior/executive dysfunction > memory early.",
      "- **Vascular dementia:** Ischemic burden (infarcts/leukoaraiosis) → stepwise decline, focal signs, executive slowing.",
      "- **Depression:** Network intact; **retrieval** problem improves with cues and mood treatment; no characteristic atrophy.",
      "**6️⃣ Symptoms — pattern recognition for DDx**",
      "- **AD:** Repeats questions, misplaces items, gets lost; poor cueing; hippocampal atrophy.",
      "- **DLB:** Hallucinations, fluctuations, REM sleep behavior disorder, parkinsonism.",
      "- **bvFTD:** Disinhibition/apathy, loss of empathy, compulsions, hyperorality; frontal atrophy.",
      "- **Vascular:** Stepwise decline, focal deficits (e.g., hemiparesis), gait disturbance; vascular lesions on imaging.",
      "- **Depression:** Low mood/anhedonia, variable effort, “I don’t know” responses, better with prompting.",
      "- [purple]Exam pearl:[/purple] ==Storage failure (poor cueing) + hippocampal atrophy → choose **AD** over retrieval disorders==",
    ],
  },
  {
    id: "AD-INV-20006",
    topic: "Geriatrics • Alzheimer’s disease — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test when you suspect amnestic Alzheimer’s",
    stem: "A 75-year-old with 2–3 years of gradually progressive episodic memory loss (repeated questions, misplacing items, getting lost) has poor delayed recall with minimal cueing benefit on bedside testing. Language/behavior are relatively preserved early; neuro exam is nonfocal. What is the **best initial investigation** to pursue?",
    options: [
      { key: "A", text: "Non-contrast CT head" },
      {
        key: "B",
        text: "MRI brain with volumetric sequences (medial temporal assessment)",
      },
      {
        key: "C",
        text: "CSF Alzheimer biomarkers (Aβ42, Aβ42/40, p-tau, t-tau)",
      },
      { key: "D", text: "Amyloid PET (± tau PET)" },
      { key: "E", text: "Comprehensive neuropsychological testing" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **MRI brain with volumetrics** is the **best initial investigation** in suspected Alzheimer’s disease (AD) because it both **excludes structural mimics** (tumor, subdural, NPH, strategic stroke) and identifies a **syndrome-consistent pattern**.",
      "- In amnestic AD, MRI often shows [blue]**bilateral hippocampal/mesial temporal atrophy**[/blue] with relative sparing of primary cortices—high-yield for clinico-radiologic alignment.",
      "- MRI outperforms CT for **gray-matter resolution** and **pattern recognition**; volumetrics quantify medial temporal atrophy and asymmetry.",
      "- [green]Practical win:[/green] one scan answers “**Is there a treatable structural cause?**” and “**Does the pattern fit AD?**” 🧠🖥️",
      "**2️⃣ Why the other options are wrong**",
      "- **A. CT head:** Useful if MRI unavailable/contraindicated, but **less sensitive** for medial temporal atrophy and subtle pathology.",
      "- **C. CSF biomarkers:** Excellent for **biomarker confirmation**, but **not first**—invasive and pursued after structural imaging rules out mimics.",
      "- **D. Amyloid PET:** Powerful but **costly/limited access** and not first-line; used when diagnosis remains uncertain after MRI/labs or for treatment decisions.",
      "- **E. Neuropsych testing:** Crucial to **quantify domains** and track change, but imaging is prioritized initially to **exclude structural disease**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) emphasizing **delayed recall** and cueing → **poor recall, minimal cueing benefit**. **Confirms?** ❌ Suggests AD pattern.",
      "- **Next Diagnostic step (Best Initial Investigation):** 🧠 **MRI brain with volumetrics** → [blue]hippocampal/mesial temporal atrophy[/blue], rule out mass/subdural/NPH/strategic stroke. **Confirms?** ➕ Strongly supports AD and excludes mimics.",
      "- **Best Diagnostic Step (for in-vivo confirmation):** **CSF AD profile** (↓Aβ42/42–40, ↑p-tau, ↑t-tau) **or** **amyloid PET** ± **tau PET**. **Confirms?** ✅ Biomarker-consistent AD.",
      "- **Adjuncts:** Labs (TSH, B12, CBC/CMP), depression screen, OSA screen; FDG-PET (posterior cingulate/precuneus hypometabolism) if needed.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving, meds, finances), caregiver education, exercise + Mediterranean-style diet, vascular risk control.",
      "- **First Line:** [green]Cholinesterase inhibitor[/green] for mild–moderate AD; **memantine** for moderate–severe or add-on; cognitive rehab, routines, environmental supports.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green]. Consider **anti-amyloid monoclonals** only if **biomarker-positive**, appropriate stage, and monitoring for ARIA is feasible; [red]minimize anticholinergics/sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Aβ plaques** and **tau tangles** disrupt hippocampal circuits, causing **encoding/storage failure** → **poor delayed recall** and weak cueing.",
      "- Network degeneration yields **mesial temporal atrophy** on MRI and posterior cingulate/precuneus hypometabolism on FDG-PET.",
      "- Biomarkers (CSF/PET) capture **amyloid and tau** pathology in vivo, corroborating the structural/clinical picture.",
      "**6️⃣ Symptoms — pattern recognition link to imaging**",
      "- **Repeating questions/misplacing items** 📝 → hippocampal storage failure ↔ [blue]medial temporal atrophy[/blue].",
      "- **Poor cueing benefit** 🧩 → true amnestic (storage) deficit, not retrieval alone.",
      "- **Getting lost** 🗺️ → parahippocampal/retrosplenial network involvement.",
      "- [purple]Pearl:[/purple] ==Suspected AD? Do **MRI (with volumetrics)** first—then confirm with **CSF or amyloid PET** as needed==.",
    ],
  },
  {
    id: "AD-GOLD-20007",
    topic: "Geriatrics • Alzheimer’s disease — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle: "What truly confirms Alzheimer’s disease etiology?",
    stem: "A 76-year-old with 3 years of progressive episodic memory loss has MRI showing bilateral hippocampal atrophy. CSF reveals low Aβ42/42–40 and elevated p-tau/t-tau; amyloid PET is positive. Family asks: “What is the final, gold standard test that proves this is Alzheimer’s disease?”",
    options: [
      { key: "A", text: "MRI brain with volumetric analysis" },
      {
        key: "B",
        text: "FDG-PET brain (posterior cingulate/precuneus hypometabolism)",
      },
      {
        key: "C",
        text: "CSF Alzheimer biomarker profile (Aβ42 or Aβ42/40, p-tau, t-tau)",
      },
      { key: "D", text: "Amyloid PET (± tau PET)" },
      {
        key: "E",
        text: "Neuropathology with immunohistochemistry demonstrating amyloid-β plaques and tau neurofibrillary tangles",
      },
    ],
    correct: "E",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gold standard = tissue diagnosis**: **Neuropathology with immunohistochemistry** directly visualizes the defining lesions of AD—**amyloid-β plaques** and **tau neurofibrillary tangles**.",
      "- While **CSF/PET biomarkers** are powerful in vivo tools, they **infer** pathology; only tissue **proves** it.",
      "- In clinical practice, this is typically **post-mortem**; brain biopsy is **rare** and reserved for atypical, rapidly progressive, or treatable-mimic scenarios.",
      "- [yellow]Bottom line:[/yellow] Imaging/CSF = strong evidence; **histopathology** = definitive proof. 🧠🔬",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI volumetrics:** Excellent for **pattern recognition** (hippocampal atrophy) and excluding mimics, but **cannot confirm** molecular pathology.",
      "- **B. FDG-PET:** Shows **hypometabolism** in posterior cingulate/precuneus/temporoparietal cortex—**supportive**, not definitive.",
      "- **C. CSF biomarkers:** High diagnostic accuracy (↓Aβ42/42–40, ↑p-tau, ↑t-tau) but **indirect**; does not show plaques/tangles themselves.",
      "- **D. Amyloid PET (± tau PET):** Visualizes **protein deposition in vivo** and is superb for confirmation/eligibility (e.g., anti-amyloid therapy) yet still **not the gold standard** versus histopathology.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) with **delayed recall + cueing** → poor recall with minimal cueing benefit. **Confirms?** ❌ Suggests AD.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]hippocampal/mesial temporal atrophy[/blue]; excludes structural mimics. **Confirms?** ➕ Supports AD.",
      "- **Best Diagnostic Step (in vivo confirmation):** **CSF AD profile** or **amyloid PET (± tau PET)** consistent with AD biology. **Confirms?** ✅ In vivo biomarker confirmation.",
      "- **Gold Standard (definitive):** 🔬 **Neuropathology with immunohistochemistry** showing **Aβ plaques** and **tau tangles**. **Confirms?** ✅✅ Definitive diagnosis.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving, meds, finances), caregiver education, exercise/Mediterranean diet, vascular risk control.",
      "- **First Line:** [green]Cholinesterase inhibitor** for mild–moderate AD; **memantine** for moderate–severe or add-on[/green]; cognitive rehab, structured routines, sleep hygiene.",
      "- **Gold Standard (therapy context):** No cure; consider **anti-amyloid monoclonal antibodies** only if **biomarker-positive** and suitable for ARIA monitoring; [red]avoid anticholinergics and minimize sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- AD features **amyloid-β plaque** accumulation and **tau tangle** formation leading to **synaptic dysfunction**, neuroinflammation, and **neurodegeneration**.",
      "- Spread follows a **Braak-like trajectory** from transentorhinal/hippocampal regions to association cortex—matching **episodic memory-first** symptoms.",
      "- Biomarkers map this biology in vivo (A/T/[N] framework), but **histology** remains the **final arbiter**.",
      "**6️⃣ Symptoms — pattern recognition link**",
      "- **Repeated questions/misplacing items** 📝 + **poor cueing** 🧩 → hippocampal storage failure.",
      "- **Getting lost** 🗺️ and **constructional errors** 🕒 → progression to parietal networks.",
      "- [purple]Pearl:[/purple] ==CSF/PET convince you; **histopathology** convinces everyone==.",
    ],
  },
  {
    id: "AD-ETIO-20008",
    topic: "Geriatrics • Alzheimer’s disease — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle: "What’s the core cause behind amnestic Alzheimer’s?",
    stem: "A 76-year-old with 3 years of progressive episodic memory loss (repeated questions, getting lost, poor cueing benefit) has MRI showing bilateral hippocampal/mesial temporal atrophy. No early hallucinations or parkinsonism. Which underlying **etiology** best explains this syndrome?",
    options: [
      {
        key: "A",
        text: "Amyloid-β plaque deposition with tau neurofibrillary tangles (Alzheimer pathology)",
      },
      { key: "B", text: "α-synuclein (Lewy body) pathology" },
      { key: "C", text: "TDP-43–predominant frontotemporal degeneration" },
      { key: "D", text: "Multi-infarct vascular injury (strategic strokes)" },
      {
        key: "E",
        text: "Reversible hypothyroidism causing cognitive impairment",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Alzheimer’s disease (AD)** is defined pathologically by **amyloid-β (Aβ) plaques** and **tau neurofibrillary tangles**.",
      "- The **amnestic presentation** with **poor cueing benefit** reflects **hippocampal storage failure**, matching tau spread in medial temporal regions.",
      "- MRI showing [blue]**hippocampal/mesial temporal atrophy**[/blue] aligns with AD’s early neuroanatomy (Braak trajectory).",
      "- Biomarkers (↓Aβ42/42–40, ↑p-tau/t-tau; amyloid PET+) map this **Aβ/tau biology** in vivo.",
      "- [yellow]Pattern lock:[/yellow] gradual memory-first decline + hippocampal atrophy + AD biomarkers → **Aβ + tau**. 🧠🧩",
      "**2️⃣ Why the other options are wrong**",
      "- **B. Lewy body disease (α-synuclein):** Early **visual hallucinations**, **fluctuations**, **parkinsonism**, REM sleep behavior disorder—absent here; hippocampal-predominant atrophy not typical early.",
      "- **C. TDP-43 FTD:** Drives **frontotemporal syndromes** (bvFTD, svPPA) with behavior or language-first features, not storage-dominant amnesia.",
      "- **D. Vascular dementia:** **Stepwise decline** with focal deficits; imaging shows **infarcts/leukoaraiosis**, not isolated hippocampal atrophy.",
      "- **E. Hypothyroidism:** Reversible metabolic cause with systemic signs; cognition usually **improves with treatment** and lacks AD biomarker pattern.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive screen (MoCA/MMSE) with **delayed recall + cueing** → poor recall, minimal cueing benefit. **Confirms?** ❌ Suggests AD.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]hippocampal/mesial temporal atrophy[/blue]; exclude structural mimics. **Confirms?** ➕ Supports AD.",
      "- **Best Diagnostic Step (in vivo etiology):** **CSF AD biomarkers** (↓Aβ42/42–40, ↑p-tau, ↑t-tau) **or** **amyloid PET** ± **tau PET**. **Confirms?** ✅ Consistent with Aβ/tau etiology.",
      "- **Adjuncts:** Labs to rule out reversibles (TSH, B12, CMP/CBC), depression screen; FDG-PET (posterior cingulate/precuneus hypometabolism) if needed.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, safety planning[/green] (driving/meds/finances), caregiver education, exercise + Mediterranean-style diet, vascular risk control.",
      "- **First Line:** [green]Cholinesterase inhibitor** (donepezil/rivastigmine/galantamine) for mild–moderate; **memantine** for moderate–severe or add-on[/green]; cognitive rehab and routines.",
      "- **Gold Standard:** No cure; [green]multidisciplinary care[/green]. Consider **anti-amyloid monoclonals** only if **biomarker-positive** and monitoring for ARIA is feasible; [red]minimize anticholinergics/sedatives[/red].",
      "**5️⃣ Full Pathophysiology Explained (Etiology focus)**",
      "- **Aβ dysmetabolism** → extracellular **plaques**; **tau hyperphosphorylation** → intracellular **neurofibrillary tangles**.",
      "- **Braak spread**: transentorhinal/hippocampal → associative neocortex → explains memory-first symptoms then visuospatial/language/executive involvement.",
      "- Result: **synaptic failure**, neuroinflammation, and network atrophy → **hippocampal shrinkage** on MRI, **posterior cingulate/precuneus hypometabolism** on FDG-PET.",
      "- [purple]Mnemonic:[/purple] “**A & T drive AD**” → **A**myloid + **T**au underpin Alzheimer’s.",
      "**6️⃣ Symptoms — cause → effect mapping**",
      "- **Repeated questions, misplacing items** 📝 → hippocampal storage failure from tau-rich medial temporal degeneration.",
      "- **Poor cueing benefit** 🧩 → true **encoding/storage** deficit (Aβ/tau network damage), not mere retrieval failure.",
      "- **Getting lost** 🗺️ → involvement of parahippocampal/retrosplenial navigational circuits.",
      "- **Later language/visuospatial decline** 🧠 → spread to temporoparietal association cortex along Braak staging.",
      "- [blue]Imaging–biology link:[/blue] hippocampal atrophy ↔ tau tangle burden; amyloid PET/CSF confirms **Aβ** path.",
    ],
  },
  {
    id: "AD-COMP-20009",
    topic: "Geriatrics • Alzheimer’s disease — Complications",
    difficulty: "Medium",
    vignetteTitle:
      "What high-risk downstream complication should you anticipate in Alzheimer’s?",
    stem: "An 80-year-old with moderate Alzheimer’s disease (3 years since diagnosis) has worsening weight loss, prolonged mealtimes, coughing during meals, and two recent chest infections. He also wanders at night and has had one mechanical fall without injury. On exam: inattentive to bolus size, wet/gurgly voice after thin liquids, and reduced gag. Which complication is most important to anticipate and prevent over the next year?",
    options: [
      { key: "A", text: "Normal-pressure hydrocephalus with ventriculomegaly" },
      { key: "B", text: "Parkinsonism with REM sleep behavior disorder" },
      { key: "C", text: "Serotonin syndrome from SSRI therapy" },
      { key: "D", text: "Aspiration pneumonia due to oropharyngeal dysphagia" },
      { key: "E", text: "Intracerebral hemorrhage from anticoagulation" },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Aspiration pneumonia** is a leading cause of **morbidity and mortality** in moderate–severe Alzheimer’s disease.",
      "- Progressive **oropharyngeal dysphagia** (impaired bolus control, delayed swallow, reduced airway protection) emerges as cortical and brainstem networks degenerate.",
      "- The vignette flags classic risk: **cough with meals**, **wet/gurgly voice** after thin liquids, **weight loss**, and **recent chest infections**.",
      "- [green]Anticipating and mitigating aspiration risk[/green] (swallow assessment, texture modification, feeding strategies) is high-yield and outcomes-relevant.",
      "- [yellow]Pattern lock:[/yellow] AD + dysphagia signs + recurrent chest infections → **anticipate aspiration pneumonia**. 🫁🍽️",
      "**2️⃣ Why the other options are wrong**",
      "- **A (NPH):** Different syndrome (gait, incontinence, ventriculomegaly); not the key complication signaled by mealtime cough/wet voice.",
      "- **B (DLB features):** Visual hallucinations, parkinsonism, RBD point to Lewy body disease; not driven by AD dysphagia pattern.",
      "- **C (Serotonin syndrome):** Requires serotonergic excess (clonus, hyperreflexia, hyperthermia); unrelated to swallowing signs here.",
      "- **E (ICH on anticoagulation):** Important if anticoagulated, but the case emphasizes **feeding-related respiratory risk**, not bleeding.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Focused **dysphagia screen** (cough/choke with liquids/solids, wet voice, prolonged meals, weight loss). **Confirms?** ❌ Suggests aspiration risk.",
      "- **Next Diagnostic step:** **Bedside swallow assessment** by speech-language therapist with trial textures/liquids and compensatory postures. **Confirms?** ➕ Risk stratification; immediate safety plan.",
      "- **Best Diagnostic Step:** **Instrumental swallow study** — videofluoroscopic swallow study (VFSS) or FEES → documents **penetration/aspiration**, residue, and safest diet/liquid. **Confirms?** ✅ Objective evidence guides interventions.",
      "- **Adjuncts:** Nutritional labs/weight trend, oral health check, CXR if respiratory symptoms/fever, pulse oximetry; review meds that **worsen sedation or saliva** (anticholinergics/benzos).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aspiration precautions[/green] (upright 30–45 min after meals, slow rate, small boluses), **texture-modified diet** per study, supervised feeds, meticulous **oral hygiene**.",
      "- **First Line:** [green]Speech–language therapy** for swallow techniques[/green] (chin tuck, effortful swallow), safe-fluid strategies (e.g., thickened liquids if indicated), **nutrition optimization** (calorie-dense foods/supplements), **vaccination** (influenza, pneumococcal).",
      "- **Gold Standard:** No curative therapy for AD; for refractory unsafe swallowing, discuss **goals of care** (comfort feeding only, risks/benefits of PEG — [blue]PEG does not prevent aspiration of saliva[/blue]); align with patient values; involve palliative care when appropriate. [red]Avoid routine PEG without shared decision-making[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- AD pathology (**amyloid-β** and **tau**) spreads from **medial temporal** to **parietal/insular/frontal** networks, degrading attention, praxis, and sensorimotor integration for swallowing.",
      "- Cortical control of the **oropharyngeal phase** weakens → delayed swallow initiation, poor laryngeal elevation, and **ineffective airway protection**.",
      "- Frailty, **sarcopenia**, and **poor oral hygiene** increase bacterial load and reduce cough clearance → **microaspiration → pneumonia**.",
      "- Intercurrent **delirium** and sedatives further impair swallow and airway reflexes, compounding risk.",
      "**6️⃣ Symptoms — pattern recognition for complications**",
      "- **Mealtime cough/wet voice** → penetration/aspiration risk.",
      "- **Weight loss, prolonged meals, food pocketing** → ineffective swallow and inadequate intake.",
      "- **Recurrent chest infections/low-grade fevers** → possible silent aspiration.",
      "- **Functional cascade:** aspiration → hospitalization → delirium → deconditioning → pressure injuries/falls.",
      "- [purple]Safety Pearl:[/purple] ==In moderate–severe AD, screen early and often for **dysphagia** to prevent **aspiration pneumonia**==",
    ],
  },
  {
    id: "AD-RISK-20010",
    topic: "Geriatrics • Alzheimer’s disease — Risk Factors",
    difficulty: "Medium",
    vignetteTitle:
      "Modifiable vs nonmodifiable: which risk matters most for prevention?",
    stem: "A 60-year-old accountant with well-controlled hypertension and type 2 diabetes reports progressive bilateral hearing loss since age 52. He is overweight (BMI 30), walks rarely, and lives alone with limited social engagement. He smokes 5–10 cigarettes/day. His mother developed Alzheimer’s disease at 78. He currently has no cognitive symptoms. Which single intervention targets the **most impactful modifiable risk factor** for late-life dementia/Alzheimer’s disease?",
    options: [
      { key: "A", text: "Tighten blood pressure to <130/80 mmHg" },
      {
        key: "B",
        text: "Fit and consistently use hearing aids with auditory rehabilitation",
      },
      {
        key: "C",
        text: "Start a high-intensity statin regardless of ASCVD risk",
      },
      {
        key: "D",
        text: "Adopt Mediterranean-style diet and structured aerobic exercise",
      },
      { key: "E", text: "Immediate smoking cessation program" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- Midlife **hearing loss** carries one of the largest **population-attributable fractions** for late-life dementia and Alzheimer’s risk.",
      "- Addressing hearing loss with **hearing aids + auditory rehabilitation** is a **high-yield, modifiable** prevention strategy.",
      "- Mechanisms include [blue]reduced cognitive load[/blue], [blue]maintained social engagement[/blue], and [blue]less sensory deprivation–driven atrophy[/blue].",
      "- Observational and interventional data show **lower incident dementia risk** among consistent hearing-aid users versus nonusers.",
      "- [yellow]Prevention pearl:[/yellow] In midlife risk counseling, **treat hearing loss early** alongside vascular risk control. 👂🧠",
      "**2️⃣ Why the other options are wrong**",
      "- **A. BP control:** Hypertension is important for dementia prevention, but **hearing loss** contributes a larger modifiable share in midlife; still manage BP aggressively for brain and heart.",
      "- **C. Statin regardless of risk:** Use statins per **ASCVD indications**; evidence does **not** support statins as a primary anti-Alzheimer therapy.",
      "- **D. Diet/exercise:** Powerful for overall brain health and vascular risk, yet **hearing intervention** targets a uniquely strong nonvascular pathway and has large attributable impact.",
      "- **E. Smoking cessation:** Always recommended; smoking raises vascular dementia and overall risk, but **midlife hearing loss** remains the higher-yield modifiable lever in this scenario.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Structured **risk review**: age, family history, education, **hearing screen**, vascular/metabolic profile, sleep, depression, alcohol, activity, social ties. Confirms? ❌ Risk stratifies; no dementia yet.",
      "- **Next Diagnostic step:** **Formal audiology** (pure-tone audiometry, speech discrimination) → quantify loss and fit **hearing aids**. Confirms? ➕ Enables targeted intervention.",
      "- **Best Diagnostic Step (if cognitive concern emerges):** **Cognitive screening** (MoCA) and **MRI brain** for patterns of atrophy; **CSF or amyloid/tau PET** only if symptomatic and diagnosis uncertain. Confirms? ✅ For symptomatic cases.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat hearing loss[/green] with **hearing aids + auditory rehab**; encourage **consistent daily use** and device troubleshooting.",
      "- **First Line (bundle other modifiable risks):** [green]BP <130/80, DM control (A1c individualized), smoking cessation, Mediterranean diet, 150–300 min/wk aerobic exercise, strength training, sleep apnea screening, depression treatment, social engagement**.",
      "- **Gold Standard (prevention reality):** No pill cures risk; [green]multidomain risk reduction over years[/green] has the best evidence; monitor adherence and adjust barriers. [purple]Mnemonic: “**HEAR VITALS**” — **Hear**ing, **V**ascular, **I**nflammation, **T**rauma, **A**ctivity, **L**earning (cognitive), **S**leep[/purple].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Alzheimer biology** = **amyloid-β plaques** and **tau tangles**; risk is shaped by **age**, **genetics (APOE ε4)**, and **lifetime exposures**.",
      "- **Hearing loss → cognitive load**: brain reallocates resources to decode sound, reducing encoding capacity and promoting network inefficiency.",
      "- **Sensory deprivation** accelerates **temporal/hippocampal atrophy** and **social isolation**, both linked to cognitive decline.",
      "- **Vascular factors** (HTN, diabetes, smoking) add [blue]ischemic/white-matter injury[/blue] and neuroinflammation, synergizing with AD pathology.",
      "- [yellow]Upstream wins[/yellow] come from **multi-domain modification**, with **hearing** a centerpiece in midlife.",
      "**6️⃣ Symptoms — risk → phenotype mapping**",
      "- **Untreated hearing loss** 👂 → social withdrawal, miscommunication, cognitive load → later **amnestic decline**.",
      "- **Hypertension/diabetes/smoking** 💢 → microvascular disease → **processing speed/executive** deficits → worsened AD trajectory.",
      "- **Low activity + isolation** 🛋️ → reduced cognitive reserve → earlier clinical expression of pathology.",
      "- **Family history/APOE ε4** 🧬 → higher baseline risk; modifiable factors still shift **onset and slope**.",
      "- [blue]Pattern to remember:[/blue] ==In midlife prevention counseling, **treat hearing loss first**, then stack vascular, lifestyle, sleep, and mood strategies==",
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
              {mm}m {ss}s
            </p>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <p className="font-semibold mb-2">Questions to review</p>
          {wrong.length === 0 ? (
            <p className="text-slate-600 text-sm">
              Nice — no incorrect answers 🎉
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
export default function DementiaAlzheimers() {
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
  }, [finished]);

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
      title="Start Alzheimer’s Question Bank"
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
