// src/pages/nvu-subjects/geriatrics-osce.jsx
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
/** Each item is OSCE-flavoured: “best next step / safety / communication”. */
const QUESTIONS = [
  {
    id: "DEL-ETIO-50001",
    topic: "Geriatrics • Delirium — Postoperative precipitants (medications)",
    difficulty: "Medium",
    vignetteTitle:
      "Which medication most likely precipitated this patient’s postoperative delirium?",
    stem: 'An 85-year-old man is admitted for hip fracture repair and undergoes total hip replacement. Intraoperative blood loss is ~300 mL and he receives 2 units of blood. Four days later, his wife reports he is "not himself." He is intermittently confused, asks about taking out a dog that died years ago, and tries to remove his IV and Foley catheter. Vitals are normal except for a temperature of 95.4°F (35.2°C). Exam: alert but disoriented with fluctuating attention; otherwise nonfocal; clean, well-healing surgical site with a Foley in place. Current medications: aspirin 325 mg daily, atenolol 25 mg daily, simvastatin 20 mg qHS, meperidine 50 mg q6h PRN pain, diphenhydramine 25 mg qHS PRN sleep. Which medication change would most likely resolve his acute confusion?',
    options: [
      {
        key: "A",
        text: "Continue all medications; add low-dose haloperidol at bedtime",
      },
      { key: "B", text: "Stop simvastatin" },
      { key: "C", text: "Stop atenolol" },
      { key: "D", text: "Stop diphenhydramine" },
      {
        key: "E",
        text: "Increase meperidine dose and add a benzodiazepine for agitation",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **Stop diphenhydramine (option D).**",
      "",
      "**2) Why it is the correct answer**",
      "- Presentation is [yellow]**acute and fluctuating inattention with disorientation**[/yellow] a few days after major surgery → this is **delirium**, not dementia or depression.",
      "- [red]**Diphenhydramine**[/red] is a **first-generation antihistamine** with strong [red]**anticholinergic**[/red] effects. Anticholinergic burden is one of the **most common, reversible hospital causes** of delirium in older adults.",
      "- Older adults have lower baseline central acetylcholine and reduced reserve; perioperative stressors (sleep loss, pain, inflammation, anesthesia carryover) make them **hypersensitive** to anticholinergic drugs.",
      "- Stopping the culprit medication is the **highest-yield intervention** and often shortens delirium duration.",
      "",
      "**3) Explain like I’m a child**",
      "- Your brain uses a helper chemical called **acetylcholine** to **pay attention, remember, and know where you are**.",
      "- [red]Diphenhydramine[/red] is like **putting gum in the brain’s fuel straw** so the helper chemical can’t get through.",
      "- When the straw is blocked, the **lights flicker**: you get mixed up, say strange things, and might grab at tubes because they feel weird.",
      "- **Take away the blocker**, and more fuel gets through; the lights come back and thinking gets clearer.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Continue meds + add haloperidol:** Antipsychotics can be used **only if the patient is dangerous** to self/others, but they **don’t remove the cause**. Keeping [red]diphenhydramine[/red] sustains delirium and adds QT/prolongation and EPS risks.",
      "- **B. Stop simvastatin:** Statins are **not acute precipitants** of delirium; discontinuation yields **no immediate cognitive benefit** and may harm cardiovascular risk control.",
      "- **C. Stop atenolol:** Beta-blockers **rarely cause delirium**. Abrupt withdrawal risks **rebound tachycardia, hypertension, ischemia**—not indicated.",
      "- **E. Increase meperidine + benzodiazepine:** This is **toxic synergy**. [red]Meperidine[/red] has a neurotoxic metabolite (**normeperidine**) → agitation, tremor, seizures; benzodiazepines (outside alcohol/benzo withdrawal) **worsen attention and delirium**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test w/ result:** **Bedside delirium screen** (e.g., CAM: acute onset & fluctuating course, inattention, disorganized thinking, altered consciousness) → **positive CAM** fits delirium.",
      "- **Best Test w/ result:** **Targeted medication review** with an **anticholinergic burden check** (Beers Criteria) → [red]**diphenhydramine identified**[/red] as a high-risk agent; also flag [red]meperidine**[/red].",
      "- **Additional Tests:** CBC, CMP/electrolytes, renal function, glucose, pulse oximetry ± ABG if hypoxic, TSH/B12 if unexplained, urinalysis/culture if infectious signs, pain assessment, bladder scan for retention, stool burden check, review of restraints/sleep disruption.",
      "- **Why we do each test:** Delirium is a **syndrome**. We search for **reversible drivers**: drugs (especially [red]anticholinergics, opioids, benzodiazepines[/red]), **infection**, **hypoxia**, **dehydration**, **electrolyte disturbances**, **urinary retention/constipation**, **pain**, and **environmental stressors**. Treating these **shortens duration and prevents complications** (falls, aspiration).",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **Remove causes** → stop [red]diphenhydramine[/red]; **avoid meperidine**; correct hypoxia/dehydration/electrolytes; **reorientation protocol** (glasses, hearing aids, clocks, familiar voices), **sleep hygiene** (lights by day, quiet/dark by night), **early mobilization**, bowel/bladder care, minimize tethers (Foley, restraints) when safe.",
      "- **First Line:** **Analgesia optimization without deliriogenic meds**: scheduled acetaminophen; if opioid required, use **small doses of morphine/oxycodone or hydromorphone** with bowel regimen; consider regional anesthesia/nerve blocks. Treat infection if present; manage withdrawal states appropriately.",
      "- **Gold Standard:** **Non-pharmacologic delirium bundle** (multicomponent) with **family engagement** + **sleep, mobility, sensory aids, hydration, pain control**, and **medication stewardship**. Use **low-dose antipsychotic** (e.g., haloperidol 0.5–1 mg) **only for dangerous agitation** after reversible causes are addressed; monitor QT and avoid in Parkinson/Lewy body if possible (prefer **quetiapine** there).",
      "",
      "**7) Full Pathophysiology Explained like a child**",
      "- The brain is a **city of lights**. The lights run on **acetylcholine power** to keep streets labeled, traffic organized, and memory buses on time.",
      "- [red]Anticholinergic drugs[/red] like diphenhydramine **close the power stations**. After surgery, storms (pain, inflammation, poor sleep, anesthesia leftovers) already strain the grid.",
      "- When power drops, **street signs vanish** (disorientation), **traffic cops nap** (inattention), and **buses miss stops** (memory problems).",
      "- **Turning the power back on** = remove anticholinergics, treat stressors, restore oxygen/water/electrolytes; the city lights stabilize and schedules return.",
      "",
      "**8) Symptoms**",
      "- **Inattention and distractibility** – [blue]acetylcholine shortage in frontal–parietal attention networks[/blue] → can’t sustain focus.",
      "- **Disorientation and memory gaps** – [blue]hippocampal and limbic network dysfunction[/blue] → poor encoding/recall in the moment.",
      "- **Perceptual disturbances (hallucinations, illusions)** – [purple]neurotransmitter imbalance (↓ACh, relative ↑dopamine) in visual/limbic circuits[/purple].",
      "- **Sleep–wake inversion** – [yellow]circadian disruption from hospitalization, light/noise, and medications[/yellow].",
      "- **Agitation or hypoactive quietness** – two faces of delirium: [yellow]hyperactive[/yellow] (restless, pulling lines) vs [yellow]hypoactive[/yellow] (quiet, withdrawn, missed by staff).",
      "- **If you see:** **sudden confusion + poor attention + recent surgery/illness + new [red]anticholinergic or opioid** → **think delirium and de-prescribe**.",
    ],
  },
  {
    id: "DEL-HX-50003",
    topic:
      "Geriatrics • Delirium — Confused Elderly Patient (Collateral History and Evaluation)",
    difficulty: "Medium",
    vignetteTitle:
      "Which information must you obtain first in an elderly woman with new-onset confusion?",
    stem: "An 84-year-old woman is brought to A&E after being found wandering at night. She is alert but confused (Mini-Mental State Examination 12/30; normal 27 to 30). There are no focal neurological signs, but she is cold (core temperature 35.5 C). She cannot provide a coherent history.",
    options: [
      {
        key: "A",
        text: "Ask about childhood illnesses and extended family history",
      },
      {
        key: "B",
        text: "Obtain collateral history of baseline cognition and function, recent events and symptoms, full medication review, and living situation",
      },
      {
        key: "C",
        text: "Send immediately for CT head before speaking to family",
      },
      {
        key: "D",
        text: "Warm the patient and wait without further assessment",
      },
      {
        key: "E",
        text: "Document confusion and discharge when she appears calm",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "- ✅ **B. Collateral history plus medication and social review.** This is the highest-yield first step in suspected **[yellow]delirium[/yellow]** when the patient is **[red]not a reliable historian[/red]**.",
      "",
      "**2) Why it is the correct answer**",
      "- The presentation is **acute** and **fluctuating** confusion after being found **wandering at night** with **hypothermia**. This points to **[yellow]delirium[/yellow]** rather than chronic dementia.",
      "- **[green]Collateral history[/green]** clarifies **[blue]baseline cognition and function[/blue]**, establishes the **[purple]time course[/purple]** (sudden vs gradual), and uncovers **[red]precipitating factors[/red]** such as infection, dehydration, new medications, intoxication, or environmental exposure to cold.",
      "- A **[green]medication reconciliation[/green]** identifies **[red]deliriogenic agents[/red]**: anticholinergics (diphenhydramine), benzodiazepines, opioids like meperidine, antipsychotics, polypharmacy, missed doses or withdrawals.",
      "- Understanding **[blue]living situation and safety[/blue]** (heating, food access, supervision, recent move) guides immediate risk control and disposition.",
      "",
      "**3) Explain like I am a child**",
      "- Her brain is like a **lamp** that suddenly flickers. To fix the flicker, first ask someone who knows her: **what is she like on a good day** **[blue]baseline[/blue]**, **what changed today** **[purple]timeline[/purple]**, and **what she took or felt** **[red]medicines or sickness[/red]**. Those answers tell you which switch to flip.",
      "",
      "**4) Why the other options are wrong**",
      "- **A:** Childhood and distant family history are **[red]not relevant[/red]** for acute confusion in the ED.",
      "- **C:** CT head may be needed later for **[yellow]focal deficit, trauma, anticoagulation, or persistent unexplained delirium[/yellow]**, but most cases are **[green]systemic and reversible[/green]**; skipping history delays diagnosis.",
      "- **D:** Warming is appropriate but **[red]insufficient alone[/red]**; you must search for causes (infection, hypoglycemia, drug toxicity).",
      "- **E:** Discharging a confused older adult without identifying cause or ensuring **[blue]safe supervision[/blue]** is **[red]unsafe[/red]**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bedside delirium screen[/blue]** (CAM features: acute change and fluctuation, inattention, disorganized thinking, altered level of consciousness) plus **vital signs and capillary glucose**. Expected result: **[yellow]CAM positive[/yellow]**; exclude **[red]hypoglycemia[/red]** and **[red]hypoxia[/red]** immediately.",
      "- **Best Test with result:** **[green]Collateral history and medication review[/green]** from daughter/carer, pharmacy, and records. Result: defines **[purple]new onset[/purple]** vs chronic decline, identifies **[red]offending drugs[/red]** or missed doses, recent infection, dehydration, or exposure to cold.",
      "- **Additional Tests:** CBC and CRP **[yellow]infection screen[/yellow]**; electrolytes, urea/creatinine, calcium **[blue]metabolic causes[/blue]**; urinalysis/culture; chest X-ray if respiratory symptoms; ECG for ischemia/arrhythmia/QT; TSH and B12 if unclear; bladder scan for **[purple]urinary retention[/purple]**; stool burden check for **[purple]constipation[/purple]**; consider CT head **only** with head injury, focal neurology, anticoagulation, or persistent diagnostic uncertainty.",
      "- **Why each test:** Delirium is a **[yellow]syndrome[/yellow]**. Tests target common **[red]reversible drivers[/red]**: infection, dehydration, electrolyte derangement, medication effects, hypoxia, hypoglycemia, urinary retention, constipation, and environmental stressors such as **[purple]hypothermia[/purple]**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Stabilize ABCs[/green]**; check glucose and oxygen saturation; begin **[blue]passive rewarming[/blue]**; provide a **[green]low-stimulus, well-lit environment[/green]** with orientation aids (clock, calendar, names); ensure **[blue]glasses and hearing aids[/blue]**; prevent falls and wandering; maintain hydration and nutrition.",
      "- **First Line:** **[green]Treat the cause[/green]** based on findings: antibiotics for UTI or pneumonia; IV or PO fluids for dehydration; correct electrolytes; relieve urinary retention or constipation; stop **[red]deliriogenic drugs[/red]** (anticholinergics, benzodiazepines, meperidine) and rationalize polypharmacy; use **[blue]acetaminophen-first analgesia[/blue]** with small, safer opioid doses only if needed.",
      "- **Gold Standard:** Implement a **[green]multicomponent delirium bundle[/green]**: regular reorientation, mobilization, daylight exposure with quiet nights **[yellow]sleep hygiene[/yellow]**, minimize catheters and restraints, involve family, and create a **[blue]safe discharge plan[/blue]**. Use **low-dose antipsychotic** only for **[red]danger to self or others[/red]** and avoid typicals in Parkinson or Lewy body; consider **quetiapine** if antipsychotic is required; monitor **[yellow]QT interval[/yellow]**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- The brain needs **[blue]oxygen[/blue]**, **[blue]sugar[/blue]**, the right **[blue]temperature[/blue]**, and smooth messages using **[green]acetylcholine[/green]**. Illness or drugs can turn the signals noisy. In older adults the spare wiring is thin, so when cold or sick or on the wrong pills, the messages scramble and attention drops. Remove the noise and warm things up, and the messages line up again.",
      "",
      "**8) Symptoms**",
      "- **Alert but confused** — **[yellow]attention network failure[/yellow]** with preserved arousal.",
      "- **Wandering and night-time agitation** — **[purple]circadian disruption[/purple]** and disorientation.",
      "- **Low temperature (35.5 C)** — **[red]hypothermia impairs synaptic transmission[/red]** and worsens confusion.",
      "- **Incoherent answers** — **[blue]working memory and executive dysfunction[/blue]**.",
      "- **Pattern lock:** **[yellow]sudden confusion[/yellow]** plus **[red]new stressor or drug[/red]** plus **[purple]environmental risk (cold, isolation)[/purple]** equals **[yellow]delirium until proven otherwise[/yellow]**.",
    ],
  },
  {
    id: "DEL-POSTOP-50004",
    topic:
      "Geriatrics • Postoperative Delirium — Hypoperfusion and Hypoxia as Triggers",
    difficulty: "Medium",
    vignetteTitle: "Why is this postoperative patient now acutely confused?",
    stem: "Mr. B was previously healthy except for mild chronic obstructive pulmonary disease. His surgery went well but was complicated by transient hypotension and excessive blood loss. He was extubated on postoperative day 3. On postoperative day 4, his wife noticed confusion and the team found no clear abnormality. On postoperative day 5 he is more confused, oriented only to person, and unable to answer even simple questions.",
    options: [
      { key: "A", text: "Normal postoperative fatigue" },
      {
        key: "B",
        text: "Postoperative delirium due to cerebral hypoperfusion with multifactorial stressors",
      },
      { key: "C", text: "Primary dementia developing acutely" },
      { key: "D", text: "Anesthesia toxicity from surgery" },
      { key: "E", text: "Malingering or functional confusion" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Postoperative delirium due to cerebral hypoperfusion with multifactorial stressors.**",
      "**2) Why it is the correct answer**",
      "- Pattern is **[yellow]acute, fluctuating confusion[/yellow]** after major surgery with **[red]hypotension and blood loss[/red]**. That combination strongly supports **[green]delirium[/green]** rather than dementia or depression.",
      "- Likely contributors: **[red]temporary cerebral hypoperfusion and reduced oxygen delivery[/red]**, **[red]inflammation from surgery[/red]**, **[red]possible COPD related hypoxia[/red]**, **[blue]sedatives or opioids[/blue]**, **[purple]sleep disruption, pain, immobility[/purple]**.",
      "- These stressors impair **[green]acetylcholine signaling[/green]** and cortical metabolism leading to **inattention, disorientation, and poor working memory**.",
      "**3) Explain like I am a child**",
      "- The brain is a small city that needs air and fuel. During surgery the pressure dropped and there was less blood, so traffic lights in the city got out of order. Now cars do not know where to go. When we restore air, fuel, and order, the city starts working normally again.",
      "**4) Why the other options are wrong**",
      "- **A:** Fatigue does not cause **[yellow]loss of orientation and attention[/yellow]**.",
      "- **C:** **[purple]Dementia is gradual over months to years[/purple]**. This is days. That is **[red]delirium[/red]**.",
      "- **D:** Most anesthetics clear within hours to a day; day 5 is too late for direct toxicity.",
      "- **E:** Progressive confusion with medical triggers does not fit malingering.",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Confusion Assessment Method (CAM)[/blue]**. Result: **[yellow]acute onset plus fluctuating course, inattention, and disorganized thinking[/yellow]** consistent with delirium. Check vitals and finger stick glucose immediately to rule out **[red]hypoxia[/red]** and **[red]hypoglycemia[/red]**.",
      "- **Best Test with result:** **[green]Targeted precipitant review[/green]**. Examine hemodynamics, oxygen saturation, fluid balance, medication chart, electrolytes, renal function, and hemoglobin. Likely results: **[red]anemia[/red]**, **[red]mild hypoxia[/red]**, or metabolic derangements.",
      "- **Additional Tests:** CBC and CRP for infection screen, basic metabolic panel including calcium and magnesium, ABG if oxygenation is uncertain, urinalysis and culture if symptomatic, chest radiograph if respiratory signs, ECG for ischemia or arrhythmia, consider TSH and B12 if unexplained. **[purple]CT head only if focal deficit, head trauma, anticoagulation, or delirium persists despite correction[/purple]**.",
      "- **Why each test:** Delirium is a **[yellow]syndrome with multiple reversible causes[/yellow]**. Tests identify common culprits: **[red]hypoperfusion, hypoxia, infection, dehydration, electrolyte imbalance, medication toxicity[/red]**.",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Stabilize perfusion and oxygenation[/green]**. Provide supplemental oxygen as needed, optimize COPD therapy, correct anemia and fluids, maintain normal temperature, treat pain, and provide a **[blue]calm, orienting environment[/blue]** with clocks, calendars, staff names, and family presence.",
      "- **First Line:** **[green]Remove and treat triggers[/green]**. Reduce or stop **[red]deliriogenic drugs[/red]** such as benzodiazepines, anticholinergics, and meperidine. Treat infection if present. Encourage early mobilization and normalize sleep wake cycle.",
      "- **Gold Standard:** **[green]Multicomponent delirium bundle[/green]**. Hydration, sensory aids, daylight exposure with quiet nights, minimize catheters and restraints, regular reorientation. Use **[yellow]low dose antipsychotic only for dangerous agitation[/yellow]**; avoid typical antipsychotics in **[purple]Parkinson or Lewy body disease[/purple]** and consider quetiapine if needed. Monitor QT interval.",
      "**7) Full Pathophysiology explained like a child**",
      "- Neurons talk using small chemical messages. When blood pressure drops or oxygen falls, the messages slow down. Medicines that make you sleepy can block the messages too. The brain loses focus because **[green]acetylcholine[/green]** signals are weak. Fix the pressure, oxygen, fluids, and medicines and the messages get strong again.",
      "**8) Symptoms**",
      "- **Disorientation and inattention** - **[yellow]core features of delirium[/yellow]** from fronto parietal network disruption.",
      "- **Fluctuations worse at night** - **[purple]circadian disruption[/purple]** and environmental noise.",
      "- **Poor comprehension and simple question failure** - **[blue]working memory and executive dysfunction[/blue]**.",
      "- **Pattern lock:** **[yellow]new confusion after surgery[/yellow]** plus **[red]hypotension or blood loss[/red]** plus **[blue]sedatives or hypoxia[/blue]** equals **[green]postoperative delirium[/green]**.",
    ],
  },
  {
    id: "DEL-HX-50005",
    topic:
      "Geriatrics • Delirium — Acute Behavioral Change in a Residential Home",
    difficulty: "Medium",
    vignetteTitle:
      "Why did this previously stable older man suddenly become paranoid, aggressive, and confused?",
    stem: "An 86-year-old man in a residential home has suddenly become aggressive, paranoid, and confused over the past 36 hours. He accuses staff of stealing, has had multiple falls, new urinary incontinence, and slurred speech. He is disoriented, fearful, and verbally aggressive. Exam: BP 178/102 mmHg, painful limited hip movement, mild right loin tenderness. Thyroid tests normal. Urine dipstick: +protein, ++blood, no glucose. What is the most likely diagnosis and underlying cause?",
    options: [
      { key: "A", text: "Progression of undiagnosed dementia" },
      {
        key: "B",
        text: "Delirium secondary to urinary tract infection or hematuria-related cause",
      },
      { key: "C", text: "Psychotic depression" },
      { key: "D", text: "Thyrotoxicosis due to excess thyroxine" },
      { key: "E", text: "Primary paranoid psychosis" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Delirium secondary to urinary tract infection or urinary tract irritation.**",
      "",
      "**2) Why it is the correct answer**",
      "- The **[yellow]abrupt onset (36 hours)[/yellow]**, **[yellow]fluctuating confusion[/yellow]**, **[yellow]disorientation[/yellow]**, **[yellow]aggression and paranoia[/yellow]**, and **[yellow]new incontinence[/yellow]** all match **[green]delirium[/green]**, not dementia or depression.",
      "- **[red]UTI or urinary irritation[/red]** is supported by the urine dipstick showing **+protein and ++blood**, new urinary changes, and **[purple]loin discomfort[/purple]**.",
      "- His **[blue]thyroid function is normal[/blue]**, ruling out endocrine causes. The raised BP and restlessness reflect **[red]stress response[/red]** or infection-related agitation.",
      "- The mechanism is **[green]acetylcholine deficiency and dopamine excess[/green]**, which disrupts normal attention and causes perceptual misinterpretations and fear.",
      "",
      "**3) Explain like I am a child**",
      "- The brain is like a TV that needs a clean signal to show a clear picture. When your body gets an infection or irritation, the signal gets fuzzy — the picture turns scary and confusing. Once the infection is fixed, the TV picture clears up again.",
      "",
      "**4) Why the other options are wrong**",
      "- **A:** Dementia worsens slowly over months, not suddenly in a day or two.",
      "- **C:** Psychotic depression causes sadness, guilt, and withdrawal, not sudden fear and fluctuating confusion.",
      "- **D:** Thyroid hormone level (T4 125, TSH 1.6) is normal, so no thyrotoxicosis.",
      "- **E:** Primary psychosis rarely begins at age 86, and does not cause **[yellow]disorientation or fluctuating alertness[/yellow]**.",
      "",
      "**5) Diagnostic Steps (in order)**",
      "- **Initial Test with result:** **[blue]Confusion Assessment Method (CAM)[/blue]** – shows **[yellow]acute onset, fluctuating attention, disorganized thinking, and altered consciousness[/yellow]**, confirming delirium.",
      "- **Best Test with result:** **[green]Urinalysis and urine culture[/green]** – likely **[red]bacteriuria, pyuria, or hematuria[/red]** consistent with UTI or irritation.",
      "- **Additional Tests:** CBC, electrolytes, urea, creatinine, CRP, glucose, CXR (exclude pneumonia), ECG, medication review. If symptoms persist, ultrasound or CT abdomen for **[purple]stone or obstruction[/purple]**. CT head only if focal signs or post-fall injury.",
      "- **Why we do each test:** To find **[red]reversible causes[/red]** of delirium – infection, metabolic imbalance, dehydration, or medication side effects.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Ensure safety and a calm environment[/green]**. Prevent falls, use clear orientation cues (clock, date, familiar staff), and check vitals, hydration, and oxygen.",
      "- **First Line:** **[green]Treat the cause[/green]** – start empiric antibiotics if infection suspected, ensure adequate fluids, manage pain, and stop **[red]deliriogenic drugs[/red]** like benzodiazepines or anticholinergics.",
      "- **Gold Standard:** **[green]Delirium bundle[/green]** – reorientation, daylight exposure, mobility, sensory aids, family involvement, and sleep protection. Use **[yellow]low-dose haloperidol[/yellow]** only if severe agitation threatens safety. Avoid in **[purple]Parkinson’s or Lewy body dementia[/purple]** (use quetiapine).",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- The brain uses messages called **[green]acetylcholine[/green]** to stay alert and focused. When the body is sick or stressed, or when the kidneys or bladder are irritated, the brain runs out of this messenger. Too much **[red]dopamine[/red]** then makes the person see and believe strange things. Once the infection and stress are fixed, the messengers go back to normal and thinking becomes clear again.",
      "",
      "**8) Symptoms**",
      "- **Sudden paranoia and aggression** – due to **[red]frontal disinhibition and dopamine excess[/red]**.",
      "- **Fluctuating attention and alertness** – **[yellow]hallmark of delirium[/yellow]**.",
      "- **Disorganized speech** – **[blue]cortical dysfunction[/blue]**, not language loss from dementia.",
      "- **Urinary incontinence and falls** – from **[purple]infection-related urgency and impaired attention[/purple]**.",
      "- **Pattern lock:** **[yellow]acute confusion + new urinary symptoms + paranoia + disorientation[/yellow] = [green]delirium due to urinary infection or irritation[/green].**",
    ],
  },
  {
    id: "DEM-MEDS-50006",
    topic:
      "Geriatrics • Dementia — Medication-induced cognitive impairment vs neurodegeneration",
    difficulty: "Medium",
    vignetteTitle: "Which intervention is most appropriate right now?",
    stem: "Mr. R is a 75-year-old man who comes to clinic with his wife because she is concerned that his memory is getting worse. For the last few months he has been getting lost driving 20 miles to the VA hospital where he has volunteered twice weekly for 25 years. Over the past 3 months a few bills have gone unpaid. MMSE is 20/30: he is disoriented to date, registers 2/3 items and recalls 0/3, gets only 1 serial 7, and cannot draw pentagons. Medications: paroxetine 20 mg daily, methadone 20 mg TID, meloxicam 7.5 mg daily, acetaminophen-codeine (300/60) 2 tabs TID, allopurinol 300 mg daily. He is calm, cooperative, and has no safety issues today. Which single next step is best?",
    options: [
      { key: "A", text: "Start donepezil for probable Alzheimer disease" },
      {
        key: "B",
        text: "Stop codeine and reduce methadone to lowest effective dose",
      },
      { key: "C", text: "Order MRI brain with contrast urgently" },
      { key: "D", text: "Arrange 24-hour home supervision immediately" },
      { key: "E", text: "Begin memantine plus rivastigmine combination" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Stop codeine and reduce methadone to lowest effective dose.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[red]Multiple psychoactive drugs[/red]** (paroxetine, methadone, codeine) collectively increase **[yellow]anticholinergic and opioid burden[/yellow]**, both proven to **[red]impair attention, memory, and executive function[/red]**.",
      "- **[purple]Codeine-containing analgesic[/purple]** is **[green]least essential[/green]** for chronic leg pain; **[purple]methadone[/purple]** can be **[green]tapered to lowest effective dose[/green]** without withdrawal.",
      "- **[blue]Reversible medication-induced cognitive impairment[/blue]** must be **[green]excluded first[/green]** before labeling as neurodegenerative dementia (NINCDS-ADRDA criteria require this step).",
      "- **No agitation, wandering, or safety crisis** → **[blue]non-urgent[/blue]** setting allows **[green]therapeutic trial of deprescribing[/green]**.",
      "",
      "**3) Explain like I’m a child**",
      "- His brain is **[yellow]under a heavy blanket[/yellow]** of sleepy medicines. **[green]Lift the blanket first[/green]**; if he’s still confused **[purple]after[/purple]**, then we look for **[red]permanent holes[/red]** in the memory rug.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Start donepezil now:** **[red]Premature[/red]**—must **[green]exclude reversible causes[/green]** first; cholinesterase inhibitors **[red]do not reverse drug-induced confusion[/red]**.",
      "- **C. MRI brain urgently:** **[red]No red flags[/red]** (stroke, tumor, trauma, anticoagulation) → **[blue]elective[/blue]**, not urgent.",
      "- **D. 24-hour supervision:** **[red]Overkill[/red]** today; patient **[green]cooperative, not wandering, no falls[/green]**—plan **[blue]safety reassessment[/blue]** after medication simplification.",
      "- **E. Dual therapy memantine + rivastigmine:** **[red]Polypharmacy[/red]** again; **[yellow]no evidence[/yellow]** for combination **[purple]before[/purple]** single reversible cause removal.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Targeted medication review[/blue]** → **[red]identify codeine + methadone + paroxetine[/red]** as **[yellow]high anticholinergic/opioid burden[/yellow]**.",
      "- **Best Test with result:** **[green]Deprescribing trial[/green]**—**[red]stop codeine[/red]**, **[yellow]reduce methadone by 25-50 %[/yellow]**, **[blue]re-check cognition in 4-6 weeks[/blue]**; expect **[green]≥2-point MMSE improvement[/green]** if drug-related.",
      "- **Additional Tests:** **[blue]Basic labs[/blue]** (CBC, electrolytes, renal, glucose, B12, TSH) to **[green]rule out metabolic[/green]**, **[purple]urinalysis[/purple]** if infection suspected, **[blue]structural brain imaging[/blue]** **[yellow]only if decline persists[/yellow]** after clean medication trial.",
      "- **Why each test:** Delirium and **[blue]medication-induced cognitive impairment[/blue]** are **[green]reversible[/green]**; neurodegenerative dementia is **[red]not[/red]**. **[green]Treat reversible first[/green]**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Deprescribe[/red]**—**[red]stop codeine/acetaminophen-codeine[/red]**, **[yellow]taper methadone[/yellow]**, **[blue]switch paroxetine to lower-anticholinergic SSRI[/blue]** (e.g., sertraline) if depression still needed.",
      "- **First Line:** **[green]Optimize pain control[/green]** with **[blue]non-deliriogenic agents[/blue]**: scheduled **[green]acetaminophen[/green]**, **[blue]topical NSAIDs[/blue]**, **[purple]gabapentin[/purple]** if neuropathic, **[yellow]physical therapy[/yellow]**, **[blue]assistive devices[/blue]**.",
      "- **Gold Standard:** **[green]Re-assess cognition[/green]** in **[blue]4-6 weeks[/blue]**; if **[green]MMSE improves ≥2 points[/green]** → **[blue]diagnosis is medication-induced cognitive impairment[/blue]**. If **[red]no change[/red]**, proceed with **[yellow]dementia work-up[/yellow]** (imaging, neuropsych testing).",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- The brain uses **[green]acetylcholine[/green]** to **[yellow]keep lights on[/yellow]** for attention and memory. **[red]Opioids and anticholinergics[/red]** **[purple]dim the lights[/purple]**. **[green]Remove the dimmers[/green]**, and the lights **[yellow]brighten again[/yellow]**; if they stay dim, then the **[red]bulbs themselves are wearing out[/red]** (neurodegeneration).",
      "",
      "**8) Symptoms**",
      "- **[yellow]Disorientation to date[/yellow]**, **[red]poor registration/recall[/red]**, **[purple]visuospatial deficits[/purple]** (pentagons) — **[blue]can be caused by[/blue]** **[red]opioid-induced hippocampal dysfunction[/red]** and **[yellow]anticholinergic blockade[/yellow]**.",
      "- **[purple]Getting lost on familiar route[/purple]** — **[blue]episodic memory & spatial navigation[/blue]** impaired by **[yellow]medication fog[/yellow]**.",
      "- **[red]Unpaid bills[/red]** — **[purple]executive dysfunction[/purple]** from **[yellow]frontal lobe sedation[/yellow]**.",
      "- **Pattern lock:** **[yellow]Subacute cognitive decline + polypharmacy with psychoactive drugs[/yellow]** → **[green]deprescribe first[/green]**, **[blue]re-evaluate later[/blue]**.",
    ],
  },
  {
    id: "DEL-NEW-50007",
    topic:
      "Geriatrics • Delirium on chronic dementia — infection & decompensated AF",
    difficulty: "Medium",
    vignetteTitle:
      "Why is this 84-year-old suddenly wandering and agitated at night?",
    stem: "An 84-year-old woman is brought to hospital after neighbours find her wandering in the street at night. She is alert but restless, agitated, and convinced she is late for work. Her niece confirms she has been 'somewhat confused and forgetful' for about 9 months and now needs help with household and financial affairs, but she has never wandered before. Exam: AF with HR 126/min, cardiomegaly, mitral regurgitation, bilateral oedema; neglected feet with an infected bunion. Abbreviated Mental Test 4/10. No focal neurology. Remainder unremarkable.",
    options: [
      {
        key: "A",
        text: "Start oral haloperidol 2 mg q8h PRN for new-onset psychosis",
      },
      {
        key: "B",
        text: "Treat presumed urinary sepsis with IV antibiotics and address bunion infection",
      },
      {
        key: "C",
        text: "Arrange immediate MRI brain to rule out acute stroke",
      },
      { key: "D", text: "Commence donepezil for worsening Alzheimer disease" },
      {
        key: "E",
        text: "Apply physical restraints and move to a quiet dark room",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Treat presumed urinary sepsis with IV antibiotics and address bunion infection.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Acute change[/yellow]** (first-time wandering, agitation, restlessness) on top of **[purple]9-month cognitive decline[/purple]** = **[green]delirium superimposed on chronic dementia[/green]**.",
      "- **[red]Infected bunion + peripheral oedema + neglected feet[/red]** = **portal of entry**; **[yellow]tachycardic AF[/yellow]** predisposes to **stasis, occult UTI, soft-tissue infection** driving delirium.",
      "- **[blue]Infection is the single most reversible trigger[/blue]**; antibiotics, wound care, and **IV fluids/ electrolyte correction** often **dramatically improve cognition**.",
      "",
      "**3) Explain like I’m a child**",
      "- Her **brain city** already has **flickering lights** (chronic dementia). A **skin infection** is like **dumping garbage** outside the power plant—**lights flash wildly** (delirium). **Clean the garbage**, and the **city calms down**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Haloperidol routine:** **[red]masks delirium[/red]** without treating cause; **QT prolongation** in elderly with AF **[purple]risks arrhythmia[/purple]**—**only use low-dose if dangerous agitation persists after medical correction**.",
      "- **C. Urgent MRI:** **[yellow]no focal neurology[/yellow]**; **stroke unlikely** to present solely with **agitated delirium**—**CT/MRI later if no improvement or focal signs develop**.",
      "- **D. Start donepezil tonight:** **[red]does not address acute deterioration[/red]**; cholinesterase inhibitors **take weeks** and **won’t reverse delirium**.",
      "- **E. Restraints & dark room:** **[red]increases agitation[/red]**, **sensory deprivation worsens delirium**; **[green]reorientation, lighting, family presence[/green]** are safer.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bedside delirium screen[/blue]** (4AT or CAM) → **[yellow]positive[/yellow]** (acute change + inattention + disorganised thinking).",
      "- **Best Test with result:** **[green]Urine dipstick, culture, blood cultures, CBC, CRP, electrolytes, glucose, chest X-ray, wound swab[/green]** → expect **[red]leucocytosis, raised CRP, bacteriuria, streptococcal/staph wound growth[/red]**.",
      "- **Additional Tests:** **[purple]ECG[/purple]** (rate control, QT before any antipsychotic), **[blue]echo[/blue]** if infective endocarditis suspected, **[yellow]bladder scan[/yellow]** for retention, **[blue]thyroid & B12[/blue]** if baseline not known.",
      "- **Why each test:** Delirium = **[yellow]syndrome of reversible insults[/yellow]**; infection, **dehydration**, **hypoxia**, **electrolyte derangement**, **urinary retention**, **pain** all common and **fixable**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]IV antibiotics[/green]** (empiric coverage for skin/GU flora), **clean & dress bunion**, **IV fluids** for perfusion, **rate control for AF** (β-blocker or digoxin), **oxygen if saturation <94 %**.",
      "- **First Line:** **[green]Non-pharmacologic delirium bundle[/green]**—**reorientation clocks, family at bedside, early mobilisation, hearing aids/glasses, minimise tethers, normalise sleep** (lights day, quiet night).",
      "- **Gold Standard:** **[yellow]Low-dose antipsychotic[/yellow]** (e.g., **haloperidol 0.5 mg PO/IV**) **only if patient poses danger to self/others** **after** medical causes addressed; **monitor QTc**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- Chronic dementia = **thin electrical wires**. Infection/fever = **rainstorm**; **wet wires short-circuit** → **flashing lights & alarms** (agitation). **Fix the leak & dry the wires**, and **city returns to baseline flicker**, not full blackout.",
      "",
      "**8) Symptoms**",
      "- **[yellow]First-time wandering at night[/yellow]** — **[purple]circadian disruption + disorientation[/purple]** hallmark of **delirium**.",
      "- **[red]Convinced she is late for work[/red]** — **[blue]perseveration & temporal disorientation[/blue]** from **frontal-executive shutdown**.",
      "- **[purple]Neglected infected feet[/purple]** — **source of inflammatory cytokines** → **blood-brain barrier leakage** → **neuronal dysfunction**.",
      "- **[yellow]Tachycardic AF[/yellow]** — **reduces cerebral perfusion**, **compounds hypoxia** from possible **pulmonary oedema**.",
      "- **Pattern lock:** **[yellow]acute agitation + chronic cognitive decline + infected portal + high HR[/yellow]** = **[green]delirium on dementia—treat infection first[/green]**.",
    ],
  },
  {
    id: "DEM-BEHAV-50008",
    topic:
      "Geriatrics • Dementia — Progressive cognitive & behavioural decline with caregiver burnout",
    difficulty: "Medium",
    vignetteTitle:
      "Which next step best addresses both patient safety and caregiver stress today?",
    stem: "JR is a 70-year-old man brought by his 45-year-old daughter BG because she can no longer care for him at home. Over 2–3 years he has got lost in supermarkets, can no longer cook, sometimes fails to recognise grandchildren (last week yelled at his 10-year-old grandson to 'get off my property'), and is almost completely dependent on IADLs. He needs some help with bathing but can transfer, feed and toilet himself. PMH: HTN, CAD with MI 8 years ago; meds: aspirin 81 mg, atenolol 25 mg, HCTZ 25 mg. Vital signs normal, gait/balance normal. Mini-Cog: recalls 1/3 items; clock-draw shows number crowding to one side with no hands. BG is anxious and states, 'I don’t know what else to do with him.'",
    options: [
      {
        key: "A",
        text: "Prescribe donepezil and discharge with routine follow-up in 6 months",
      },
      {
        key: "B",
        text: "Order urgent brain MRI to exclude normal-pressure hydrocephalus",
      },
      {
        key: "C",
        text: "Refer immediately to a dementia-care coordinator and adult-day-health programme; schedule caregiver-support counselling within 1 week",
      },
      {
        key: "D",
        text: "Advise daughter to lock all doors and windows and purchase a bed alarm",
      },
      {
        key: "E",
        text: "Start haloperidol 0.5 mg bid for agitation and paranoid behaviour",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Refer immediately to a dementia-care coordinator and adult-day-health programme; schedule caregiver-support counselling within 1 week.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]2–3-year progressive course[/yellow]** with **[purple]wandering, visuospatial errors[/purple]** (clock-draw) and **[red]behavioural disinhibition[/red]** → **[green]moderate-stage major neurocognitive disorder[/green]** (probable Alzheimer).",
      "- **[blue]Caregiver burnout[/blue]** is **acute**; BG’s repeated statements signal **[red]high risk of institutional placement[/red]** unless **respite & education** provided **now**.",
      "- **[green]Dementia-care coordinators[/green]** can **arrange day-centre attendance, home aides, safety devices, medication review** and **link to social services** faster than routine 6-month visit.",
      "- **Evidence**: caregiver interventions **[purple]delay nursing-home admission[/purple]** and **[yellow]reduce behavioural disturbances[/yellow]** by **[blue]decreasing caregiver stress[/blue]**.",
      "",
      "**3) Explain like I’m a child**",
      "- Dad’s **brain GPS is breaking**, so he **gets lost and lashes out**. Daughter is **running on empty**. **[green]Give her a team[/green]**—**drivers, maps, fuel**—so she can **keep driving safely** instead of **crashing into a nursing-home ditch**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Donepezil only:** **[red]misses caregiver crisis[/red]**; drug takes **[yellow]weeks-months[/yellow]** for modest benefit and **doesn’t stop wandering**.",
      "- **B. Urgent MRI:** **[purple]no gait apraxia/incontinence[/purple]**; **NPH unlikely**—**clock-draw & memory fit AD**; MRI **[blue]elective[/blue]** not urgent today.",
      "- **D. Lock doors & bed alarm:** **[yellow]isolates family[/yellow]** without **[red]external support[/red]**; **doesn’t provide respite** and **[purple]increases frustration[/purple]**.",
      "- **E. Haloperidol routine:** **[red]worsens cognition[/red]**, **increases stroke/ mortality** in dementia; **use only for dangerous agitation** after **[green]non-drug measures[/green]** fail.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Mini-Cog ≤2/5[/blue]** + **[purple]abnormal clock-draw[/purple]** → **[yellow]positive screen[/yellow]** for **major NCD**.",
      "- **Best Test with result:** **[green]Full neuropsych battery[/green]** + **[blue]basic labs[/blue]** (TSH, B12, renal, glucose) → expected: **[purple]amnestic + visuospatial deficits[/purple]**; labs normal (exclude reversible).",
      "- **Additional Tests:** **[yellow]Brain MRI[/yellow]** (elective) to **confirm medial-temporal atrophy** and **rule out tumour/NPH/vascular pattern**; **ECG** before cholinesterase inhibitor.",
      "- **Why each test:** **[green]Definitive diagnosis[/green]** guides **prognosis & future planning**; **rule-out reversible** maintains **evidence-based care**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Start donepezil 5 mg daily[/green]** (after ECG), **counsel on bradycardia risk**; **treat pain/constipation** to **reduce agitation**.",
      "- **First Line:** **[green]Refer to dementia-care coordinator[/green]** → **adult-day-health 2–3×/week**, **home-safety evaluation**, **MedicAlert + GPS tracker**, **respite vouchers**.",
      "- **Gold Standard:** **[blue]Caregiver-support programme[/blue]**: **education sessions**, **stress-management skills**, **24-hour helpline**, **monthly support group**—**proven to [purple]improve caregiver QoL[/purple]** and **[yellow]decrease patient behavioural symptoms[/yellow]**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Alzheimer plaque goo** clogs **memory highways** and **map signs** (parietal lobe). When **stress or fatigue** adds **fog**, Dad **takes wrong exits** (wandering) and **yells at strangers** (frontal disinhibition). **Clearer signs & co-driver support** keep the car on the road longer.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Getting lost in familiar supermarket[/yellow]** — **[purple]episodic + spatial memory loss[/purple]**.",
      "- **[red]Can’t make a sandwich[/red]** — **[blue]apraxia + executive dysfunction[/blue]**.",
      "- **[red]Yells at grandson[/red]** — **[purple]behavioural disinhibition[/purple]**, **misidentification**.",
      "- **[yellow]Clock crowding[/yellow]** — **[blue]visuospatial neglect[/blue]** typical of **[green]Alzheimer[/green]**.",
      "- **Pattern lock:** **[yellow]2–3-year decline + IADL loss + caregiver distress[/yellow]** → **[green]moderate Alzheimer[/green]**; **[blue]immediate caregiver support[/blue]** = **[purple]highest yield intervention today[/purple]**.",
    ],
  },
  {
    id: "DEM-VH-50009",
    topic:
      "Geriatrics • Dementia with Lewy bodies vs Alzheimer — Visual hallucinations & caregiver management",
    difficulty: "Medium",
    vignetteTitle:
      "Which single next step is best for her distressing visual hallucinations?",
    stem: "Mrs DM is an 83-year-old lady diagnosed with multi-infarct dementia in 2008. She lives with her husband and is supported by family. Over recent months she frequently wakes at night, misplaces items and accuses relatives of theft. She now sees ‘young people in the trees’ and worries they will fall, hears a child crying, and has seen the child down the road. Relatives aggravate her by insisting the experiences are unreal. Medications: simvastatin 40 mg, aspirin 75 mg. No other medical history.",
    options: [
      {
        key: "A",
        text: "Start risperidone 1 mg nocte to abolish hallucinations",
      },
      {
        key: "B",
        text: "Reassure family that hallucinations are harmless and no action is needed",
      },
      { key: "C", text: "Stop aspirin and simvastatin to reduce polypharmacy" },
      {
        key: "D",
        text: "Validate her feelings, reduce environmental shadows/lighting glare, schedule eye check and consider low-dose memantine or rivastigmine after specialist review",
      },
      {
        key: "E",
        text: "Arrange urgent CT head to rule out intracranial bleed",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **D. Validate her feelings, reduce environmental shadows/lighting glare, schedule eye check and consider low-dose memantine or rivastigmine after specialist review.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Well-formed visual hallucinations[/yellow]** (people in trees, child) with **preserved insight into risk** + **[purple]fluctuating nocturnal worsening[/purple]** → **typical of Lewy-body or late-stage Alzheimer**; **not psychosis**.",
      "- **[green]Validation[/green]** and **[blue]environmental modification[/blue]** (improve lighting, remove patterned curtains, night-light) **[purple]reduce hallucination frequency[/purple]** without drugs.",
      "- **[red]Antipsychotics[/red]** carry **[yellow]3-fold increased stroke/mortality risk[/yellow]** in dementia and **[purple]may worsen extrapyramidal symptoms[/purple]** if Lewy-body disease present.",
      "- **[green]Cholinesterase inhibitors[/green]** (rivastigmine) and **[blue]memantine[/blue]** **decrease hallucination burden** in both AD and DLB by **[yellow]enhancing cortical acetylcholine[/yellow]**.",
      "",
      "**3) Explain like I’m a child**",
      "- Her **brain TV** is picking up **ghost channels**. Instead of **smashing the TV** (antipsychotic), we **adjust the antenna** (lighting, eye check) and **add better signal boosters** (cholinesterase inhibitors).",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Risperidone routine:** **[red]Black-box warning[/red]** in dementia; **no emergency danger**; **may precipitate EPS, neuroleptic malignant syndrome, stroke**.",
      "- **B. Reassure only:** **[yellow]leaves patient distressed[/yellow]**; **caregivers need concrete strategies** to **avoid arguments** that **escalate agitation**.",
      "- **C. Stop aspirin/simvastatin:** **[purple]no benefit on hallucinations[/purple]**; **aspirin protective** for recurrent vascular events—**continue unless bleeding**.",
      "- **E. Urgent CT:** **[yellow]no focal neurology, no head trauma, no anticoagulation[/yellow]**; **hallucinations chronic over months**—**elective imaging sufficient**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Eye check[/blue]** (cataracts, macular degeneration, refractive error) → **common reversible contributor**.",
      "- **Best Test with result:** **[green]Specialist referral[/green]** (old-age psychiatry) → **differentiate DLB vs AD vs vascular**; **consider EEG** if **fluctuating confusion** to **rule out seizure-related hallucinations**.",
      "- **Additional Tests:** **[purple]MRI brain[/purple]** (elective) for **cortical atrophy pattern**, **basal ganglia changes**; **review drug list** for **anticholinergic burden**.",
      "- **Why each test:** **Accurate subtype** guides **safe pharmacology** (e.g., **avoid antipsychotics in DLB**) and **prognosis**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Validate[/green]** — 'That sounds frightening; let’s look together and make sure everyone is safe.' **Reduce shadows**, **install uniform lighting**, **cover mirrors**, **maintain daytime routine**, **avoid caffeine/alcohol at night**.",
      "- **First Line:** **[blue]Cholinesterase inhibitor[/blue]** (rivastigmine patch 4.6 mg/24 h) **after specialist confirmation**; **titrate to 9.5 mg** if tolerated → **shown to [yellow]reduce visual hallucinations[/yellow]** and **[purple]slow cognitive fluctuation[/purple]**. **Add memantine** if **mixed or moderate AD**.",
      "- **Gold Standard:** **[green]Caregiver education[/green]** — **never argue with hallucination**, **redirect attention**, **use gentle touch/music**, **document triggers**, **plan respite** to **prevent caregiver burnout**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Vision areas** at the **back of the brain** normally **edit out fake images**. In **Lewy-body disease**, **alpha-synuclein clumps** **switch off the editors**, so **phantom pictures pop up**. **Boosting acetylcholine** **turns the editors back on**, **reducing ghost channels**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Complex visual hallucinations[/yellow]** — **people, animals, children**; **insight often retained early**.",
      "- **[purple]Nocturnal confusion[/purple]** — **circadian dysregulation** from **melatonin pathway involvement**.",
      "- **[red]Accusatory behaviour[/red]** — **misplacing objects** → **paranoia** due **frontal-executive dysfunction**.",
      "- **Pattern lock:** **[yellow]Vivid recurring hallucinations + fluctuation + caregiver distress[/yellow]** → **[green]validate, optimise environment, consider cholinesterase inhibitor[/green]**; **[red]avoid antipsychotics[/red]** unless **severe agitation or risk**.",
    ],
  },
  {
    id: "DEM-AGGR-50010",
    topic:
      "Geriatrics • Severe Alzheimer dementia — Aggression, wandering & caregiver safety",
    difficulty: "Medium",
    vignetteTitle:
      "Which single intervention best reduces his aggression and unsafe wandering right now?",
    stem: "Mr MB is an 81-year-old man with severe Alzheimer dementia. He lives alone since his wife died 6 years ago. A main carer looks after him 8:30 am–5:30 pm, 6 days a week. He is usually amiable but has thrown water over her without warning. On the seventh day an agency carer attends; he becomes verbally and physically aggressive, wanders the neighbourhood and refuses personal care. Despite severe expressive dysphasia, negligible recall and total dependence for hygiene/dressing, he can still navigate locally. He has been admitted to hospital for his own safety and that of others. He lacks mental capacity.",
    options: [
      { key: "A", text: "Start risperidone 1 mg twice daily routinely" },
      {
        key: "B",
        text: "Discharge back home with a 24-hour live-in carer and structured daily routine; introduce step-wise behavioural plan before any pharmacological sedation",
      },
      { key: "C", text: "Commence memantine 5 mg daily to control aggression" },
      {
        key: "D",
        text: "Apply electronic tagging bracelet and advise neighbours to call police if seen outside",
      },
      {
        key: "E",
        text: "Insert urinary catheter and use physical restraints when agitated",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Discharge back home with a 24-hour live-in carer and structured daily routine; introduce step-wise behavioural plan before any pharmacological sedation.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Severe AD + aggression only with unfamiliar carers[/yellow]** → **[green]triggered behavioural & psychological symptoms of dementia (BPSD)[/green]**, **not chronic psychosis**.",
      "- **[blue]Consistent familiar routine & environment[/blue]** **[purple]reduces aggression[/purple]** more than drugs; **24-hour live-in carer** provides **[green]continuity[/green]** and **[yellow]safe supervision[/yellow]**.",
      "- **[red]Antipsychotics[/red]** carry **3-fold increase in stroke & mortality** in severe AD; **use only after[/purple]** non-drug measures fail and **risk > benefit**.",
      "- **Step-wise plan**: **identify triggers** (new carer, bathing), **use same-sex carer**, **play favourite music**, **distract & redirect**, **scheduled toileting**, **GPS watch** for elopement.",
      "",
      "**3) Explain like I’m a child**",
      "- His **brain clock is broken**; **sudden new faces** are **aliens**. **Same friendly face 24/7** plus **predictable day-plan** **calms the aliens**; **sleepy medicines** **slow the clock even more**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Routine risperidone:** **[red]Black-box warning[/red]** in dementia; **doesn’t address wandering**; **sedation increases falls, pneumonia, stroke**.",
      "- **C. Memantine for aggression:** **[yellow]modest cognitive benefit[/yellow]**, **no acute anti-aggression effect**; **takes weeks**, **wandering needs immediate safety plan**.",
      "- **D. Tag & police:** **[purple]stigmatising[/purple]** and **reactive**; **doesn’t prevent exit** or **reduce trigger**; **police involvement escalates agitation**.",
      "- **E. Catheter & restraints:** **[red]increases pain, infection, agitation[/red]**; **restraints = last resort** < 24 h when **life-threatening danger** and **1-to-1 supervision unavailable**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Trigger analysis[/blue]** → **aggression only with unfamiliar carers & personal care**; **wandering on ‘stranger’ day**.",
      "- **Best Test with result:** **[green]Comprehensive geriatric / psychiatry review[/green]** → **confirm severe AD**, **capacity assessment** (unsafe alone), **exclude pain/constipation/UTI** as hidden triggers.",
      "- **Additional Tests:** **[purple]MRI brain[/purple]** (if not recent) to **confirm global atrophy**; **basic labs** (glucose, renal, Ca, UTI screen) **rule out reversible aggravators**.",
      "- **Why each test:** **[yellow]Identify treatable contributors[/yellow]** (pain, infection, dehydration) and **document severity** for **funding live-in care package**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]24-hour live-in familiar carer[/green]** (same main carer extends hours), **structured timetable** (wake-wash-meals-walk-bed same times), **GPS watch** with **safe-walking zone**, **remove latch-lock below eye-level** to **reduce exit-seeking**.",
      "- **First Line:** **[blue]Non-pharmacological BPSD bundle[/blue]**: **gentle approach from front**, **offer favourite object/music**, **break tasks into single steps**, **toilet every 2 h**, **monitor pain** (paracetamol schedule).",
      "- **Gold Standard:** **[yellow]Low-dose antipsychotic[/yellow]** (e.g., **haloperidol 0.5 mg PO PRN** or **quetiapine 12.5 mg nocte**) **only if[/purple]** aggression **endangers despite above**; **review daily**, **stop within 1 week** if **no benefit**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Alzheimer plaque tangles** **unplug the frontal ‘brake pedals’**; **new faces = threat**. **Consistent caregiver voice** **re-plugs the brake**, **reducing fight-or-flight**. **Sedative drugs** **snap the pedal off entirely**, **causing falls & infections**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Throws water unpredictably[/yellow]** — **[purple]frontal disinhibition + misinterpretation[/purple]** of care gesture.",
      "- **[red]Wanders neighbourhood[/red]** — **[blue]retained procedural navigation[/blue]** (basal ganglia) despite **lost topographical memory**.",
      "- **[purple]Severe dysphasia[/purple]** — **left perisylvian atrophy**, **limits verbal de-escalation** → **rely on non-verbal techniques**.",
      "- **Pattern lock:** **[yellow]Aggression & wandering only with unfamiliar carers[/yellow]** → **[green]continuity of care + structured routine[/green]** = **[purple]highest-yield safety intervention[/purple]**; **[red]avoid routine antipsychotics[/red]**.",
    ],
  },
  {
    id: "GER-DEPL-50011",
    topic:
      "Geriatrics • Polypharmacy, depression & mild cognitive impairment — Medication rationalisation",
    difficulty: "Medium",
    vignetteTitle:
      "Which single action best improves her safety and depressive symptoms today?",
    stem: "ST is an 87-year-old woman newly relocated to live with her son. Past records: HTN, sleep-maintenance insomnia, DJD, trace ankle oedema, mild dementia, urge UI, gait problems, no falls. Husband died 10 months ago; social contact ↓, hygiene ↓, apathy. Meds: captopril 12.5 mg TID, nifedipine 10 mg TID, furosemide 20 mg BID, KCl 10 mEq BID, digoxin 0.125 mg daily, cimetidine 100 mg qhs, indomethacin 25 mg BID, diphenhydramine 50 mg qhs, gabapentin 300 mg BID. ROS: no DM, no CHF (LVEF 55 %, mild diastolic dysfn), lone AF 14 yrs ago. BP 135/84, HR 76 regular, chronic knee/hand DJD, trace ankle oedema, depressed affect, MMSE 25/30, GDS 9/15 (> 5 = depression).",
    options: [
      {
        key: "A",
        text: "Add sertraline 25 mg daily for depression and increase gabapentin to 300 mg TID for pain",
      },
      {
        key: "B",
        text: "Stop diphenhydramine and indomethacin, switch nifedipine to once-daily long-acting, and schedule brief psychotherapy / caregiver education for depression",
      },
      {
        key: "C",
        text: "Increase furosemide to 40 mg BID to eliminate ankle oedema and add vitamin B12 injection",
      },
      {
        key: "D",
        text: "Order urgent echocardiogram to reassess LVEF before any medication change",
      },
      {
        key: "E",
        text: "Commence donepezil 5 mg daily to improve medication adherence and mood",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Stop diphenhydramine and indomethacin, switch nifedipine to once-daily long-acting, and schedule brief psychotherapy / caregiver education for depression.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[red]Diphenhydramine[/red]** = **high anticholinergic burden** → **worsens cognition**, **causes sedation**, **increases fall risk**, **contributes to apathy/indomethacin[/red]** = **NSAID** → **GI bleed risk**, **renal sodium retention**, **interacts with ACE-i & diuretic**, **may worsen depression**.",
      "- **[purple]Depression[/purple]** is **grief-related & reactive**; **brief psychotherapy**, **increased social activity**, **caregiver education** **match evidence** for **late-life depression** and **avoid sertraline start[/purple]** in **polypharmacy context**.",
      "- **Once-daily long-acting CCB** **reduces pill count**, **improves adherence**, **less rebound BP fluctuation**.",
      "",
      "**3) Explain like I’m a child**",
      "- Grandma’s **brain is foggy** because **sleeping pills & pain pills** are **throwing blankets over it**. **Remove the blankets**, **simplify the pill chart**, and **give her sunshine & chats**—**pills for mood come later**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Add sertraline + gabapentin:** **[red]increases pill burden[/red]**, **risk of hyponatraemia** with **thiazide & ACE-i**, **gabapentin sedation** **adds to fall risk**; **not first-line** until **offending drugs stopped**.",
      "- **C. Increase furosemide:** **[yellow]trace oedema is benign[/yellow]**; **over-diuresis** → **urinary urgency**, **nocturia**, **falls**, **renal dysfunction**.",
      "- **D. Urgent echo:** **LVEF 55 % recently**, **no CHF signs**, **no AF now**—**elective review sufficient**.",
      "- **E. Start donepezil:** **MMSE 25 = mild cognitive impairment**; **does not treat depression**, **does not improve adherence**; **rationalise harmful meds first**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Medication reconciliation + anticholinergic burden scale[/blue]** → **[red]diphenhydramine & indomethacin flagged[/red]**; **pill count 18/day** → **[purple]adherence risk[/purple]**. - **Best Test with result:** **[green]Stop harmful/unnecessary drugs[/green]** and **re-check GDS + MMSE in 4–6 weeks** → expect **≥2-point GDS drop**, **MMSE stable/improved**.",
      "- **Additional Tests:** **Renal function, Na/K**, **GI bleed risk assessment** (Hb, faecal occult blood if indicated), **eye check** (cataracts, macular degeneration) **to improve sleep & mood**.",
      "- **Why each test:** **Depression & cognition** often **improve** when **anticholinergics & NSAIDs removed**; **baseline labs** **detect silent NSAID harm**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Stop diphenhydramine[/red]** — **replace with sleep-hygiene** (daylight exposure, warm milk, lights off 10 pm), **paracetamol 1 g qhs** for DJD pain. **[red]Stop indomethacin[/red]** — **topical NSAID or capsaicin** for knees, **paracetamol scheduled**, **short-term low-dose opioid** only if severe.** - **First Line:** **Switch nifedipine 10 mg TID → amlodipine 5 mg daily** (once-daily, **less ankle oedema**, **better adherence**). **Brief psychotherapy** (2–3 sessions) + **son taught behavioural activation** (walks, senior centre, video calls with Florida friends).",
      "- **Gold Standard:** **Re-assess mood & cognition 4–6 weeks**; **if GDS ≥ 5 persists** → **start sertraline 12.5 mg daily** (↑ slowly, **monitor Na**) **+ continue psychotherapy**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Anticholinergic drugs** **block the brain’s mailman** (acetylcholine) so **memory & mood messages** **go undelivered**. **NSAIDs** **irritate the stomach** and **hold water in legs**, **making grandma feel heavy & sad**. **Remove the blockers & extra water**, **mail arrives**, **mood lifts**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Apathy, poor hygiene, anhedonia[/yellow]** — **grief + drug-induced slowing**.",
      "- **[purple]MMSE 25[/purple]** — **mild cognitive impairment**, **worsened by anticholinergics**.",
      "- **[red]Diphenhydramine qhs[/red]** — **morning hangover, falls, urinary retention**.",
      "- **Pattern lock:** **[yellow]New late-life depression + polypharmacy with anticholinergics/NSAID[/yellow]** → **[green]deprescribe first[/green]**, **then consider SSRI & non-drug therapies**.",
    ],
  },
  {
    id: "DRUG-INT-50012",
    topic: "Geriatrics • Drug interaction — St John’s Wort + theophylline",
    difficulty: "Medium",
    vignetteTitle: "Why has his asthma control suddenly worsened?",
    stem: "An elderly patient wants to discuss a new dry cough and wheeze for a few days. He has been using his asthma inhalers more often than usual. Medicines: Uniphyllin Continus® (theophylline) 400 mg 12-hourly for the past year, dose increased last month; St John’s Wort (self-prescribed) for low mood since a friend died, started 3 months ago. He insists St John’s Wort is 'natural, not a medicine'.",
    options: [
      {
        key: "A",
        text: "Increase Uniphyllin to 600 mg 12-hourly and add oral prednisolone",
      },
      {
        key: "B",
        text: "Stop St John’s Wort immediately and check serum theophylline level in 3–5 days",
      },
      {
        key: "C",
        text: "Switch St John’s Wort to sertraline 50 mg daily and continue current theophylline dose",
      },
      {
        key: "D",
        text: "Order chest X-ray to exclude pneumonia before any medication change",
      },
      {
        key: "E",
        text: "Reassure that cough is viral and continue all drugs at present doses",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Stop St John’s Wort immediately and check serum theophylline level in 3–5 days.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[red]St John’s Wort[/red]** is a **potent inducer of CYP1A2 & CYP3A4** → **[yellow]↑ metabolism of theophylline[/yellow]** → **sub-therapeutic bronchodilation** → **loss of asthma control**.",
      "- **Dose was increased last month** yet **symptoms worsened**, implying **plasma level fell** as **induction matured (≈ 3 weeks)** after starting SJW.",
      "- **Measuring level** **confirms toxicity vs sub-therapeutic** and **guides re-dosing** once induction wears off (half-life ~3–5 days).",
      "",
      "**3) Explain like I’m a child**",
      "- **St John’s Wort** is like **a paper-shredder** for the **theophylline sheet**—**shreds it faster** so **lungs can’t read the instructions** → **cough & wheeze return**. **Remove the shredder**, **let sheets pile up again**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Increase theophylline now:** **[red]risk of toxicity[/red]** once SJW stopped (levels rebound); **no objective level** to guide dose.",
      "- **C. Switch to sertraline today:** **SSRI also inhibits CYP2D6** but **does not restore theophylline level**; **may precipitate serotonin syndrome** if SJW still on board.",
      "- **D. CXR first:** **no fever, purulent sputum, focal signs**; **drug interaction far more likely** → **simple reversible test first**.",
      "- **E. Viral reassurance:** **ignores documented interaction**; **patient already using more inhalers** → **needs proactive management**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Serum theophylline level[/blue]** → **expected sub-therapeutic** (< 5 mg/L) **after SJW induction**.",
      "- **Best Test with result:** **[green]Stop SJW[/green]** → **re-check level in 3–5 days** → **level rises toward therapeutic window** (8–12 mg/L) **without extra tablets**.",
      "- **Additional Tests:** **[purple]Spirometry[/purple]** (if < 50 % predicted **adds inhaled steroid**), **CXR** only if **focal crackles/fever**, **mood screen** (PHQ-2/9) **once physical issue resolved**.",
      "- **Why each test:** **Differentiates** **[yellow]sub-therapeutic drug[/yellow]** from **other asthma exacerbators** (infection, heart failure).",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Cease St John’s Wort immediately[/red]**; **continue current theophylline dose** until level available.",
      "- **First Line:** **Optimise inhaler technique**, **add spacer**, **increase ICS/LABA** (e.g., budesonide-formoterol 2 puffs bd) **for interim control**.",
      "- **Gold Standard:** **Counsel on herbal-drug interactions**; **offer evidence-based grief support** (counselling, consider **mirtazapine 15 mg nocte** **after** level stable—**also helps sleep & appetite**).",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Liver enzymes** are **little Pac-Men**; **SJW calls in extra Pac-Men** to **gobble theophylline pellets**. **Fewer pellets reach the lungs** → **airways tighten**. **Send the Pac-Men home** and **pellets return**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Dry cough + wheeze + increased inhaler use[/yellow]** — **loss of bronchodilation**.",
      "- **[purple]No infective features[/purple]** — **makes infection unlikely**.",
      "- **Pattern lock:** **[yellow]New herbal + worsening asthma despite recent dose increase[/yellow]** → **[green]check interaction first[/green]**.",
    ],
  },
  {
    id: "VAS-NCD-50013",
    topic:
      "Geriatrics • Major vascular neurocognitive disorder (vascular dementia) — Stepwise decline with frontal-subcortical features",
    difficulty: "Medium",
    vignetteTitle:
      "Which diagnosis best explains his 3-year stepwise cognitive decline with predominant executive dysfunction?",
    stem: "An 84-year-old man in a residential care home becomes increasingly agitated and restless, frequently disturbing other residents. Staff report a 3-year history of stepwise cognitive decline following several transient ischemic attacks and one ischemic stroke. He has long-standing hypertension, atrial fibrillation, and ischemic heart disease. Compared with memory loss, his problems with planning and attention are more prominent; he also has urinary urgency and a broad-based, slow gait. On examination, he is disoriented to time and has a mild residual left-sided weakness. The on-call doctor administers haloperidol 2.5 mg stat and prescribes 1 mg three times daily thereafter. A recent non-contrast head CT showed multiple lacunar infarcts and periventricular white-matter changes.",
    options: [
      { key: "A", text: "Alzheimer disease dementia" },
      { key: "B", text: "Dementia with Lewy bodies" },
      {
        key: "C",
        text: "Major vascular neurocognitive disorder (vascular dementia)",
      },
      { key: "D", text: "Parkinson disease dementia" },
      { key: "E", text: "Mixed Alzheimer-vascular dementia" },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Major vascular neurocognitive disorder (vascular dementia).**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]3-year stepwise deterioration[/yellow]** after **multiple TIAs + ischaemic stroke** = **classic vascular course**.",
      "- **[purple]Prominent executive/attention deficits[/purple]** (planning, disorientation) **outweigh memory loss** → **frontal-subcortical pattern** of vascular disease.",
      "- **[blue]Physical signs match[/blue]**: **residual hemiparesis**, **broad-based slow gait (gait apraxia)**, **urinary urgency** (frontal bladder dysfunction) + **CT: multiple lacunar infarcts + periventricular white-matter change**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Small strokes** keep **nibbling holes** in the **brain’s wiring**. **Lights flicker in steps** (not slowly fading), **remote memory bulb** still glows but **planning switch** is **broken**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Alzheimer disease dementia:** **[red]insidious onset[/red]**, **memory first**, **no stepwise course**, **CT shows atrophy not lacunes**.",
      "- **B. Dementia with Lewy bodies:** **[purple]visual hallucinations, fluctuating cognition, parkinsonism[/purple]** **not described**; **gait here is vascular, not Lewy.**",
      "- **D. Parkinson disease dementia:** **requires** **parkinsonism preceding dementia by > 1 year**; **no tremor/rigidity reported**, **gait is broad-based vascular, not shuffling.**",
      "- **E. Mixed Alzheimer-vascular:** **possible later**, **but stepwise course + CT purely vascular** → **call it vascular** **until memory loss becomes dominant.**",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Clinical criteria[/blue]** (DSM-5) → **stepwise decline**, **vascular risk factors**, **focal neuro deficits**, **imaging confirms** → **[green]major vascular NCD[/green]**.",
      "- **Best Test with result:** **[purple]CT/MRI[/purple]** → **multiple lacunar infarcts**, **white-matter hyperintensities**, **preserved hippocampal volume**.",
      "- **Additional Tests:** **Carotid Doppler**, **ECHO** for **AF source**, **HbA1c, lipids, BP monitoring** → **guide secondary-stroke prevention**.",
      "- **Why each test:** **Prevent further strokes** → **slow cognitive decline**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Treat vascular risk[/green]** — **BP < 130/80**, **statin high-intensity**, **anticoagulate AF** (NOAC if eligible), **stop smoking**.",
      "- **First Line:** **[blue]Structured day, cueing, bladder schedule[/blue]**; **avoid antipsychotics** ( **[red]↑ stroke risk[/red]** ) — **use low-dose quetiapine 12.5 mg** **only if[/purple]** agitation **endangers despite non-drug measures**.",
      "- **Gold Standard:** **Multidisciplinary rehab** — **physiotherapy for gait**, **occupational therapy for ADL aids**, **family education on** **[yellow]stepwise expectations[/yellow]**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **High BP + AF** **blast tiny clots** into **deep brain wires** (lacunes). **Each clot snips a wire** — **another step down**. **Keeping BP & blood thin** **stops new clots**, **preserves remaining wires**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Stepwise drops in function[/yellow]** — **each lacunar stroke event**.",
      "- **[purple]Frontal-executive deficits[/purple]** — **apraxia, inattention, disorientation**, **relative sparing of episodic memory**.",
      "- **[blue]Gait apraxia + urinary urgency[/blue]** — **subcortical frontal tracts affected**.",
      "- **Pattern lock:** **[yellow]Multiple TIAs/strokes + stepwise decline + executive > memory deficits + lacunar CT[/yellow]** → **[green]major vascular NCD[/green]**.",
    ],
  },
  {
    id: "DEL-FALL-50014",
    topic:
      "Geriatrics • Delirium superimposed on dementia — Falls, dehydration & infection",
    difficulty: "Medium",
    vignetteTitle:
      "What is the most likely cause of her sudden agitation and falls?",
    stem: "An 84-year-old woman with known dementia is admitted from a residential home after several recent falls. Staff report a sudden 24–48 hour change from her baseline: she has become increasingly restless and agitated, especially at night, and her attention fluctuates during conversations. She is frail and dehydrated. On exam, she is disoriented to time, distractible, and intermittently tries to get out of bed. Temperature is 37.9 °C, respiratory rate 22/min, and oxygen saturation 92% on room air. Chest auscultation reveals coarse crackles at the right base. Her skin is fragile with small lacerations and bruises from the falls.",
    options: [
      { key: "A", text: "Acute exacerbation of Alzheimer disease dementia" },
      { key: "B", text: "Delirium due to right-sided pneumonia / dehydration" },
      { key: "C", text: "Sundowning only, without medical cause" },
      { key: "D", text: "Depressive episode with psychomotor agitation" },
      { key: "E", text: "Normal-pressure hydrocephalus progression" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Delirium due to right-sided pneumonia / dehydration.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Sudden 24–48 h change[/yellow]** from baseline (restless, night-time agitation, **fluctuating attention**) in **patient with dementia** = **[green]acute delirium[/green]** (DSM-5 criteria met).",
      "- **[red]Objective medical stressors[/red]**: **low-grade fever (37.9 °C), tachypnoea (22/min), hypoxia (92 %), right basal crackles** → **right-sided pneumonia**; **clinical dehydration** → **both potent delirium triggers**.",
      "- **[blue]Falls[/blue]** are **common consequence** of **delirium-related over-activity & poor judgement**; **skin fragility** reflects **chronic frailty + acute dehydration**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Brain city** already has **flickering lights** (dementia). **Infection & thirst** are **thunderstorms** that **short-circuit traffic lights** → **cars drive wildly** (agitation, falls). **Fix the storm**, **lights steady again**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Acute Alzheimer exacerbation:** **[red]dementia never fluctuates over hours[/red]**; **no fever/hypoxia**.",
      "- **C. Sundowning only:** **sundowning is **a **evening worsening of baseline dementia WITHOUT** new **medical signs**; **here we have **fever, crackles, hypoxia** → **organic cause**.",
      "- **D. Depressive episode:** **mood not reported**, **attention fluctuates**, **physical signs absent** in **pure depression**.",
      "- **E. NPH progression:** **no gait apraxia/incontinence story**, **no ventriculomegaly reported**, **time-course hours not months**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bedside delirium screen[/blue]** (4AT ≥ 4 or CAM positive) → **acute onset + inattention + disorientation + altered consciousness** = **[green]delirium confirmed[/green]**.",
      "- **Best Test with result:** **[purple]Chest X-ray[/purple]** → **right lower-lobe consolidation**; **basic bloods** → **leucocytosis, elevated CRP, mild acute kidney injury (prerenal)** consistent with **pneumonia + dehydration**.",
      "- **Additional Tests:** **Urinalysis & culture**, **blood cultures if febrile > 38 °C**, **ECG** (tachypnoea rule-out AF), **pulse oximetry continuously**, **bladder scan** for **retention**.",
      "- **Why each test:** **Identify & treat all reversible drivers** → **shorten delirium duration**, **prevent complications** (pressure ulcers, aspiration, prolonged hospital stay).",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]IV antibiotics[/green]** (amoxicillin-clavulanate or ceftriaxone per local protocol), **IV fluids** (balanced crystalloid, **monitor Na**), **oxygen** to **keep SpO₂ ≥ 94 %**, **paracetamol** for fever.",
      "- **First Line:** **[blue]Non-pharmacological delirium bundle[/blue]** — **reorientation board, family at bedside, glasses/hearing aids, early mobilisation, normal sleep pattern (lights day, quiet night), remove tethers**.",
      "- **Gold Standard:** **[yellow]Low-dose antipsychotic[/yellow]** (e.g., **haloperidol 0.5 mg PO/IM PRN**) **only if[/purple]** agitation **endangers patient/staff** despite **pain, bladder, hypoxia corrected**; **review daily & stop ASAP**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Infection & dehydration** **release inflammatory messengers** that **clog the brain’s mailboxes** (neurotransmitters). **Messages jam**, **traffic lights flash**, **cars crash** (falls). **Clear the mailboxes** → **traffic flows smoothly**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Restless, agitated, night-time worsening[/yellow]** — **circadian disruption + hypoxia**.",
      "- **[red]Disoriented, distractible, trying to climb out[/red]** — **core features of delirium**.",
      "- **[purple]Falls & skin tears[/purple]** — **consequence of** **over-activity + frailty**.",
      "- **Pattern lock:** **[yellow]Sudden agitation + fever/crackles/hypoxia/dehydration[/yellow]** → **[green]delirium due to pneumonia + dehydration[/green]**.",
    ],
  },
  {
    id: "FALL-OLD-50015",
    topic: "Geriatrics • Falls — Multifactorial mechanical fall in frailty",
    difficulty: "Medium",
    vignetteTitle: "Why did she fall, and what is the most likely diagnosis?",
    stem: "A 92-year-old frail woman is brought to ED after an unwitnessed fall at home. She lives alone with family/home-care support. History: mild dementia, osteoporosis with prior wrist & thoracic vertebral fractures. No chest pain, palpitations, dyspnea or pre-syncope reported; no post-event confusion, tongue-biting or incontinence. Poor vision & hearing. Medications: loop diuretic for ankle swelling. Vitals stable. Exam: no focal neurology, no new bony tenderness, old shin bruises. ECG NSR. Standing: unsteady but no presyncope. Relatives worried about home safety.",
    options: [
      { key: "A", text: "Cardiac arrhythmia with syncope" },
      { key: "B", text: "Orthostatic hypotension" },
      {
        key: "C",
        text: "Multifactorial mechanical fall (frailty, poor vision/hearing, mild dementia, diuretic-related nocturia)",
      },
      { key: "D", text: "Acute stroke with subsequent fall" },
      { key: "E", text: "Seizure with post-ictal fall" },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Multifactorial mechanical fall (frailty, poor vision/hearing, mild dementia, diuretic-related nocturia).**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]No red flags[/yellow]** for syncope (no LOC, presyncope, chest pain, palpitations) or seizure (no tongue-bite, incontinence, post-ictal confusion).",
      "- **[purple]Multiple chronic risk factors[/purple]**: **frailty, poor vision/hearing, mild dementia (poor hazard perception), loop diuretic (nocturia, urgency)** → **common scenario for mechanical trip/stumble.**",
      "- **Normal ECG & standing vitals** **exclude arrhythmia & orthostatic hypotension** today; **no focal neurology** → **stroke unlikely**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Grandma’s legs are thin batteries**, **eyes are foggy**, **ears are muffled**, and **water pill wakes her at 3 am**. **She trips over the rug** while **rushing to the loo** — **no blackout, no seizure, just a slippery path**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Cardiac arrhythmia:** **[red]no LOC, palpitations, ECG normal[/red]**; **absence of syncope** makes this **very unlikely**.",
      "- **B. Orthostatic hypotension:** **[red]denies presyncope[/red]**, **vitals stable on standing**; **no documented BP drop**.",
      "- **D. Acute stroke:** **[red]no focal neuro deficit[/red]**, **no aphasia/neglect**; **prior vertebral fracture** can **mimic but exam clear**.",
      "- **E. Seizure:** **[red]no tongue-biting, incontinence, or confusion[/red]**; **post-event mental state normal**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Orthostatic vitals & ECG[/blue]** → **negative**; **basic labs** (Na, renal, glucose) → **rule out dehydration/ hypoNa** from **diuretic**.",
      "- **Best Test with result:** **[green]Multifactorial falls-risk assessment[/green]** (Tinetti/STRATIFY) → **high risk** due to **vision, hearing, cognition, mobility, polypharmacy**.",
      "- **Additional Tests:** **Vision check** (cataracts, refraction), **hearing aid function**, **DXA scan** (if not recent), **home safety OT visit**.",
      "- **Why each test:** **Identify modifiable factors** to **prevent next fracture**; **guide intervention package**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Education & home safety[/green]** — **remove loose rugs**, **add night-lights**, **install grab bars**, **provide raised toilet seat**, **ensure diuretic taken ≥ 6 h before bed**.",
      "- **First Line:** **Refer **[**blue]OT home assessment[/blue]**, **physio for strength/balance training**, **optician & audiology review**, **Medic-Alert bracelet**, **consider 24-h carer call button**.",
      "- **Gold Standard:** **Review medications** — **switch loop diuretic to **[**purple]once-morning[/purple]** or **reduce dose** if **ankle oedema minimal**; **ensure Ca/Vit D & osteoporosis Rx up to date**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Frailty** = **thin muscles, wobbly joints, cloudy senses**. **Diuretic** = **midnight bathroom dash**. **Together** = **trip, no blackout** — **just physics, not electricity**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Unwitnessed fall, no prodrome[/yellow]** — **suggests mechanical** rather than **syncopal**.",
      "- **[purple]Old bruises[/purple]** — **prior trips**, **confirms chronic risk**.",
      "- **[red]Loop diuretic[/red]** — **nocturia, urgency**, **common precipitant**.",
      "- **Pattern lock:** **[yellow]Frail, sensory-impaired, cognitively impaired woman on diuretic[/yellow]** → **[green]multifactorial mechanical fall[/green]**; **safety package & medication review key**.",
    ],
  },
  {
    id: "OST-COL-50016",
    topic:
      "Geriatrics • Osteoporosis — Calcium & vitamin D after Colles’ fracture",
    difficulty: "Medium",
    vignetteTitle:
      "Should this house-bound 92-year-old take calcium tablets after a Colles’ fracture?",
    stem: "An elderly house-bound woman has fallen at home on several occasions and has recently attended A&E with a Colles’ (wrist) fracture. Her daughter is concerned about the presence of osteoporosis and seeks your advice at the surgery about the need for calcium tablets to prevent further fractures.",
    options: [
      {
        key: "A",
        text: "Reassure only — calcium tablets do not prevent fractures",
      },
      {
        key: "B",
        text: "Prescribe calcium 1200 mg + vitamin D 800 IU daily and arrange a DXA scan",
      },
      {
        key: "C",
        text: "Advise dietary calcium alone — supplements increase heart-attack risk",
      },
      {
        key: "D",
        text: "Start high-dose vitamin D 100 000 IU once yearly without calcium",
      },
      {
        key: "E",
        text: "Refer immediately to secondary-care osteoporosis clinic without supplements",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Prescribe calcium 1200 mg + vitamin D 800 IU daily and arrange a DXA scan.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[purple]Colles’ fracture after low-energy fall[/purple]** = **clinical diagnosis of osteoporosis** (NICE & NOGG) — **DXA still useful to guide further drug therapy**.",
      "- **Meta-analysis**: **1200 mg elemental calcium + 800 IU vitamin D daily** ↓ **all fractures by 12%**, **hip fractures by 26%** in **frail elderly** [^3^][^4^].",
      "- **House-bound** → **low sunlight exposure** → **high risk of vitamin D deficiency** → **supplementation essential**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bones are bricks**, **calcium & vitamin D are the mortar**. After a **wrist snap**, **add more mortar** to **stop the next brick cracking**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Reassure only:** **[red]ignores evidence[/red]** — **calcium + D reduces fractures[/purple]** when **compliance > 80 %** [^3^].",
      "- **C. Diet alone:** **house-bound intake usually < 600 mg/day**; **supplements needed** to **reach 1200 mg** [^2^][^4^].",
      "- **D. Yearly mega-dose:** **associated with ↑ falls & fractures**; **daily 800 IU safer** [^2^].",
      "- **E. No tablets till clinic:** **delays protection**; **primary care can start** **calcium/D immediately** while **awaiting DXA**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Check dietary calcium intake[/blue]** (< 600 mg/day) & **serum 25-OH vitamin D** (< 50 nmol/L) → **confirm need for supplement**.",
      "- **Best Test with result:** **[green]DXA scan within 3 months[/green]** → **T-score ≤ −2.5** → **add oral bisphosphonate**; **> −2.5** → **continue Ca/D + fall-prevention**.",
      "- **Additional Tests:** **FRAX score** using **clinical risk factors + DXA** → **guide drug therapy**; **renal function** before **bisphosphonate**.",
      "- **Why each test:** **Ca/D alone insufficient** if **very high fracture risk**; **bisphosphonate needs** **adequate Ca/D stores** to **work** [^3^].",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Prescribe combined Ca 1200 mg + D 800 IU daily[/green]** (split into **≤ 500 mg Ca per dose** with food); **ensure hydration** to **↓ kidney-stone risk**.",
      "- **First Line:** **OT home safety assessment**, **strength & balance classes**, **Medic-Alert**, **review loop diuretic** if **ankle swelling minimal**.",
      "- **Gold Standard:** **If DXA osteoporosis** → **start oral bisphosphonate** (alendronate 70 mg weekly) **after Ca/D replete**; **annual review of compliance & adverse effects**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Calcium crystals** are **bricks**, **vitamin D is the forklift** that **loads bricks into bone factory**. **House-bound granny** has **no forklift (sun)** and **few bricks (diet)**. **Give forklift + bricks daily** → **factory repairs**.",
      "",
      "**8) Symptoms**",
      "- **[purple]Low-energy Colles’ fracture[/purple]** — **pathognomonic for osteoporosis**.",
      "- **[yellow]House-bound[/yellow]** — **vitamin D deficiency risk**.",
      "- **Pattern lock:** **[yellow]Fragility wrist fracture + low sunlight/dietary intake[/yellow]** → **[green]start Ca 1200 mg + D 800 IU daily[/green]**, **arrange DXA**, **add bisphosphonate if T-score ≤ −2.5**.",
    ],
  },
  {
    id: "FALL-BRADY-50017",
    topic:
      "Geriatrics • Falls — Sick-sinus syndrome / bradyarrhythmia vs other causes",
    difficulty: "Medium",
    vignetteTitle: "Why has he fallen eight times in three months?",
    stem: "An 85-year-old man is admitted after a fall with mild facial laceration. He reports ≈ 8 falls over 3 months, mostly mornings, occasionally afternoons. No LOC, but dizziness precedes each fall. No chest pain, palpitations, tripping or mechanical trigger; normal within minutes. No witnesses. Lives alone. Smokes 5 cigs/day, no alcohol. Occasional white-sputum cough. PMH: hypertension on bendrofluazide + doxazosin; diet-controlled impaired fasting glucose (6.5 mmol/L). Exam: well, pulse 90/min irregular, BP 134/84, heart sounds normal, no postural drop; mild distal glove-and-stocking touch loss. Labs normal except fasting glucose 6.5 mmol/L. ECG: evidence of sino-atrial node disease / sick-sinus syndrome.",
    options: [
      {
        key: "A",
        text: "Orthostatic hypotension due to doxazosin and bendrofluazide",
      },
      { key: "B", text: "Vasovagal syncope triggered by morning cough" },
      {
        key: "C",
        text: "Sick-sinus syndrome with intermittent bradycardia causing cerebral hypoperfusion",
      },
      { key: "D", text: "Hypoglycaemia from undiagnosed diabetes" },
      { key: "E", text: "Mechanical falls because of peripheral neuropathy" },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Sick-sinus syndrome with intermittent bradycardia causing cerebral hypoperfusion.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Pre-fall dizziness without LOC, no chest pain/palpitations, rapid recovery[/yellow]** → **classical cerebral hypoperfusion from bradyarrhythmia**.",
      "- **ECG shows sino-atrial node disease / sick-sinus syndrome** — **intermittent sinus pauses or bradycardic spells** **often occur in morning** (vagal tone) and **can be missed on single ECG** but **explain symptoms**.",
      "- **No postural drop (BP 134/84 stable)** → **excludes orthostatic hypotension**; **glucose 6.5 mmol/L** → **not hypoglycaemic**; **no tripping** → **mechanical fall unlikely**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Heart’s natural pacemaker** **misses beats** like **a dodgy metronome**. **Brain misses the beat** → **dizzy tumble**; **metronome restarts** → **feels fine again**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Orthostatic hypotension:** **[red]no postural BP drop documented[/red]**, **no symptoms on standing**; **doxazosin & bendrofluazide** **can cause it** but **not demonstrated**.",
      "- **B. Vasovagal syncope:** **needs trigger** (cough, micturition) — **patient denies cough during falls**; **would expect nausea/sweating**.",
      "- **D. Hypoglycaemia:** **fasting glucose 6.5 mmol/L** (impaired, not low); **no sweat, tremor, confusion** reported.",
      "- **E. Mechanical neuropathy:** **mild sensory loss only**, **no weakness/ataxia**, **no tripping history**; **falls are** **brief dizziness-related**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Postural vitals[/blue]** → **negative**; **ECG** → **sinus pauses / brady episodes** → **sick-sinus syndrome**.",
      "- **Best Test with result:** **[green]24-hour Holter or telemetry[/green]** → **documents** **intermittent bradycardia < 40 bpm or pauses > 2 s** during **symptom time**.",
      "- **Additional Tests:** **Echo** (exclude structural disease), **electrolytes, TSH** (reversible causes), **carotid Doppler** only if **focal neurology**.",
      "- **Why each test:** **Confirm correlation** of **bradycardia with dizziness/falls** → **guides need for pacemaker**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Stop bendrofluazide if ankle oedema minimal[/green]** (↓ volume depletion), **avoid rate-slowing drugs** (β-blockers, digoxin).",
      "- **First Line:** **Document arrhythmia** → **if pauses > 3 s or symptomatic brady < 40 bpm** → **[purple]permanent pacemaker[/purple]** (class I indication).",
      "- **Gold Standard:** **Anticoagulate if paroxysmal AF emerges on monitoring**, **treat glucose & BP**, **refer to falls multidisciplinary team** for **balance training & home safety**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Sick sinus = lazy drummer**. **Sometimes he misses a beat** → **music stops** (blood flow) → **dancer falls**. **New drummer (pacemaker)** keeps **steady beat**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Dizziness preceding fall, rapid recovery[/yellow]** — **cerebral hypoperfusion**.",
      "- **[purple]Morning predominance[/purple]** — **high vagal tone**, **bradycardia common**.",
      "- **Pattern lock:** **[yellow]Recurrent dizziness + ECG sick-sinus + no postural drop[/yellow]** → **[green]intermittent bradycardia[/green]** → **needs Holter & pacemaker consideration**.",
    ],
  },
  {
    id: "DEL-PRES-50018",
    topic:
      "Geriatrics • Delirium — Pressure injury sepsis / hypernatraemia / hypoglycaemia",
    difficulty: "Medium",
    vignetteTitle: "Why is she still confused after 48 h of antibiotics?",
    stem: "An 82-year-old woman is admitted with a left femoral-neck fracture (ORIF, transfusion). PMH: HF, DM2. Meds: enoxaparin, Foley, propoxyphene/APAP, home furosemide/lisinopril/metoprolol/simvastatin/glyburide. Refuses PT, eats <25%, no visitors. Day-3 fever; urine >100 000 E. coli, treated. Still febrile & confused 48 h later. Vitals: BP stable, HR 110, SpO₂ 86% RA. Exam: basilar crackles, tachycardia + 2/6 holosystolic murmur, 5-cm sacral ulcer with duskiness & maceration. Surgical site clean. CXR: no consolidation/pulmonary oedema; CTPA negative. Labs: Na 156, K 2.9, BUN 45, Cr 2.1, Hb 13.5, WBC 10.5, capillary glucose 46 mg/dL.",
    options: [
      { key: "A", text: "Hospital-acquired pneumonia" },
      { key: "B", text: "Pulmonary embolism" },
      {
        key: "C",
        text: "Delirium due to Stage 3/4 sacral pressure injury with sepsis, hypernatraemic dehydration, and iatrogenic hypoglycaemia",
      },
      { key: "D", text: "Acute stroke (post-operative embolic)" },
      { key: "E", text: "Hyperglycaemic hyperosmolar state" },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Delirium due to Stage 3/4 sacral pressure injury with sepsis, hypernatraemic dehydration, and iatrogenic hypoglycaemia.**",
      "",
      "**2) Why it is the correct answer**",
      "- **[yellow]Continued fever[/yellow]** despite **48 h appropriate antibiotics for UTI** → **alternative septic source**; **5-cm non-blanchable sacral ulcer with duskiness & maceration** = **Stage 3/4 pressure injury** → **source of ongoing sepsis**.",
      "- **[red]Hypernatraemia (Na 156)[/red]** + **raised BUN/Cr (prerenal)** → **hypernatraemic dehydration** → **major delirium driver**.",
      "- **[purple]Capillary glucose 46 mg/dL[/purple]** (while on **glyburide + poor oral intake**) → **iatrogenic hypoglycaemia** → **confusion, tachycardia, diaphoresis**.",
      "- **CXR negative, CTPA negative** → **rules out pneumonia & PE**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bed sore turns into a nasty volcano**, **body keeps burning**. **Water pills dry her out** (salty blood) and **sugar pill drops too low** → **brain alarm bells ring** (confusion).",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Hospital-acquired pneumonia:** **[red]CXR clear[/red]**, **no consolidation**, **SpO₂ ↓ may reflect sepsis/atelectasis**.",
      "- **B. Pulmonary embolism:** **[red]CTPA negative[/red]**, **no RV strain, no pleuritic pain**.",
      "- **D. Acute stroke:** **[red]no focal neurology[/red]**, **CT brain not indicated here**, **confusion global not lateralising**.",
      "- **E. Hyperglycaemic hyperosmolar state:** **[red]glucose 46 mg/dL[/red]** (hypo), **not hyper**; **osmolality driven by Na but insulin not absent**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Blood & wound cultures[/blue]** → **likely heavy growth**; **serum osmolality** → **↑ (Na 156 ≈ 320 mOsm/kg)**.",
      "- **Best Test with result:** **[green]Clinical wound staging[/green]** → **Stage 3 (full-thickness skin loss) or 4 (with tunneling)** → **source of sepsis confirmed**.",
      "- **Additional Tests:** **ABG if SpO₂ low**, **lactate**, **repeat glucose q1h until > 70 mg/dL**, **CXR daily if respiratory deterioration**.",
      "- **Why each test:** **Identify & treat all reversible metabolic / septic drivers** of **delirium**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]IV 0.9% saline slow correction[/red]** (↓ Na ≤ 10 mmol/24 h), **KCl replacement**, **IV antibiotics** guided by **wound + blood cultures**, **stop glyburide** (long-acting sulphonylurea), **start 5% dextrose once glucose > 70 mg/dL**.",
      "- **First Line:** **[blue]Pressure-relief mattress[/blue]**, **2-hourly repositioning**, **wound debridement & negative-pressure therapy**, **adequate analgesia** (switch propoxyphene → **paracetamol ± low-dose morphine**), **remove Foley ASAP** to **↓ UTI risk**.",
      "- **Gold Standard:** **[yellow]Multidisciplinary care[/yellow]** — **nutrition plan (≥ 1.2 g/kg protein)**, **PT/OT early mobilisation**, **diabetes switch to** **short-acting insulin sliding scale** while **intake unpredictable**, **diabetes nurse education**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Bed-sore volcano** **spews germs** into blood. **Body becomes salty desert** (diuretic) and **sugar drops to empty** (glyburide + no food). **Brain cells shrivel & starve** → **confusion bells ring**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Persistent fever despite UTI treatment[/yellow]** — **alternate septic source (pressure ulcer)**.",
      "- **[red]Hypernatraemia + rising creatinine[/red]** — **hypertonic dehydration**.",
      "- **[purple]Hypoglycaemia 46 mg/dL[/purple]** — **iatrogenic, neuroglycopenic confusion**.",
      "- **Pattern lock:** **[yellow]Post-op day 3 + neglected sacral ulcer + hypernatraemia + hypoglycaemia[/yellow]** → **[green]delirium from multiple metabolic/septic insults[/green]**; **correct all drivers**.",
    ],
  },
  {
    id: "HTN-CKD-50019",
    topic:
      "Geriatrics • Hypertension — Resistant HTN with CKD progression & thiazolidinedione-induced fluid retention",
    difficulty: "Medium",
    vignetteTitle:
      "Why is his BP still 164/80 mmHg despite 2 antihypertensives?",
    stem: "Mr. G, long-standing patient, returns for follow-up. PMH: T2DM, HTN. Meds: amlodipine 10 mg daily, enalapril 10 mg daily, glipizide 10 mg daily, rosiglitazone 8 mg daily, EC aspirin 325 mg daily, multivitamin. BP 164/80 mmHg, HR 72 regular. Weight 186 lb (↓ 4 lb over 6 months). JVP not elevated, lungs clear, cardiac exam normal, mild bilateral ankle oedema. Labs: HbA1c 7.5 %, BUN 24 mg/dL, creatinine 1.8 mg/dL, total chol 224 mg/dL, TG 180 mg/dL, HDL 30 mg/dL, LDL 151 mg/dL.",
    options: [
      { key: "A", text: "White-coat hypertension" },
      {
        key: "B",
        text: "Resistant hypertension with chronic kidney disease and rosiglitazone-induced fluid retention",
      },
      { key: "C", text: "Primary hyperaldosteronism" },
      { key: "D", text: "Medication non-adherence" },
      { key: "E", text: "Aortic coarctation" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Resistant hypertension with chronic kidney disease and rosiglitazone-induced fluid retention.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Resistant HTN defined as** **[purple]BP > 130/80 despite 3 drugs including a diuretic at maximally tolerated doses[/purple]**; here only **2 antihypertensives** (amlodipine 10 mg, enalapril 10 mg) **+ no diuretic** → **truly resistant once diuretic added**.",
      "- **[red]Creatinine 1.8 mg/dL (eGFR ≈ 38 mL/min)[/red]** → **CKD stage 3b**; **CKD is the commonest secondary cause of resistant HTN** due to **volume expansion & RAAS activation**.",
      "- **[yellow]Rosiglitazone 8 mg daily[/yellow]** → **thiazolidinedione-induced sodium & water retention** → **ankle oedema, weight gain OR masks weight loss**; **amplifies volume-mediated BP rise**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Kidneys are rusty filters** → **water backs up** (high BP). **Sugar pill (rosi)** **pours extra water into the tank**. **Need an extra drain (diuretic)** to **let water out** and **lower the pressure**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. White-coat HTN:** **[red]repeated clinic readings > 130/80[/red]** in **established patient**; **home BP usually similar** — **unlikely**.",
      "- **C. Primary hyperaldosteronism:** **no hypokalaemia (K 4.2)**, **no adrenal mass story**; **screen only after** **resistant HTN persists despite 3 drugs + diuretic**.",
      "- **D. Non-adherence:** **patient states good adherence**, **weight stable**, **refill record consistent**; **CKD + drug side-effect explains picture**.",
      "- **E. Aortic coarctation:** **no radio-femoral delay, no murmur, normal pulses, age 85** → **implausible**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Home / ambulatory BP monitoring[/blue]** → **confirms true hypertension** (average > 130/80).",
      "- **Best Test with result:** **[green]Add low-dose thiazide-like diuretic (indapamide 1.5 mg)[/green]** → **check K & creatinine in 1–2 weeks**; **expect BP ↓ 10–15 mmHg** if **volume overloaded**.",
      "- **Additional Tests:** **UACR, renal USS** if **rapid CKD progression**, **aldosterone/renin ratio** **only if** **BP remains > 130/80 on 3 drugs including diuretic & K > 4.0**.",
      "- **Why each test:** **Identify reversible / treatable causes** and **guide safe diuretic use** in **CKD**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Switch rosiglitazone to[/red]** **[purple]weight-neutral glucose-lowering agent[/purple]** (e.g., **DPP-4 inhibitor or SGLT-2 inhibitor** if eGFR ≥ 30) → **↓ fluid retention**, **may reduce albuminuria**.",
      "- **First Line:** **[green]Add indapamide 1.5 mg daily[/green]** (thiazide-like, preferred in CKD) **± increase enalapril to 20 mg** if **K < 5.0 & creatinine rise < 30 %**; **monitor electrolytes 1–2 weekly until stable**.",
      "- **Gold Standard:** **Statin intensification** (atorvastatin 40–80 mg) — **LDL 151 mg/dL** in **diabetic CKD** → **high-intensity statin indicated**; **lifestyle (Na < 2 g, weight loss, exercise) & diabetes education**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Rusty kidney filters** **hold extra water**; **sugar pill** **adds more water**. **Extra water squeezes blood pipes** → **high BP**. **Open a new drain (diuretic)** and **turn off the water tap (stop TZD)** → **pipes relax**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]BP 164/80 mmHg on 2 drugs[/yellow]** — **resistant pattern**.",
      "- **[purple]Ankle oedema[/purple]** — **volume expansion + TZD-induced**.",
      "- **[red]Creatinine 1.8 mg/dL[/red]** — **CKD stage 3b** → **volume-mediated HTN**.",
      "- **Pattern lock:** **[yellow]Resistant HTN + CKD + TZD use[/yellow]** → **[green]add diuretic, stop TZD, intensify RAAS blockade[/green]**.",
    ],
  },
  {
    id: "HTN-ELDER-50020",
    topic:
      "Geriatrics • Hypertension — Isolated systolic hypertension (ISH) in the very elderly",
    difficulty: "Medium",
    vignetteTitle: "Why is her BP 165/80 mmHg at age 90 despite feeling well?",
    stem: "A 90-year-old woman newly established in your clinic reports good overall health. She notes bilateral knee pain with walking controlled by acetaminophen and has taken a daily baby aspirin for years. She denies prior diagnoses of hypertension, diabetes, or coronary disease and has never smoked. She appears slender and well. Vitals: BP 165/80 mmHg, HR 78/min and regular, RR 12/min. Cardiopulmonary and abdominal exams are unremarkable. Lower extremities show strong peripheral pulses without edema. Labs (CBC, creatinine, glucose, TSH) are normal. ECG demonstrates left ventricular hypertrophy by voltage criteria with no other abnormalities. When informed her blood pressure is high, she is skeptical, stating she has “never had high blood pressure.”",
    options: [
      { key: "A", text: "White-coat hypertension" },
      {
        key: "B",
        text: "Isolated systolic hypertension (ISH) with age-related arterial stiffening",
      },
      { key: "C", text: "Coarctation of the aorta" },
      { key: "D", text: "Primary aldosteronism" },
      { key: "E", text: "Renal artery stenosis" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Isolated systolic hypertension (ISH) with age-related arterial stiffening.**",
      "",
      "**2) Why it is the correct answer**",
      "- **ISH = systolic BP ≥ 130 mmHg + diastolic < 80 mmHg**; here **165/80 mmHg** fits **ISH pattern** (diastolic borderline).",
      "- **[purple]Loss of large-artery elasticity[/purple]** (collagen ↑, elastin fragmentation) → **↑ pulse wave velocity**, **↑ systolic pressure**, **normal/low diastolic pressure** — **physiological after age 70**.",
      "- **ECG LVH by voltage** → **chronic after-load increase**; **normal creatinine & K** → **no secondary cause clues**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Big blood pipes turn from stretchy rubber tubes into stiff plastic straws**. **Heart pushes harder**, **number on top goes up**, **bottom number stays low** — **not magic, just old pipes**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. White-coat HTN:** **[red]repeated clinic readings > 130[/red]** in **established visit**; **needs home BP to confirm** but **ISH still likely component**.",
      "- **C. Coarctation of the aorta:** **radio-femoral delay**, **mid-systolic murmur**, **rib notching** — **absent**, **age 90** → **implausible**.",
      "- **D. Primary aldosteronism:** **would expect hypokalaemia, raised creatinine** — **labs normal**; **screen only if resistant HTN on 3 drugs**. - **E. Renal artery stenosis:** **no flash pulmonary oedema, no creatinine rise with ACE-i**, **no abdominal bruit** → **low probability**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Home / ambulatory BP monitoring[/blue]** → **average SBP ≥ 130 mmHg** → **confirms true ISH**.",
      "- **Best Test with result:** **[green]Echocardiogram[/green]** → **concentric LVH**, **preserved EF**, **no aortic stenosis** → **chronic pressure overload**.",
      "- **Additional Tests:** **UACR, renal USS** only if **rapid CKD progression**; **secondary screen (aldosterone/renin)** **if BP > 130 on 3 drugs**. - **Why each test:** **Exclude reversible causes** and **assess end-organ damage**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **Lifestyle** — **Na < 2 g/day**, **moderate exercise (walking, Tai-Chi)**, **weight maintenance**, **limit alcohol**.",
      "- **First Line:** **Systolic BP target 130–140 mmHg** (HYVET & STEP trials) — **start low-dose thiazide-like diuretic** (indapamide 1.5 mg) **or ACE-i**; **monitor orthostatic BP**, **electrolytes 2-weekly initially**.",
      "- **Gold Standard:** **Involve patient in decision** — **quality of life & fall risk balance**; **if treatment tolerated & SBP ↓ to 130–140 mmHg** → **↓ stroke, heart failure, CV death**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Rubber pipes become crusty straws**. **Heart squeezes harder**, **top number climbs**. **Gentle water pills or relaxants** **soften the squeeze** without **dropping the bottom number too low**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]SBP 165 mmHg, DBP 80 mmHg[/yellow]** — **classic ISH**.",
      "- **ECG LVH voltage** — **chronic after-load consequence**.",
      "- **No prior HTN diagnosis** — **common in very elderly**; **often discovered incidentally**.",
      "- **Pattern lock:** **[yellow]Age ≥ 90 + SBP ≥ 130 + DBP < 80 + LVH[/yellow]** → **[green]isolated systolic hypertension[/green]**; **treat cautiously to 130–140 mmHg**.",
    ],
  },
  {
    id: "COPD-COR-50021",
    topic:
      "Geriatrics • COPD — Chronic cor pulmonale with decompensated right-heart failure",
    difficulty: "Medium",
    vignetteTitle:
      "Why are his legs swollen and he can’t get out of the chair?",
    stem: "A 72-year-old man who lives alone is assessed at home after the district nurse reports worsening health. He has been housebound for months and now cannot rise from his chair. He is an unkempt heavy smoker with a chronic cough, progressive breathlessness, and wheeze. Examination is limited but notable for central cyanosis, diffuse expiratory wheezes with prolonged expiration, elevated jugular venous pressure, and bilateral pitting peripheral edema. His legs are swollen with tense blisters. Cardiac auscultation is distant; there are no focal crackles. The left hip is very painful with restricted movement despite no history of a fall. He is reluctant to be transferred to hospital.",
    options: [
      { key: "A", text: "Acute left-ventricular failure with pulmonary edema" },
      {
        key: "B",
        text: "Bilateral deep-vein thrombosis with pulmonary embolism",
      },
      {
        key: "C",
        text: "Decompensated chronic cor pulmonale secondary to severe COPD",
      },
      { key: "D", text: "Nephrotic syndrome with hypoalbuminaemia" },
      {
        key: "E",
        text: "Bilateral hip osteoarthritis with immobility-induced edema",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **C. Decompensated chronic cor pulmonale secondary to severe COPD.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Heavy smoker + chronic cough + progressive wheeze/ breathlessness** → **severe COPD**.",
      "- **Central cyanosis + elevated JVP + diffuse wheezes (no crackles) + bilateral pitting oedema to tense blisters** → **right-heart failure (cor pulmonale)** from **chronic hypoxic pulmonary vasoconstriction**.",
      "- **No basal crackles or gallop** → **excludes left-sided failure**; **no proteinuria/hypotension** → **not nephrotic**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Lungs are so blocked** that **the heart’s right pump** **has to push through a narrow straw**. **Pump gets tired**, **blood backs up into legs** → **swollen balloons**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Acute LVF:** **[red]no basal crackles, no gallop, no orthopnoea[/red]**; **oedema is symmetrical & legs only**.",
      "- **B. Bilateral DVT + PE:** **[red]no calf tenderness, no unilateral swelling, no pleuritic pain[/red]**; **JVP elevation chronic**, **not acute**.",
      "- **D. Nephrotic syndrome:** **no hypoalbuminaemia story**, **no periorbital oedema**, **no heavy proteinuria**.",
      "- **E. Hip OA alone:** **does not cause cyanosis, JVP elevation, or anasarca blisters**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]ABG on room air[/blue]** → **pO₂ < 55 mmHg, pCO₂ ↑, pH normal** → **chronic hypoxaemia**.",
      "- **Best Test with result:** **[green]CXR[/green]** → **hyperinflation, flat diaphragms, large pulmonary arteries**; **ECHO** → **RV dilatation/dysfunction, TR jet**, **normal LV** → **cor pulmonale**.",
      "- **Additional Tests:** **Spirometry** (if able) → **FEV₁/FVC < 0.7, FEV₁ < 50 % predicted**; **BNP** → **elevated RV strain**.",
      "- **Why each test:** **Confirm severe COPD + right-heart strain** and **exclude LVF**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Controlled O₂ 24–28 %[/green]** (target SpO₂ 88–92 %) → **avoid CO₂ narcosis**; **nebulised bronchodilators**, **oral prednisolone 30 mg daily 5 days**, **IV diuretic** (furosemide 40 mg) for **oedema relief**.",
      "- **First Line:** **Stop smoking support**, **pneumococcal & flu vaccines**, **DVT prophylaxis (LMWH)** while immobile, **nutrition plan** (↑ protein 1.2 g/kg).",
      "- **Gold Standard:** **Home O₂ assessment** if **pO₂ < 55 mmHg**; **consider HF-NIV** if **hypercapnic**, **refer for pulmonary rehab** once stable.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Smoking tar** **clogs air pipes**, **air sacs pop** (emphysema). **Body squeezes lung blood vessels** to **keep oxygen flowing** → **right heart muscle bulks up** then **fails**. **Blood dams back into legs** → **giant water balloons**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Central cyanosis + diffuse wheeze[/yellow]** — **severe COPD**.",
      "- **[purple]Elevated JVP + bilateral pitting oedema to blisters[/purple]** — **right-heart failure**.",
      "- **[blue]Painful immobile hip[/blue]** — **likely ischaemic necrosis or septic arthritis** from **chronic steroid use** (but **not primary cause of oedema**).",
      "- **Pattern lock:** **[yellow]Heavy smoker + chronic breathlessness + cyanosis + JVP ↑ + anasarca[/yellow]** → **[green]decompensated cor pulmonale[/green]**; **treat COPD + RV failure**.",
    ],
  },
  {
    id: "DVT-POSTOP-50022",
    topic:
      "Surgery • Post-operative venous thrombo-embolism — Deep-vein thrombosis after right hemicolectomy",
    difficulty: "Easy",
    vignetteTitle:
      "What is the most likely diagnosis for her painful, swollen left calf?",
    stem: "A 65-year-old woman is seen in surgical follow-up two weeks after a right hemicolectomy. Within days of surgery she developed progressive unilateral left calf pain and swelling. On exam today, her left calf is warm, erythematous, and tender with pitting edema up to the knee; calf circumference is 3 cm greater than the right. She is afebrile and hemodynamically stable. Duplex ultrasonography performed at the time of symptom onset demonstrated non-compressibility of the popliteal vein consistent with thrombosis. She was started on therapeutic anticoagulation and remains on treatment.",
    options: [
      { key: "A", text: "Cellulitis" },
      { key: "B", text: "Deep-vein thrombosis (DVT)" },
      { key: "C", text: "Ruptured Baker (popliteal) cyst" },
      { key: "D", text: "Superficial thrombophlebitis" },
      { key: "E", text: "Lymphedema" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Deep-vein thrombosis (DVT).**",
      "",
      "**2) Why it is the correct answer**",
      "- **Classic Virchow triad**: **recent major abdominal surgery** (stasis, endothelial injury, hyper-coagulability) → **high DVT risk**.",
      "- **Unilateral calf pain, swelling, erythema, pitting edema, 3 cm circumference difference** → **clinical DVT**.",
      "- **Duplex US**: **non-compressible popliteal vein** → **objective confirmation**; **already on therapeutic anticoagulation** → **supports diagnosis**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Blood leg pipe gets clogged with clots** after **tummy surgery** → **leg pipe swells, hurts, turns red**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Cellulitis:** **[red]no fever, no entry site, no leukocytosis[/red]**; **anticoagulation would not improve cellulitis**.",
      "- **C. Ruptured Baker cyst:** **[red]no sudden popliteal swelling/bruising[/red]**, **US showed venous thrombosis not cyst**.",
      "- **D. Superficial thrombophlebitis:** **[red]involves superficial veins[/red]**, **not popliteal (deep) vein**; **non-compressible deep vein = DVT**.",
      "- **E. Lymphedema:** **usually painless, non-pitting, develops slowly**, **no acute erythema/warmth**; **US normal in lymphedema**.",
      "",
      "**5) Diagnostic Steps (already done)**",
      "- **Initial Test with result:** **[blue]Wells score[/blue]** → **high probability**; **D-dimer** (often elevated post-op) — **not needed when US positive**.",
      "- **Best Test with result:** **[green]Duplex ultrasonography[/green]** → **non-compressible popliteal vein** → **confirms DVT**.",
      "- **Additional Tests:** **Baseline CBC, PT/INR** before starting anticoagulation**; **rule out concurrent PE** (if dyspnoea, chest pain) with **CT-PA**.",
      "- **Why each test:** **Confirm extent**, **exclude PE**, **guide anticoagulation choice & duration**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Therapeutic anticoagulation already instituted[/green]** — **continue LMWH or switch to oral DOAC** (e.g., rivaroxaban 15 mg bd × 21 days, then 20 mg daily).",
      "- **First Line:** **Compression stockings (20–30 mmHg)** once bleeding risk low → **↓ post-thrombotic syndrome**, **encourage early ambulation**.",
      "- **Gold Standard:** **Duration**: **≥ 3 months** (post-surgical provoked DVT); **review at 3 months** for **extended anticoagulation** if **ongoing risk factors**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Surgery slows blood flow** and **makes it clotty**. **Clots pile up in deep leg pipe** → **pipe swells and hurts**. **Blood-thinner soap** **washes clots away** and **stops new ones forming**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Unilateral calf pain & swelling[/yellow]** — **classic DVT**.",
      "- **[purple]Warmth, erythema, pitting edema[/purple]** — **inflammatory response**.",
      "- **Pattern lock:** **[yellow]Recent surgery + unilateral calf signs + positive duplex[/yellow]** → **[green]acute lower-limb DVT[/green]**; **anticoagulate ≥ 3 months**.",
    ],
  },
  {
    id: "ASP-PNEU-50023",
    topic: "Geriatrics • Stroke-associated pneumonia / aspiration pneumonia",
    difficulty: "Medium",
    vignetteTitle: "What is causing his fever, cough, and “wet” voice?",
    stem: "A 75-year-old man in a nursing home is largely confined to bed or a chair after a prior left-sided stroke. He has dysphasia, dysphagia, and mild cognitive impairment, and requires assistance with all activities of daily living. Staff report several days of poor oral intake, frequent coughing during meals, a “wet” voice after swallowing, and increasing lethargy. Today he is febrile and more short of breath. Vitals: T 38.2 °C, BP 128/72 mmHg, HR 104/min, RR 24/min, SpO₂ 90% on room air. Exam shows coarse crackles over the right lower lung field; oral hygiene is poor with pooled secretions.",
    options: [
      {
        key: "A",
        text: "Hospital-acquired bacterial pneumonia from airborne spread",
      },
      {
        key: "B",
        text: "Aspiration pneumonia secondary to stroke-associated dysphagia",
      },
      { key: "C", text: "COVID-19 viral pneumonia" },
      { key: "D", text: "Pulmonary embolism" },
      { key: "E", text: "Acute exacerbation of COPD" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Aspiration pneumonia secondary to stroke-associated dysphagia.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Classic triad**: **dysphagia** + **wet voice/cough after swallowing** + **poor oral intake** → **aspiration risk**.",
      "- **Fever, tachypnoea, hypoxia, coarse crackles RLL** → **chemical / bacterial pneumonia** from **aspirated oropharyngeal contents**.",
      "- **Right-lower-lobe predilection** (aspiration when supine) and **pooled secretions** reinforce **aspiration aetiology**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Food & saliva slip into the wrong pipe** because **swallow muscles are weak after stroke**. **Germs grow**, **lung gets angry** → **fever & cough**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Airborne hospital pneumonia:** **[red]no contact with other infected patients[/red]**, **no ICU ventilation**, **clinical picture points to aspiration**.",
      "- **C. COVID-19:** **[red]no outbreak exposure reported[/red]**, **no PCR data**, **typical dysphagia signs favour aspiration**.",
      "- **D. Pulmonary embolism:** **[red]no calf swelling, no pleuritic pain, no sudden collapse[/red]**, **crackles localised**, **response to antibiotics expected**.",
      "- **E. COPD exacerbation:** **[red]no known COPD history[/red]**, **no wheeze described**, **crackles + fever = infection, not bronchospasm**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Chest X-ray[/blue]** → **right-lower-lobe consolidation** / **patchy infiltrate**; **sputum culture** → **mixed oral flora** ± **anaerobes**.",
      "- **Best Test with result:** **[green]Bedside swallow screen[/green]** (water swallow test) → **failed** → **aspiration confirmed**; **consider videofluoroscopy later**.",
      "- **Additional Tests:** **Blood cultures**, **CBG**, **ABG if SpO₂ < 94 %**, **U&Es** (dehydration), **CRP / procalcitonin**.",
      "- **Why each test:** **Guide antibiotic choice**, **assess severity**, **detect dehydration / electrolyte issues**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Keep nil-by-mouth initially[/green]**, **suction oral secretions**, **sit upright 30–45°**, **IV antibiotics** (co-amoxiclav or ceftriaxone + metronidazole if anaerobic cover needed).",
      "- **First Line:** **Start thickened fluids & texture-modified diet** after **speech-and-language therapist (SALT) assessment**; **nasogastric tube if unsafe swallow persists**.",
      "- **Gold Standard:** **Swallow rehabilitation**, **oral-hygiene programme** (chlorhexidine), **consider percutaneous gastrostomy** if **unsafe swallow > 4 weeks**, **vaccinations (pneumococcal, flu)**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Stroke weakens the swallow gate**. **Food & saliva sneak into the lung playground**. **Germs throw a party**, **lung gets red and angry** → **fever, fast breathing, low oxygen**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Wet voice, cough after swallowing[/yellow]** — **aspiration signs**.",
      "- **[purple]Right-lower-lobe crackles + fever[/purple]** — **typical site for supine aspiration pneumonia**.",
      "- **Pattern lock:** **[yellow]Stroke + dysphagia + fever + RLL signs[/yellow]** → **[green]aspiration pneumonia[/green]**; **SALT assessment + antibiotics + swallow precautions key**.",
    ],
  },
  {
    id: "DEL-RET-50024",
    topic:
      "Geriatrics • Dementia — Acute on chronic urinary retention with overflow incontinence, delirium, and iatrogenic anticholinergic toxicity",
    difficulty: "Medium",
    vignetteTitle:
      "Why has he started leaking continuously and become confused?",
    stem: "An 82-year-old man with Alzheimer’s dementia, glaucoma, and dyspepsia is brought to clinic for worsening urinary incontinence. Medications: donepezil, timolol eye drops, ranitidine; TURP at 75. Tamsulosin trial failed. Ambulatory but ADL-dependent. For 1 month: voids q2h daytime, 4–5× nightly, urgency, reaches toilet only 50 %. One month later: near-continuous dribbling, increasing confusion, agitation. Prescribed risperidone, lorazepam, diphenhydramine; symptoms worsen. After fall, ED: febrile 101°F, cloudy urine, fecal impaction, PVR 500 mL cloudy urine. Vitals otherwise stable.",
    options: [
      {
        key: "A",
        text: "Progression of Alzheimer’s dementia with behavioural and psychological symptoms (BPSD)",
      },
      {
        key: "B",
        text: "Acute on chronic urinary retention with overflow incontinence, precipitating delirium, compounded by anticholinergic toxicity and constipation",
      },
      { key: "C", text: "Neurogenic bladder due to spinal cord compression" },
      { key: "D", text: "Risperidone-induced neuroleptic malignant syndrome" },
      { key: "E", text: "Acute prostatitis causing sepsis and encephalopathy" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Acute on chronic urinary retention with overflow incontinence, precipitating delirium, compounded by anticholinergic toxicity and constipation.**",
      "",
      "**2) Why it is the correct answer**",
      "- **PVR 500 mL cloudy urine** → **acute urinary retention** (normal < 50 mL) with **overflow incontinence** (continuous dribbling).",
      "- **Cloudy urine + fever** → **urinary tract infection** → **common trigger of delirium** in dementia.",
      "- **Fecal impaction** → **further bladder outlet obstruction** + **delirium driver**.",
      "- **Diphenhydramine (anticholinergic)** → **impairs detrusor contraction**, **increases retention**, **directly worsens confusion**.",
      "- **Risperidone & lorazepam** → **additional CNS depression**, **fall risk**, **mask pain of retention**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bladder is a water balloon** **too full to empty** (clogged pipe). **Water leaks out the top** (dribbling). **Full balloon + dirty water + constipated tummy + sleepy pills** → **brain fog & agitation**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Pure BPSD:** **[red]does not explain cloudy urine, fever, PVR 500 mL[/red]**; **delirium has medical drivers**.",
      "- **C. Cord compression:** **[red]no limb weakness, sensory level, bowel dysfunction beyond impaction[/red]**; **retention onset subacute**, **no trauma/malignancy history**.",
      "- **D. NMS:** **[red]no hyperthermia > 38.5°C, no rigidity, no CK elevation[/red]**; **fever here is infective (UTI)**.",
      "- **E. Acute prostatitis:** **[red]no fluctuating fever, no prostate tenderness, no WBC > 15[/red]**; **infection source is bladder**, **not necessarily prostate**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bladder scan / PVR[/blue]** → **500 mL** → **acute retention**; **urinalysis & culture** → **pyuria + bacteriuria**.",
      "- **Best Test with result:** **[green]Digital rectal exam[/green]** → **fecal impaction**; **plain abdominal film** if **uncertain**.",
      "- **Additional Tests:** **CBC, CRP**, **renal function**, **blood cultures** if **temp > 38.5°C**, **CK if NMS suspected**.",
      "- **Why each test:** **Identify infection site**, **guide antibiotics**, **detect fecal obstruction**, **exclude NMS/rhabdomyolysis**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Stop anticholinergics (diphenhydramine)[/red]**, **reduce antipsychotic to lowest dose**, **insert urethral catheter** → **drain 500 mL**, **send urine for C&S**, **start antibiotics** (nitrofurantoin or ceftriaxone per sensitivities).",
      "- **First Line:** **Manual evacuation / enema for fecal impaction**, **scheduled toileting**, **switch ranitidine to PPI** (less anti-cholinergic), **review donepezil** (continue), **pain control with paracetamol**.",
      "- **Gold Standard:** **Trial void after 48 h**; **if PVR < 100 mL & sterile urine** → **remove catheter**, **start supervised bladder retraining**, **consider intermittent catheterisation** if **retention recurs**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Bladder tap sticks** (TURP scarring, anticholinergic glue). **Tap fills, water spills over**. **Dirty water & full tummy** **make brain lights flicker**. **Remove glue, open tap, clean water** → **lights steady**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Continuous dribbling[/yellow]** — **overflow incontinence**.",
      "- **[purple]PVR 500 mL + cloudy urine + fever[/purple]** — **acute retention with UTI**.",
      "- **[red]Fecal impaction[/red]** — **mechanical & toxic trigger of delirium**.",
      "- **Pattern lock:** **[yellow]Retention + infection + constipation + anticholinergics[/yellow]** → **[green]delirium[/green]**; **drain bladder, clear bowels, stop culprit drugs**.",
    ],
  },
  {
    id: "PD-RET-50025",
    topic:
      "Geriatrics • Advanced Parkinson’s disease — Acute urinary retention & overflow incontinence with anticholinergic / dopaminergic toxicity",
    difficulty: "Medium",
    vignetteTitle: "Why is he suddenly agitated and continuously wet?",
    stem: "A nursing-home resident with advanced Parkinson’s disease and dementia has recently become markedly more agitated. Staff report new behaviors: shouting, rattling the bedrails, and occasionally striking out at nurses. The on-call GP started a nighttime sedative, but there’s been no improvement. He is now continuously wet with urine and, atypically for him, passing frequent small amounts of liquid stool. He is afebrile and other vital signs are normal.",
    options: [
      {
        key: "A",
        text: "Progression of Parkinson’s disease dementia with behavioural and psychological symptoms (BPSD)",
      },
      {
        key: "B",
        text: "Acute urinary retention with overflow incontinence and anticholinergic / dopaminergic toxicity compounded by constipation",
      },
      {
        key: "C",
        text: "Neuroleptic malignant syndrome induced by the recent sedative",
      },
      { key: "D", text: "Infective diarrhoea with associated delirium" },
      {
        key: "E",
        text: "Spinal cord compression causing paraparesis and neurogenic bladder",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Acute urinary retention with overflow incontinence and anticholinergic / dopaminergic toxicity compounded by constipation.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Continuous wetness + frequent small-volume liquid stools** → **classic overflow incontinence** (bladder over-distended) **with bypass fecal leakage** from **impaction**.",
      "- **Advanced PD** → **detrusor under-activity & sphincter bradykinesia** → **chronic retention**; **any anticholinergic or sedative drug** (night-time sedative likely antihistamine or benzodiazepine) **impairs detrusor contraction** & **increases retention**.",
      "- **Agitation & striking out** → **frontal-lobe response to pain/discomfort** (distended bladder, rectum) **+ anticholinergic CNS toxicity**.",
      "- **Afebrile** → **makes acute infection less likely** as sole driver.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bladder tap is stuck** (Parkinson stiff muscles). **Water balloon fills, tiny leaks drip**. **Full balloon + full tummy** **hurt**, so **grandpa shouts & hits**. **Sleepy pills glue the tap tighter**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Pure BPSD:** **[red]does not explain continuous wetting pattern[/red]**; **medical cause (retention) must be excluded first**.",
      "- **C. NMS:** **[red]no fever, rigidity, elevated CK[/red]**; **antipsychotic not yet given**.",
      "- **D. Infective diarrhoea:** **[red]afebrile, no leukocytosis reported[/red]**; **liquid stool is bypass leakage, not infection**.",
      "- **E. Cord compression:** **[red]no limb weakness, sensory level, or trauma history[/red]**; **subacute retention here is functional/pharmacological**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bladder scan / PVR[/blue]** → **> 200–500 mL** → **acute-on-chronic retention**; **digital rectal exam** → **fecal impaction**.",
      "- **Best Test with result:** **[green]Stop offending medications[/green]** (sedative antihistamine, anticholinergic) → **PVR ↓, agitation ↓** within 24–48 h.",
      "- **Additional Tests:** **Urine dipstick & culture** (exclude UTI), **CBC, CRP**, **renal function**, **CK if NMS suspected**.",
      "- **Why each test:** **Exclude infection**, **assess renal impact**, **confirm retention**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Insert urethral catheter[/red]** → **drain bladder fully**, **relieve pain**, **measure exact PVR**; **manual evacuation of fecal impaction**.",
      "- **First Line:** **Review drug list** — **replace sedative with melatonin 2 mg**, **stop any anticholinergic (e.g., diphenhydramine)**, **switch ranitidine to PPI**, **continue donepezil**.",
      "- **Gold Standard:** **Scheduled toileting q2h by day & q4h overnight**, **bedside commode**, **trial void after 48 h**; **if PVR < 100 mL** → **remove catheter**, **start intermittent catheterisation PRN**; **constipation prophylaxis** (macrogol 17 g daily, titrate).",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Parkinson makes bladder muscles slow**. **Water fills, can’t squeeze out**. **Full balloon presses on brain**, **grandpa feels pain & panic**. **Sleepy pills & allergy pills** **glue the squeeze button** → **more filling, more leaking, more shouting**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Continuous wetting + small liquid stools[/yellow]** — **overflow bladder + bypass fecal leakage**.",
      "- **[purple]New agitation, shouting, striking[/purple]** — **frontal response to discomfort & anticholinergic toxicity**.",
      "- **Pattern lock:** **[yellow]Advanced PD + new continuous incontinence + agitation + recent sedative[/yellow]** → **[green]acute retention + anticholinergic toxicity[/green]**; **catheter, evacuate bowels, stop culprit drugs**.",
    ],
  },
  {
    id: "UI-ELDER-50026",
    topic:
      "Geriatrics • Urinary incontinence — Chronic stress / mixed incontinence in hypertensive elderly woman",
    difficulty: "Easy",
    vignetteTitle: "Why does she always smell of urine despite feeling well?",
    stem: "An elderly woman with long-standing hypertension attends clinic for a routine BP review. Her daughter reports a persistent smell of urine at home and on clothing. The patient downplays the issue, appears sensible and oriented. Vitals stable, no fever or dysuria.",
    options: [
      { key: "A", text: "Acute urinary-tract infection with incontinence" },
      { key: "B", text: "Chronic stress or mixed urinary incontinence" },
      { key: "C", text: "Overflow incontinence from urinary retention" },
      { key: "D", text: "Functional incontinence due to cognitive impairment" },
      { key: "E", text: "Fistula-related continuous urinary leakage" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Chronic stress or mixed urinary incontinence.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Persistent smell of urine on clothes/home** → **chronic leakage**, **not acute infection** (no fever, dysuria, urgency, confusion).",
      "- **Patient sensible & oriented** → **rules out acute delirium, severe cognitive or functional incontinence**.",
      "- **Elderly hypertensive woman** → **high prevalence of stress (cough/laugh leak) or mixed (stress + urge) incontinence** due to **weak pelvic floor, detrusor overactivity**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bladder tap leaks a little when she laughs, coughs, or moves**; **drip-drip on clothes** → **persistent pee smell**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Acute UTI:** **[red]no fever, dysuria, urgency, or confusion[/red]**; **smell is chronic**, **not acute malodorous discharge**.",
      "- **C. Overflow retention:** **[red]no suprapubic discomfort, no dribbling description, no history of retention[/red]**; **would expect PVR > 200 mL**.",
      "- **D. Functional incontinence:** **[red]patient is oriented, mobile enough to attend clinic[/red]**; **no cognitive or mobility barrier described**.",
      "- **E. Fistula:** **[red]continuous leakage, previous pelvic surgery/radiation not stated[/red]**; **very rare**, **usually constant severe wetting**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]3-day bladder diary[/blue]** → **shows leakage with cough, sneeze, walking** → **stress component**; **volume small**, **frequency normal** → **mixed pattern**.",
      "- **Best Test with result:** **[green]Pelvic floor examination[/green]** → **weak contraction, **positive cough stress test** → **stress incontinence confirmed**.",
      "- **Additional Tests:** **Urine dipstick** (exclude infection), **PVR bladder scan** (< 100 mL), **UACR** (microalbuminuria in HTN).",
      "- **Why each test:** **Exclude infection/retention**, **confirm type**, **guide therapy**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **Lifestyle** — **weight loss if BMI > 25**, **reduce caffeine**, **timed voiding q2–3h**, **pelvic-floor muscle training (PFMT) 8 contractions × 3/day** (NICE grade A).",
      "- **First Line:** **If mixed symptoms persist** → **offer duloxetine 40 mg bd** (off-label) **or refer for tension-free vaginal tape (TVT)** if **stress predominant & fit for surgery**.",
      "- **Gold Standard:** **Provide absorbent pads** (not a treatment), **review every 6 months**, **ensure adequate fluid intake (1.5 L/day)** to **avoid UTI**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Pelvic hammock muscles are loose**. **When mummy coughs, the tap drips**. **Tightening the hammock** (exercises) **stops the drips**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Persistent urine smell on clothes[/yellow]** — **chronic small-volume leakage**.",
      "- **No systemic illness** — **rules out infection, retention, fistula**.",
      "- **Pattern lock:** **[yellow]Oriented elderly woman + chronic smell + no systemic signs[/yellow]** → **[green]stress / mixed urinary incontinence[/green]**; **start pelvic-floor training & lifestyle**.",
    ],
  },
  {
    id: "UI-MIXED-50027",
    topic:
      "Geriatrics • Urinary incontinence — Mixed (urge-predominant) incontinence in post-menopausal woman",
    difficulty: "Medium",
    vignetteTitle: "Why does she leak as soon as she puts the key in the lock?",
    stem: "A 75-year-old widow presents for post-hospital follow-up after surgical repair of a right shoulder fracture sustained during a nocturnal trip to the bathroom after drinking wine with a friend. PMH: well-controlled HTN (HCTZ 25 mg, atenolol 50 mg), bilateral knee OA, obesity, remote stroke without deficit. Meds: acetaminophen, EC aspirin, multivitamin. Reports years of urinary frequency and nocturia, sudden hard-to-defer urges triggered “as soon as the key goes into the lock,” several episodes of urge incontinence (including during recent hospital stay). Occasional leakage with sneezing/standing/coughing, most often during an urgent episode. Denies dysuria, fever, constipation. Pelvic exam 1 year ago: no prolapse.",
    options: [
      { key: "A", text: "Stress urinary incontinence alone" },
      { key: "B", text: "Mixed urinary incontinence (urge-predominant)" },
      { key: "C", text: "Overflow incontinence from urinary retention" },
      { key: "D", text: "Urinary tract infection with urge incontinence" },
      {
        key: "E",
        text: "Functional incontinence due to obesity and knee pain",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Mixed urinary incontinence (urge-predominant).**",
      "",
      "**2) Why it is the correct answer**",
      "- **Key trigger: “key in the lock”** → **classic sensory urge** (conditioned reflex).",
      "- **Sudden, hard-to-defer urge** with **large-volume leakage** → **urge component dominant**.",
      "- **Leakage with cough/sneeze/standing** **only during urgent episode** → **stress component exists but is secondary** (mixed, urge-predominant).",
      "- **No prolapse, no retention symptoms, no infection signs** → **supports mixed rather than pure stress, overflow, or UTI**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bladder is an impatient toddler**. **As soon as it sees the front door (key in lock)** it **yells “I need to go NOW!”** and **wets the pants**. **Sometimes when mummy coughs while holding the toddler, a few extra drops escape**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Stress alone:** **[red]main leakage occurs with urge, not with cough alone[/red]**; **urge episodes are more frequent & voluminous**.",
      "- **C. Overflow retention:** **[red]no dribbling, no hesitancy, no poor stream[/red]**; **PVR not mentioned**, **no HCTZ-induced retention story**.",
      "- **D. UTI:** **[red]no dysuria, fever, or acute change[/red]**; **symptoms chronic for years**.",
      "- **E. Functional only:** **[red]can reach toilet but leaks on the way due to urgency[/red]**; **obesity/knee pain delay, not prevent, arrival**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]3-day bladder diary[/blue]** → **large-volume leaks preceded by strong urge**, **small leaks only during urgent hold** → **urge > stress**.",
      "- **Best Test with result:** **[green]Pelvic floor / cough stress test[/green]** → **leak only during full bladder with urge**, **not with empty bladder cough** → **mixed, urge-predominant**.",
      "- **Additional Tests:** **Urine dipstick** (exclude infection), **PVR bladder scan** (< 100 mL), **UACR** (micro-albumin in HTN).",
      "- **Why each test:** **Confirm type**, **rule out infection/retention**, **guide therapy**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **Lifestyle** — **weight loss (5–10 % if BMI > 30)**, **reduce caffeine/alcohol**, **timed voiding q2h**, **pelvic-floor muscle training (PFMT) 8 contractions × 3/day**.",
      "- **First Line:** **Bladder retraining** — **delay void 5–10 min after urge**, **gradually increase interval**; **if insufficient** → **offer antimuscarinic** (e.g., **oxybutynin 2.5 mg bd** or **solifenacin 5 mg daily**) **provided PVR < 150 mL**.",
      "- **Gold Standard:** **Review after 4–6 weeks**; **if stress component bothersome** → **consider duloxetine 40 mg bd** or **refer for mid-urethral sling** if **fit for surgery**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Bladder muscle becomes twitchy** after **menopause** (no estrogen). **Twitchy muscle jumps at any signal** (key, cold, cough). **Training the muscle + calming pills** **reduces the jumps**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]“Key in the lock” urge[/yellow]** — **sensory reflex incontinence**.",
      "- **Leakage during cough only while holding urgent bladder** — **mixed pattern, urge dominant**.",
      "- **Nocturia & hospital incontinence** — **urge component exacerbated by cold, diuretic, unfamiliar environment**.",
      "- **Pattern lock:** **[yellow]Chronic urgency + situational stress leaks + no infection/prolapse[/yellow]** → **[green]mixed urinary incontinence, urge-predominant[/green]**; **bladder training + PFMT ± antimuscarinic**.",
    ],
  },
  {
    id: "UI-OVER-50028",
    topic:
      "Geriatrics • Urinary incontinence — Chronic overflow incontinence due to benign prostatic obstruction",
    difficulty: "Medium",
    vignetteTitle: "Why is he “almost always wet” without any warning?",
    stem: "An 85-year-old man with long-standing benign prostatic hyperplasia (no prior prostate cancer or procedures) presents with chronic urinary incontinence. He reports being “almost always wet” without any warning urge. When he attempts to void, he has difficulty initiating the stream and notes post-void dribbling. He denies dysuria or fever. On exam, the lower abdomen is mildly distended and nontender; prostate is enlarged and smooth on digital rectal exam.",
    options: [
      { key: "A", text: "Urge urinary incontinence from overactive bladder" },
      {
        key: "B",
        text: "Overflow incontinence secondary to benign prostatic obstruction",
      },
      {
        key: "C",
        text: "Stress urinary incontinence due to sphincter weakness",
      },
      {
        key: "D",
        text: "Continuous incontinence from a vesicovaginal fistula",
      },
      { key: "E", text: "Functional incontinence due to severe arthritis" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Overflow incontinence secondary to benign prostatic obstruction.**",
      "",
      "**2) Why it is the correct answer**",
      "- **“Almost always wet” without warning urge** → **continuous overflow** from **chronic over-distension**.",
      "- **Difficulty initiating stream + post-void dribbling** → **typical obstructive voiding symptoms**.",
      "- **Large, smooth prostate + non-tender distended lower abdomen** → **benign prostatic obstruction** causing **high post-void residuals (PVR)**.",
      "- **No dysuria/fever** → **makes acute infection unlikely as primary cause**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Bladder is a water balloon** with **a kinked hose (enlarged prostate)**. **Water can’t get out**, **balloon over-fills**, **tiny drips leak around the blockage** — **always wet**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Urge incontinence:** **[red]would have sudden strong urges[/red]**; **patient has NO warning**.",
      "- **C. Stress incontinence:** **[red]no cough/sneeze leakage history[/red]**; **continuous wetting incompatible with pure stress**.",
      "- **D. Vesicovaginal fistula:** **[red]male patient[/red]**, **no history of pelvic surgery/radiation**, **continuous leakage is overflow, not fistula**.",
      "- **E. Functional incontinence:** **[red]can reach toilet but obstructed when he tries[/red]**; **problem is outlet, not mobility**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bladder scan / PVR[/blue]** → **> 200–500 mL** → **confirm retention**.",
      "- **Best Test with result:** **[green]Uroflowmetry + post-void ultrasound[/green]** → **low peak flow, high residual** → **obstruction pattern**.",
      "- **Additional Tests:** **Urine dipstick & culture** (exclude infection), **PSA**, **renal function**, **UACR**.",
      "- **Why each test:** **Exclude infection/cancer**, **assess renal impact**, **guide therapy**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Insert urethral catheter[/red]** → **drain bladder**, **relieve discomfort**, **measure exact PVR**; **start α-blocker** (tamsulosin 0.4 mg nocte).",
      "- **First Line:** **5-α-reductase inhibitor** (finasteride 5 mg daily) **if prostate > 40 mL**, **arrange urology referral** for **trans-urethral resection of prostate (TURP)** evaluation.",
      "- **Gold Standard:** **Trial void after 1–2 weeks α-blocker**; **if PVR remains > 300 mL or symptoms recur** → **offer surgery**; **teach intermittent self-catheterisation** if **unfit for surgery**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Enlarged prostate squeezes the water pipe**. **Balloon stretches**, **muscles tire**, **tap drips continuously**. **Open the pipe** (surgery or pills) → **tap stops dripping**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Continuous wetness without urge[/yellow]** — **overflow pattern**.",
      "- **[purple]Poor stream, hesitancy, dribbling[/purple]** — **obstructive voiding**.",
      "- **Pattern lock:** **[yellow]Elderly man + enlarged prostate + continuous leakage + high PVR[/yellow]** → **[green]overflow incontinence from BPH[/green]**; **drain bladder, start α-blocker, consider surgery**.",
    ],
  },
  {
    id: "UI-STRESS-50029",
    topic: "Geriatrics • Urinary incontinence — Pure stress incontinence",
    difficulty: "Easy",
    vignetteTitle:
      "Why does she leak when she coughs, sneezes, or lifts groceries?",
    stem: "A 70-year-old woman with congestive heart failure and type 2 diabetes presents for evaluation of frequent urinary leakage. She reports small to moderate episodes that occur “without warning” when she coughs, sneezes, laughs, or lifts grocery bags. There is no dysuria, urgency, or nocturnal enuresis. She voids normal volumes between episodes. Vitals are stable. Abdomen is soft, nontender. Pelvic exam shows no masses; with a cough, a brief spurt of urine is observed. Urinalysis is negative; postvoid residual is low.",
    options: [
      { key: "A", text: "Stress urinary incontinence" },
      { key: "B", text: "Urge urinary incontinence" },
      { key: "C", text: "Mixed urinary incontinence" },
      { key: "D", text: "Overflow incontinence" },
      { key: "E", text: "Functional incontinence" },
    ],
    correct: "A",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **A. Stress urinary incontinence.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Leakage occurs ONLY with cough, sneeze, laugh, lifting** → **clear stress trigger**.",
      "- **No urgency, no nocturnal enuresis, normal volumes between episodes** → **no urge component**.",
      "- **Positive cough stress test (brief spurt)** + **low PVR** → **anatomical weakness of urethral support**.",
      "",
      "**3) Explain like I’m a child**",
      "- **When mummy coughs, the tummy pushes on the bladder**, but **the gate (urethra) is loose**, so **a little water squirts out**.",
      "",
      "**4) Why the other options are wrong**",
      "- **B. Urge incontinence:** **[red]no sudden urge, no frequency, no nocturia[/red]**; **leakage is purely mechanical**.",
      "- **C. Mixed incontinence:** **[red]no urge symptoms at all[/red]**; **pure stress pattern here**.",
      "- **D. Overflow incontinence:** **[red]no dribbling, no poor stream, PVR low[/red]**; **normal voids between episodes**.",
      "- **E. Functional incontinence:** **[red]no mobility or cognitive barrier described[/red]**; **she reaches toilet normally between episodes**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Cough stress test[/blue]** → **visible leak with cough** → **positive**.",
      "- **Best Test with result:** **[green]Low PVR (< 100 mL)[/green]** → **excludes retention**; **urinalysis negative** → **excludes infection**.",
      "- **Additional Tests:** **Urine culture** if **dipstick positive**, **UACR** (diabetes), **pelvic floor strength assessment**.",
      "- **Why each test:** **Confirm pure stress pattern**, **rule out reversible causes**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **Lifestyle** — **weight loss if BMI > 30**, **stop smoking**, **PFMT 8 contractions × 3/day** (grade A evidence).",
      "- **First Line:** **If bothersome after 3 months PFMT** → **offer mid-urethral sling** (TVT) **or duloxetine 40 mg bd** if **surgery declined**.",
      "- **Gold Standard:** **Continence nurse follow-up**, **pad usage for social events**, **review every 6 months**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Pelvic floor muscles are like a hammock**. **After babies/menopause the hammock sags**. **When tummy pushes (cough)**, **bladder neck drops**, **hammock can’t squeeze shut**, **pee escapes**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Leak only with cough, sneeze, laugh, lifting[/yellow]** — **pure stress trigger**.",
      "- **[purple]Brief spurt on cough test[/purple]** — **anatomical stress incontinence**.",
      "- **Normal voids between episodes** — **no retention or over-activity**.",
      "- **Pattern lock:** **[yellow]Mechanical leakage + positive cough test + no urge[/yellow]** → **[green]stress urinary incontinence[/green]**; **PFMT ± sling / duloxetine**.",
    ],
  },
  {
    id: "UI-FUNC-50030",
    topic:
      "Geriatrics • Urinary incontinence — Functional incontinence in advanced dementia",
    difficulty: "Easy",
    vignetteTitle:
      "Why are his diapers always wet despite a normal bladder scan?",
    stem: "A 78-year-old man with advanced Alzheimer’s disease resides in a nursing home. He is otherwise medically stable and participates in group activities. Nursing staff report chronic urinary incontinence since admission, with diapers consistently wet and progressive perineal skin breakdown despite routine changes. There is no dysuria, fever, or hematuria reported. Medications are unchanged; vitals are stable; abdominal exam is soft and nontender; postvoid residual (when checked previously) was low.",
    options: [
      { key: "A", text: "Overflow incontinence from urinary retention" },
      {
        key: "B",
        text: "Functional urinary incontinence secondary to advanced dementia",
      },
      { key: "C", text: "Stress urinary incontinence" },
      { key: "D", text: "Urge urinary incontinence from overactive bladder" },
      {
        key: "E",
        text: "Continuous incontinence from a vesicovaginal fistula",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Functional urinary incontinence secondary to advanced dementia.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Advanced Alzheimer’s disease** → **cannot recognise urge, locate toilet, or communicate need** → **incontinence despite normal bladder function**.",
      "- **Low PVR previously** → **rules out retention/overflow**.",
      "- **No dysuria/fever/hematuria** → **no infection, no painful urge** → **excludes UTI, pure urge, or stress incontinence as primary cause**.",
      "- **Consistently wet diapers** → **loss of toileting ability** (functional) rather than **bladder pathology**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Grandpa’s bladder works fine**, but **his brain forgot where the bathroom is** and **what the “need to go” feeling means** → **pees wherever**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Overflow retention:** **[red]PVR was low[/red]**; **would expect dribbling, distended bladder, high residuals**.",
      "- **C. Stress incontinence:** **[red]no cough/sneeze leakage story[/red]**; **incontinence is continuous, not effort-related**.",
      "- **D. Urge incontinence:** **[red]no reports of sudden urges or frequency[/red]**; **brain cannot process urge** → **functional, not detrusor over-activity**.",
      "- **E. Vesicovaginal fistula:** **[red]male patient[/red]**, **no pelvic surgery/radiation**, **continuous leakage here is functional**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bladder scan / PVR[/blue]** → **< 50 mL** → **normal emptying** → **functional cause**.",
      "- **Best Test with result:** **[green]Direct observation[/green]** → **patient voids normally when prompted** but **wets between times** → **toileting disability**.",
      "- **Additional Tests:** **Urinalysis** (exclude infection), **CBC** (exclude anaemia), **renal function**.",
      "- **Why each test:** **Exclude reversible causes**, **confirm functional diagnosis**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[green]Scheduled toileting q2h by day & q4h overnight[/green]**, **prompted voiding**, **bedside commode**, **easy-off clothing**, **good lighting/signage**.",
      "- **First Line:** **Absorbent products** (not treatment), **skin barrier cream**, **review diuretic timing** (morning only), **ensure 1.5 L fluid/day** to **↓ UTI risk**.",
      "- **Gold Standard:** **Behavioural programme** (toileting assistance, positive reinforcement), **continence nurse review**, **family education**, **consider indwelling catheter only if skin breakdown severe & refractory**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Bladder phone works**, but **the brain operator is asleep**. **No call is made**, so **the bathroom is missed** → **wet pants**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Continuous wetness since admission[/yellow]** — **loss of toileting ability**.",
      "- **[purple]Low PVR, no infection, no pain[/purple]** — **bladder function normal**.",
      "- **Pattern lock:** **[yellow]Advanced dementia + continuous wetting + normal PVR[/yellow]** → **[green]functional urinary incontinence[/green]**; **scheduled toileting & skin care mainstay**.",
    ],
  },
  {
    id: "RET-DRUG-50031",
    topic:
      "Geriatrics • Iatrogenic urinary retention — Diphenhydramine-induced acute retention in heart-failure patient",
    difficulty: "Medium",
    vignetteTitle: "Why can’t he urinate 8 hours after normal intake?",
    stem: "An 84-year-old retired professor is admitted to CCU with AF (VR 150/min) and congestive heart failure. Long-standing constipation treated with senna; current inpatient meds: enalapril, furosemide, diltiazem, morphine, docusate, high-fiber supplements, and—started hospital day 2—diphenhydramine at night for insomnia. No prior urinary complaints. By hospital day 3, cardiopulmonary status improved, but he reports inability to urinate; nursing notes confirm no urine output for ≥8 hours despite normal oral intake. He is uncomfortable and suprapubically full; Foley catheter drains 550 mL of clear urine.",
    options: [
      { key: "A", text: "Acute prostatitis" },
      {
        key: "B",
        text: "Acute urinary retention due to diphenhydramine-induced anticholinergic bladder dysfunction",
      },
      { key: "C", text: "Furosemide-resistant oliguric heart failure" },
      { key: "D", text: "Spinal cord compression from occult malignancy" },
      { key: "E", text: "Bilateral ureteric obstruction from nephrolithiasis" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Acute urinary retention due to diphenhydramine-induced anticholinergic bladder dysfunction.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Temporal link**: **retention starts within 24 h of starting diphenhydramine** → **classic anticholinergic side-effect**.",
      "- **Anticholinergic mechanism**: **blocks M3 receptors on detrusor muscle** → **impaired contraction + increased sphincter tone** → **acute retention**.",
      "- **550 mL clear urine on catheter** → **confirms retention**, **rules out oliguric renal failure**.",
      "- **No fever/dysuria, prostate not described as tender** → **makes acute prostatitis unlikely**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Sleepy pill (diphenhydramine) glues the bladder squeeze button**. **Bladder fills but can’t push**, **tap stays shut** → **water balloon over-fills**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Acute prostatitis:** **[red]no fever, dysuria, or tender prostate on DRE[/red]**; **retention sudden after new drug**.",
      "- **C. Furosemide-resistant heart failure:** **[red]550 mL urine drained[/red]** → **bladder full, not oliguria**; **patient improving clinically**.",
      "- **D. Cord compression:** **[red]no limb weakness, sensory level, or back pain[/red]**; **onset coincides with drug**.",
      "- **E. Bilateral stones:** **[red]no haematuria, no colic, normal creatinine[/red]**; **ultrasound would show hydronephrosis** — **not indicated here**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bladder scan / PVR[/blue]** → **> 500 mL** → **acute retention**; **diphenhydramine listed on drug chart** → **probable culprit**.",
      "- **Best Test with result:** **[green]Stop diphenhydramine[/green]** → **trial void after 24 h**; **if PVR < 100 mL** → **diagnosis confirmed**.",
      "- **Additional Tests:** **Urine dipstick & culture** (exclude infection), **renal function & electrolytes**, **prostate exam** if **retention recurs**.",
      "- **Why each test:** **Exclude infection, confirm reversible drug cause**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Stop diphenhydramine immediately[/red]**, **insert urethral catheter** → **drain 550 mL**, **relieve pain**, **monitor output**.",
      "- **First Line:** **Alternative sleep aid** — **melatonin 2 mg**, **non-pharmacological sleep hygiene**; **continue furosemide morning-only** (↓ nocturia), **morphine dose review** (also constipating/retaining).",
      "- **Gold Standard:** **Trial void after 24–48 h**; **if successful & PVR < 100 mL** → **remove catheter**; **if recurrence** → **urology consult for prostate evaluation & possible TURP**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Bladder muscle has a squeeze button (M3 receptor)**. **Diphenhydramine sticks gum on the button** → **no squeeze**, **tap stays shut**. **Remove the gum** → **button works again**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Sudden anuria ≥ 8 h[/yellow]** — **acute retention**.",
      "- **[purple]Suprapubic discomfort + 550 mL on catheter[/purple]** — **classic overflow**.",
      "- **Pattern lock:** **[yellow]New anticholinergic drug + acute retention[/yellow]** → **[green]drug-induced urinary retention[/green]**; **stop drug, catheter, trial void**.",
    ],
  },
  {
    id: "COPD-CHF-50033",
    topic:
      "Geriatrics • Acute decompensated heart failure masquerading as COPD exacerbation",
    difficulty: "Medium",
    vignetteTitle:
      "Why did she suddenly deteriorate after initial improvement?",
    stem: "An 85-year-old woman with HTN, DM2, COPD-bronchiectasis, osteoporosis, OA presents with 1-week worsening cough/dyspnea. Former heavy smoker (quit 20 yrs). Home meds: ICS/LABA, lisinopril, rosiglitazone, Ca/Vit D, acetaminophen. Lives alone with 8-h/day aide. ED: BP 170/90, HR 88, RR 28, afebrile; lungs: baseline basilar crackles, diffuse rhonchi/wheezes; no edema. ECG LVH. CXR: poor inspiration, ↑ vascular markings, retrocardiac infiltrate. Admitted: IV methylprednisolone, antibiotics, nebulised bronchodilators → initial improvement. Next morning: sitting bolt upright, tachypneic, loud expiratory wheezes audible; repeat CXR: small bilateral pleural effusions + pulmonary vascular congestion in addition to retrocardiac infiltrate.",
    options: [
      { key: "A", text: "Acute COPD exacerbation with dynamic hyperinflation" },
      {
        key: "B",
        text: "Acute decompensated heart failure with pulmonary edema",
      },
      { key: "C", text: "Hospital-acquired pneumonia" },
      { key: "D", text: "Bilateral pneumothorax" },
      { key: "E", text: "Pulmonary embolism" },
    ],
    correct: "B",
    explanation_detail: [
      "**1) Correct Answer**",
      "✅ **B. Acute decompensated heart failure with pulmonary edema.**",
      "",
      "**2) Why it is the correct answer**",
      "- **Sudden deterioration**: **sitting bolt upright, tachypneic, loud wheezes audible without stethoscope** → **acute pulmonary edema (“cardiac asthma”)**.",
      "- **New CXR findings**: **small bilateral pleural effusions + pulmonary vascular congestion** → **classical HF signs**; **retained infiltrate = baseline bronchiectasis**.",
      "- **Precipitants present**: **IV methylprednisolone + rosiglitazone** → **salt & water retention**; **overnight supine position** → **reduced venous return compensation**.",
      "",
      "**3) Explain like I’m a child**",
      "- **Heart pump got lazy** from **too much water (steroids + sugar pill)**. **Water fills the lungs overnight**, **patient drowns while sitting up**, **wheezes like an accordion**.",
      "",
      "**4) Why the other options are wrong**",
      "- **A. Dynamic hyperinflation:** **[red]CXR shows vascular congestion & effusions, not hyperinflation[/red]**; **sudden orthopnea is typical of HF, not COPD**.",
      "- **C. Hospital-acquired pneumonia:** **[red]afebrile, no new focal consolidation, no leukocytosis mentioned[/red]**; **effusions are transudative (HF)**.",
      "- **D. Bilateral pneumothorax:** **[red]no sudden sharp pain, no tracheal deviation, no absent breath sounds[/red]**; **CXR shows effusions, not pneumothorax**.",
      "- **E. Pulmonary embolism:** **[red]no pleuritic pain, no haemoptysis, no RV strain on ECG[/red]**; **bilateral effusions + congestion point to HF**.",
      "",
      "**5) Diagnostic Steps in order**",
      "- **Initial Test with result:** **[blue]Bedside lung ultrasound[/blue]** → **B-lines bilateral, effusions** → **cardiogenic pulmonary oedema**; **BNP/NT-proBNP** → **> 100 pg/mL (likely > 400)**.",
      "- **Best Test with result:** **[green]Echo[/green]** → **LVEF unchanged vs baseline**, **diastolic dysfunction**, **moderate MR**, **raised LV filling pressures** → **HF with preserved EF (HFpEF)**.",
      "- **Additional Tests:** **U&Es, glucose** (rosiglitazone), **ABG if SpO₂ < 94 %**, **sputum culture** only if **purulent**.",
      "- **Why each test:** **Confirm HF, guide diuresis, exclude infection**.",
      "",
      "**6) Management / Treatment**",
      "- **Initial Management:** **[red]Sit patient upright, high-flow O₂[/red]** (target SpO₂ 94–98 %), **IV furosemide 40 mg bolus**, **GTN spray 2 puffs SL** (if SBP > 100 mmHg) **→ ↓ preload**.",
      "- **First Line:** **Switch rosiglitazone to** **metformin/SGLT-2 inhibitor** (if eGFR ≥ 30) **to ↓ fluid retention**, **daily weights**, **strict fluid balance**, **restrict Na < 2 g**.",
      "- **Gold Standard:** **Continue HF meds** (lisinopril titrated to max tolerated, add MRA if EF < 40 % or HFpEF with fibrosis), **wean steroids rapidly**, **refer to HF nurse specialist & dietitian**.",
      "",
      "**7) Full Pathophysiology explained like a child**",
      "- **Steroids & sugar pill (rosi) pour extra water into the blood**. **Heart pump is stiff & old**, **can’t push water uphill**. **Water spills into lung sponges** → **sudden drowning breath**.",
      "",
      "**8) Symptoms**",
      "- **[yellow]Sitting bolt upright, audible wheezes[/yellow]** — **acute pulmonary oedema (“cardiac asthma”)**.",
      "- **[purple]New bilateral effusions + vascular congestion on CXR[/purple]** — **acute decompensated HF**.",
      "- **Pattern lock:** **[yellow]COPD patient + steroids/rosi + sudden orthopnea + effusions[/yellow]** → **[green]acute HF exacerbation[/green]**; **urgent diuresis, stop fluid-retaining drugs**.",
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
          Results — Geriatrics OSCE
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
            <p className="text-slate-600">Clean sweep — nice work 🎯</p>
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
            to="/nvu/geriatrics"
            className="rounded-xl border px-4 py-2 hover:bg-slate-50"
          >
            ← Back to NVU • Geriatrics
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ================================ Page ================================ */
export default function GeriatricsOSCE() {
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
    setShowResults(true);
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
      title="Start Geriatrics OSCE Bank"
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
