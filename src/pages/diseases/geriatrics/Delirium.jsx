// src/pages/diseases/geriatrics/Delirium.jsx
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

/* ------------------------ Delirium Question Bank ------------------------ */
/* Add images in /public and set q.image = "/file.png" if you want figures */
const QUESTIONS = [
  {
    id: "DEL-DEF-40001",
    topic: "Geriatrics • Delirium — Definition & Core Concept",
    difficulty: "Medium",
    vignetteTitle: "What exactly is delirium?",
    stem: "An 83-year-old nursing-home resident becomes acutely confused over 24 hours after starting oxycodone for a hip fracture. Staff note fluctuating alertness, disorganized thinking, and poor attention; symptoms worsen at night. Vitals show low-grade fever; oxygen saturation is 91% on room air. Which statement best captures the **core definition** of delirium?",
    options: [
      {
        key: "A",
        text: "A chronic, progressive decline in memory with preserved attention and a stable level of consciousness",
      },
      {
        key: "B",
        text: "An acute and fluctuating disturbance in attention and awareness, plus additional cognitive deficits, due to a medical condition or substance",
      },
      {
        key: "C",
        text: "A fixed delusional belief system without changes in arousal or attention",
      },
      {
        key: "D",
        text: "A lifelong neurodevelopmental disorder characterized by impaired social communication",
      },
      {
        key: "E",
        text: "A primary mood disorder causing persistent low mood and anhedonia without inattention",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium** is defined by an **acute (hours–days) onset** and **fluctuating** course of **inattention and impaired awareness**, with additional cognitive changes (memory, disorientation, language, visuospatial, perception).",
      "- There must be **evidence of a precipitating medical condition or substance** (intoxication/withdrawal/medication effect).",
      "- It is **not better explained** by an established neurocognitive disorder and does **not occur exclusively in coma**; level of arousal is commonly altered.",
      "- [blue]Core tool:[/blue] **CAM** requires (1) acute/fluctuating + (2) inattention **and** either (3) disorganized thinking or (4) altered consciousness.",
      "- [yellow]Essentials:[/yellow] **Acute + fluctuating + inattention + medical/substance trigger** = delirium. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **A (chronic dementia):** Describes **gradual** decline with **preserved attention** early and **stable arousal**—opposite of delirium’s acute, fluctuating inattention.",
      "- **C (primary psychosis):** Fixed delusions can occur in delirium, but **attention/arousal are typically normal** in isolated psychosis.",
      "- **D (neurodevelopmental disorder):** Not an acute confusional state; unrelated time course and mechanisms.",
      "- **E (major depression):** May mimic cognitive issues, but **inattention with fluctuating consciousness** and acute onset point away from primary mood disorder.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside **CAM screen** + vitals, **fingerstick glucose**, pulse oximetry. **Confirms?** ❌ CAM identifies syndrome; etiology not yet confirmed.",
      "- **Next Diagnostic step:** **Search for causes**: review meds (anticholinergics, opioids, benzos), **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR** if respiratory signs, **ECG**, consider **TSH/B12** if subacute. **Confirms?** ➕ Points to trigger(s).",
      "- **Best Diagnostic Step:** **Targeted tests** based on clues (ABG/lactate, blood cultures, troponin, CT head if focal deficit/trauma, EEG if nonconvulsive seizures). **Confirms?** ✅ Establish precipitant(s).",
      "**4️⃣ Management / Treatment in order**",
      "- **Initial Management:** [green]Treat the cause[/green] (oxygenate, antibiotics for infection, fluids/electrolytes, pain control with non-deliriogenic strategies).",
      "- **First Line (non-pharm):** [green]DELIRIUM BUNDLE[/green] — orientation cues, glasses/hearing aids, sleep hygiene, mobilization, hydration, bowel/bladder care, minimize tethers/restraints, **deprescribe deliriogenic meds**.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** patient endangers self/others; **avoid** in Parkinson’s/Lewy—use **quetiapine**. [red]Avoid benzodiazepines[/red] **except** for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Delirium reflects **acute network dysconnectivity** with **thalamocortical arousal** and **frontoparietal attention** failure.",
      "- Drivers include **neuroinflammation**, impaired **acetylcholine** signaling, excess **dopamine**, metabolic/oxygenation insults, and sleep–wake disruption.",
      "- [blue]EEG[/blue]: typically **generalized slowing** (delta/theta); triphasic waves may appear in metabolic/hepatic encephalopathy.",
      "- Subtypes: **hyperactive**, **hypoactive** (easily missed), and **mixed**.",
      "**6️⃣ Symptoms — core pattern recognition**",
      "- **Inattention** 🎯 → cannot maintain/repeat digits or months backward.",
      "- **Altered awareness/arousal** 🌙 → drowsy, hypervigilant, or fluctuating (worse at night: **sundowning**).",
      "- **Disorganized thinking & disorientation** 🧩 → rambling, tangential, confused about time/place.",
      "- **Perceptual disturbances** 👀 → illusions/hallucinations, often visual.",
      "- **Reversibility clue:** ==find and fix the trigger(s)== leads to improvement; dementia alone does not fluctuate like this.",
      "- [purple]Mnemonic:[/purple] “**A-F IT**” → **A**cute-**F**luctuating **I**nattention from a **T**rigger.",
    ],
  },
  {
    id: "DEL-SX-40002",
    topic: "Geriatrics • Delirium — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle: "Spot the delirium pattern: acute, fluctuating inattention",
    stem: "An 82-year-old with COPD and CKD becomes confused over 36 hours after a UTI diagnosis. Family reports he’s ‘with it’ in the morning but by evening he’s sleepy, then suddenly agitated and trying to get out of bed. He can’t follow the TV plot, loses track of conversations, and keeps misplacing his oxygen cannula. No prior cognitive complaints. Which clinical constellation best identifies delirium?",
    options: [
      {
        key: "A",
        text: "Gradual memory-first decline with poor cueing over years; stable alertness",
      },
      {
        key: "B",
        text: "Acute and fluctuating inattention/awareness with disorganized thinking and altered sleep–wake; worse at night (sundowning)",
      },
      {
        key: "C",
        text: "Lifelong distractibility without change in consciousness; better with stimulants",
      },
      {
        key: "D",
        text: "Fixed delusions and hallucinations with intact attention and stable arousal",
      },
      {
        key: "E",
        text: "Low mood and anhedonia for months with psychomotor slowing but normal attention",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**\n- **Delirium = acute (hours–days) & fluctuating** disturbance of **attention** and **awareness** with additional cognitive/behavioral changes.\n- Symptom signature: **can’t sustain focus**, **disorganized/rambling thought**, **misperceptions/visual hallucinations**, and **sleep–wake inversion**; often **worse at night (==sundowning==)**.\n- Course maps to **precipitants** (infection, hypoxia, new meds like anticholinergics/opioids, dehydration, pain). Removing triggers improves symptoms.\n- **Hypoactive** subtype (quiet, sleepy, withdrawn) is common and easily missed; many oscillate (mixed type). 🧠⚡\n- [yellow]Pattern lock:[/yellow] **Acute + fluctuating + inattention + medical/substance trigger** → delirium.",
      "**2️⃣ Why the other options are wrong**\n- **A (Alzheimer’s):** **Insidious memory** decline with early **preserved attention** and **stable arousal**; not acutely fluctuating.\n- **C (ADHD/trait distractibility):** Chronic pattern from youth; **no change in consciousness** or acute medical trigger.\n- **D (Primary psychosis):** Delusions/hallucinations can occur but **attention and arousal are usually intact**; fluctuations are not tied to medical precipitants.\n- **E (Depression):** Weeks–months of low mood; may have cognitive slowing (“pseudo-dementia”) but **attention typically improves with effort/cueing** and arousal is stable.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**\n- **Initial Diagnostic step →** **CAM screen** (acute/fluctuating + inattention + [disorganized thinking **or** altered consciousness]). **Confirms?** ❌ Identifies syndrome.\n- **Next Diagnostic step →** **Find triggers**: review meds (anticholinergics, opioids, benzos), vitals, **glucose**, **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR** if respiratory signs, **ABG/SpO₂** for hypoxia, **ECG**. **Confirms?** ➕ Points to cause.\n- **Best Diagnostic Step →** Targeted tests by clues: **blood cultures**, **lactate**, **TSH/B12** (if subacute), **CT head** (focal deficits/trauma/anticoag), **EEG** if nonconvulsive status suspected. **Confirms?** ✅ Establishes precipitant(s).",
      "**4️⃣ Management / Treatment (in order)**\n- **Initial Management:** [green]Treat underlying cause(s)[/green] (oxygenation, fluids/electrolytes, antibiotics for infection, pain control using non-deliriogenic strategies).\n- **First Line (non-pharm):** [green]DELIRIUM BUNDLE[/green] — orientation (clocks, family), **glasses/hearing aids**, daytime mobilization, sleep protocol (lights off at night), hydration, bowel/bladder care, minimize lines/restraints, **deprescribe** deliriogenic meds.\n- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** the patient endangers self/others; in **Parkinson’s/Lewy**, prefer **quetiapine or clozapine**. [red]Avoid benzodiazepines[/red] **except** for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained**\n- **Network failure** across **frontoparietal attention** and **thalamocortical arousal** circuits → impaired focus and fluctuating awareness.\n- **Neuroinflammation**, **oxidative stress**, and **neurotransmitter imbalance** ([blue]↓acetylcholine, ↑dopamine[/blue]) drive acute dysfunction.\n- **Sleep–wake disruption** (loss of circadian cues) amplifies nighttime worsening; **EEG** often shows **generalized slowing**.",
      "**6️⃣ Symptoms — Clinical Presentation map**\n- **Inattention** 🎯 → can’t recite months backward or maintain digit span.\n- **Altered awareness/arousal** 🌙 → drowsy ↔ hypervigilant; **worse at night**.\n- **Disorganized thinking** 🧩 → tangential, illogical, rambling.\n- **Perceptual disturbances** 👀 → illusions/visual hallucinations.\n- **Memory & orientation errors** 🗺️ → recent disorientation that **fluctuates**.\n- [purple]Pearl:[/purple] ==If **attention** is broken and the course **fluctuates**, think **delirium** until proven otherwise==",
    ],
  },
  {
    id: "DEL-SIGNS-40003",
    topic: "Geriatrics • Delirium — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to delirium?",
    stem: "An 84-year-old postsurgical patient becomes confused over 24–48 hours. On rounds, she is drowsy then suddenly agitated later in the day. She cannot recite the months backwards, is easily distractible by hallway noise, and gives tangential answers. Nurse notes sleep–wake inversion and visual misperceptions at night. Neuro exam is otherwise nonfocal; vitals show low-grade fever and mild hypoxia. Which **set of examination signs** best fits delirium?",
    options: [
      {
        key: "A",
        text: "Stable alertness, poor delayed recall with minimal cueing benefit, intact attention",
      },
      {
        key: "B",
        text: "Fluctuating attention and awareness, impaired digit span/months backward, disorganized thinking, altered arousal (hypo↔hyper), sleep–wake disruption",
      },
      {
        key: "C",
        text: "Fixed delusions with normal attention and steady level of consciousness",
      },
      {
        key: "D",
        text: "Magnetic gait with ventriculomegaly, urinary incontinence, and subcortical cognitive slowing",
      },
      {
        key: "E",
        text: "Prominent visual hallucinations with spontaneous parkinsonism and consistent alertness",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium** exam centers on **inattention** (fails **digits span** or **months backward**) and **altered awareness** that **fluctuates** over hours. ",
      "- **Disorganized thinking** (illogical, tangential) and **altered arousal** (hypoactive, hyperactive, or mixed) are common; **sleep–wake inversion** is typical (==sundowning==).",
      "- [blue]CAM framework[/blue]: (1) acute/fluctuating course + (2) inattention **and** either (3) disorganized thinking or (4) altered level of consciousness.",
      "- Exam is often **nonfocal neurologically**, but may show precipitant clues (dehydration, infection, hypoxia).",
      "- [yellow]Bedside tip:[/yellow] If the patient **can’t maintain attention**, prioritize a delirium search. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **A (Alzheimer pattern):** Stable alertness with **storage (memory) failure** and **intact attention** early → not delirium’s acute inattention.",
      "- **C (Primary psychosis):** Delusions/hallucinations may occur, but **attention and arousal are usually normal**; course doesn’t fluctuate with medical triggers.",
      "- **D (NPH):** Gait + incontinence + ventriculomegaly triad; not an acute attentional syndrome.",
      "- **E (DLB):** Visual hallucinations with **consistent alertness** and parkinsonism suggest Lewy body disease, not acute, fluctuating inattention.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **CAM** at bedside + vitals, **fingerstick glucose**, **SpO₂**. **Confirms?** ❌ Identifies the syndrome, not the cause.",
      "- **Next Diagnostic step:** **Search for triggers**: med review (anticholinergics, opioids, benzos), **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR** if respiratory signs, **ECG**, consider **TSH/B12** if subacute. **Confirms?** ➕ Narrows etiology.",
      "- **Best Diagnostic Step:** Targeted testing by clues: **ABG/lactate**, **blood cultures**, **CT head** (focal deficit/trauma/anticoag), **EEG** if nonconvulsive status suspected (often shows [blue]generalized slowing[/blue]). **Confirms?** ✅ Establish precipitant(s).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Correct the cause[/green] (oxygenation, fluids/electrolytes, treat infection, relieve pain with non-deliriogenic strategies).",
      "- **First Line (non-pharm):** [green]DELIRIUM BUNDLE[/green] — reorientation cues, **glasses/hearing aids**, mobilization, sleep protocol (lights/dose timing), hydration, bowel/bladder care, minimize lines/restraints, **deprescribe** deliriogenic meds.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** the patient is unsafe; in Parkinson’s/Lewy, use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Acute **thalamocortical arousal** and **frontoparietal attention** network failure driven by **neuroinflammation**, impaired **acetylcholine** signaling, excess **dopamine**, and metabolic/hypoxic stress.",
      "- **Circadian disruption** worsens nighttime confusion; **EEG** typically shows **diffuse slowing**.",
      "- Subtypes: **hyperactive**, **hypoactive** (easily missed), and **mixed**; the **exam fluctuates** accordingly.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Inattention** 🎯 → fails months backward/serial 7s/digit span.",
      "- **Fluctuating awareness/arousal** 🌙 → drowsy ↔ hypervigilant; **worse at night**.",
      "- **Disorganized thinking** 🧩 → illogical, tangential, rambling answers.",
      "- **Perceptual disturbances** 👀 → illusions/visual hallucinations that rise/fall with arousal.",
      "- **Nonfocal neuro exam** 🧪 → look for precipitant clues (fever, dehydration, hypoxia).",
      "- [purple]Pearl:[/purple] ==If attention breaks and arousal wobbles **today**, call it **delirium** until a trigger proves otherwise==",
    ],
  },
  {
    id: "DEL-REDFLAGS-40004",
    topic: "Geriatrics • Delirium — Red Flags",
    difficulty: "Medium",
    vignetteTitle: "When it’s not ‘just delirium’: spot the red flags",
    stem: "An 81-year-old man becomes acutely confused over 12 hours. Staff report waxing–waning alertness. Today he develops a severe headache, 38.6°C fever, and new difficulty moving his right arm. He’s on warfarin for AF. On exam: somnolent, neck stiffness, photophobia, right pronator drift, and vomiting. Which feature set signals a RED FLAG requiring immediate escalation rather than routine delirium workup?",
    options: [
      {
        key: "A",
        text: "Gradual cognitive slowing over months with stable alertness and good attention",
      },
      {
        key: "B",
        text: "Acute fluctuating inattention after starting an opioid, no focal deficits, afebrile",
      },
      {
        key: "C",
        text: "Acute confusion with focal neurologic deficit, fever/meningism, severe headache, vomiting, and anticoagulant use",
      },
      {
        key: "D",
        text: "Mild evening agitation (sundowning) that improves with family presence and glasses/hearing aids",
      },
      {
        key: "E",
        text: "Sleep–wake inversion without systemic symptoms or focal findings",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Red-flag cluster:** **focal deficit** (possible stroke/bleed), **fever/meningism** (CNS infection), **sudden severe headache/vomiting** (↑ICP or SAH), and **anticoagulation** (risk of intracranial hemorrhage).",
      "- This pattern demands **immediate emergency evaluation** and **time-critical imaging**—not a routine search for reversible precipitants.",
      "- In delirium medicine, ==**FAST + HOT + FOCAL + PRESSURE + ANTICOAG**== means escalate now. 🚑",
      "- Early treatment can be life-saving (thrombolysis/EVT, antibiotics/acyclovir, reversal of anticoagulation).",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Chronic, stable course with preserved attention → not delirium; no emergent red flags.",
      "- **B:** Medication-triggered delirium is common; without focal/systemic danger signs, manage promptly but not as a code situation.",
      "- **D:** Typical **sundowning** features improve with orientation/sensory aids; no red-flag physiology.",
      "- **E:** Sleep–wake disturbance alone is nonspecific; watchful evaluation, not emergent escalation.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** [red]Stabilize ABCs[/red] → airway, breathing (SpO₂/ABG), circulation; **fingerstick glucose** immediately. **Confirms?** ❌ Safety first.",
      "- **Next Diagnostic step:** **Urgent non-contrast CT head** (rule out hemorrhage/mass) ± **CTA head/neck** if stroke suspected; **CXR**, **EKG**, basic labs (**CBC/CMP**, Ca/Mg/Phos, **INR**), **blood cultures** if febrile. **Confirms?** ➕ Identifies time-critical causes.",
      "- **Best Diagnostic Step:** If no mass effect: **Lumbar puncture** for **cell count, glucose/protein, Gram stain/culture, HSV/VZV PCR** when meningitis/encephalitis suspected; **EEG** if nonconvulsive status epilepticus possible. **Confirms?** ✅ Etiologic diagnosis.",
      "- **Adjuncts (by clue):** **Reversal of anticoagulation** if ICH, **toxin panel/CO-oximetry** for exposures, **TSH/cortisol** if endocrine crisis, **ammonia** for hepatic failure.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat the immediately reversible killers[/green] — oxygenation, IV fluids, **empiric IV antibiotics + acyclovir** if CNS infection possible, **stroke pathway** if indicated, **reverse anticoagulation** for ICH, manage ICP (head-up, consider hypertonic agents per protocol).",
      "- **First Line (support & prevention):** Start **delirium bundle** (orientation, sensory aids, mobilize as able, sleep protocol), **deprescribe deliriogenic meds**, correct electrolytes, control pain without heavy sedatives.",
      "- **Gold Standard (agitation safety):** **Low-dose antipsychotic** only if danger to self/others; in **Parkinson’s/Lewy**, use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained (why these are red flags)**",
      "- **Stroke/ICH** → abrupt network disruption ± mass effect → **focal deficits** and decreased consciousness.",
      "- **Meningitis/encephalitis** → **neuroinflammation**, cytokine surge, BBB injury → **fever, neck stiffness, photophobia**.",
      "- **SAH/↑ICP** → diffuse cortical dysfunction → **thunderclap headache, vomiting, papilledema** (if present).",
      "- **Nonconvulsive status** → persistent altered mentation; **EEG** essential.",
      "**6️⃣ Red-flag checklist — escalate immediately when you see…**",
      "- **Focal neurologic deficit** (aphasia, hemiparesis, field cut) or **new seizure/status**.",
      "- **Fever** with **meningism**, **immunosuppression**, or **petechial rash**.",
      "- **Severe sudden headache**, **papilledema**, **projectile vomiting**, or **trauma/anticoagulation**.",
      "- **Profound hypoxia/hypotension**, **glucose extremes**, or **toxin exposure** (CO, salicylates, anticholinergics).",
      "- [blue]Presence of any → jump to **emergent imaging, labs, and targeted therapy** before routine workup[/blue].",
    ],
  },
  {
    id: "DEL-DDX-40005",
    topic: "Geriatrics • Delirium — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle: "Acute confusion on the ward: which diagnosis fits best?",
    stem: "A 79-year-old woman admitted for pneumonia becomes acutely confused over 24 hours. She is alternately drowsy and agitated, cannot sustain attention for months backward, and gives tangential answers. Family says she was cognitively sharp last week. Vitals: T 38.2°C, SpO₂ 90% on room air. Med list includes new oxycodone and diphenhydramine. Neuro exam is nonfocal. Which diagnosis best explains this presentation?",
    options: [
      { key: "A", text: "Delirium due to medical illness and medications" },
      { key: "B", text: "Alzheimer’s disease (amnestic presentation)" },
      {
        key: "C",
        text: "Primary psychotic disorder (late-onset schizophrenia)",
      },
      {
        key: "D",
        text: "Major depressive disorder with cognitive impairment (pseudodementia)",
      },
      { key: "E", text: "Nonconvulsive status epilepticus (NCSE)" },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Acute (hours–days), fluctuating** change in **attention/awareness** with disorganized thinking is the signature of **delirium**.",
      "- Clear **precipitants**: infection (pneumonia with fever/hypoxia) + **deliriogenic meds** (opioid, diphenhydramine/anticholinergic).",
      "- **Nonfocal neuro exam** and previously normal cognition support an acute confusional state rather than neurodegeneration.",
      "- Fits **CAM**: (1) acute/fluctuating + (2) inattention **and** either (3) disorganized thinking or (4) altered consciousness → criteria met.",
      "- [yellow]Pattern lock:[/yellow] acute + fluctuating + inattention + medical/medication trigger ⇒ **delirium**. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **B. Alzheimer’s disease:** **Insidious** years-long decline with **poor cueing** but **stable arousal**; not an abrupt, fluctuating syndrome tied to illness/meds.",
      "- **C. Primary psychosis:** Delusions/hallucinations can occur, but **attention and level of consciousness are typically intact**; onset in late life without prodrome is unusual.",
      "- **D. Depression (pseudodementia):** Low mood and **retrieval-type** deficits with **preserved attention**; course is **weeks–months**, not hours–days with fever/hypoxia.",
      "- **E. NCSE:** Can mimic delirium but often shows **staring, fluctuating responsiveness, subtle motor signs**; requires **EEG**—consider if unexplained or refractory, but infection/anticholinergic load already explains this case.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **CAM screen** + vitals, **fingerstick glucose**, **pulse oximetry**. **Confirms?** ❌ Identifies the syndrome.",
      "- **Next Diagnostic step:** **Search for triggers** → med review (stop anticholinergics, minimize opioids), **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR**, **ABG** if hypoxic, **ECG**. **Confirms?** ➕ Finds etiology.",
      "- **Best Diagnostic Step:** Targeted testing by clues (e.g., **blood cultures**, **lactate**, **TSH/B12** if subacute, **CT head** if trauma/focal deficit/anticoagulation, **EEG** if NCSE suspected). **Confirms?** ✅ Establish precipitant(s).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat underlying cause(s)[/green] — oxygenation, antibiotics for pneumonia, fluids/electrolytes, **deprescribe anticholinergics**, use the **lowest effective opioid** and prefer multimodal analgesia.",
      "- **First Line (non-pharm):** [green]DELIRIUM BUNDLE[/green] — orientation (clocks/family), glasses/hearing aids, mobilize, lights-by-day/dark-by-night, hydration, bowel/bladder care, reduce lines/restraints.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** patient endangers self/others; in Parkinson’s/Lewy use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained (DDx focus)**",
      "- **Delirium:** acute **network disconnection** of **frontoparietal attention** and **thalamocortical arousal** circuits driven by **inflammation**, **hypoxia**, and **neurotransmitter imbalance** (↓acetylcholine, ↑dopamine).",
      "- **Alzheimer’s:** **Aβ/tau** neurodegeneration → hippocampal storage failure; not acutely fluctuating.",
      "- **Psychosis:** Dopaminergic dysregulation with **intact arousal/attention**; lacks medical trigger and fluctuation.",
      "- **Depression:** Fronto-limbic mood disorder with **preserved attention** and effort-dependent performance; time course longer.",
      "- **NCSE:** Persistent epileptiform activity → altered mentation; **EEG** shows ictal discharges; consider when triggers are absent or response to treatment is poor.",
      "**6️⃣ Symptoms — pattern recognition for DDx**",
      "- **Delirium:** **Inattention**, fluctuating arousal, disorganized thinking, sleep–wake inversion; medical/medication triggers.",
      "- **AD:** Gradual memory loss, **poor cueing**, stable alertness.",
      "- **Psychosis:** Hallucinations/delusions with steady attention/awareness; no fever/hypoxia link.",
      "- **Depression:** Low mood, anergia; cognitive slowing improves with cues/effort.",
      "- **NCSE:** Staring spells, automatisms, unresponsiveness cycles; **EEG** clarifies.",
      "- [purple]Pearl:[/purple] ==If attention is broken **and** the course **fluctuates**, park on **delirium** while you hunt the trigger==",
    ],
  },
  {
    id: "DEL-INV-40006",
    topic: "Geriatrics • Delirium — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test when you suspect delirium",
    stem: "An 81-year-old post-op patient becomes acutely confused over 18 hours. Nurses report waxing–waning alertness and poor attention. She started oxycodone and diphenhydramine last night. Vitals: 38.0°C, HR 104, BP 146/82, SpO₂ 90% RA. What is the **best initial investigation** to pursue?",
    options: [
      {
        key: "A",
        text: "Bedside Confusion Assessment Method (CAM) + immediate physiology check (vitals, fingerstick glucose, pulse oximetry) and medication review",
      },
      { key: "B", text: "Non-contrast CT head" },
      { key: "C", text: "Electroencephalography (EEG)" },
      { key: "D", text: "Lumbar puncture for CSF analysis" },
      { key: "E", text: "MRI brain with and without contrast" },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium is a clinical diagnosis**: start with **CAM** to establish the syndrome (acute/fluctuating + inattention + [disorganized thinking or altered consciousness]).",
      "- The patient may be **hypoxic**, **febrile**, hypoglycemic/hyperglycemic, or **over-sedated**—so the **first tests are bedside physiology**: **vitals, fingerstick glucose, SpO₂/ABG if needed**, and **medication review** for deliriogenic agents.",
      "- This approach is **fast, low-risk, and high-yield**, immediately guiding treatment (oxygen, glucose, stop anticholinergics/opioids, treat infection).",
      "- [green]Practical win:[/green] Confirm the syndrome, correct life threats **now**, and then broaden the search for causes. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **B. CT head:** Indicated **only when** red flags exist (head trauma, focal deficit, anticoagulation bleed risk, thunderclap headache). Not the first step for typical ward delirium.",
      "- **C. EEG:** Helpful if **nonconvulsive status** is suspected or to document generalized slowing, but **not** first-line for routine cases.",
      "- **D. CSF:** Reserve for **meningitis/encephalitis** concern (fever + meningism/immunosuppression); invasive and not initial in most.",
      "- **E. MRI:** Excellent for structural disease, but **low immediate yield** in standard delirium evaluation without focal signs.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **CAM + ABCs**; check **vitals**, **fingerstick glucose**, **SpO₂** (± ABG), pain score; **medication review** (anticholinergics, opioids, benzos). **Confirms?** ❌ Identifies syndrome and immediate threats.",
      "- **Next Diagnostic step →** **Etiology screen**: **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR** if pulmonary signs, **ECG**, consider **TSH/B12** if subacute. **Confirms?** ➕ Points to trigger(s).",
      "- **Best Diagnostic Step →** **Targeted testing by clues**: **blood cultures/lactate**, **CT head** (trauma/focal/anticoag), **EEG** (NCSE concern), **LP** (meningitis/encephalitis). **Confirms?** ✅ Etiologic diagnosis.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat cause(s) immediately[/green] — oxygen for hypoxia, fluids/electrolytes, antibiotics for infection, multimodal analgesia; **stop/reduce deliriogenic meds**.",
      "- **First Line (non-pharmacologic):** [green]DELIRIUM BUNDLE[/green] — reorientation cues, **glasses/hearing aids**, daytime mobilization, sleep hygiene (lights off at night), hydration, bowel/bladder care, minimize lines/restraints.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** unsafe; in **Parkinson’s/Lewy**, use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Delirium reflects **frontoparietal attention** and **thalamocortical arousal** network failure triggered by **inflammation**, **hypoxia**, **metabolic derangements**, and **neurotransmitter imbalance** ([blue]↓acetylcholine, ↑dopamine[/blue]).",
      "- Correcting physiology (O₂, glucose, electrolytes, fever) and removing offenders rapidly **stabilizes networks**, enabling recovery.",
      "**6️⃣ Symptoms — pattern recognition**",
      "- **Inattention** 🎯 (fails months backward/digit span) with **fluctuating awareness** 🌙.",
      "- **Disorganized thinking** 🧩 and **sleep–wake inversion** 😴.",
      "- **Hallucinations/illusions** 👀 that ebb and flow with arousal.",
      "- [purple]Pearl:[/purple] ==In suspected delirium, **CAM + vitals/glucose/SpO₂ + med review** is the best first move==",
    ],
  },
  {
    id: "DEL-GOLD-40007",
    topic: "Geriatrics • Delirium — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle: "What definitively establishes delirium at the bedside?",
    stem: "An 82-year-old inpatient becomes acutely confused over 24 hours with waxing–waning alertness. Nurses report poor attention and disorganized thinking after opioids and a new infection. CT head is normal. You want the **gold standard** to establish delirium as a diagnosis (separate from finding the cause). What is the single best choice?",
    options: [
      { key: "A", text: "Brain MRI with and without contrast" },
      { key: "B", text: "Electroencephalography (EEG)" },
      {
        key: "C",
        text: "Lumbar puncture for CSF cell count, protein, and cultures",
      },
      {
        key: "D",
        text: "Formal clinical assessment using DSM-5 criteria (or a validated tool such as CAM/CAM-ICU) demonstrating acute/fluctuating inattention and altered awareness",
      },
      { key: "E", text: "Comprehensive neuropsychological testing battery" },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium is a clinical diagnosis**. The **gold standard** is an **expert clinical assessment using DSM-5 criteria**, often operationalized with **validated tools** like **CAM** (or **CAM-ICU** for ventilated patients).",
      "- Core required elements: **acute onset**, **fluctuating course**, **inattention**, **altered awareness**, plus additional cognitive change (disorganized thinking, disorientation, perception).",
      "- Imaging/labs help **find the cause**, not to diagnose the syndrome itself.",
      "- [yellow]Bottom line:[/yellow] To *prove* delirium is present → **DSM-5/CAM-based bedside assessment**. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI:** Excellent for structural disease but **does not define delirium**; often normal or nonspecific.",
      "- **B. EEG:** May show **generalized slowing** or detect **NCSE**, but it **supports** and **doesn’t establish** delirium as the syndrome.",
      "- **C. CSF:** Useful when **infection/inflammation** is suspected; it finds **causes**, not the delirium syndrome itself.",
      "- **E. Neuropsych testing:** Time-consuming and inappropriate for fluctuating attention/arousal; not required to diagnose delirium.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step →** **DSM-5/CAM at bedside** (acute + fluctuating + **inattention** + **disorganized thinking/altered consciousness**). **Confirms?** ✅ **Yes** — establishes delirium.",
      "- **Next Diagnostic step →** **Physiology check & screen for precipitants**: vitals, **fingerstick glucose**, **SpO₂/ABG**, medication review (anticholinergics, opioids, benzos), **CBC/CMP**, Ca/Mg/Phos, **UA/urine culture**, **CXR**, **ECG**. **Confirms?** ➕ Finds likely triggers.",
      "- **Best Diagnostic Step (targeted by clues) →** **CT head** (trauma/focal/anticoag), **EEG** (NCSE concern), **LP** (meningitis/encephalitis), toxin panels, **TSH/B12/cortisol/ammonia** as indicated. **Confirms?** ✅ Etiology defined.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Treat causes promptly[/green] — oxygenation, fluids/electrolytes, antibiotics for infection, multimodal analgesia; **deprescribe deliriogenic meds**.",
      "- **First Line (non-pharmacologic):** [green]DELIRIUM BUNDLE[/green] — orientation cues, **glasses/hearing aids**, mobilization, sleep hygiene (quiet/dark nights), hydration/nutrition, bowel/bladder care, minimize lines/restraints.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if unsafe**; in **Parkinson’s/Lewy** use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Delirium = **acute network failure** in **frontoparietal attention** and **thalamocortical arousal** circuits.",
      "- Mechanisms: **neuroinflammation**, **neurotransmitter imbalance** ([blue]↓acetylcholine, ↑dopamine[/blue]), **hypoxia/metabolic stress**, and **circadian disruption**.",
      "- EEG often shows **diffuse slowing**; this reflects network dysfunction but lacks diagnostic specificity without the **clinical** syndrome.",
      "**6️⃣ Symptoms — pattern recognition link**",
      "- **Inattention** 🎯 (months backward/digit span failures) with **fluctuating awareness** 🌙.",
      "- **Disorganized thinking** 🧩, **sleep–wake inversion** 😴, **illusions/visual hallucinations** 👀.",
      "- [purple]Pearl:[/purple] ==To *diagnose* delirium: use **DSM-5/CAM**; to *treat* delirium: correct **physiology & precipitants**==",
    ],
  },
  {
    id: "DEL-ETIO-40008",
    topic: "Geriatrics • Delirium — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle:
      "Why did this patient become delirious? Multifactorial brain failure",
    stem: "An 84-year-old woman with baseline mild cognitive impairment and poor hearing is admitted for hip-fracture repair. Within 36 hours post-op she becomes acutely confused with waxing–waning attention. Vitals: T 38.1°C, SpO₂ 90% on room air, HR 106. Labs: Na 129, BUN/Cr ratio 28. Meds started last night: oxycodone PRN, diphenhydramine at bedtime, and oxybutynin for bladder spasms. UA shows pyuria. Which underlying **etiology** best explains her delirium?",
    options: [
      {
        key: "A",
        text: "Primary Alzheimer’s disease progression causing storage (memory) failure",
      },
      {
        key: "B",
        text: "Acute focal ischemic stroke in the left MCA territory",
      },
      {
        key: "C",
        text: "Multifactorial acute brain failure: interaction of predisposing vulnerability (age, MCI, sensory loss) with precipitating factors (infection, hypoxia, electrolyte derangement, pain, polypharmacy—anticholinergics/opioids/antihistamines)",
      },
      { key: "D", text: "Primary psychotic disorder emerging in late life" },
      {
        key: "E",
        text: "Long-standing major depressive disorder with pseudodementia",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- Delirium typically arises from a **vulnerability–precipitant model**: **predisposing factors** (advanced age, cognitive impairment, sensory deficits, frailty) combine with **acute triggers** (infection, hypoxia, metabolic disturbances, pain, sleep loss, **deliriogenic medications**—notably **anticholinergics, sedating antihistamines, opioids, benzodiazepines**).",
      "- This patient has **multiple precipitants at once**: UTI/fever, post-op hypoxia, **hyponatremia**, dehydration (BUN/Cr), **anticholinergics** (diphenhydramine, oxybutynin), and **opioids**, layered on high baseline vulnerability (age, MCI, hearing loss).",
      "- The result is **acute network dysfunction** of attention/awareness (delirium), not a focal lesion or slow neurodegenerative drift.",
      "- [yellow]Etiology lock:[/yellow] many small hits on a vulnerable brain → **multifactorial acute brain failure (delirium)**. 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Alzheimer progression:** Neurodegeneration is **insidious** with **stable arousal** and early preserved attention; it doesn’t cause **abrupt, fluctuating** inattention over hours–days.",
      "- **B. Focal MCA stroke:** Would suggest **acute focal deficits** (aphasia/hemiparesis/field cut). Delirium can occur post-stroke, but here **poly-precipitant medical factors** explain the syndrome.",
      "- **D. Primary psychosis:** Typically features **intact attention/arousal** and lacks a medical trigger; sudden onset post-op with physiologic derangements fits delirium, not new psychosis.",
      "- **E. Depression (pseudodementia):** **Weeks–months** course with **retrieval** problems and **preserved attention**; not the **hour-to-hour fluctuation** seen here.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **CAM** screen to establish delirium + **vitals**, **fingerstick glucose**, **SpO₂**; **medication review** (anticholinergics/opioids/benzos). **Confirms?** ❌ Identifies syndrome and immediate threats.",
      "- **Next Diagnostic step:** Broad precipitant search: **CBC/CMP** (Na↓, renal function), Ca/Mg/Phos, **UA/urine culture**, **CXR** if pulmonary signs, **ABG** if hypoxic, **ECG**; assess pain, urinary retention, constipation, and sleep. **Confirms?** ➕ Narrows triggers.",
      "- **Best Diagnostic Step:** **Targeted tests** by clue (blood cultures, troponin if ischemia, CT head if trauma/focal/anticoag, **EEG** if NCSE concern). **Confirms?** ✅ Establishes causative factors.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Correct precipitants[/green] — oxygen, treat UTI, IV fluids/electrolytes (slow Na correction), multimodal **non-opioid-first** analgesia, bladder scan/catheter only if necessary.",
      "- **First Line (non-pharmacologic):** [green]DELIRIUM BUNDLE[/green] — reorientation, **glasses/hearing aids**, early mobilization, daytime light/nighttime dark, sleep protocol, hydration/nutrition, remove tethers, family presence.",
      "- **Gold Standard (agitation safety):** **Low-dose antipsychotic** **only if** the patient is unsafe; in **Parkinson’s/Lewy**, use **quetiapine/clozapine**. [red]Avoid benzodiazepines[/red] except for **alcohol/benzo withdrawal**.",
      "**5️⃣ Full Pathophysiology Explained (Etiology focus)**",
      "- **Neuroinflammation** (cytokines from infection/surgery) and **metabolic stress** (hypoxia, hyponatremia) impair **thalamocortical arousal** and **frontoparietal attention** networks.",
      "- **Neurotransmitter imbalance**: [blue]↓ acetylcholine[/blue] (worsened by anticholinergics), [blue]↑ dopamine[/blue] (agitation/psychosis), plus GABA/glutamate disruptions.",
      "- **Sleep–wake disruption**, pain, and sensory deprivation (no hearing aids/glasses) further degrade cognition.",
      "- The **dose–threshold** model: more precipitants → lower threshold to delirium in a vulnerable brain.",
      "**6️⃣ Symptoms — cause → effect mapping**",
      "- **Anticholinergics/opioids** 💊 → ↓ACh/↑DA imbalance → **inattention**, hallucinations, agitation.",
      "- **Infection & hypoxia** 🦠🌬️ → cytokine/oxygen debt → **fluctuating awareness** and lethargy.",
      "- **Hyponatremia/dehydration** 💧 → cortical irritability → confusion, delirium.",
      "- **Sensory loss/no aids** 👂👓 → misperceptions/illusions; improves with amplification/visual cues.",
      "- [purple]Pearl:[/purple] ==Delirium rarely has one cause—**stacked small hits** on a vulnerable brain are the rule==",
    ],
  },
  {
    id: "DEL-COMP-40009",
    topic: "Geriatrics • Delirium — Complications",
    difficulty: "Medium",
    vignetteTitle:
      "What high-impact complication should you anticipate in delirium?",
    stem: "An 83-year-old inpatient with pneumonia becomes acutely delirious. He is intermittently agitated at night, pulls at IV lines, and tries to get out of bed. He received oxycodone and diphenhydramine overnight. Exam shows fluctuating attention, disorganized thinking, and unsteady gait when mobilized. Which complication is most important to anticipate and actively prevent over the next 24–72 hours?",
    options: [
      {
        key: "A",
        text: "New-onset Parkinson’s disease requiring dopaminergic therapy",
      },
      {
        key: "B",
        text: "Falls with injury (hip fracture or intracranial hemorrhage) due to inattention, impulsivity, and sedatives",
      },
      {
        key: "C",
        text: "Primary major depressive disorder from hospital environment",
      },
      { key: "D", text: "Multiple sclerosis relapse triggered by infection" },
      { key: "E", text: "Acute leukemia precipitated by antibiotics" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium** markedly increases risk of **falls** because of **inattention, impaired awareness, psychomotor agitation (or sudden hypo→hyper shifts), sleep loss, and sedating/deliriogenic meds**.",
      "- Consequences are **high-impact and immediate**: **hip fractures**, **intracranial hemorrhage**, and **subdural hematoma**, each raising mortality and prolonging hospitalization.",
      "- Nighttime agitation (“==sundowning==”), lines/tethers, and unfamiliar rooms amplify risk; prevention requires **environment + staff + medication** strategies working together.",
      "- [yellow]Safety hinge:[/yellow] In the first 72 hours, **prevent a fall**—it changes the patient’s trajectory more than any sedative. 🧠🦴",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Parkinsonism is not a typical complication of delirium; antipsychotics may **worsen** parkinsonism but do not cause PD.",
      "- **C:** Low mood can follow hospitalization, but **acute injuries** from falls are the urgent threat during delirium.",
      "- **D:** MS relapse is unrelated to delirium in this context.",
      "- **E:** Antibiotics do not cause acute leukemia; irrelevant to delirium’s risk profile.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **CAM** to confirm syndrome + **vitals, fingerstick glucose, SpO₂**, and **medication review** (stop anticholinergics/minimize opioids). **Confirms?** ❌ Identifies delirium; not the complication yet.",
      "- **Next Diagnostic step:** **Falls risk assessment** (history of falls, gait test, orthostatics), **environmental hazard check** (lines/tethers, bed height, clutter), **sedation scale** (e.g., RASS), **QTc** if antipsychotics planned. **Confirms?** ➕ Stratifies injury risk.",
      "- **Best Diagnostic Step:** If any event occurs (near-fall/fall), perform **post-fall huddle** + targeted imaging (CT head if head strike/anticoagulation), **hip X-ray/CT** if pain/shortened leg. **Confirms?** ✅ Detects injury early.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Immediate fall prevention bundle[/green] — **1:1 observation or cohorting**, low bed with **bed alarm**, **non-slip socks**, clear floor, **night lighting**, frequent orientation, schedule toileting, ensure **glasses/hearing aids** on.",
      "- **First Line:** [green]Medication minimization[/green] — stop **diphenhydramine/anticholinergics**, use **lowest effective opioid** with multimodal analgesia; avoid benzodiazepines (except withdrawal). Early **mobilization/PT**, review **orthostatics**, hydrate, manage pain/constipation/urinary retention.",
      "- **Gold Standard (for dangerous agitation):** **Low-dose antipsychotic** (e.g., haloperidol) **only if** the patient is unsafe; in **Parkinson’s/Lewy**, use **quetiapine/clozapine**. [red]Avoid physical restraints when possible[/red]—they **increase injury and agitation**; if absolutely necessary, use **shortest time with protocolized monitoring**.",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Delirium’s **frontoparietal attention** and **thalamocortical arousal** failure yields **impulsivity**, **inattention**, and **psychomotor variability**.",
      "- **Sedatives/anticholinergics** worsen reaction time and postural reflexes; **sleep–wake disruption** and **pain** further degrade motor control.",
      "- Result: **instability + poor hazard detection** → **falls**; after a fall, inflammatory stress can **worsen delirium**, creating a vicious cycle.",
      "**6️⃣ Complications — pattern recognition & prevention map**",
      "- **Falls with injury** 🦴🧠 → hip fracture, ICH/subdural; **highest immediate priority**.",
      "- **Aspiration pneumonia** 🫁 → inattention, dyscoordination, oversedation; prevent with swallow screening, upright positioning.",
      "- **Pressure injuries & malnutrition** 🛌🍽️ → hypoactive subtype; mobilize, nutrition support.",
      "- **Prolonged LOS, institutionalization, mortality** 📈 → each fall/infection lengthens trajectory.",
      "- **Medication harms** 💊 → QTc prolongation (antipsychotics), **benzodiazepine-induced respiratory depression**; monitor and minimize.",
      "- [purple]Pearl:[/purple] ==Delirium + night + sedatives + lines = **fall waiting to happen**. Build the bundle before it does==",
    ],
  },
  {
    id: "DEL-EPI-40010",
    topic: "Geriatrics • Delirium — Epidemiology",
    difficulty: "Medium",
    vignetteTitle: "How common is delirium, and where should you expect it?",
    stem: "Your hospital leadership wants a snapshot of delirium burden to plan staffing and prevention programs. They care about how often delirium occurs in different settings, who’s most at risk, and what outcomes it drives. Which statement best captures the **epidemiology** of delirium?",
    options: [
      {
        key: "A",
        text: "Delirium is rare in older inpatients (<1%) and mostly limited to psychiatric wards",
      },
      {
        key: "B",
        text: "Delirium is common in older inpatients and ICU/post-operative settings, especially with acute illness and sensory impairment; it is frequently missed (hypoactive type) and is linked to longer stays, institutionalization, and higher mortality",
      },
      {
        key: "C",
        text: "Delirium occurs primarily in community-dwelling adolescents with viral infections and resolves without consequences",
      },
      {
        key: "D",
        text: "Delirium is confined to patients with known dementia and never occurs in those with normal baseline cognition",
      },
      {
        key: "E",
        text: "Delirium only follows large territorial strokes; medical illnesses do not precipitate it",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium is common** in **older hospitalized adults**, with **high rates in ICU** and **post-operative** populations (e.g., hip fracture, major cardiac/vascular surgery).",
      "- **Hypoactive delirium** is **under-recognized**, contributing to **missed diagnoses** on general wards.",
      "- It is associated with **longer length of stay, higher costs**, **post-discharge institutionalization**, **falls**, and **increased short- and long-term mortality**.",
      "- Delirium often heralds **serious acute illness** and predicts **subsequent cognitive decline** in a subset of patients. [yellow]System-level priority condition[/yellow].",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Delirium is **not rare** and is **not limited** to psychiatric units.",
      "- **C:** Adolescents are **not the primary risk group**; delirium is a disorder of **acute medical illness**, especially in **older** or **medically complex** patients.",
      "- **D:** Baseline **normal cognition** does **not** protect; delirium can occur without prior dementia (though dementia raises risk).",
      "- **E:** Delirium arises from **many medical/surgical causes** (infection, hypoxia, metabolic derangements, drugs) and is **not confined** to large strokes.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step (program level):** Implement **routine screening** (CAM/CAM-ICU once per shift in high-risk units). **Confirms?** ❌ Surveillance detects cases; not etiology.",
      "- **Next Diagnostic step (measurement):** Track **incidence/prevalence** by unit (ICU, ortho, cardiac surgery, medicine), and **subtype mix** (hyper/hypo/mixed). **Confirms?** ➕ Quantifies burden.",
      "- **Best Diagnostic Step (quality):** Audit **missed hypoactive delirium** and measure outcomes (LOS, falls, restraints, discharge destination, 30-day readmission/mortality). **Confirms?** ✅ Identifies targets for improvement.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management (population):** [green]Delirium prevention bundle[/green] — orientation, **glasses/hearing aids**, early mobility, sleep protocol, hydration/nutrition, bowel/bladder care, pain control with **non-deliriogenic** strategies.",
      "- **First Line (unit pathways):** [green]Nurse-driven screens + rapid cause hunt[/green] (vitals, glucose, SpO₂, med review) and standardized order sets (labs/imaging by clue).",
      "- **Gold Standard (system impact):** Embed **multicomponent prevention programs** on high-risk wards; establish **post-op/ICU protocols**, minimize **anticholinergics/benzodiazepines**. [red]Avoid routine physical restraints[/red].",
      "**5️⃣ Full Pathophysiology Explained (Epi lens)**",
      "- Rising **age** and **comorbidity** in hospital populations increase **vulnerability**; **acute precipitants** (infection, surgery, meds) are ubiquitous.",
      "- **Sensory deprivation** (no hearing aids/glasses) and **sleep disruption** on wards amplify risk → higher observed incidence.",
      "- Recurrent episodes and prolonged delirium contribute to **functional decline** and **future cognitive impairment** in some patients.",
      "**6️⃣ Symptoms — epidemiology → phenotype link**",
      "- **ICU/post-op**: higher rates; often **hypoactive or mixed** types.",
      "- **General medicine**: infection, hypoxia, dehydration, polypharmacy drive cases; **nighttime worsening** common.",
      "- **Long-term outcomes**: more **falls, institutionalization, mortality**, and **new cognitive deficits** after discharge.",
      "- [purple]Service design tip:[/purple] ==If your unit has many older, acutely ill patients, budget for **screening + prevention bundles** and train staff to spot **hypoactive** delirium==",
    ],
  },
  {
    id: "DEL-RISK-40011",
    topic: "Geriatrics • Delirium — Risk Factors",
    difficulty: "Medium",
    vignetteTitle:
      "Who’s primed for delirium? Vulnerability × precipitant load",
    stem: "An 86-year-old with mild cognitive impairment (MoCA 22/30), severe hearing loss (no aids), CKD, and polypharmacy (including diphenhydramine and oxybutynin) is admitted for community-acquired pneumonia. She is dehydrated, hypoxic (SpO₂ 89% RA), febrile, and has a urinary catheter placed. Which risk profile best captures the **highest delirium risk**?",
    options: [
      {
        key: "A",
        text: "Advanced age + baseline cognitive impairment/sensory loss (vulnerability) × acute illness/severity + deliriogenic medications + sleep disruption/immobility/tethers (precipitants)",
      },
      { key: "B", text: "High educational attainment and bilingualism" },
      { key: "C", text: "APOE ε4 genotype without medical illness" },
      { key: "D", text: "Seasonal allergies treated with intranasal steroids" },
      {
        key: "E",
        text: "History of resolved concussion 20 years ago, currently well",
      },
    ],
    correct: "A",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Delirium risk = Vulnerability × Precipitant load.**",
      "- **Vulnerability:** **Age ≥65**, **dementia/MCI**, **sensory impairment** (no hearing aids/glasses), frailty, prior delirium.",
      "- **Precipitants:** **Acute illness/severity** (sepsis, hypoxia), **polypharmacy**/**deliriogenic drugs** (anticholinergics, benzodiazepines, opioids), **dehydration/electrolyte derangement**, **sleep loss/ICU**, **immobility**, **tethers** (catheters/lines), pain/constipation/urinary retention.",
      "- The vignette stacks multiple high-yield risks → **very high probability** of delirium. [yellow]==Stacked hits on a vulnerable brain==[/yellow] 🧠⚡",
      "**2️⃣ Why the other options are wrong**",
      "- **B:** Education/bilingualism usually **increase cognitive reserve**; not risk factors.",
      "- **C:** APOE ε4 relates more to **Alzheimer’s** risk; delirium needs **acute triggers** even in carriers.",
      "- **D:** Intranasal steroids have minimal central effects; not a core delirium risk.",
      "- **E:** Remote concussion without current issues is **low-yield** compared to acute physiologic stressors.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** **Risk screen on admission** (age, dementia/MCI, sensory loss, prior delirium, frailty, polypharmacy, illness severity, tethers, sleep/immobility). **Confirms?** ❌ Stratifies risk.",
      "- **Next Diagnostic step:** Implement **preventive orders** immediately for high-risk patients; perform **CAM** at baseline and every shift. **Confirms?** ➕ Detects incident delirium early.",
      "- **Best Diagnostic Step:** If delirium appears, **hunt precipitants** (vitals, glucose, SpO₂/ABG, med review, CBC/CMP, Ca/Mg/Phos, UA/CXR/ECG) and treat quickly. **Confirms?** ✅ Establishes cause(s).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management (prevention):** [green]Multicomponent bundle[/green] — orientation, **hearing aids/glasses**, daytime mobilization, sleep protocol (quiet/dark nights), hydration/nutrition, pain control (non-deliriogenic), bowel/bladder care, **remove tethers** ASAP.",
      "- **First Line (meds):** [green]Deprescribe deliriogenic agents[/green] — stop **anticholinergics** (diphenhydramine/oxybutynin), minimize **benzodiazepines/opioids**; prefer multimodal analgesia.",
      "- **Gold Standard:** Unit-wide **prevention programs** (e.g., HELP model) with nursing-led screening, early mobility, and sensory optimization; [red]avoid routine restraints/bedrest[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Predisposed brains (age, neurodegeneration, sensory deprivation) have **lower reserve** in **frontoparietal attention** and **thalamocortical arousal** networks.",
      "- Acute insults (infection, hypoxia, metabolic derangement) trigger **neuroinflammation** and **neurotransmitter imbalance** ([blue]↓acetylcholine, ↑dopamine[/blue]), tipping the system into **delirium**.",
      "- Drugs with **anticholinergic** and **sedative** properties further suppress attention/arousal, while **sleep and immobility** worsen synaptic efficiency.",
      "**6️⃣ Risk checklist — memorize the big levers**",
      "- **Age ≥65, dementia/MCI, prior delirium, frailty.**",
      "- **Sensory loss** without aids (hearing/vision).",
      "- **Acute severity:** sepsis, hypoxia, shock, surgery/ICU.",
      "- **Deliriogenic meds:** anticholinergics, benzos, opioids, sedating antihistamines, polypharmacy.",
      "- **Environment:** sleep disruption, **immobility**, **tethers** (Foley/lines), unfamiliar setting.",
      "- [purple]Pearl:[/purple] ==Reduce **drugs, tethers, darkness of hearing/vision**, and **physiologic chaos**—your best delirium prophylaxis==",
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
              No incorrect answers — excellent 🎉
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
export default function Delirium() {
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
      title="Start Delirium Question Bank"
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
