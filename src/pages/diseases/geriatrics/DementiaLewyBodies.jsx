// src/pages/diseases/geriatrics/DementiaLewyBodies.jsx
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

/* ------------------------ DLB Question Bank ------------------------ */
const QUESTIONS = [
  {
    id: "DLB-DEF-50001",
    topic: "Geriatrics • Dementia with Lewy bodies — Definition & Core Concept",
    difficulty: "Medium",
    vignetteTitle: "What exactly is dementia with Lewy bodies (DLB)?",
    stem: "A 74-year-old retired engineer develops cognitive decline over 12 months characterized by fluctuating attention, recurrent well-formed visual hallucinations of small animals, and new spontaneous parkinsonism (bradykinesia, rigidity). His wife reports dream enactment behaviors for several years prior. On testing, visuospatial and attention deficits are prominent with relatively preserved naming early. Which statement best captures the **core definition** of dementia with Lewy bodies?",
    options: [
      {
        key: "A",
        text: "A neurodegenerative dementia defined by amyloid-β plaques and tau tangles causing hippocampal-predominant amnestic syndrome",
      },
      {
        key: "B",
        text: "A chronic psychotic disorder with fixed delusions and hallucinations without changes in attention or arousal",
      },
      {
        key: "C",
        text: "A dementia syndrome characterized by fluctuating cognition, recurrent well-formed visual hallucinations, spontaneous parkinsonism, and often REM sleep behavior disorder; supported by biomarkers such as reduced striatal DAT uptake",
      },
      {
        key: "D",
        text: "A vascular cognitive impairment due to lacunes and white-matter disease with executive slowing and gait disturbance",
      },
      {
        key: "E",
        text: "A language-led neurodegeneration with progressive loss of word meaning and anterior temporal atrophy",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **DLB** is a **synucleinopathy** presenting with **dementia** plus **core clinical features**: [yellow]==fluctuating cognition/attention==[/yellow], **recurrent well-formed visual hallucinations**, **spontaneous parkinsonism**, and frequently **REM sleep behavior disorder (RBD)**. 🧠👁️🛌",
      "- Supportive **biomarkers** include [blue]**reduced striatal dopamine transporter (DAT) uptake** on DaTscan[/blue], [blue]**low cardiac MIBG uptake**[/blue], [blue]**PSG-confirmed REM sleep without atonia**[/blue], and **occipital hypometabolism with a “cingulate island sign”** on FDG-PET.",
      "- **Relative medial temporal sparing** on MRI (vs Alzheimer’s) and **early visuospatial/attention deficits** fit DLB.",
      "- [red]**Severe antipsychotic sensitivity**[/red] is characteristic; if antipsychotics are unavoidable, **quetiapine/clozapine** at low dose are preferred.",
      "- [purple]Rule of 1 year:[/purple] Dementia **before or within 1 year** of parkinsonism → **DLB**; dementia **after >1 year** of established Parkinson disease → **PDD**.",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s):** Describes **amyloid/tau** amnestic dementia with **hippocampal** atrophy; lacks DLB’s **fluctuations, visual hallucinations, RBD, and DAT loss**.",
      "- **B (Primary psychosis):** Attention/arousal typically **intact**; no neurodegenerative parkinsonism or RBD link.",
      "- **D (Vascular dementia):** **Stepwise** course, **executive/gait** prominence, WMH/lacunes on MRI—not hallucination-fluctuation-RBD cluster.",
      "- **E (svPPA):** Language-led **semantic loss** with anterior temporal atrophy; not a hallucination-parkinsonism dementia.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** Cognitive screen emphasizing **attention/visuospatial** domains; focused history for **fluctuations**, **formed visual hallucinations**, **RBD**; exam for **spontaneous parkinsonism**. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step →** **MRI brain** (often nonspecific; **relative medial temporal sparing**) to exclude structural mimics. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (indicative biomarkers) →** **DaTscan** showing [blue]reduced striatal DAT uptake[/blue] **or** **PSG** confirming **REM sleep without atonia**; consider **FDG-PET (cingulate island sign)** or **cardiac MIBG** where available. **Confirms?** ✅ Strongly supports DLB.",
      "- **Adjuncts →** Consider **CSF/PET for AD** pathology to gauge **mixed DLB+AD**, which is common and guides counseling/therapy.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education + safety[/green] (driving, falls, meds), optimize **sleep/light**, treat **hearing/vision**.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine, donepezil)[/green] for cognition/behavior; **melatonin** (± low-dose clonazepam) for **RBD**; **low-dose levodopa** cautiously for parkinsonism.",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics and high-potency D2 blockers**[/red]; if psychosis endangers safety, use **quetiapine/clozapine** minimal effective dose. [green]Treat orthostatic hypotension, constipation, urinary dysfunction[/green].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregates (Lewy bodies/neurites) spread from **brainstem/limbic** to **neocortex**, disrupting **cholinergic** and **dopaminergic** networks.",
      "- Network effects: **attention fluctuations** (frontoparietal), **visual hallucinations** (occipital/ventral stream + cholinergic loss), **parkinsonism** (nigrostriatal), **RBD** (pontine REM atonia circuitry).",
      "- Imaging mirrors biology: **occipital hypometabolism**, **DAT loss**, **relative MTL sparing**, **low MIBG**.",
      "**6️⃣ Symptoms — core pattern recognition**",
      "- **Fluctuating cognition/attention** 🎚️ (good hours ⇄ bad hours).",
      "- **Well-formed visual hallucinations** 👁️🦋 (people/animals).",
      "- **Spontaneous parkinsonism** 🚶‍♂️ (bradykinesia/rigidity ± tremor).",
      "- **RBD** 🛌🥊 (dream enactment) often **precedes dementia**.",
      "- [purple]Pearl:[/purple] ==Hallucinations + fluctuations + parkinsonism + RBD → **think DLB**; check a **DaTscan**==",
    ],
  },
  {
    id: "DLB-SX-50002",
    topic:
      "Geriatrics • Dementia with Lewy bodies — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle:
      "Spot the Lewy pattern: fluctuations, hallucinations, parkinsonism, and RBD",
    stem: "A 73-year-old man has 10 months of cognitive change. Family reports striking hour-to-hour **fluctuations**: some mornings he is sharp, by evening he’s drowsy and inattentive. He describes **well-formed visual hallucinations** of children and small animals. His wife notes several years of **dream enactment** (punching/kicking during sleep). Over the last 6 months he has developed **slowness and stiffness** with a softer voice and reduced arm swing. Memory is variable but naming is relatively preserved early; visuospatial tasks are poor. Which clinical constellation best identifies the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Gradual, memory-first decline with poor cueing and hippocampal-predominant atrophy",
      },
      {
        key: "B",
        text: "Stepwise executive slowing with early gait disturbance after TIAs and lacunes",
      },
      {
        key: "C",
        text: "Early behavioral disinhibition and hyperorality with relative memory sparing",
      },
      {
        key: "D",
        text: "Fluctuating cognition/attention with well-formed visual hallucinations, spontaneous parkinsonism, and REM sleep behavior disorder; early visuospatial/attention deficits",
      },
      {
        key: "E",
        text: "Nonfluent agrammatic speech with apraxia of speech and left IFG atrophy",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Core symptom tetrad of DLB**: **fluctuations** in cognition/attention 🎚️, **well-formed visual hallucinations** 👁️, **spontaneous parkinsonism** 🚶‍♂️, and **REM sleep behavior disorder (RBD)** 🛌🥊.",
      "- **Visuospatial and attention deficits** appear early, while **episodic memory** may be relatively preserved initially (compared with Alzheimer’s).",
      "- The history of **RBD years before dementia** is characteristic for a **synucleinopathy** trajectory.",
      "- **Spontaneous** (not drug-induced) parkinsonism plus hallucinations and fluctuations tightly match DLB rather than other dementias.",
      "- [yellow]Pattern lock:[/yellow] hallucinations + fluctuations + parkinsonism + RBD → **DLB**.",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s):** Memory-first amnestic syndrome with **poor cueing** and hippocampal atrophy; lacks early hallucinations/RBD/fluctuations.",
      "- **B (Vascular):** **Stepwise** course with executive/gait features following TIAs; hallucinations and RBD are not core.",
      "- **C (bvFTD):** **Behavioral disinhibition/apathy** and dietary changes dominate; hallucinations and parkinsonism are not typical early.",
      "- **E (nfvPPA):** Language-output disorder (agrammatism/apraxia of speech) rather than hallucination–fluctuation syndrome.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** Focused history for **fluctuations, hallucinations, RBD**; bedside cognitive screen emphasizing **attention/visuospatial** tasks. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step →** 🧠 **MRI brain** to exclude mimics; may show **relative medial temporal sparing**. **Confirms?** ➕ Supportive only.",
      "- **Best Diagnostic Step (indicative biomarkers) →** **DaTscan (I-123 FP-CIT)** showing [blue]**reduced striatal DAT uptake**[/blue] **or** polysomnography with **REM sleep without atonia**; FDG-PET may reveal **occipital hypometabolism** with **cingulate island sign**. **Confirms?** ✅ Strongly supports DLB.",
      "- **Adjuncts →** Consider **cardiac MIBG** (reduced uptake) and **CSF/PET for AD** to assess for mixed DLB+AD biology.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education/safety[/green] (falls, driving), optimize **hearing/vision**, daytime light/sleep hygiene, treat constipation/orthostasis.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± cautious clonazepam) for RBD; **low-dose levodopa** for parkinsonism (watch psychosis).",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics and high-potency D2 blockers**[/red] due to **severe sensitivity** (rigidity, NMS, death). If psychosis threatens safety, use **quetiapine/clozapine** at **lowest effective dose**; manage triggers (infection, meds).",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregation (Lewy bodies/neurites) spreads from **brainstem** → **limbic** → **neocortex**, disrupting **cholinergic** and **dopaminergic** networks.",
      "- Network effects: **attention fluctuations** (frontoparietal), **visual hallucinations** (occipital/ventral stream + cholinergic loss), **parkinsonism** (nigrostriatal), **RBD** (pontine REM atonia circuitry).",
      "- [blue]Imaging/biomarkers[/blue] mirror biology: **DAT loss**, **occipital hypometabolism**, **low cardiac MIBG**, **relative medial temporal sparing**.",
      "**6️⃣ Symptoms — Clinical Presentation map**",
      "- **Fluctuating cognition/attention** (good hours ⇄ bad hours) 🎚️.",
      "- **Well-formed visual hallucinations** (people/animals/scenes) 👁️🦋.",
      "- **Spontaneous parkinsonism** (bradykinesia/rigidity ± tremor) 🚶‍♂️.",
      "- **RBD** with dream enactment 🛌🥊 (often precedes dementia).",
      "- **Early visuospatial/attention deficits** with relatively preserved naming early.",
      "- [purple]Pearl:[/purple] ==If hallucinations and parkinsonism arrive early with cognitive **fluctuations**, think **DLB** and check a **DaTscan**==",
    ],
  },
  {
    id: "DLB-SIGNS-50003",
    topic:
      "Geriatrics • Dementia with Lewy bodies — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to dementia with Lewy bodies?",
    stem: "A 75-year-old with 1 year of cognitive change shows variable alertness during the visit: at times engaged, later drowsy and inattentive. He miscopies intersecting pentagons and produces a disorganized clock with misplaced numbers. Naming is largely intact. Neuro exam reveals hypomimia, bradykinesia with reduced arm swing (L≈R), mild rigidity, and postural instability; rest tremor is minimal. Orthostatic vitals drop 28/14 mmHg without compensatory tachycardia. His spouse reports vivid dream enactment. Which **examination sign cluster** best fits the underlying syndrome?",
    options: [
      {
        key: "A",
        text: "Stable alertness with poor delayed recall despite cues; nonfocal neuro exam",
      },
      {
        key: "B",
        text: "Stepwise executive dysfunction with spastic hemiparesis and Babinski sign after TIAs",
      },
      {
        key: "C",
        text: "Early behavioral disinhibition and hyperorality with frontal release signs and fluent speech",
      },
      {
        key: "D",
        text: "Fluctuating attention/alertness during the exam, visuospatial/constructional errors (clock/pentagons), symmetric parkinsonism (bradykinesia/rigidity > tremor), and autonomic failure (orthostatic hypotension); naming relatively preserved early",
      },
      {
        key: "E",
        text: "Nonfluent agrammatic speech with apraxia of speech and left inferior frontal weakness",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Fluctuations on exam** (alert ⇄ drowsy, variable attention) are a **core clinical feature** of DLB and may be witnessed within a single visit.",
      "- **Visuospatial/constructional impairment** (clock, intersecting pentagons) out of proportion to naming/semantic loss is typical early.",
      "- **Spontaneous parkinsonism** that is **symmetric, axial-predominant**, with **bradykinesia/rigidity > tremor**, plus **postural instability**, fits DLB rather than pure PD early tremor-dominant patterns.",
      "- **Autonomic dysfunction** such as **orthostatic hypotension** commonly accompanies Lewy body disorders and supports the syndrome.",
      "- [yellow]Pattern lock:[/yellow] **fluctuations + visuospatial errors + symmetric parkinsonism + autonomic failure** → **DLB**. 👁️🎚️🚶‍♂️",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer’s signs):** Stable alertness with **storage failure** (poor cueing) and nonfocal exam → hippocampal pattern, not DLB’s fluctuation–parkinsonism phenotype.",
      "- **B (Vascular pattern):** **Stepwise** deficits with **UMN signs** after TIAs suggest VaD, not DLB; DLB lacks pyramidal signs as a rule.",
      "- **C (bvFTD):** **Behavioral disinhibition/hyperorality** with frontal signs and early language/social changes — not the hallucination–fluctuation–parkinsonism cluster.",
      "- **E (nfvPPA):** **Nonfluent agrammatism**/apraxia of speech localizes to left IFG; DLB is not a primary language-output disorder.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside cognitive testing emphasizing **attention/visuospatial** tasks (clock/pentagons, trail-making) + document **fluctuations**, **parkinsonism**, and **orthostatics**. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** to exclude structural mimics; may show **relative medial temporal sparing**. **Confirms?** ➕ Supportive but not diagnostic.",
      "- **Best Diagnostic Step (indicative biomarkers):** **DaTscan (I-123 FP-CIT)** showing [blue]**reduced striatal DAT uptake**[/blue] **or** **polysomnography** confirming **REM sleep without atonia**. Consider **FDG-PET** (occipital hypometabolism with **cingulate island sign**) or **cardiac MIBG** (reduced uptake) where available. **Confirms?** ✅ Strongly supports DLB.",
      "- **Adjuncts:** **CSF/PET for AD** pathology to assess **mixed DLB+AD**; review meds for **antipsychotic sensitivity risk**.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & safety[/green] (falls, driving), optimize **hearing/vision**, treat constipation/orthostasis, sleep hygiene.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± cautious clonazepam) for **RBD**; **low-dose levodopa** for parkinsonism with careful psychosis monitoring.",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics/high-potency D2 blockers**[/red] due to **severe sensitivity** (rigidity, NMS). If unavoidable for dangerous psychosis, use **quetiapine/clozapine** at the **lowest effective dose**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregates (Lewy bodies/neurites) disrupt **dopaminergic** (nigrostriatal) and **cholinergic** (basal forebrain) systems.",
      "- Network impact: **fluctuations** (frontoparietal/ascending arousal), **visuoperceptual dysfunction** (occipital/ventral stream + cholinergic loss), **parkinsonism** (nigrostriatal), **autonomic failure** (peripheral/central autonomic circuits).",
      "- [blue]Imaging tie-ins[/blue]: **DAT loss**, **occipital hypometabolism**, **relative medial temporal sparing**; **MIBG** reduction supports Lewy pathology.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Fluctuating attention/alertness** 🎚️ → variable digit span, inconsistent engagement within the same visit.",
      "- **Visuospatial/constructional errors** 🕒🔺 → abnormal clock and pentagons with relatively preserved naming early.",
      "- **Symmetric parkinsonism** 🚶‍♂️ → bradykinesia/rigidity, axial/postural instability, **minimal rest tremor**.",
      "- **Autonomic failure** 📉 → **orthostatic hypotension**, constipation, urinary dysfunction.",
      "- **Hypersensitivity to antipsychotics** ⚠️ → history or trial can unmask severe rigidity/confusion; treat with extreme caution.",
      "- [purple]Pearl:[/purple] ==During the same exam: if the patient **waxes/wanes**, draws a **wild clock**, and shows **symmetric bradykinesia** with **orthostatic drops**, aim your differential at **DLB**==",
    ],
  },
  {
    id: "DLB-REDFLAGS-50004",
    topic: "Geriatrics • Dementia with Lewy bodies — Red Flags",
    difficulty: "Medium",
    vignetteTitle: "When it’s not typical Lewy: spot the red flags",
    stem: "A 76-year-old with suspected DLB (fluctuations, visual hallucinations, mild parkinsonism) suddenly worsens over 48 hours with severe headache, 38.7°C fever, and new right arm weakness. Staff report vomiting and photophobia. He takes warfarin for atrial fibrillation. Which feature set most strongly signals a RED FLAG requiring emergent evaluation rather than routine DLB workup?",
    options: [
      {
        key: "A",
        text: "Gradual visuospatial decline with well-formed visual hallucinations and dream enactment over a year",
      },
      {
        key: "B",
        text: "Day-to-day fluctuations in attention and alertness without systemic symptoms",
      },
      {
        key: "C",
        text: "Acute/subacute deterioration with fever, severe headache, meningism, vomiting, and a new focal neurologic deficit in a patient on anticoagulation",
      },
      {
        key: "D",
        text: "Mild antipsychotic sensitivity (confusion after a single dose of haloperidol) that improves when stopped",
      },
      {
        key: "E",
        text: "Progressive orthostatic hypotension and constipation over months",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **DLB** evolves over **months–years**, not hours–days. The cluster of **fever, severe headache, meningism, vomiting, and focal deficit** suggests **CNS infection, intracranial hemorrhage, mass effect, venous thrombosis, or stroke**.",
      "- **Anticoagulation** raises concern for **intracranial hemorrhage**; a **new focal deficit** demands **time-critical imaging**.",
      "- This presentation warrants an **emergency pathway** (CT/MRI ± LP/EEG), not outpatient biomarker testing for DLB.",
      "- [yellow]Rule of thumb:[/yellow] **FAST + HOT + FOCAL + PRESSURE + ANTICOAG** → escalate now. 🚑",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Classic DLB features (hallucinations, RBD, visuospatial deficits) over **a year**—not a red-flag emergency.",
      "- **B:** **Fluctuations** are a **core DLB feature** and, alone, are not dangerous signals.",
      "- **D:** **Antipsychotic sensitivity** is characteristic of DLB; it guides medication choice but, once reversed, is not an emergency red flag by itself.",
      "- **E:** **Autonomic dysfunction** (orthostasis, constipation) commonly accompanies synucleinopathies; manage but not emergent.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** [red]Stabilize ABCs[/red]; fingerstick glucose; focused neuro exam. **Confirms?** ❌ Safety first.",
      "- **Next Diagnostic step:** **Urgent non-contrast head CT** (rule out ICH/mass) → **CTA head/neck** if stroke suspected; then **MRI brain with/without contrast** ± **MRV/CTV** for venous thrombosis. **Confirms?** ➕ Identifies structural/time-critical causes.",
      "- **Best Diagnostic Step:** If imaging excludes mass effect, perform **lumbar puncture** (CSF cell count, glucose/protein, culture, HSV/VZV PCR) when infection/inflammation suspected; **EEG** if seizure/NCSE possible. **Confirms?** ✅ Etiologic diagnosis.",
      "- **Adjuncts:** CBC, CMP, ESR/CRP, blood cultures; **INR** (on warfarin); troponin if indicated.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat immediately reversible threats[/green] — oxygenation, IV fluids, **empiric IV antibiotics + acyclovir** for suspected meningitis/encephalitis; **reverse anticoagulation** for ICH; activate **stroke pathway** when appropriate; manage ICP (head elevation, targeted hyperosmolar therapy per protocol).",
      "- **First Line (once stable):** Begin **delirium-prevention bundle** (orientation, sensory aids, mobilize, sleep hygiene); discontinue **deliriogenic meds**.",
      "- **Gold Standard (DLB context):** For persistent psychosis after stabilization, **avoid high-potency D2 antipsychotics**; if necessary for safety, use **quetiapine/clozapine** at the **lowest effective dose**. Treat **RBD** (melatonin) and **parkinsonism** (low-dose levodopa) cautiously.",
      "**5️⃣ Full Pathophysiology Explained (why these are red flags)**",
      "- **Infection/hemorrhage/ischemia** cause **abrupt network failure** with **systemic signs** (fever) or **pressure signs** (headache/vomiting) and **focal deficits**—patterns not explained by synucleinopathy progression.",
      "- DLB’s biology (α-synuclein spread with cholinergic/dopaminergic loss) yields **fluctuations/hallucinations/parkinsonism** chronically, but **not** meningism, high fevers, or thunderclap headaches.",
      "- **Anticoagulation** lowers the threshold for catastrophic bleeding—treat as **time-critical**.",
      "**6️⃣ Red-flag checklist — escalate immediately when you see…**",
      "- **Focal neurologic deficit** (aphasia, hemiparesis, field cut) or **new seizure/status**.",
      "- **Fever** with **neck stiffness/photophobia** or **immunosuppression**.",
      "- **Sudden severe headache**, **projectile vomiting**, **papilledema**, or **recent head trauma/anticoagulation**.",
      "- **Profound hypoxia/hypotension**, **glucose extremes**, or suspected **toxin exposure**.",
      "- [blue]Presence of any → skip routine DLB workup; proceed to **emergent imaging + CSF/EEG** and cause-specific therapy[/blue].",
    ],
  },
  {
    id: "DLB-DDX-50005",
    topic: "Geriatrics • Dementia with Lewy bodies — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle:
      "Hallucinations, fluctuations, parkinsonism: which diagnosis fits best?",
    stem: "A 74-year-old man has 14 months of cognitive change with striking hour-to-hour fluctuations in attention. He reports well-formed visual hallucinations of people and small animals. His spouse describes dream enactment for several years. Exam shows bradykinesia and rigidity (symmetric, minimal rest tremor). MoCA reveals impaired attention and visuospatial construction with relatively preserved naming and delayed recall with cues. MRI shows relative medial temporal sparing. Which diagnosis best explains this presentation?",
    options: [
      { key: "A", text: "Alzheimer’s disease (amnestic presentation)" },
      { key: "B", text: "Dementia with Lewy bodies (DLB)" },
      { key: "C", text: "Parkinson disease dementia (PDD)" },
      { key: "D", text: "Behavioral-variant frontotemporal dementia (bvFTD)" },
      { key: "E", text: "Primary psychotic disorder" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Core DLB tetrad** present: **fluctuating cognition/attention**, **well-formed visual hallucinations**, **spontaneous parkinsonism**, and history of **REM sleep behavior disorder (RBD)** 🛌🥊.",
      "- **Neuropsych profile**: early **visuospatial/attention** deficits with relatively **preserved naming/episodic recall** (with cues) fits DLB > AD.",
      "- **Timing rule**: Dementia **before or within 1 year** of parkinsonism favors **DLB** (vs PDD).",
      "- **Imaging**: **Relative medial temporal sparing** supports non-AD pattern; RBD history points to **synucleinopathy**.",
      "- [yellow]Pattern lock:[/yellow] hallucinations + fluctuations + parkinsonism + RBD → **DLB**. 👁️🎚️🚶‍♂️",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Alzheimer’s disease:** **Memory-first** syndrome with **poor cueing** and hippocampal-predominant atrophy; early hallucinations/RBD/fluctuations are atypical.",
      "- **C. Parkinson disease dementia (PDD):** Requires **>1 year** of well-established Parkinson disease **before** dementia; here, cognitive decline and parkinsonism are near-synchronous.",
      "- **D. bvFTD:** Early **behavior/personality** change, disinhibition/apathy, hyperorality; hallucinations/fluctuations/RBD not core; parkinsonism less symmetric early.",
      "- **E. Primary psychosis:** Attention/level of consciousness typically **stable**; lacks **parkinsonism** and **RBD** and the age profile is atypical for first-episode.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Focused history for **fluctuations, hallucinations, RBD**; bedside cognitive screen emphasizing **attention/visuospatial** tasks; exam for **spontaneous parkinsonism** and **autonomic signs**. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** to exclude structural mimics; look for **relative medial temporal sparing**. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (indicative biomarkers):** **DaTscan (I-123 FP-CIT)** showing [blue]**reduced striatal DAT uptake**[/blue] **or** **polysomnography** confirming **REM sleep without atonia**; FDG-PET may show **occipital hypometabolism** with **cingulate island sign**; **cardiac MIBG** reduced uptake where available. **Confirms?** ✅ Strongly supports DLB.",
      "- **Adjuncts:** Consider **CSF Aβ/tau or amyloid/tau PET** to quantify **mixed AD** co-pathology; review meds for **antipsychotic sensitivity** risk.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & safety[/green] (falls, driving), optimize **hearing/vision**, sleep hygiene; treat **orthostasis/constipation**.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± low-dose clonazepam) for **RBD**; **low-dose levodopa** cautiously for parkinsonism (monitor psychosis).",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics and high-potency D2 blockers**[/red] due to **severe sensitivity**; if psychosis endangers safety, use **quetiapine/clozapine** at **lowest effective dose**.",
      "**5️⃣ Full Pathophysiology Explained (DDx focus)**",
      "- **DLB:** **α-synuclein** aggregates disrupt **cholinergic** and **dopaminergic** systems → **fluctuations**, **visual hallucinations**, **parkinsonism**, **RBD**.",
      "- **AD:** **Aβ/tau** pathology → hippocampal storage failure → amnestic syndrome without early hallucination/RBD signature.",
      "- **PDD:** Same synuclein biology but **temporal sequence reversed** (motor → then dementia).",
      "- **bvFTD:** **TDP-43/tau** frontoinsular degeneration → behavioral/executive syndrome, not hallucination–fluctuation.",
      "- **Psychosis:** Dopaminergic dysregulation with **intact arousal/attention** and no neurodegenerative motor/autonomic features.",
      "**6️⃣ Symptoms — pattern recognition for DDx**",
      "- **DLB:** Fluctuations, visual hallucinations, **symmetric parkinsonism**, **RBD**, visuospatial/attention deficits.",
      "- **AD:** Memory-first, poor cueing, hippocampal atrophy; hallucinations late/atypical early.",
      "- **PDD:** Years of PD then dementia; motor signs long precede cognitive decline.",
      "- **bvFTD:** Disinhibition/apathy, hyperorality, loss of empathy; frontal/insular atrophy.",
      "- **Psychosis:** Hallucinations/delusions with steady attention/awareness; no RBD/parkinsonism.",
      "- [purple]Pearl:[/purple] ==If cognition fluctuates and animals walk through the living room while the patient has symmetric bradykinesia—and RBD history—**DLB** tops the list==",
    ],
  },
  {
    id: "DLB-INV-50006",
    topic:
      "Geriatrics • Dementia with Lewy bodies — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test when you suspect dementia with Lewy bodies",
    stem: "A 74-year-old with 1 year of fluctuating cognition, well-formed visual hallucinations, and spontaneous parkinsonism presents for evaluation. Spouse reports years of dream enactment. Bedside testing shows impaired attention/visuospatial tasks with relatively preserved naming and delayed recall with cues. What is the **best initial investigation**?",
    options: [
      {
        key: "A",
        text: "DaTscan (I-123 FP-CIT) to assess striatal dopamine transporter uptake",
      },
      {
        key: "B",
        text: "Overnight polysomnography to document REM sleep without atonia",
      },
      {
        key: "C",
        text: "MRI brain (structural) to exclude mimics and assess relative medial temporal sparing",
      },
      {
        key: "D",
        text: "FDG-PET for occipital hypometabolism with cingulate island sign",
      },
      {
        key: "E",
        text: "Cardiac MIBG scintigraphy to assess sympathetic denervation",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **MRI brain** is the **best initial investigation** because it **rules out structural mimics** (tumor, subdural, NPH, strategic strokes) and gives supportive clues (often **relative medial temporal sparing** in DLB).",
      "- Structural imaging is the first stop in *any* new dementia workup to ensure you’re not missing a **treatable lesion** or a vascular burden that redirects the diagnosis.",
      "- After MRI, you can pursue **indicative biomarkers** if clinical uncertainty remains.",
      "- [green]Practical win:[/green] One scan aligns safety, differential-wide triage, and pattern support. 🧠🖥️",
      "**2️⃣ Why the other options are wrong**",
      "- **A. DaTscan:** Highly supportive for **DLB/PDD** (reduced striatal DAT) but is **not first-line**—use after structural causes are excluded.",
      "- **B. Polysomnography:** Confirms **RBD**, which supports synucleinopathy, but **doesn’t exclude structural mimics**; do after MRI if needed.",
      "- **D. FDG-PET:** Can show **occipital hypometabolism** with a **cingulate island sign** but is a **secondary metabolic study**.",
      "- **E. Cardiac MIBG:** Supportive where available, yet **ancillary** and not the first step in a standard diagnostic pathway.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Focused history for **fluctuations, formed visual hallucinations, RBD**; exam for **spontaneous parkinsonism**; bedside screen emphasizing **attention/visuospatial** tasks. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step (Best Initial Investigation):** 🧠 **MRI brain (structural)** → [blue]exclude mass/subdural/NPH/strategic stroke; look for relative medial temporal sparing[/blue]. **Confirms?** ➕ Supportive, rules out mimics.",
      "- **Best Diagnostic Step (indicative biomarkers):** **DaTscan** (↓ striatal DAT) **or** **PSG** (REM sleep without atonia); consider **FDG-PET** or **cardiac MIBG** depending on access. **Confirms?** ✅ Strongly supports DLB.",
      "- **Adjuncts:** **CSF/PET for AD** biology to quantify **mixed DLB+AD**; autonomic testing if orthostasis prominent; medication review for **antipsychotic sensitivity** risk.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & safety[/green] (falls, driving), optimize **hearing/vision**, sleep hygiene, treat **orthostasis/constipation**.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± cautious clonazepam) for **RBD**; **low-dose levodopa** carefully for parkinsonism.",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics/high-potency D2 blockers**[/red] due to **severe sensitivity**; if psychosis threatens safety, **quetiapine/clozapine** at **lowest effective dose**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** pathology (Lewy bodies/neurites) disrupts **dopaminergic** (nigrostriatal) and **cholinergic** (basal forebrain) systems.",
      "- Network effects produce **fluctuations**, **visual hallucinations**, **parkinsonism**, and **RBD**; imaging/biomarkers (DAT loss, occipital hypometabolism, low MIBG) mirror this biology.",
      "- MRI’s role is **gatekeeping**—it doesn’t prove DLB but ensures the syndrome isn’t a masquerader.",
      "**6️⃣ Symptoms — pattern recognition link to imaging**",
      "- **Hallucinations + fluctuations + symmetric parkinsonism + RBD** → synucleinopathy; **MRI** to clear the field, then **DaTscan/PSG** to clinch support.",
      "- [purple]Pearl:[/purple] ==Suspect DLB? **Start with MRI**; then deploy **DaTscan/PSG** to strengthen the case==",
    ],
  },
  {
    id: "DLB-GOLD-50007",
    topic:
      "Geriatrics • Dementia with Lewy bodies — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle: "What definitively establishes DLB etiology?",
    stem: "A 75-year-old with 18 months of cognitive fluctuations, well-formed visual hallucinations, REM sleep behavior disorder, and spontaneous parkinsonism has MRI without structural cause. DaTscan shows reduced striatal uptake. Family asks: “What is the final, gold standard test that proves this is dementia with Lewy bodies?”",
    options: [
      {
        key: "A",
        text: "MRI brain with volumetrics showing relative medial temporal sparing",
      },
      {
        key: "B",
        text: "FDG-PET showing occipital hypometabolism with a ‘cingulate island sign’",
      },
      {
        key: "C",
        text: "Polysomnography documenting REM sleep without atonia",
      },
      {
        key: "D",
        text: "Dopamine transporter imaging (DaTscan) showing reduced striatal uptake",
      },
      {
        key: "E",
        text: "Neuropathology (post-mortem or rarely biopsy) demonstrating α-synuclein–positive Lewy bodies/neurites in brainstem/limbic/cortex sufficient to explain dementia",
      },
    ],
    correct: "E",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gold standard = tissue diagnosis.** **Neuropathology** directly shows **α-synuclein–positive Lewy bodies/neurites** in characteristic distributions (brainstem → limbic → neocortex) **sufficient to account for the dementia**.",
      "- Clinical criteria and biomarkers are **highly supportive**, but only **histopathology** proves the underlying synucleinopathy and quantifies **co-pathologies** (e.g., Alzheimer changes).",
      "- In practice, confirmation is almost always **post-mortem**; brain biopsy is **rare** and reserved for atypical, nondegenerative concerns.",
      "- [yellow]Bottom line:[/yellow] DaTscan/PSG/FDG-PET support DLB **in vivo**, but **Lewy pathology on immunohistochemistry** is definitive. 🧠🔬",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI volumetrics:** Useful to **exclude mimics** and may show **relative medial temporal sparing**, but **cannot prove** Lewy pathology.",
      "- **B. FDG-PET:** The **occipital hypometabolism**/**cingulate island sign** supports DLB but is **not pathognomonic**.",
      "- **C. Polysomnography:** **RBD** (REM without atonia) is a strong **indicative biomarker** of synucleinopathy, yet still **indirect**.",
      "- **D. DaTscan:** Shows **nigrostriatal dopaminergic loss**—excellent support for DLB/PDD—but **does not identify α-synuclein**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Focused history for **fluctuations/hallucinations/RBD**; bedside cognitive screen emphasizing **attention/visuospatial** tasks; exam for **spontaneous parkinsonism** and **autonomic signs**. **Confirms?** ❌ Suggests DLB.",
      "- **Next Diagnostic step:** 🧠 **MRI brain** to exclude structural mimics; note **relative medial temporal sparing** if present. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (in vivo confirmation):** **DaTscan** (↓ striatal DAT) and/or **PSG** (REM without atonia); consider **FDG-PET** (occipital hypometabolism/**cingulate island sign**) or **cardiac MIBG** (reduced uptake). **Confirms?** ✅ Strongly supports DLB.",
      "- **Gold Standard (definitive):** 🔬 **Neuropathology** showing **α-synuclein Lewy bodies/neurites** in appropriate regions **± staging** and **quantification of co-pathology**. **Confirms?** ✅✅ Definitive.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & safety[/green] (falls/drive), optimize **hearing/vision**, address **orthostasis/constipation**, sleep hygiene.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± cautious clonazepam) for **RBD**; **low-dose levodopa** for parkinsonism (monitor for psychosis).",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics/high-potency D2 blockers**[/red] due to **severe sensitivity**; if psychosis threatens safety, use **quetiapine/clozapine** at the **lowest effective dose**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** aggregation spreads from **brainstem** to **limbic** to **neocortical** regions, disrupting **dopaminergic** (nigrostriatal) and **cholinergic** (basal forebrain) systems.",
      "- Network effects yield **fluctuations** (frontoparietal/arousal), **visual hallucinations** (occipital/ventral stream + cholinergic loss), **parkinsonism**, **RBD**, and **autonomic failure**.",
      "- Neuropathology confirms **distribution and burden**, and identifies **mixed pathology** (e.g., AD) that influences phenotype and treatment.",
      "**6️⃣ Symptoms — pattern recognition link**",
      "- **Fluctuating attention**, **well-formed visual hallucinations**, **symmetric parkinsonism**, **RBD**, early **visuospatial/attention** deficits.",
      "- [purple]Pearl:[/purple] ==Biomarkers can **convince the clinic**, but only **Lewy bodies** on histology **convince the microscope**==",
    ],
  },
  {
    id: "DLB-ETIO-50008",
    topic: "Geriatrics • Dementia with Lewy bodies — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle: "What underlies the Lewy body syndrome?",
    stem: "A 72-year-old with 1 year of cognitive fluctuations, well-formed visual hallucinations, REM sleep behavior disorder (RBD), and spontaneous parkinsonism asks, “What actually causes this disease?” MRI excludes structural lesions. Which underlying **etiology** best explains his syndrome?",
    options: [
      {
        key: "A",
        text: "Primary amyloid-β plaques with tau tangles causing hippocampal-predominant neurodegeneration (pure Alzheimer pathology)",
      },
      {
        key: "B",
        text: "Cerebrovascular small-vessel disease with lacunes and confluent white-matter hyperintensities",
      },
      {
        key: "C",
        text: "Autoimmune limbic encephalitis with NMDA receptor antibodies",
      },
      {
        key: "D",
        text: "α-Synuclein aggregation (Lewy bodies/neurites) with nigrostriatal dopaminergic loss and basal forebrain cholinergic deficits; often mixed with Alzheimer co-pathology",
      },
      {
        key: "E",
        text: "Frontotemporal lobar degeneration due to TDP-43 in anterior temporal/frontal regions",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **DLB** is a **synucleinopathy**: misfolded **α-synuclein** accumulates as **Lewy bodies/neurites** in brainstem → limbic → neocortex.",
      "- This produces **nigrostriatal dopaminergic loss** (parkinsonism) and **basal forebrain cholinergic deficits** (fluctuations, hallucinations).",
      "- **RBD** often precedes dementia, reflecting early **pontine** involvement.",
      "- Many patients show **mixed pathology** with **amyloid/tau** co-burden that modifies phenotype/progression.",
      "- [yellow]Etiology lock:[/yellow] **α-synuclein** + **DA↓/ACh↓ network failure** → fluctuations, hallucinations, parkinsonism, RBD. 👁️🎚️🚶‍♂️🛌",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Pure AD):** Explains **amnestic** syndrome with hippocampal atrophy; lacks early **hallucinations/RBD/fluctuations** typical of DLB.",
      "- **B (VaD):** Yields **executive slowing/gait** with **stepwise** course; not the hallucination–fluctuation–RBD cluster.",
      "- **C (Autoimmune):** Subacute encephalitis with seizures/psychiatric features; antibody-driven and often steroid-responsive—different timeline and biomarkers.",
      "- **E (FTLD–TDP):** Behavior/language-led syndromes (bvFTD/svPPA); not a hallucination–parkinsonism dementia.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** History for **fluctuations, hallucinations, RBD**; exam for **spontaneous parkinsonism**; bedside **attention/visuospatial** testing. **Confirms?** ❌ Suggests DLB pattern.",
      "- **Next Diagnostic step:** 🧠 **MRI** to rule out structural disease; note **relative medial temporal sparing**. **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (indicative biomarkers):** **DaTscan** (↓ striatal DAT), **polysomnography** (REM without atonia); **FDG-PET** (occipital hypometabolism/**cingulate island sign**) or **cardiac MIBG** (reduced uptake) as available. **Confirms?** ✅ Supports synuclein etiology.",
      "- **Adjuncts:** **CSF/PET for AD** co-pathology to quantify mixed DLB+AD.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education & safety[/green] (falls/drive), optimize **hearing/vision**, manage orthostasis/constipation, sleep hygiene.",
      "- **First Line:** [green]**Cholinesterase inhibitor** (rivastigmine/donepezil)**[/green] for cognition/behavior; **melatonin** (± cautious clonazepam) for **RBD**; **low-dose levodopa** for parkinsonism (watch psychosis).",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics/high-potency D2 blockers**[/red] due to severe sensitivity; if mandatory for dangerous psychosis, use **quetiapine/clozapine** at **lowest effective dose**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Misfolding & spread:** α-Synuclein aggregates seed and propagate along **brainstem→limbic→neocortical** networks.",
      "- **Neurotransmitter disruption:** [blue]**DA↓** (nigrostriatal) → parkinsonism; **ACh↓** (basal forebrain) → attention deficits, hallucinations/fluctuations[/blue].",
      "- **Circuit correlates:** **Occipital/ventral stream** dysfunction → **visual hallucinations**; **frontoparietal/arousal** circuits → **fluctuations**; **pontine REM** circuitry → **RBD**.",
      "- **Co-pathology:** Concurrent **Aβ/tau** accelerates decline and can add **amnestic** features (mixed DLB+AD).",
      "**6️⃣ Symptoms — cause → effect mapping**",
      "- **α-Syn → DA loss** 🎯 → **bradykinesia/rigidity**, reduced arm swing.",
      "- **α-Syn → ACh loss** 🧩 → **fluctuating attention**, **visual hallucinations**.",
      "- **Brainstem (pontine) hit** 🛌 → **RBD** years before dementia.",
      "- **Occipital hypometabolism** 👁️ → vivid, well-formed visual content.",
      "- [purple]Pearl:[/purple] ==Think **Lewy** when **RBD + hallucinations + symmetric parkinsonism + fluctuations** ride together==",
    ],
  },
  {
    id: "DLB-COMP-50009",
    topic: "Geriatrics • Dementia with Lewy bodies — Complications",
    difficulty: "Medium",
    vignetteTitle:
      "What high-impact complication should you anticipate in Lewy body dementia?",
    stem: "A 76-year-old with probable DLB (fluctuations, well-formed visual hallucinations, RBD, symmetric parkinsonism) becomes agitated in the ED and receives haloperidol 2 mg IM. Within hours he develops severe rigidity, mutism, diaphoresis, fever 38.9°C, and labile blood pressure. Which complication is most important to anticipate and urgently prevent in patients with DLB, especially after exposure to high-potency antipsychotics?",
    options: [
      { key: "A", text: "Serotonin syndrome from SSRI therapy" },
      {
        key: "B",
        text: "Neuroleptic sensitivity reaction, including neuroleptic malignant syndrome (NMS)",
      },
      { key: "C", text: "Idiopathic intracranial hypertension" },
      { key: "D", text: "Wernicke encephalopathy" },
      { key: "E", text: "Lamotrigine-associated Stevens–Johnson syndrome" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- Patients with **DLB** have **marked sensitivity to dopamine D2 antagonists**. Exposure to **typical antipsychotics or high-potency D2 blockers** can trigger **profound rigidity, akinesia, confusion**, **autonomic instability**, and **fever**—up to full **neuroleptic malignant syndrome (NMS)**.",
      "- This complication is **life-threatening** and can present **within hours–days** after a dose; it is far more likely in **synucleinopathies** (DLB/Parkinson disease dementia).",
      "- Even without full NMS, **severe neuroleptic sensitivity** worsens mobility, cognition, and aspiration/fall risk.",
      "- [yellow]Safety rule:[/yellow] In DLB, **avoid typical antipsychotics**; if antipsychotic is absolutely required for dangerous psychosis, use **quetiapine or clozapine** at **lowest effective dose**. ⚠️",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Serotonin syndrome):** Requires serotonergic agents and shows **clonus/hyperreflexia**—not the **lead-pipe rigidity** and **bradyreflexia** typical of NMS.",
      "- **C (IIH):** Headache/visual obscurations/papilledema—unrelated to antipsychotic exposure or DLB core biology.",
      "- **D (Wernicke):** Due to thiamine deficiency (ophthalmoplegia, ataxia, confusion); important in alcoholism/malnutrition but not the key DLB-specific threat here.",
      "- **E (SJS):** Severe rash/mucositis risk with specific meds (e.g., lamotrigine); not the central DLB complication after **haloperidol**.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **Recognize the syndrome**: recent **D2 blocker** exposure + **rigidity**, **fever**, **autonomic instability**, **altered mental state**. **Confirms?** ❌ Clinical suspicion raised.",
      "- **Next Diagnostic step →** Labs: **CK** (often ↑), **renal function** (rhabdomyolysis risk), **electrolytes**, **LFTs**, **CBC**, **CRP**, **UA** (myoglobinuria). **ECG** for **QTc**. **Confirms?** ➕ Supports NMS/neuroleptic sensitivity.",
      "- **Best Diagnostic Step →** **Rule out mimics** (sepsis, serotonin syndrome, malignant catatonia) based on exam (clonus vs rigidity), med list, cultures; consider **EEG** if stupor/seizure concern. **Confirms?** ✅ Clinical diagnosis of **neuroleptic sensitivity/NMS**.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]**STOP the offending antipsychotic immediately**[/green]; admit, **aggressive IV fluids**, active **cooling**, **electrolyte** correction, **VTE prophylaxis**; monitor **CK/renal**.",
      "- **First Line:** [green]Pharmacologic treatment for NMS**[/green] — **dantrolene** (muscle rigidity/heat), **bromocriptine** or **amantadine** (restore dopaminergic tone). Treat **autonomic instability** (telemetry, BP support).",
      "- **Gold Standard (future safety):** [red]**Avoid typical/high-potency D2 antipsychotics**[/red]. For persistent distressing psychosis threatening safety, use **quetiapine or clozapine** at **lowest effective dose**; optimize **non-drug strategies** (treat infection/pain/constipation, reduce nighttime stimulation). Continue **cholinesterase inhibitor**; use **melatonin** (± cautious clonazepam) for **RBD**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **DLB** features **nigrostriatal dopamine loss** and **cholinergic deficits** from **α-synuclein** pathology. **D2 blockade** further suppresses already fragile dopaminergic signaling → **severe parkinsonism**, **rigidity**, and **autonomic failure**.",
      "- In **NMS**, **skeletal muscle rigidity** drives **hyperthermia** and **rhabdomyolysis** (↑CK), while hypothalamic dysregulation produces **labile BP** and **HR**.",
      "- Cholinergic deficiency heightens **confusion** and **delirium**, compounding aspiration/fall risk.",
      "**6️⃣ Complications — pattern recognition & prevention map**",
      "- **Neuroleptic sensitivity/NMS** 🔥 → rigidity, fever, autonomic collapse (ED/ICU emergency).",
      "- **Falls & fractures** 🦴 → parkinsonism + orthostasis + sedatives; implement fall-prevention bundle.",
      "- **Aspiration pneumonia** 🫁 → dysphagia/rigidity/delirium; upright feeding, swallow precautions.",
      "- **Delirium** 🧠 → infections, meds, sleep disruption; deploy delirium bundle early.",
      "- **Autonomic failure** 📉 → orthostatic hypotension/syncope; fluids, compression, midodrine/droxidopa as appropriate.",
      "- [purple]Pearl:[/purple] ==In DLB, the **most dangerous drug is a typical antipsychotic**—assume harm until proven otherwise==",
    ],
  },
  {
    id: "DLB-EPI-50010",
    topic: "Geriatrics • Dementia with Lewy bodies — Epidemiology",
    difficulty: "Medium",
    vignetteTitle: "How common is DLB, and who tends to get it?",
    stem: "Your memory clinic is planning services and asks for a snapshot of DLB burden: relative frequency among dementias, typical age at onset, sex differences, and common patterns such as RBD and mixed pathology. Which statement best captures the **epidemiology** of dementia with Lewy bodies (DLB)?",
    options: [
      {
        key: "A",
        text: "DLB is extremely rare (<0.1% of dementias) and occurs primarily in teenagers; hallucinations are uncommon",
      },
      {
        key: "B",
        text: "DLB is the most common dementia overall, accounting for >60% of cases worldwide",
      },
      {
        key: "C",
        text: "DLB accounts for a meaningful minority of dementias (commonly ~5–15%), with onset typically in the 60s–70s, slight male predominance, frequent REM sleep behavior disorder, and high rates of mixed Alzheimer co-pathology",
      },
      {
        key: "D",
        text: "DLB occurs only in patients with longstanding Parkinson disease (>10 years) who then develop dementia",
      },
      {
        key: "E",
        text: "DLB is confined to ICU patients and resolves completely after discharge",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **DLB** represents a **meaningful minority** of dementias (often cited around **5–15%** in clinic/autopsy series), varying by setting and diagnostic criteria.",
      "- Usual **age at onset** is the **60s–70s**; there is a **slight male predominance** in many cohorts.",
      "- **REM sleep behavior disorder (RBD)** is **common** and may **precede dementia** by years (prodromal synucleinopathy).",
      "- **Mixed pathology** with **Alzheimer changes** (amyloid/tau) is **frequent**, influencing phenotype and prognosis.",
      "- [yellow]Service-planning pearl:[/yellow] Expect DLB wherever **RBD**, **parkinsonism**, and **visual hallucinations** cluster in older adults.",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** DLB is **not ultra-rare** and is a disorder of **older adults**, not teens; **hallucinations** are **common** and often well-formed.",
      "- **B:** Alzheimer’s disease remains the **most common** dementia worldwide; DLB is a **substantial minority**, not majority.",
      "- **D:** That description fits **Parkinson disease dementia (PDD)**; **DLB** is defined by dementia **preceding or within 1 year** of parkinsonism.",
      "- **E:** DLB is **neurodegenerative**, not a transient ICU syndrome; delirium may fluctuate but does not define DLB.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step (population view):** Track clinic **case mix** (AD, DLB, VaD, FTD) and screen for **RBD** history. **Confirms?** ❌ Surveillance only.",
      "- **Next Diagnostic step:** For suspected cases, perform **structural MRI** to exclude mimics and characterize patterns (often **relative medial temporal sparing**). **Confirms?** ➕ Supportive.",
      "- **Best Diagnostic Step (epidemiologic accuracy):** Use **indicative biomarkers**—**DaTscan** (↓ striatal DAT) and/or **PSG** (REM without atonia)—to reduce misclassification; consider **CSF/PET** for **AD co-pathology**. **Confirms?** ✅ Improves diagnostic fidelity.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management (program level):** [green]Staff training[/green] to recognize **fluctuations, hallucinations, RBD**, and **antipsychotic sensitivity**.",
      "- **First Line (clinic pathways):** [green]Standardized workups[/green] (MRI → DaTscan/PSG as needed) and **caregiver education**; embed **fall prevention** and **sleep protocols**.",
      "- **Gold Standard (safety caveat):** [red]System rule-out for typical antipsychotics/high-potency D2 blockers[/red]; create default orders for **quetiapine/clozapine** only when safety demands, plus **cholinesterase inhibitors** for cognition/behavior.",
      "**5️⃣ Full Pathophysiology Explained (epi lens)**",
      "- Population burden reflects **α-synuclein** spread across **dopaminergic** and **cholinergic** systems, with **AD co-pathology** common in aging brains.",
      "- **RBD prevalence** in older men and the **synucleinopathy prodrome** help explain the **male slant** in some series.",
      "- Diagnostic yield improves when clinics use **biomarkers** rather than relying solely on clinical impressions (fluctuations are subtle and misread).",
      "**6️⃣ Symptoms — epidemiology → phenotype link**",
      "- Clinics serving many **RBD** and **parkinsonism** patients will see more **DLB**.",
      "- **Occipital hypometabolism/DAT loss** patterns map onto **visual hallucinations** and **parkinsonism** prevalence.",
      "- **Mixed DLB+AD** cohorts show more **amnestic** features and faster decline.",
      "- [purple]Planning tip:[/purple] ==Resource for **sleep labs (PSG)** and **DaTscan access** if your catchment has a high RBD/parkinsonism footprint==",
    ],
  },
  {
    id: "DLB-RISK-50011",
    topic: "Geriatrics • Dementia with Lewy bodies — Risk Factors",
    difficulty: "Medium",
    vignetteTitle: "Who’s primed for Lewy? Risk profile at a glance",
    stem: "A 72-year-old man with years of dream enactment (kicking/punching while asleep) asks about his risk of developing dementia with Lewy bodies (DLB). His father had Parkinson disease. He has mild anosmia, constipation, and occasional orthostatic lightheadedness. Which risk factor cluster best captures **elevated DLB risk**?",
    options: [
      {
        key: "A",
        text: "Advanced age, male sex, REM sleep behavior disorder (RBD), family history of synucleinopathy (PD/DLB), hyposmia/autonomic symptoms; possible genetic contributors (e.g., GBA variants), and mixed Alzheimer co-pathology",
      },
      {
        key: "B",
        text: "High educational attainment, bilingualism, and regular aerobic exercise",
      },
      {
        key: "C",
        text: "APOE ε4 alone without synucleinopathy features or prodrome",
      },
      {
        key: "D",
        text: "Single prior concussion in youth with complete recovery and no prodromal symptoms",
      },
      {
        key: "E",
        text: "Long-standing essential tremor treated with propranolol",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **DLB** risk rises with **age** and shows a **slight male predominance**.",
      "- **RBD** (REM sleep behavior disorder) is a powerful **prodromal synucleinopathy** marker that often **precedes DLB** by years. 🛌🥊",
      "- **Family history** of **Parkinson disease** or **DLB** suggests shared **α-synuclein** biology; **hyposmia** and **autonomic symptoms** (orthostasis/constipation) signal **early autonomic/brainstem involvement**.",
      "- **Genetics:** **GBA** variants (and, less specifically, **APOE ε4** as a *modifier*) can increase risk or shift phenotype; **mixed AD co-pathology** is common and may accelerate decline.",
      "- [yellow]Pattern lock:[/yellow] **Age + male + RBD + Lewy family history + early nonmotor signs** → elevated **DLB** risk.",
      "**2️⃣ Why the other options are wrong**",
      "- **B:** Education/bilingualism and exercise relate to **cognitive reserve**; they are **protective modifiers**, not core DLB risks.",
      "- **C:** **APOE ε4** chiefly tags **Alzheimer** biology; without Lewy prodrome, it’s **not sufficient** to define high **DLB** risk.",
      "- **D:** Remote concussion with full recovery, in isolation, is **weakly linked** at best; lacks Lewy prodromal features.",
      "- **E:** **Essential tremor** is a different movement disorder; treatment with propranolol doesn’t drive DLB risk.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Screen for prodromal synucleinopathy** → history of **RBD**, **hyposmia**, **constipation**, **orthostatic symptoms**; basic cognitive screen (attention/visuospatial). **Confirms?** ❌ Risk stratifies.",
      "- **Next Diagnostic step:** **Polysomnography (PSG)** to confirm **RBD (REM without atonia)**; **orthostatic vitals**; consider **QSART/autonomic testing** if symptomatic. **Confirms?** ➕ Strengthens Lewy prodrome.",
      "- **Best Diagnostic Step (supportive biomarkers):** **DaTscan** if parkinsonism emerges (↓ striatal DAT); **cardiac MIBG** (low uptake) and **FDG-PET** (occipital hypometabolism/**cingulate island sign**) in select cases. **Confirms?** ✅ Supports Lewy biology (not mandatory in asymptomatic risk states).",
      "- **Adjuncts:** **MRI** to exclude structural mimics; consider **CSF/PET for AD** to estimate **mixed pathology** risk.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management (risk-stage):** [green]Education & surveillance[/green] — sleep safety for **RBD** (padding, remove hazards), **melatonin** at night; manage **orthostasis/constipation**; optimize **hearing/vision**.",
      "- **First Line (if symptomatic):** [green]**Cholinesterase inhibitor**[/green] for emerging cognitive/behavioral symptoms; **low-dose levodopa** cautiously for parkinsonism; treat **RBD** with **melatonin** (± cautious clonazepam).",
      "- **Gold Standard (safety caveat):** [red]**Avoid typical antipsychotics/high-potency D2 blockers**[/red] due to **severe neuroleptic sensitivity**; if indispensable for dangerous psychosis, use **quetiapine/clozapine** minimal dose.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **α-Synuclein** misfolds and spreads from **brainstem autonomic/REM nuclei** → **limbic** → **neocortex**.",
      "- **Early nonmotor signs** (RBD, hyposmia, constipation, orthostasis) reflect **brainstem/peripheral autonomic** involvement **years before** dementia/parkinsonism.",
      "- **Nigrostriatal DA loss** → parkinsonism; **basal forebrain ACh loss** → fluctuations/hallucinations; **occipital network dysfunction** → visual phenomena.",
      "- **Genetic modifiers** (e.g., **GBA**) and **AD co-pathology** (Aβ/tau) can amplify risk and alter trajectory.",
      "**6️⃣ Risk checklist — memorize the big levers**",
      "- **Age (60s–70s typical) & male sex.**",
      "- **RBD** (PSG-proven REM without atonia).",
      "- **Family history of PD/DLB** or known **GBA** variant.",
      "- **Hyposmia**, **constipation**, **orthostatic hypotension** (autonomic prodrome).",
      "- **Possible APOE ε4** (phenotype modifier), **mixed AD co-pathology**.",
      "- [purple]Pearl:[/purple] ==RBD + hyposmia + autonomic clues in an older man with Lewy family history → keep **DLB** on speed dial==",
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
export default function DementiaLewyBodies() {
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
      title="Start Lewy Body Dementia Bank"
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
