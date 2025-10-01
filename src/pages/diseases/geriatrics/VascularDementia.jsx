// src/pages/diseases/geriatrics/VascularDementia.jsx
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

/* ------------------------ Vascular Dementia Question Bank ------------------------ */
/* Add images in /public and set q.image = "/file.png" if you want figures */
const QUESTIONS = [
  {
    id: "VaD-DEF-30001",
    topic: "Geriatrics • Vascular dementia — Definition & Core Concept",
    difficulty: "Medium",
    vignetteTitle: "What exactly is vascular dementia?",
    stem: "A 78-year-old with hypertension, diabetes, and atrial fibrillation has stepwise cognitive decline after several TIAs and one lacunar stroke. He has slowed thinking, impaired executive function, and focal exam findings (right pronator drift, brisk reflexes). MRI shows multiple lacunes and confluent periventricular white-matter hyperintensities. Which definition best captures the **core concept** of vascular dementia?",
    options: [
      {
        key: "A",
        text: "A progressive neurodegenerative disorder defined by amyloid-β plaques and tau tangles causing hippocampal-predominant memory loss",
      },
      {
        key: "B",
        text: "Cognitive impairment due to cerebrovascular brain injury (infarcts, hemorrhage, or ischemic white-matter disease) with a temporal/pathophysiologic link between vascular events and cognitive decline",
      },
      {
        key: "C",
        text: "A primary language-led dementia with selective degeneration of the anterior temporal lobes",
      },
      {
        key: "D",
        text: "A rapidly progressive dementia caused by prion protein misfolding with myoclonus and characteristic EEG changes",
      },
      {
        key: "E",
        text: "A neurodegenerative synucleinopathy with early visual hallucinations, cognitive fluctuations, and spontaneous parkinsonism",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** = **major neurocognitive disorder due to vascular disease**: cognitive/functional decline caused by **cerebrovascular brain injury** (large/small infarcts, hemorrhage, **ischemic white-matter disease**).",
      "- The diagnosis requires a **clinical–radiologic link**: timing (onset after stroke or stepwise with TIAs), **focal neurological signs**, and **imaging evidence** of vascular lesions explaining the deficits.",
      "- Typical phenotype emphasizes **processing speed/executive dysfunction** > pure amnestic loss, with **gait disturbance**, pseudobulbar affect, urinary urgency in subcortical forms.",
      "- Course can be **stepwise**, **fluctuating**, or insidiously progressive when small-vessel disease accumulates. [yellow]Core concept: brain network damage from vascular hits → cognitive impairment[/yellow]. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s):** Describes **amyloid/tau** neurodegeneration with hippocampal memory-first decline—**not vascular injury**.",
      "- **C (svPPA):** Language-led semantic loss from anterior temporal degeneration—**non-vascular**.",
      "- **D (Prion disease):** **Rapid** course with myoclonus and periodic EEG; not a vascular mechanism.",
      "- **E (DLB):** **Hallucinations, fluctuations, parkinsonism** from α-synuclein; vascular lesions are not the driver.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive profile (MoCA with **executive/attention** items), full neuro exam for **focal deficits**; vascular risk review. **Confirms?** ❌ Suggests VaD pattern.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** (preferred over CT) → [blue]lacunes, cortical/subcortical infarcts, microbleeds, and white-matter hyperintensities[/blue] in a distribution matching deficits. **Confirms?** ➕ Supports VaD when lesions explain cognition.",
      "- **Best Diagnostic Step:** **Establish cerebrovascular causality**: correlate timeline (post-stroke decline/stepwise course) + imaging burden/strategic infarcts (e.g., thalamus, caudate) + exclude alternative primary neurodegeneration with **CSF AD biomarkers** or **amyloid PET** if mixed etiology suspected. **Confirms?** ✅ Clinico-radiologic diagnosis of VaD (or mixed).",
      "- **Adjuncts:** Vascular work-up (ECG/AF, carotid/CTA/MRA, echo for embolic source), labs (lipids/A1c), BP monitoring; screen for sleep apnea.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — BP target per guidelines, statin for ASCVD risk, diabetes management, smoking cessation, exercise, Mediterranean-style diet.",
      "- **First Line:** [green]Antiplatelet therapy[/green] (single agent) for non-cardioembolic ischemic disease; **anticoagulation** for atrial fibrillation if indicated; **cognitive rehab** focusing on executive strategies; manage gait/balance with PT; treat depression/apathy.",
      "- **Gold Standard:** No cure; [green]prevent further vascular injury[/green] is paramount. Consider **cholinesterase inhibitor** or **memantine** in *selected* VaD or **mixed AD/VaD** for symptomatic benefit (modest effect). [red]Avoid hypotension/over-sedation[/red] which worsens perfusion/cognition.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Large-vessel infarcts** (strategic cortex, thalamus) and **small-vessel disease** (lacunes, white-matter ischemia) disconnect **fronto–subcortical circuits** vital for attention, speed, and executive control.",
      "- **Microvascular pathology** (lipohyalinosis, arteriolosclerosis) and **endothelial dysfunction** reduce network efficiency; recurrent hits produce cumulative cognitive debt.",
      "- Mixed pathology is common: vascular injury **lowers cognitive reserve** and **unmasks** concomitant Alzheimer changes.",
      "- [purple]Mnemonic:[/purple] “**S.T.E.P.**” → **S**tepwise decline, **T**IAs/strokes, **E**xecutive slowing, **P**eriventricular WMH.",
      "**6️⃣ Symptoms — core pattern recognition**",
      "- **Slowed processing & executive dysfunction** 🐢🧩 → fronto–subcortical disconnection from small-vessel disease.",
      "- **Gait disturbance & falls** 🚶‍♂️↘️ → subcortical WM involvement (‘lower body parkinsonism’).",
      "- **Pseudobulbar affect/urinary urgency** 😢/🚻 → descending fiber tract disruption.",
      "- **Stepwise decline after strokes** ⬇️➡️⬇️ → temporal link to vascular events.",
      "- [blue]Imaging tie-in:[/blue] lacunes + confluent periventricular WMH or strategic infarcts that **match the deficits**.",
    ],
  },
  {
    id: "VaD-SX-30002",
    topic: "Geriatrics • Vascular dementia — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle:
      "Spot the vascular pattern: executive slowing with stepwise dips",
    stem: "A 79-year-old man with long-standing hypertension, type 2 diabetes, and atrial fibrillation presents with 18 months of cognitive decline. Family reports a 'good day/bad day' pattern with two clear step-downs after TIAs. He mismanages bills and meds, gets stuck switching tasks, and walks more slowly with short steps. He laughs/cry easily (embarrassed afterward) and has new urinary urgency. Memory for recent events is fair with cues, but he is slow and distractible on testing. Which clinical constellation best identifies the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Gradual, memory-first decline with poor cueing benefit; hippocampal-predominant pattern",
      },
      {
        key: "B",
        text: "Fluctuations with recurrent visual hallucinations and spontaneous parkinsonism",
      },
      {
        key: "C",
        text: "Early behavioral disinhibition, apathy, hyperorality with relatively spared episodic memory",
      },
      {
        key: "D",
        text: "Stepwise or fluctuating decline with psychomotor slowing, executive dysfunction, gait disturbance, pseudobulbar affect, and early urinary urgency",
      },
      {
        key: "E",
        text: "Triad of magnetic gait, urinary incontinence, cognitive slowing with ventriculomegaly",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** classically presents with **executive dysfunction** and **psychomotor slowing** rather than pure amnesia.",
      "- **Temporal link** to vascular events: **stepwise dips** after TIA/stroke or fluctuating course with small-vessel disease.",
      "- **Gait disturbance** (short steps, lower-body parkinsonism), **pseudobulbar affect** (emotional lability), and **early urinary urgency** reflect **fronto–subcortical disconnection**.",
      "- **Memory may improve with cues** (retrieval problem) versus the storage failure of Alzheimer’s.",
      "- [yellow]Pattern lock:[/yellow] vascular risks + stepwise course + executive/gait/affect/urinary features → **VaD**. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s):** Memory-first with **poor cueing** and hippocampal atrophy; lacks stepwise vascular signature.",
      "- **B (DLB):** **Visual hallucinations**, pronounced **fluctuations**, and **parkinsonism** without clear vascular temporality.",
      "- **C (bvFTD):** Early **behavioral**/personality change with relative memory sparing and frontal atrophy; not vascular stepwise.",
      "- **E (NPH):** Gait + urinary + cognitive slowing fit, but NPH requires **ventriculomegaly** and often magnetic gait; stepwise TIAs are not typical.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** MoCA with **attention/executive** focus (trail-making, clock, abstraction) + neuro exam for **focal signs**. **Confirms?** ❌ Suggests VaD profile.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]lacunes, cortical/subcortical infarcts, confluent periventricular WMH, microbleeds[/blue] matching deficits/timeline. **Confirms?** ➕ Supports.",
      "- **Best Diagnostic Step:** **Establish causality**: correlate **clinical timeline** (post-stroke/stepwise) + **lesion location/burden**; consider **CSF AD biomarkers/amyloid PET** if mixed AD/VaD suspected. **Confirms?** ✅ Clinico-radiologic VaD (or mixed).",
      "- **Adjuncts:** Vascular workup (ECG for AF, carotid US/CTA/MRA, echocardiography), lipids/A1c, ambulatory BP, sleep apnea screen.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — BP per guideline, statin for ASCVD risk, DM optimization, smoking cessation, exercise, Mediterranean-style diet.",
      "- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic disease; **anticoagulation** for AF when indicated; PT/OT for **gait**; **cognitive rehab** emphasizing external aids and task sequencing; manage mood/apathy and **pseudobulbar affect** (e.g., dextromethorphan–quinidine where appropriate).",
      "- **Gold Standard:** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension and over-sedation[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Small-vessel disease** (arteriolosclerosis, lipohyalinosis) and **infarcts/hemorrhages** disrupt **fronto–subcortical circuits**, degrading processing speed, attention, and executive control.",
      "- **White-matter hyperintensities** disconnect cortical hubs; **microbleeds** signal cerebral amyloid angiopathy or hypertensive small-vessel pathology.",
      "- Repeated vascular hits accumulate **cognitive debt**; mixed pathology common, where vascular injury unmasks/worsens underlying AD.",
      "- [blue]Network view:[/blue] damage to thalamus, caudate, frontal WM tracts → executive/gait/affect/urinary syndrome.",
      "**6️⃣ Symptoms — Clinical Presentation map**",
      "- **Psychomotor slowing & executive dysfunction** 🐢🧩 → fronto–subcortical disconnection.",
      "- **Gait disturbance** 🚶‍♂️↘️ (short steps, wide base) → subcortical WM involvement (‘lower-body parkinsonism’).",
      "- **Pseudobulbar affect** 😢😅 → corticobulbar tract involvement causing emotional lability.",
      "- **Urinary urgency/early incontinence** 🚻 → descending control pathway disruption.",
      "- **Stepwise or fluctuating decline** ⬇️➡️⬇️ → temporal link to TIAs/strokes/small-vessel burden.",
      "- [purple]Pearl:[/purple] ==Cues help memory (retrieval) + executive/gait/affect/urinary + vascular timeline → **think VaD**==",
    ],
  },
  {
    id: "VaD-SIGNS-30003",
    topic: "Geriatrics • Vascular dementia — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to vascular dementia?",
    stem: "An 80-year-old with long-standing hypertension, diabetes, and atrial fibrillation has stepwise cognitive decline after TIAs. On exam: slowed processing, impaired trail-making and set-shifting, reduced verbal fluency, positive grasp reflex, brisk reflexes with right-sided pronator drift, and short-stepped gait with early urinary urgency. Delayed recall improves with category cues. Which set of examination signs best fits the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Poor delayed recall with minimal cueing benefit; constructional apraxia; otherwise nonfocal exam",
      },
      {
        key: "B",
        text: "Fluctuating attention with recurrent visual hallucinations and spontaneous parkinsonism",
      },
      {
        key: "C",
        text: "Nonfluent agrammatic speech with apraxia of speech; left inferior frontal signs",
      },
      {
        key: "D",
        text: "Psychomotor slowing with executive dysfunction (set-shifting/attention), frontal release signs, focal UMN findings (hyperreflexia/pronator drift/Babinski), gait disturbance (short steps/lower-body parkinsonism), early urinary urgency; memory improves with cues",
      },
      {
        key: "E",
        text: "Magnetic gait with ventriculomegaly, urinary incontinence, and subcortical cognitive slowing without focal UMN signs",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** shows **executive dysfunction** (set-shifting, attention) and **psychomotor slowing** on bedside testing.",
      "- **Frontal release signs** (e.g., grasp), **UMN findings** (hyperreflexia, pronator drift, Babinski), and **gait disturbance** (short steps, wide base, lower-body parkinsonism) reflect **fronto–subcortical disconnection**.",
      "- **Urinary urgency** appears early in subcortical small-vessel disease.",
      "- **Delayed recall improves with cues** → retrieval problem (subcortical) rather than the storage failure typical of Alzheimer’s.",
      "- [yellow]Pattern lock:[/yellow] vascular risks + stepwise course + executive/gait/UMN/frontal-release + cueable memory → **VaD**. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s signs):** **Poor cueing benefit** and nonfocal exam point to hippocampal storage failure, not VaD with focal/frontal signs.",
      "- **B (DLB signs):** **Visual hallucinations**, cognitive **fluctuations**, and spontaneous **parkinsonism** without vascular temporality; UMN/frontal-release are not core.",
      "- **C (nfvPPA signs):** Language-output (agrammatism/apraxia of speech) localizes to left IFG/insula; not the executive–gait–UMN cluster of VaD.",
      "- **E (NPH signs):** Magnetic gait + ventriculomegaly + incontinence fit NPH but typically **lack focal UMN signs** and vascular stepwise link.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** MoCA focusing on **attention/executive** (trail-making, clock, abstraction) + full neuro exam for **UMN/frontal-release** signs. **Confirms?** ❌ Suggests VaD.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]lacunes, cortical/subcortical infarcts, confluent periventricular WMH, microbleeds[/blue] matching deficits/timeline. **Confirms?** ➕ Supports VaD.",
      "- **Best Diagnostic Step:** **Clinico-radiologic causality** (stepwise decline post-TIA/stroke or heavy small-vessel burden) ± **CSF AD biomarkers/amyloid PET** if mixed AD/VaD suspected. **Confirms?** ✅ VaD (or mixed).",
      "- **Adjuncts:** Vascular workup (ECG/AF, carotid US/CTA/MRA, echocardiography), ambulatory BP, lipids/A1c, sleep apnea screen.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — guideline BP, statin per ASCVD risk, diabetes optimization, smoking cessation, exercise, Mediterranean-style diet.",
      "- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic disease; **anticoagulation** for AF if indicated; **PT/OT** for gait/balance; **cognitive rehab** with external aids; treat depression/apathy and **pseudobulbar affect** (e.g., dextromethorphan–quinidine when appropriate).",
      "- **Gold Standard:** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension/over-sedation[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Small-vessel disease** (arteriolosclerosis/lipohyalinosis) and **infarcts** disconnect **fronto–subcortical circuits**, producing **slowing, executive dysfunction, gait disturbance, and UMN signs**.",
      "- **White-matter hyperintensities** degrade network efficiency; **microbleeds** indicate hypertensive disease or CAA.",
      "- Mixed pathology is common; vascular injury **reduces cognitive reserve** and **amplifies** coexisting Alzheimer changes.",
      "- [blue]Network view:[/blue] thalamus–caudate–frontal WM tract damage → executive/affect/urinary phenotype.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Executive dysfunction & slowing** 🐢🧩 → impaired set-shifting/attention on MoCA (TMT-B, clock).",
      "- **Frontal release signs** ✋ → grasp/snout from frontal disinhibition.",
      "- **UMN findings** ⚡ → hyperreflexia, pronator drift, Babinski from corticospinal tract involvement.",
      "- **Gait disturbance** 🚶‍♂️↘️ → short steps, wide base, lower-body parkinsonism from subcortical WM disease.",
      "- **Urinary urgency** 🚻 → descending control pathway disruption.",
      "- **Cueable memory** 🧩 → retrieval deficit (subcortical) vs storage deficit of AD.",
      "- [purple]Pearl:[/purple] ==Executive slowing + frontal/UMN signs + vascular timeline → **think VaD**==",
    ],
  },
  {
    id: "VaD-REDFLAGS-30004",
    topic: "Geriatrics • Vascular dementia — Red Flags",
    difficulty: "Medium",
    vignetteTitle:
      "When it’s not typical vascular dementia: spot the red flags",
    stem: "A 78-year-old with hypertension and diabetes is referred for suspected vascular dementia after a transient episode of confusion. Over 6 weeks, family notes rapidly worsening attention, new daily headaches, low-grade fevers, and one focal seizure. Exam shows fluctuating consciousness, neck stiffness, and left homonymous hemianopia. Which feature set most strongly signals a RED FLAG requiring urgent reevaluation rather than routine vascular dementia workup?",
    options: [
      {
        key: "A",
        text: "Stepwise decline after strokes with executive slowing and gait disturbance over 3 years",
      },
      {
        key: "B",
        text: "Rapid (weeks–months) global decline with fever, new headache, seizure, meningism, or papilledema",
      },
      {
        key: "C",
        text: "Gradual executive dysfunction with white-matter hyperintensities on prior MRI",
      },
      {
        key: "D",
        text: "Stable mild cognitive impairment responsive to cues and normal neuro exam",
      },
      {
        key: "E",
        text: "Slow progression with urinary urgency and pseudobulbar affect in the setting of lacunes",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** typically evolves **stepwise** or slowly with vascular events—not as a **rapid febrile encephalopathy**.",
      "- **Fever, new/worsening headache, seizure, meningism, papilledema, or focal cortical deficits** in a **weeks–months** time frame point to **infection, inflammation, neoplasm, hemorrhage, or venous thrombosis**.",
      "- These features demand an **urgent acute neurology pathway** (imaging + CSF) rather than outpatient cognitive workup.",
      "- [yellow]Safety hinge:[/yellow] **FAST + HOT + ELECTRIC + PRESSURE** → Fast decline, fever, seizures, raised ICP = **not routine VaD**. 🚨",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Classic vascular timeline: **stepwise** dips after strokes with **executive/gait** issues—expected VaD pattern, not a red flag.",
      "- **C:** Chronic executive slowing with WMH fits small-vessel VaD; urgent pathologies are not suggested.",
      "- **D:** Stable MCI without neuro signs is low-risk; monitor and risk-modify, not emergent.",
      "- **E:** Urinary urgency/pseudobulbar affect with lacunes fits subcortical VaD; again, not an acute red-flag cluster.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** [red]Stabilize ABCs; fingerstick glucose; focused neuro exam[/red]. **Confirms?** ❌ Safety first.",
      "- **Next Diagnostic step:** **Urgent non-contrast CT head** to exclude hemorrhage/mass → proceed to **MRI brain with and without contrast** ± **MRV/CTV** if venous thrombosis suspected. **Confirms?** ➕ Identifies structural/inflammatory causes.",
      "- **Best Diagnostic Step:** **Lumbar puncture** (after imaging rules out mass effect) with **cell count, protein/glucose, cultures**, **HSV/VZV PCR**, **autoimmune encephalitis panel**; **EEG** for seizures/encephalopathy. **Confirms?** ✅ Etiologic diagnosis.",
      "- **Adjuncts:** CBC, CMP, ESR/CRP, blood cultures; autoimmune/vasculitis serologies; coagulation panel; consider **CTA** for vasculopathy.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Seizure control[/green] (benzodiazepine → levetiracetam), head elevation, analgesia/antipyretics; manage BP per stroke/ICP protocols.",
      "- **First Line (empiric while pending):** **IV acyclovir** if encephalitis possible; add **broad-spectrum antibiotics** if meningitis/abscess suspected; consider **steroids** only when indicated (e.g., vasculitis/tumor edema) after infectious causes addressed.",
      "- **Gold Standard:** **Cause-specific therapy** (antivirals/antibiotics, anticoagulation for CVST, immunotherapy for autoimmune encephalitis, neurosurgical management for mass/abscess). For confirmed VaD without red flags, pivot to **vascular risk control + secondary stroke prevention**.",
      "**5️⃣ Full Pathophysiology Explained (why these are red flags)**",
      "- **VaD** results from **ischemic/hemorrhagic vascular injury** accumulating over time, usually **non-febrile** and **non-epileptic** early.",
      "- **Infectious/autoimmune/neoplastic** processes create **inflammation, edema, mass effect**, and **cortical hyperexcitability** → **fever, headache, seizures, papilledema**.",
      "- **Cerebral venous sinus thrombosis** or **intracranial hemorrhage** can mimic cognitive decline but add **pressure signs** and **rapid change**.",
      "- Time course is the tell: **weeks–months** with systemic/neuroirritative features ≠ degenerative/vascular slow burn.",
      "**6️⃣ Red-flag checklist — switch to urgent workup when you see…**",
      "- **Acute/subacute** cognitive decline (days–weeks) or **dramatic fluctuations** with reduced consciousness.",
      "- **Fever**, **new headache**, **meningism**, **papilledema**, or **recurrent seizures/status**.",
      "- **New focal cortical deficits** (aphasia, neglect, homonymous field cut) not explained by prior strokes.",
      "- **Cancer/immunosuppression**, **anticoagulation/trauma**, **vasculitis** or **venous thrombosis** risk.",
      "- [blue]If present → bypass routine VaD evaluation and pursue **acute neuroimaging + CSF/EEG** now[/blue].",
    ],
  },
  {
    id: "VaD-DDX-30005",
    topic: "Geriatrics • Vascular dementia — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle:
      "Parsing the differentials in a stepwise, executive-predominant dementia",
    stem: "An 80-year-old with long-standing hypertension, diabetes, and atrial fibrillation has 2 years of cognitive decline with two clear stepwise 'drop-offs' after TIAs. Family notes slowed thinking, difficulty planning multi-step tasks, short-stepped gait, emotional lability, and early urinary urgency. Memory improves with cues, but he is distractible and slow. MRI shows multiple lacunes and confluent periventricular white-matter hyperintensities. Which diagnosis best explains this presentation?",
    options: [
      { key: "A", text: "Alzheimer’s disease (amnestic presentation)" },
      { key: "B", text: "Dementia with Lewy bodies (DLB)" },
      { key: "C", text: "Behavioral-variant frontotemporal dementia (bvFTD)" },
      {
        key: "D",
        text: "Vascular dementia (VaD) — small-vessel disease with lacunes/WMH",
      },
      { key: "E", text: "Normal-pressure hydrocephalus (NPH)" },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**\n- **Temporal link to vascular events**: stepwise dips after TIAs/strokes are classic for **VaD**.\n- **Cognitive profile**: **psychomotor slowing** and **executive dysfunction** > pure amnesia; **memory improves with cues** (retrieval problem).\n- **Subcortical syndrome**: **gait disturbance** (short steps), **pseudobulbar affect**, **early urinary urgency** → fronto–subcortical disconnection.\n- **Imaging match**: [blue]lacunes + confluent periventricular white-matter hyperintensities (WMH)[/blue] consistent with small-vessel VaD.\n- [yellow]Pattern lock:[/yellow] vascular risks + stepwise course + executive/gait/affect/urinary + WMH/lacunes → **VaD**. 🧠🩸",
      "**2️⃣ Why the other options are wrong**\n- **A. Alzheimer’s disease:** **Memory-first** decline with **poor cueing**, hippocampal atrophy; lacks vascular stepwise pattern and subcortical gait/UMN/frontal-release features.\n- **B. DLB:** **Visual hallucinations**, **cognitive fluctuations**, **spontaneous parkinsonism**, and **RBD** dominate; imaging does not hinge on lacunes/WMH burden.\n- **C. bvFTD:** Early **behavior/personality change**, disinhibition/apathy, stereotypies; MRI frontal/insular atrophy; stepwise vascular timeline is absent.\n- **E. NPH:** **Magnetic gait**, urinary incontinence, subcortical slowing **with ventriculomegaly**; cueable memory can occur, but TIAs/lacunes/WMH pattern points elsewhere.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**\n- **Initial Diagnostic step:** MoCA/MMSE with **attention/executive** emphasis (trail-making, clock, abstraction) + full neuro exam for **UMN/frontal-release** signs. **Confirms?** ❌ Suggests VaD profile.\n- **Next Diagnostic step:** 🧠 **MRI brain** → [blue]lacunes, cortical/subcortical infarcts, confluent periventricular WMH, microbleeds[/blue] that map to deficits/timeline. **Confirms?** ➕ Supports VaD.\n- **Best Diagnostic Step:** **Clinico-radiologic causality**: correlate **timeline (post-TIA/stroke/stepwise)** + **lesion load/location**; consider **CSF AD biomarkers or amyloid PET** if mixed AD/VaD is suspected. **Confirms?** ✅ VaD (or mixed).",
      "**4️⃣ Management / Treatment (in order)**\n- **Initial Management:** [green]Aggressive vascular risk control[/green] — guideline BP, statin per ASCVD risk, diabetes optimization, smoking cessation, Mediterranean diet, exercise.\n- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic disease; **anticoagulation** for AF if indicated; **PT/OT** for gait; **cognitive rehab** (external aids, task sequencing); treat depression/apathy and **pseudobulbar affect**.\n- **Gold Standard:** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension/over-sedation[/red].",
      "**5️⃣ Full Pathophysiology Explained (DDx focus)**\n- **VaD:** ischemic/hemorrhagic injury (lacunes, WMH, infarcts) → **fronto–subcortical disconnection** → slowing/executive deficits, gait/affect/urinary changes.\n- **AD:** **Aβ/tau** pathology → hippocampal storage failure → amnestic syndrome with poor cueing.\n- **DLB:** **α-synuclein** spread → hallucinations/fluctuations/parkinsonism; visuospatial deficits early.\n- **bvFTD:** **TDP-43/tau** in frontal–insular networks → behavior/executive change > memory.\n- **NPH:** CSF dynamics → ventriculomegaly → gait then continence/cognition; potentially shunt-responsive.",
      "**6️⃣ Symptoms — pattern recognition for DDx**\n- **VaD:** Stepwise or fluctuating decline; **executive slowing**, **gait disturbance**, **pseudobulbar affect**, **early urinary urgency**; memory **helped by cues**; MRI with **lacunes/WMH**.\n- **AD:** Gradual memory-first decline; **poor cueing**; hippocampal atrophy.\n- **DLB:** Hallucinations, fluctuations, **spontaneous parkinsonism**, RBD.\n- **bvFTD:** Disinhibition/apathy, loss of empathy, stereotypies; frontal atrophy.\n- **NPH:** **Magnetic gait** + ventriculomegaly + urinary incontinence; tap test may help predict shunt response.\n- [purple]Pearl:[/purple] ==Cueable memory + executive/gait/affect/urinary + vascular timeline → choose **VaD** over AD/DLB/FTD/NPH==",
    ],
  },
  {
    id: "VaD-INV-30006",
    topic: "Geriatrics • Vascular dementia — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test when you suspect vascular dementia",
    stem: "An 81-year-old with hypertension, diabetes, and atrial fibrillation has 2 years of stepwise cognitive decline after TIAs. Family notes slowed thinking, trouble organizing tasks, short-stepped gait, emotional lability, and early urinary urgency. Bedside testing shows impaired set-shifting and attention; delayed recall improves with cues. What is the **best initial investigation**?",
    options: [
      { key: "A", text: "Non-contrast CT head" },
      {
        key: "B",
        text: "MRI brain with vascular/small-vessel protocol (T1/T2/FLAIR/DWI/SWI)",
      },
      { key: "C", text: "CSF Alzheimer biomarkers (Aβ42/40, p-tau, t-tau)" },
      { key: "D", text: "FDG-PET brain" },
      { key: "E", text: "Comprehensive neuropsychological testing" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **MRI brain with a small-vessel/vascular protocol (T1/T2/FLAIR/DWI/SWI)** is the **best initial investigation** for suspected vascular dementia (VaD).",
      "- MRI provides **superior sensitivity** to detect **lacunes, strategic infarcts, confluent white-matter hyperintensities (WMH), microbleeds**, and **acute/subacute ischemia** (DWI).",
      "- The pattern/burden and **anatomic mapping to deficits and timeline** establish the clinico-radiologic link essential for VaD.",
      "- SWI flags **microbleeds** (hypertensive SVD vs CAA), informing antithrombotic risk; FLAIR quantifies **WMH** load.",
      "- [yellow]Bottom line:[/yellow] MRI both **rules out mimics** and **demonstrates vascular injury** that matches the clinical story. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **A. CT head:** Useful if MRI unavailable/contraindicated or to exclude acute bleed, but **insensitive** for WMH, lacunes, and microbleeds.",
      "- **C. CSF AD biomarkers:** Helpful to assess **mixed AD/VaD**, but **not first**—doesn’t show vascular injury or stroke burden.",
      "- **D. FDG-PET:** May show network hypometabolism but is **nonspecific** and secondary to structural imaging.",
      "- **E. Neuropsych testing:** Quantifies deficits; **supports** diagnosis but cannot demonstrate cerebrovascular lesions.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Cognitive screen targeting **attention/executive** functions (trail-making, clock, abstraction) + neuro exam for **UMN/frontal-release** signs. **Confirms?** ❌ Suggests VaD profile.",
      "- **Next Diagnostic step (Best Initial Investigation):** 🧠 **MRI brain (T1/T2/FLAIR/DWI/SWI)** → [blue]lacunes, WMH (Fazekas), microbleeds, strategic infarcts[/blue] that map to symptoms and stepwise timeline. **Confirms?** ➕ Supports.",
      "- **Best Diagnostic Step (to secure causality/mixed etiologies):** Correlate **timeline + lesion location/burden**; add **CSF AD biomarkers or amyloid PET** if mixed AD/VaD suspected. **Confirms?** ✅ Clinico-radiologic VaD (or mixed).",
      "- **Adjuncts:** Vascular workup (ECG for AF, carotid US/CTA/MRA, echocardiography), lipids/A1c, ambulatory BP, sleep apnea screen.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — guideline BP targets, statin per ASCVD risk, diabetes optimization, smoking cessation, Mediterranean diet, exercise.",
      "- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic disease; **anticoagulation** for AF if indicated; **PT/OT** for gait; **cognitive rehab** (external aids, task sequencing); treat depression/apathy and **pseudobulbar affect**.",
      "- **Gold Standard:** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension/over-sedation[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Small-vessel disease** (arteriolosclerosis, lipohyalinosis) and **infarcts/hemorrhages** disrupt **fronto–subcortical circuits**, producing **slowing, executive dysfunction, gait disturbance, affect/urinary changes**.",
      "- MRI visualizes the **network disconnection** (WMH, lacunes) and **hemorrhagic markers** (microbleeds) that drive the syndrome.",
      "- Establishing a **temporal and anatomic link** between lesions and cognitive course is central to diagnosing VaD.",
      "**6️⃣ Symptoms — pattern recognition link to imaging**",
      "- **Cueable memory with executive slowing** 🧩 ↔ **WMH/lacunes** in fronto-subcortical tracts.",
      "- **Short-stepped gait & early urgency** 🚶‍♂️🚻 ↔ subcortical WM involvement.",
      "- **Pseudobulbar affect** 😢😅 ↔ corticobulbar tract disruption.",
      "- [purple]Pearl:[/purple] ==Suspected VaD? **MRI with DWI/FLAIR/SWI** first; then consider **AD biomarkers** if mixed disease is on the table==",
    ],
  },
  {
    id: "VaD-GOLD-30007",
    topic: "Geriatrics • Vascular dementia — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle: "What definitively confirms vascular dementia etiology?",
    stem: "An 82-year-old with stepwise cognitive decline after TIAs shows multiple lacunes and confluent periventricular WMH on MRI. Neuro exam reveals frontal release signs, mild right pronator drift, and short-stepped gait. CSF Alzheimer biomarkers are non-AD. Family asks: “What is the final, gold standard test that proves this is vascular dementia?”",
    options: [
      {
        key: "A",
        text: "MRI brain with volumetric analysis and Fazekas scoring",
      },
      { key: "B", text: "FDG-PET brain showing frontoparietal hypometabolism" },
      {
        key: "C",
        text: "CSF Alzheimer biomarker profile (Aβ42/40, p-tau, t-tau)",
      },
      {
        key: "D",
        text: "Neuropathology (post-mortem or, rarely, biopsy) demonstrating cerebrovascular lesions sufficient to cause the cognitive syndrome",
      },
      {
        key: "E",
        text: "Amyloid PET to exclude coexisting Alzheimer’s disease",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gold standard = tissue diagnosis**: **Neuropathology** directly shows **cerebrovascular brain injury** (macro/microinfarcts, lacunes, microhemorrhages, small-vessel arteriolosclerosis, CAA) in patterns/severity **sufficient to explain the cognitive syndrome**.",
      "- Clinical criteria rely on **clinico–radiologic correlation**; only pathology can **prove causality** and quantify mixed disease (e.g., AD + vascular).",
      "- In practice this is almost always **post-mortem**; biopsy is **rare** and reserved for atypical inflammatory/neoplastic suspicions.",
      "- [yellow]Bottom line:[/yellow] MRI/CSF/PET are **supportive**; **histopathology** is definitive. 🧠🔬",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI volumetrics/Fazekas:** Best **initial** structural tool and highly supportive, but **cannot prove** etiologic sufficiency or exclude mixed disease.",
      "- **B. FDG-PET:** Shows network hypometabolism but is **nonspecific** for vascular vs degenerative etiologies.",
      "- **C. CSF AD biomarkers:** Helpful to **exclude AD** or identify mixed pathology, yet **do not confirm** VaD.",
      "- **E. Amyloid PET:** Useful to judge **amyloid co-pathology** (mixed AD/VaD) but is not definitive for vascular causation.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Cognitive screen emphasizing **attention/executive** domains + full neuro exam for **UMN/frontal-release** signs. **Confirms?** ❌ Suggests VaD profile.",
      "- **Next Diagnostic step:** 🧠 **MRI brain (T1/T2/FLAIR/DWI/SWI)** → [blue]lacunes, WMH (Fazekas), microbleeds, strategic infarcts[/blue] that map to timeline/deficits. **Confirms?** ➕ Supports VaD.",
      "- **Best Diagnostic Step (in vivo confirmation/mixing):** **Correlate clinical course with imaging**; add **CSF AD biomarkers** or **amyloid PET** if mixed AD/VaD suspected. **Confirms?** ✅ Clinico–radiologic diagnosis.",
      "- **Gold Standard (definitive):** 🔬 **Neuropathology** showing **vascular lesions sufficient for cognitive impairment** ± quantification of **co-pathologies** (AD, Lewy, TDP-43). **Confirms?** ✅✅ Definitive.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — BP targets, statin per ASCVD risk, diabetes optimization, smoking cessation, Mediterranean diet, exercise.",
      "- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic disease; **anticoagulation** for AF if indicated; **PT/OT** for gait; **cognitive rehab**; treat depression/apathy and **pseudobulbar affect**.",
      "- **Gold Standard (therapy reality):** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension/over-sedation[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Ischemic/hemorrhagic lesions** disrupt **fronto–subcortical circuits** → psychomotor slowing, executive dysfunction, gait/affect/urinary changes.",
      "- **Small-vessel disease** (arteriolosclerosis, lipohyalinosis) causes **WMH**, lacunes; **microbleeds** reflect hypertensive SVD or **CAA**.",
      "- Neuropathology quantifies **lesion burden and distribution**, establishing whether vascular injury is **sufficient** to account for dementia and how much **mixed pathology** contributes.",
      "**6️⃣ Signs — pattern recognition link**",
      "- **Executive slowing & cueable memory** 🧩 ↔ fronto–subcortical disconnection.",
      "- **Gait disturbance, UMN/frontal-release signs** 🚶‍♂️✋ ↔ subcortical and corticospinal tract involvement.",
      "- **Early urinary urgency** 🚻 ↔ descending control pathway disruption.",
      "- [purple]Pearl:[/purple] ==MRI builds the case; **neuropathology** closes it==",
    ],
  },
  {
    id: "VaD-ETIO-30008",
    topic: "Geriatrics • Vascular dementia — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle: "What’s the underlying cause in vascular dementia?",
    stem: "An 82-year-old with long-standing hypertension, diabetes, and hyperlipidemia has a 3-year history of stepwise cognitive decline following TIAs. MRI shows multiple lacunar infarcts in the basal ganglia and thalamus, confluent periventricular white-matter hyperintensities, and scattered microbleeds on SWI. Which underlying **etiology** best explains this presentation?",
    options: [
      {
        key: "A",
        text: "Small-vessel ischemic disease with arteriolosclerosis/lipohyalinosis causing lacunes, white-matter ischemia, and microbleeds",
      },
      {
        key: "B",
        text: "Primary amyloid-β plaques and tau tangles (Alzheimer pathology) without vascular lesions",
      },
      {
        key: "C",
        text: "α-synuclein (Lewy body) pathology leading to visual hallucinations and parkinsonism",
      },
      {
        key: "D",
        text: "Frontotemporal lobar degeneration with TDP-43 causing semantic memory loss",
      },
      {
        key: "E",
        text: "Normal-pressure hydrocephalus with impaired CSF absorption and ventriculomegaly",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** arises when **cerebrovascular lesions** are sufficient to cause the cognitive syndrome.",
      "- The most common cause is **small-vessel disease (SVD)** due to **arteriolosclerosis/lipohyalinosis** from chronic HTN/diabetes → **lacunes** and **white-matter hyperintensities (WMH)**.",
      "- **SWI microbleeds** reflect hypertensive SVD (deep) or CAA (lobar); here vascular risks + deep lesions favor **hypertensive SVD**.",
      "- Clinically matches **stepwise decline** with **executive slowing/gait** from fronto–subcortical disconnection.",
      "- [yellow]Etiology lock:[/yellow] vascular risks + lacunes/WMH + microbleeds → **small-vessel ischemic disease**. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **B. Alzheimer pathology:** Explains amnestic **storage** failure with hippocampal atrophy, not stepwise vascular injury (though mixed disease can coexist).",
      "- **C. Lewy body disease:** Hallucinations, fluctuations, spontaneous parkinsonism dominate; imaging isn’t lacune/WMH/microbleed-centric.",
      "- **D. FTLD–TDP:** Language/behavior-led syndromes (svPPA/bvFTD); not a vascular lesion model.",
      "- **E. NPH:** Triad (magnetic gait, incontinence, cognitive slowing) with **ventriculomegaly**—not the lacune/WMH/microbleed pattern.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Cognitive screen focused on **attention/executive** (trail-making, clock, abstraction) + vascular risk inventory. **Confirms?** ❌ Suggests VaD/SVD profile.",
      "- **Next Diagnostic step:** 🧠 **MRI brain (T1/T2/FLAIR/DWI/SWI)** → [blue]lacunes, confluent WMH (Fazekas), microbleeds[/blue]; DWI for acute/subacute hits. **Confirms?** ➕ Supports vascular etiology.",
      "- **Best Diagnostic Step:** **Clinico–radiologic correlation** (timeline after TIAs/strokes + lesion distribution) ± **CSF AD biomarkers or amyloid PET** to assess **mixed AD/VaD**. **Confirms?** ✅ Establishes vascular causality (or mixed).",
      "- **Adjuncts:** Vascular workup (ECG/AF, carotid US/CTA/MRA, echocardiography), lipids/A1c, ambulatory BP, sleep apnea screen.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aggressive vascular risk control[/green] — BP per guideline, statin per ASCVD risk, diabetes optimization, smoking cessation, Mediterranean diet, exercise.",
      "- **First Line:** [green]Antiplatelet therapy[/green] for non-cardioembolic ischemia; **anticoagulation** for AF if indicated; **PT/OT** for gait; **cognitive rehab** with external aids; treat depression/apathy and **pseudobulbar affect**.",
      "- **Gold Standard:** No cure; [green]prevent further vascular hits[/green]. Consider **cholinesterase inhibitor/memantine** for symptomatic benefit in selected VaD or **mixed AD/VaD** (modest effect). [red]Avoid hypotension/over-sedation** which worsens perfusion/cognition[/red].",
      "**5️⃣ Full Pathophysiology Explained (Etiology focus)**",
      "- **Chronic hypertension/diabetes** → **arteriolosclerosis** (wall thickening, lipohyalinosis) → luminal narrowing and impaired autoregulation.",
      "- Result: **ischemic white-matter injury** (WMH), **lacunar infarcts** in deep gray/WM tracts, and **microbleeds** from fragile vessels.",
      "- These lesions disconnect **fronto–subcortical circuits** → **psychomotor slowing, executive dysfunction, gait disturbance, pseudobulbar affect, urinary urgency**.",
      "- **CAA** may coexist (lobar microbleeds), and **mixed AD** is common—vascular injury lowers **cognitive reserve**, unmasking degenerative pathology.",
      "- [purple]Mnemonic:[/purple] “**HITs to small pipes → slow mind & short steps**.”",
      "**6️⃣ Symptoms — cause → effect mapping**",
      "- **Arteriolosclerosis → WMH/lacunes** 🧩 → **executive slowing** and **cueable memory** (retrieval deficit).",
      "- **Deep microbleeds** ⚫ → hypertensive SVD marker; caution with antithrombotics.",
      "- **Fronto–subcortical disconnection** 🔗 → **gait disturbance** and **pseudobulbar affect**.",
      "- **Strategic small infarcts (thalamus/caudate)** 🎯 → disproportionate executive/attention deficits.",
      "- [blue]Imaging–clinic link:[/blue] Lesion burden/distribution should **map to the symptoms and stepwise timeline**.",
    ],
  },
  {
    id: "VaD-COMP-30009",
    topic: "Geriatrics • Vascular dementia — Complications",
    difficulty: "Medium",
    vignetteTitle:
      "What high-impact complication should you anticipate in vascular dementia?",
    stem: "An 82-year-old with vascular dementia due to small-vessel disease (multiple lacunes, confluent periventricular WMH) and atrial fibrillation presents for follow-up. BP averages 152/88 mmHg at home, LDL 120 mg/dL, A1c 7.9%. Gait is short-stepped with two near-falls this month. He is inconsistently taking his DOAC and has missed several BP pills. Which complication is most important to anticipate and actively prevent over the next year?",
    options: [
      {
        key: "A",
        text: "Recurrent ischemic stroke causing further stepwise cognitive decline and disability",
      },
      {
        key: "B",
        text: "Early visual hallucinations requiring antipsychotics",
      },
      {
        key: "C",
        text: "Amyloid-related imaging abnormalities (ARIA) from anti-amyloid therapy",
      },
      { key: "D", text: "Serotonin syndrome due to SSRI use" },
      { key: "E", text: "Autoimmune encephalitis following viral illness" },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Vascular dementia (VaD)** reflects accumulated **cerebrovascular injury**; the single **highest-impact future risk** is **another stroke** that accelerates disability and cognition loss.",
      "- The vignette shows **uncontrolled vascular factors** (HTN, DM, lipids), **AF with poor anticoagulation adherence**, and **gait instability**—a perfect storm for **recurrent ischemic events**.",
      "- Preventing **new infarcts** changes the slope of decline more than any cognitive drug in VaD; secondary prevention is the **main therapeutic lever**.",
      "- [yellow]Clinical rule:[/yellow] In VaD, the next stroke is the biggest complication to anticipate and prevent. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **B (DLB feature):** Visual hallucinations point to **Lewy body dementia**, not VaD; antipsychotics risk sensitivity in DLB and are not the central VaD complication.",
      "- **C (ARIA):** ARIA is tied to **anti-amyloid mAbs** used in biomarker-positive AD, not standard in pure VaD.",
      "- **D (Serotonin syndrome):** Possible with polypharmacy but uncommon and not the dominant risk in VaD management planning.",
      "- **E (Autoimmune encephalitis):** Typically **subacute, inflammatory**; not a foreseeable complication of chronic small-vessel VaD.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Quantify **vascular risk** and **adherence** → home BP log, A1c/lipids, med reconciliation, AF anticoagulation status. **Confirms?** ❌ Risk profiles the patient.",
      "- **Next Diagnostic step:** **MRI brain (baseline for trajectory)** if not recent to document WMH/lacune burden; **carotid duplex/CTA/MRA** and **echocardiography** if large-artery or cardioembolic sources suspected. **Confirms?** ➕ Identifies stroke mechanisms.",
      "- **Best Diagnostic Step:** Implement a **secondary stroke prevention plan** with targets (BP, LDL, A1c) and **AF anticoagulation** verification (level/adherence/contraindications). **Confirms?** ✅ Action plan addressing the preventable complication.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Tight vascular control[/green] — BP target per guideline (often <130/80 if tolerated), **high-intensity statin**, DM optimization, smoking cessation, Mediterranean diet, exercise; **fall prevention** (PT, home safety).",
      "- **First Line:** [green]Antithrombotic strategy[/green] — **anticoagulation for AF** (DOAC preferred unless contraindicated); **single antiplatelet** for non-cardioembolic disease; avoid dual therapy unless specific indication. Adherence supports: pillboxes, caregiver oversight, pharmacy sync.",
      "- **Gold Standard:** [green]Prevent further vascular hits[/green] via **comprehensive secondary prevention bundle** (BP, lipids, DM, AF anticoagulation, sleep apnea treatment). Consider **cholinesterase inhibitor/memantine** in selected VaD/mixed AD–VaD for modest symptomatic benefit; [red]avoid hypotension/over-sedation[/red] which worsen perfusion and falls.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Small-vessel disease** (arteriolosclerosis/lipohyalinosis) plus **cardioembolism** (AF) create **recurrent ischemic insults** → additive **fronto–subcortical disconnection**.",
      "- Each new infarct/lacune further degrades **processing speed, executive control, gait**, and continence networks → **stepwise decline**.",
      "- Secondary prevention targets the **mechanisms of injury** (hemodynamic, thromboembolic, metabolic) rather than downstream symptoms.",
      "**6️⃣ Complications — pattern recognition & prevention map**",
      "- **Recurrent ischemic stroke** 🎯 → stepwise cognitive/functional losses — **primary target for prevention**.",
      "- **Intracerebral hemorrhage** ⚠️ → consider if **microbleeds/CAA** or uncontrolled HTN; adjust antithrombotic risk.",
      "- **Falls and fractures** 🦴 → short-stepped gait, weakness; mitigate with PT/home safety/vision review.",
      "- **Depression/apathy & pseudobulbar affect** 😢😅 → treat to reduce disability and caregiver strain.",
      "- **Urinary incontinence** 🚻 → behavioral/med strategies; avoid anticholinergics when possible.",
      "- [purple]Pearl:[/purple] ==In VaD, **prevent the next vascular hit**—it’s the complication that most changes the trajectory==",
    ],
  },
  {
    id: "VaD-EPI-30010",
    topic: "Geriatrics • Vascular dementia — Epidemiology",
    difficulty: "Medium",
    vignetteTitle: "How common is vascular dementia, and in whom?",
    stem: "A 79-year-old clinic asks for a brief data sheet on vascular dementia (VaD) to guide resource planning. They serve an older population with high rates of hypertension, diabetes, and stroke. They want to know how common VaD is relative to other dementias, how age and geography influence risk, and what patterns of cerebrovascular disease are typically involved.",
    options: [
      {
        key: "A",
        text: "VaD is rare (<1% of dementias) and occurs mostly in young adults without vascular risk factors",
      },
      {
        key: "B",
        text: "VaD accounts for a substantial minority of dementia cases, commonly coexisting with Alzheimer pathology; risk rises with age and vascular burden",
      },
      {
        key: "C",
        text: "VaD incidence is equal across ages and is unrelated to stroke prevalence",
      },
      {
        key: "D",
        text: "VaD is primarily a pediatric condition linked to congenital heart disease",
      },
      {
        key: "E",
        text: "VaD occurs only after large hemispheric infarcts; small-vessel disease is not epidemiologically relevant",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **VaD** represents a **substantial minority** of dementias globally and frequently appears as **mixed disease** with Alzheimer pathology.",
      "- Prevalence and incidence **increase sharply with age**, mirroring the epidemiology of stroke and small-vessel disease.",
      "- **Population vascular burden** (hypertension, diabetes, AF, dyslipidemia, smoking) tracks with higher VaD rates across regions.",
      "- **Mixed AD/VaD** is common in clinic and autopsy series, explaining overlapping phenotypes and emphasizing biomarker use.",
      "- [yellow]Planning pearl:[/yellow] Where **stroke** is common, **VaD** (and mixed dementia) will be common. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** VaD is **not rare** and is most prevalent in **older adults with vascular risks**, not the young.",
      "- **C:** Risk is **age- and stroke-dependent**; it is **not uniform** across ages or geographies.",
      "- **D:** Pediatric VaD is **not** a standard entity; adult cerebrovascular disease drives VaD.",
      "- **E:** **Small-vessel disease** (lacunes/WMH/microbleeds) is **epidemiologically central**; VaD does **not** require a massive cortical infarct.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Define clinic population **risk profile** (age distribution, HTN/DM/AF rates, stroke prevalence). **Confirms?** ❌ Frames expected VaD burden.",
      "- **Next Diagnostic step:** Track **incident strokes/TIAs** and **MRI markers** (WMH burden, lacunes, microbleeds) in your cohort. **Confirms?** ➕ Links cerebrovascular load to cognitive outcomes.",
      "- **Best Diagnostic Step:** Build a **mixed-dementia pathway** (MRI + cognitive profile + optional AD biomarkers) to separate **pure VaD** from **mixed AD/VaD**. **Confirms?** ✅ Better epidemiologic classification.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Clinic-level prevention bundle[/green] — BP programs, diabetes optimization, statins per ASCVD risk, smoking cessation, exercise/diet coaching.",
      "- **First Line:** [green]Secondary stroke prevention pathways[/green] for any cerebrovascular event (antithrombotics, AF anticoagulation, carotid evaluation, OSA screening).",
      "- **Gold Standard:** [green]Population risk reduction** + **equitable stroke care access**[/green]; cognitive rehab and caregiver support networks for established cases.",
      "**5️⃣ Full Pathophysiology Explained (Epi lens)**",
      "- VaD prevalence reflects **macro/microvascular brain injury** accumulation in aging populations.",
      "- **Small-vessel disease** prevalence rises with **hypertension/diabetes** → more **WMH/lacunes** and higher VaD risk.",
      "- **Geographic and socioeconomic gradients** (vascular risk control, stroke systems of care) modulate VaD rates across regions.",
      "- **Mixed pathology** is frequent at autopsy, so real-world ‘VaD’ commonly rides alongside **AD changes**.",
      "**6️⃣ Symptoms — epidemiology → phenotype link**",
      "- Populations with heavy **WMH/lacune** burden show more **executive slowing, gait disturbance, and cueable memory**.",
      "- Where **AF and large-artery disease** are prevalent, expect **stepwise dips** post-stroke.",
      "- **Mixed AD/VaD** settings show blended **amnestic + executive** profiles.",
      "- [purple]Service design tip:[/purple] ==If your clinic serves a high-stroke community, scale up **MRI access**, **BP/AF clinics**, and **post-stroke cognitive screening**==",
    ],
  },
  {
    id: "VaD-RISK-30011",
    topic: "Geriatrics • Vascular dementia — Risk Factors",
    difficulty: "Medium",
    vignetteTitle:
      "Which risk factor cluster drives vascular dementia the most?",
    stem: "A 72-year-old with hypertension, type 2 diabetes, hyperlipidemia, atrial fibrillation, and a 40 pack-year smoking history asks what to prioritize to lower his chance of vascular dementia (VaD). He has mild white-matter hyperintensities on MRI but no prior stroke. Which risk factor set contributes most to VaD risk and is the highest-yield target for prevention?",
    options: [
      {
        key: "A",
        text: "Chronic hypertension, diabetes, dyslipidemia, smoking, and atrial fibrillation (vascular risk cluster)",
      },
      {
        key: "B",
        text: "Late-life bilingualism and high education (cognitive reserve)",
      },
      { key: "C", text: "APOE ε4 genotype and increasing age" },
      { key: "D", text: "Gluten sensitivity and low vitamin C intake" },
      { key: "E", text: "High coffee consumption and cold weather exposure" },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **VaD** results from **cerebrovascular injury**; the dominant, modifiable drivers are the **vascular risk cluster**: **hypertension, diabetes, dyslipidemia, smoking, and atrial fibrillation**.",
      "- These factors fuel **small-vessel disease** (arteriolosclerosis → WMH/lacunes/microbleeds) and **macrovascular events** (embolic/large-artery strokes).",
      "- Treating the cluster sharply lowers **stroke incidence** and **white-matter disease progression**, shifting VaD trajectory. [green]Risk control = brain protection[/green].",
      "- [yellow]High-yield prevention focus[/yellow]: BP control, glucose/lipid optimization, **smoking cessation**, and **anticoagulation for AF** when indicated. 🧠🩸",
      "**2️⃣ Why the other options are wrong**",
      "- **B. Cognitive reserve:** Protective modifier, not a **primary vascular driver**; useful but not the main lever for VaD risk.",
      "- **C. APOE ε4 & age:** Important **nonmodifiable** risks (and stronger for AD than pure VaD); they guide counseling, not actionables.",
      "- **D. Gluten/low vitamin C:** Not established determinants of VaD risk; **low-yield** relative to vascular control.",
      "- **E. Coffee/cold exposure:** Associations are inconsistent/weak; neither is a core, targetable VaD risk factor.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Vascular risk inventory → **ambulatory/home BP**, A1c/fasting glucose, **lipids**, smoking status, **AF screening** (ECG ± ambulatory), BMI, sleep apnea screen. **Confirms?** ❌ Stratifies modifiable risk.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** (FLAIR/SWI) baseline to quantify **WMH/lacunes/microbleeds**; carotid US/CTA/MRA and echocardiography if mechanism suspected. **Confirms?** ➕ Maps current cerebrovascular burden.",
      "- **Best Diagnostic Step:** Establish a **personalized prevention plan** with numeric targets (BP, LDL, A1c) and **AF anticoagulation** suitability; use **adherence checks** and pharmacist review. **Confirms?** ✅ Operationalizes risk reduction.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]BP control[/green] to guideline targets (often **<130/80** if tolerated); **smoking cessation** (counseling + NRT/varenicline), Mediterranean-style diet, **150–300 min/wk aerobic exercise**.",
      "- **First Line:** [green]High-intensity statin** per ASCVD risk[/green]; **A1c** individualized (~<7–7.5% for most older adults); **anticoagulation for AF** with DOAC unless contraindicated; treat **OSA** (CPAP).",
      "- **Gold Standard:** [green]Comprehensive vascular bundle** + adherence supports[/green] (blister packs, reminders, caregiver oversight). [red]Avoid hypotension/over-sedation[/red] which worsens perfusion and falls.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Hypertension/diabetes/dyslipidemia** → endothelial dysfunction, **arteriolosclerosis**, BBB injury → **WMH/lacunes** and slowed networks.",
      "- **Smoking** → oxidative stress, inflammation, thrombosis risk → both SVD and macrovascular events.",
      "- **Atrial fibrillation** → **cardioembolism** to strategic territories (thalamus, cortex) → stepwise cognitive drops.",
      "- Cumulative lesions disconnect **fronto–subcortical circuits** → **executive slowing, gait changes, pseudobulbar affect, urinary urgency**.",
      "- [blue]Concept link:[/blue] fewer vascular hits → slower lesion accrual → lower VaD probability/severity.",
      "**6️⃣ Symptoms — risk → phenotype mapping**",
      "- **Chronic HTN/SVD** 🩺 → **psychomotor slowing, cueable memory**, WMH on MRI.",
      "- **AF/cardioembolism** ❤️ → **stepwise dips** after infarcts; focal signs may accrue.",
      "- **Smoking + dyslipidemia** 🚬🧪 → atherosclerosis → large/small infarcts; faster disability.",
      "- **Diabetes** 🍬 → microvascular injury → WM disconnection → executive dysfunction.",
      "- [purple]Pearl:[/purple] ==Tackle **HTN, DM, lipids, smoking, AF**—they are the big levers that move VaD risk==",
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
export default function VascularDementia() {
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
      title="Start Vascular Dementia Bank"
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
