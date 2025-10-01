// src/pages/diseases/geriatrics/FrontotemporalDementia.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

/** Inline-color RichText renderer (no Tailwind purge issues) */
function RichText({ text = "" }) {
  let html = String(text);

  // minimal escape so raw < > & don’t break things, but keep our tags
  html = html
    .replace(/&(?![a-zA-Z#0-9]+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // *italic* (single *)
  html = html.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  // _italic_
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // ==highlight== → yellow
  html = html.replace(
    /==(.+?)==/g,
    "<mark style='background-color:#FEF3C7' class='px-1 rounded'>$1</mark>"
  );

  // colored chips via [color]...[/color]
  const colorHex = {
    yellow: "#FEF3C7",
    green: "#D1FAE5",
    blue: "#E0F2FE",
    red: "#FFE4E6",
    purple: "#EDE9FE",
  };

  Object.entries(colorHex).forEach(([name, bg]) => {
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

/* ------------------------ Question Data ------------------------ */
const QUESTIONS = [
  {
    id: "FTD-SX-7001",
    topic:
      "Geriatrics • Frontotemporal Dementia — Clinical Presentation (Symptoms)",
    difficulty: "Medium",
    vignetteTitle: "Spot the semantic-variant PPA pattern",
    stem: "A 65-year-old librarian has 2 years of progressively 'vague' speech. She talks fluently but struggles to name familiar objects and often uses broad terms like “animal” or “tool.” She cannot match single words to pictures on testing. Repetition and grammar are intact. MRI later shows left-predominant anterior temporal atrophy. Which clinical constellation best identifies the underlying PPA subtype?",
    options: [
      {
        key: "A",
        text: "Effortful, halting speech with agrammatism and apraxia of speech; impaired repetition",
      },
      {
        key: "B",
        text: "Fluent speech with severe anomia and loss of single-word comprehension; preserved grammar and repetition",
      },
      {
        key: "C",
        text: "Word-finding pauses with impaired sentence repetition; phonologic errors; temporoparietal atrophy",
      },
      {
        key: "D",
        text: "Acute onset jargon aphasia with poor comprehension and poor repetition following a stroke",
      },
      {
        key: "E",
        text: "Nonfluent speech with preserved comprehension but severe repetition deficit from arcuate fasciculus damage",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Fluent but empty speech** with severe **anomia** and **loss of single-word comprehension** is the hallmark of **semantic-variant PPA (svPPA)**.",
      "- **Grammar and repetition preserved** separates svPPA from nonfluent/agrammatic and logopenic variants.",
      "- Day-to-day clue: patients swap specific nouns for **broad category labels** due to semantic store failure.",
      "- Clinicoradiologic tie-in: [blue]left anterior temporal lobe atrophy[/blue] tracks with semantic impairment.",
      "- [yellow]Pattern recognition:[/yellow] fluent speech + empty content + anomia + word-meaning loss + preserved repetition → **svPPA** 🧠📖",
      "**2️⃣ Why the other options are wrong**",
      "- **A (nfvPPA):** Effortful, halting, agrammatic speech with apraxia; grammar broken and often impaired repetition; not fluent or semantic-dominant.",
      "- **C (lvPPA):** Word-finding pauses and **impaired repetition** from phonologic-loop failure; semantics less affected early; often Alzheimer-related.",
      "- **D (Wernicke stroke):** **Acute** onset with poor comprehension and poor repetition; neurodegenerative svPPA is **insidious** and repetition is spared.",
      "- **E (Conduction aphasia):** Repetition is the main casualty from arcuate fasciculus damage; svPPA keeps repetition intact while semantics fail.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language screen (naming, single-word comprehension, repetition, grammar). Confirms? ❌ Suggests svPPA if semantics fail with preserved repetition/grammar.",
      "- **Next Diagnostic step:** Formal neuropsychology (word–picture matching, semantic association, irregular word reading). Confirms? ➕ Strengthens diagnosis; excludes phonologic or syntactic primaries.",
      "- **Best Diagnostic Step:** MRI brain (volumetric preferred). Results: [blue]left > right anterior temporal atrophy[/blue] with relative parietal sparing. Confirms? ✅ Clinicoradiologic signature for svPPA.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, and communication aids[/green] (semantic feature analysis, visual supports); caregiver training and safety review.",
      "- **First Line:** [green]Speech–language therapy[/green] with compensatory strategies; environmental modifications; multidisciplinary team support; SSRIs for behavioral symptoms if needed.",
      "- **Gold Standard:** No disease-modifying therapy; [green]sustained person-centred, team-based care[/green] with periodic re-goaling, caregiver respite, community resources; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- svPPA reflects degeneration of the **anterior temporal semantic hub**, most often from [blue]TDP-43 type C[/blue] proteinopathy.",
      "- Disrupted RNA handling and network failure cause **loss of concept knowledge** while leaving phonology/syntax relatively intact early.",
      "- Hence **fluent output** with **low informational content** and **single-word comprehension failure**.",
      "**6️⃣ Symptoms — Clinical Presentation map**",
      "- **Fluent but empty speech** 🗣️ → semantic store failure yields low-information sentences.",
      "- **Anomia (naming difficulty)** 🔎 → broken concept–label links in anterior temporal cortex.",
      "- **Loss of single-word comprehension** 🧠 → inability to map words to meanings (fails word–picture matching).",
      "- **Surface dyslexia/dysgraphia** ✍️ → reliance on letter–sound rules when irregular-word semantics are lost (e.g., ‘yacht’).",
      "- **Preserved grammar and repetition** 🔁 → phonologic/syntactic circuitry spared early.",
      "- [purple]Think svPPA when you see:[/purple] ==fluent speech + empty content + severe anomia + impaired single-word comprehension + left ATL atrophy== 🚨",
    ],
  },
  {
    id: "FTD-SIGNS-8001",
    topic:
      "Geriatrics • Frontotemporal Dementia — Signs (Examination Findings)",
    difficulty: "Medium",
    vignetteTitle: "What bedside signs point to semantic-variant PPA?",
    stem: "A 66-year-old former journalist has 2 years of progressive word-meaning loss. On exam, conversation is fluent but content-light. He cannot name pictured objects and fails word–picture matching, yet repeats long sentences perfectly and follows multi-step commands. Reading aloud is smooth, but he misreads irregular words (‘yacht’ as ‘yatched’). Neurologic exam is otherwise nonfocal. Which **set of examination signs** best localizes the PPA subtype?",
    options: [
      {
        key: "A",
        text: "Effortful, halting speech; agrammatism; apraxia of speech; impaired sentence repetition; right–left limb apraxia",
      },
      {
        key: "B",
        text: "Fluent but empty speech; severe anomia; impaired single-word comprehension and word–picture matching; preserved grammar and repetition; surface dyslexia",
      },
      {
        key: "C",
        text: "Frequent word-finding pauses; phonologic paraphasias; markedly impaired sentence repetition; ideomotor apraxia",
      },
      {
        key: "D",
        text: "Acute jargon aphasia with poor comprehension and poor repetition; homonymous superior quadrantanopia",
      },
      {
        key: "E",
        text: "Prominent visuospatial neglect; constructional apraxia; dressing apraxia; intact naming and repetition",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **svPPA bedside signature**: **fluent but empty speech**, **severe anomia**, **loss of single-word comprehension**, **preserved grammar and repetition**.",
      "- **Word–picture matching errors** reflect breakdown of the **semantic store** rather than attention or phonology.",
      "- **Surface dyslexia/dysgraphia** (irregular word errors) arises when semantic knowledge guiding exception words is lost.",
      "- Neuro exam is often **nonfocal early**; behavior may be subtle unless right ATL is involved (prosopagnosia, socioemotional semantics).",
      "- [yellow]Pattern lock-in:[/yellow] fluent + empty content + anomia + impaired word meaning + intact repetition ⇒ **semantic-variant PPA**. 🧠📖",
      "**2️⃣ Why the other options are wrong**",
      "- **A (nfvPPA):** Non-fluent, effortful, **agrammatic** output ± **apraxia of speech** with **impaired repetition**—opposite of fluent/grammatically intact svPPA.",
      "- **C (lvPPA):** **Phonologic** deficits with **impaired sentence repetition** and word-finding pauses; semantics relatively spared early; often AD-related.",
      "- **D (Wernicke stroke):** **Acute** onset with poor comprehension **and** poor repetition plus visual field signs—neurodegenerative svPPA is **insidious** and repetition is preserved.",
      "- **E (parietal/visuospatial syndrome):** Neglect and constructional apraxia imply **right parietal** pathology; naming/comprehension typically not the primary deficit.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language exam (naming, single-word comprehension, word–picture matching, sentence repetition, grammar). **Confirms?** ❌ Suggests svPPA if semantics fail with preserved repetition/grammar.",
      "- **Next Diagnostic step:** Formal neuropsychology (semantic association, category fluency ↓ with letter fluency relatively spared, irregular word reading). **Confirms?** ➕ Strengthens svPPA pattern; excludes phonologic/syntactic primaries.",
      "- **Best Diagnostic Step:** MRI brain (volumetric preferred) → [blue]**left > right anterior temporal lobe atrophy**[/blue] with relative parietal sparing. **Confirms?** ✅ Clinicoradiologic signature with the bedside signs.",
      "- **Adjuncts:** FDG-PET (anterior temporal hypometabolism); CSF AD biomarkers (non-AD pattern); genetics if young/familial (GRN/MAPT/C9orf72 though svPPA often sporadic).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, and communication aids[/green] (semantic feature analysis, visual supports); caregiver training; safety/advance planning.",
      "- **First Line:** [green]Speech–language therapy[/green] with compensatory strategies; environmental modifications; [green]multidisciplinary care[/green] (neurology, SLT, OT, social work); **SSRIs** if behavioral symptoms emerge.",
      "- **Gold Standard:** No disease-modifying therapy; [green]sustained person-centred team care[/green] with periodic re-goaling, caregiver respite, community resources; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- Degeneration of the **anterior temporal semantic hub** (often [blue]TDP-43 type C[/blue]) disrupts concept knowledge and word–meaning links.",
      "- **Phonology and syntax** (dorsal/fronto-insular circuits) are relatively spared early → fluent output with **low informational content**.",
      "- Loss of semantic mediation yields **surface dyslexia/dysgraphia** and failures on **word–picture matching**.",
      "- Right ATL involvement adds **prosopagnosia** and socioemotional semantic deficits.",
      "**6️⃣ Signs — Examination Findings map**",
      "- **Fluent but empty speech** 🗣️ → semantic content loss, motor speech intact.",
      "- **Severe anomia** 🔎 → broken concept–label links in ATL.",
      "- **Impaired single-word comprehension & word–picture matching** 🧠 → semantic hub failure.",
      "- **Surface dyslexia/dysgraphia** ✍️ → irregular word errors (e.g., ‘pint’, ‘yacht’).",
      "- **Preserved grammar & sentence repetition** 🔁 → phonologic/syntactic circuitry spared early.",
      "- [purple]Think svPPA when the exam shows:[/purple] ==fluent speech + empty content + anomia + impaired word meaning + intact repetition== 🚨",
    ],
  },
  {
    id: "FTD-REDFLAGS-9001",
    topic: "Geriatrics • Frontotemporal Dementia — Red Flags",
    difficulty: "Medium",
    vignetteTitle: "When svPPA isn’t svPPA: spot the red flags",
    stem: "A 63-year-old teacher is referred with suspected semantic-variant PPA after 3 months of worsening word-finding. Today her partner reports new daily headaches, a witnessed focal seizure last week, and a low-grade fever. Exam shows mild naming difficulty but also papilledema. Which feature(s) most strongly indicate a RED FLAG requiring urgent re-evaluation rather than typical degenerative svPPA?",
    options: [
      {
        key: "A",
        text: "Gradual 2–3 year history of semantic loss with preserved repetition and left anterior temporal atrophy",
      },
      {
        key: "B",
        text: "Early behavioral apathy without psychosis in a 58-year-old with normal basic labs",
      },
      {
        key: "C",
        text: "Subacute (weeks–months) decline with new headache, fever, and a seizure",
      },
      {
        key: "D",
        text: "Progressive anomia over 18 months with impaired word–picture matching, normal neuro exam",
      },
      {
        key: "E",
        text: "Family history of late-onset dementia in one second-degree relative",
      },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Subacute time course (weeks–months)** + **systemic/meningoencephalitic features** (fever, headache) + **seizure** = [red]red flag[/red] for **non-degenerative** causes (e.g., autoimmune/viral encephalitis, neoplasm, abscess, vasculitis).",
      "- Degenerative svPPA typically evolves **insidiously over years**, without constitutional symptoms or early seizures.",
      "- **Papilledema** suggests raised intracranial pressure → urgent neuroimaging and infectious/inflammatory workup, not a routine dementia pathway.",
      "- [yellow]Exam pearl:[/yellow] Any **rapid progression**, **focal neuro signs**, **systemic illness**, or **seizures** should pivot you to an **acute neurology/infectious** algorithm.",
      "- Prioritizing safety prevents missing treatable, life-threatening etiologies. 🚨",
      "**2️⃣ Why the other options are wrong**",
      "- **A:** Classic **svPPA** pattern (years-long semantic decline, preserved repetition, L > R anterior temporal atrophy) → *not* a red flag.",
      "- **B:** Early apathy can occur in FTD spectrum; without psychosis, fever, seizures, or focal deficits, this isn’t an urgent red flag.",
      "- **D:** Progressive semantic profile over 18 months with normal neuro exam fits degenerative svPPA; still important, but not urgent.",
      "- **E:** A single second-degree relative with late-onset dementia is common and **low pretest significance**; no acute concern signaled.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** [red]Stabilize and screen for emergencies[/red] → vitals, glucose, neuro check, **urgent non-contrast CT head** if raised ICP suspected. **Confirms?** ❌ Safety first; rules out bleed/mass.",
      "- **Next Diagnostic step:** **MRI brain with contrast + MRV** (if venous thrombosis possible). Results guide mass/encephalitis/venous causes. **Confirms?** ➕ Suggests specific non-degenerative etiologies.",
      "- **Best Diagnostic Step:** **Lumbar puncture** (if no mass effect) with CSF cell count, protein/glucose, **viral PCR (HSV, VZV, etc.)**, autoimmune encephalitis panel; **EEG** for subclinical seizures/encephalopathy. **Confirms?** ✅ Etiologic diagnosis (infectious/autoimmune).",
      "- **Adjuncts:** Bloods (CRP/ESR, cultures), autoimmune/vasculitis serology, tumor markers when indicated.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Airway–Breathing–Circulation[/green]; treat **seizure** (IV benzodiazepine → levetiracetam), elevate head of bed, analgesia, manage fever; start empiric **acyclovir** if encephalitis suspected. 🚑",
      "- **First Line (targeted):** Narrow therapy based on results: antivirals for HSV/VZV, **immunotherapy** (steroids/IVIG/plasma exchange) for autoimmune encephalitis, **antibiotics** for bacterial processes, **anticoagulation** if CVST confirmed, or **neurosurgical** consult for mass/abscess.",
      "- **Gold Standard:** **Cause-specific therapy** guided by definitive CSF/imaging/biopsy findings; then neurorehab and secondary prevention. For true svPPA (if red flags excluded), revert to **multidisciplinary supportive care**.",
      "**5️⃣ Full Pathophysiology Explained (why these are red flags)**",
      "- **Degenerative svPPA** = slow **TDP-43 type C**–mediated anterior temporal network failure → no early fever, seizures, or ICP signs.",
      "- **Infectious/autoimmune/neoplastic** processes provoke **inflammation, edema, mass effect, cortical irritability** → headaches, fever, seizures, papilledema—**not** typical of neurodegeneration.",
      "- Time course distinguishes: **weeks–months** (inflammatory/neoplastic) vs **years** (degenerative).",
      "- [purple]Mnemonic:[/purple] “**FAST + HOT + SHOCK**” → **Fast** decline, **Hot** (fever), **Shock** (seizure) = **not** svPPA.",
      "**6️⃣ Red-flag checklist — think urgent workup when you see…**",
      "- **Acute/subacute onset** (days–weeks) or **stepwise** course.",
      "- **Fever, new headache, meningism**, or **systemic illness** (weight loss, night sweats).",
      "- **Seizures**, **papilledema**, or **focal neurologic deficits** (hemiparesis, visual field cut).",
      "- **Rapid change in consciousness**, **delirium**, or profound fluctuations.",
      "- **Cancer/immunosuppression**, **anticoagulation/trauma** (consider subdural), or **RPGN/vasculitis signs**.",
      "- [blue]If any present → switch from “dementia workup” to **acute neurology/infectious oncology** pathways immediately[/blue].",
    ],
  },
  {
    id: "FTD-DDX-10001",
    topic: "Geriatrics • Frontotemporal Dementia — Differential Diagnosis",
    difficulty: "Medium",
    vignetteTitle:
      "Which diagnosis best fits? Parsing the aphasia differentials",
    stem: "A 64-year-old art historian has 2 years of fluent but content-light speech. She mislabels specific nouns with broad categories, cannot match single words to pictures, and misreads irregular words (e.g., 'pint' as 'pint' with long i). Repetition and grammar are preserved. MRI shows left-predominant anterior temporal atrophy with relative parietal sparing. Which diagnosis best explains this presentation?",
    options: [
      {
        key: "A",
        text: "Non-fluent/agrammatic primary progressive aphasia (nfvPPA)",
      },
      {
        key: "B",
        text: "Semantic-variant primary progressive aphasia (svPPA)",
      },
      {
        key: "C",
        text: "Logopenic variant PPA (lvPPA) due to Alzheimer pathology",
      },
      { key: "D", text: "Major depressive disorder (pseudodementia)" },
      {
        key: "E",
        text: "Wernicke aphasia due to left temporoparietal ischemic stroke",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **svPPA** presents with fluent but **empty** speech, severe **anomia**, and **loss of single-word comprehension**.",
      "- **Grammar and repetition preserved** clearly separate it from nfvPPA and lvPPA.",
      "- **Surface dyslexia/dysgraphia** for irregular words signals semantic system failure.",
      "- MRI shows [blue]left anterior temporal lobe (ATL) atrophy[/blue] with parietal sparing—clinicoradiologic match.",
      "- [yellow]Pattern lock:[/yellow] fluent speech + semantic loss + preserved repetition + left ATL atrophy ⇒ **svPPA**.",
      "**2️⃣ Why the other options are wrong**",
      "- **A. nfvPPA:** Effortful, halting, **agrammatic** speech ± apraxia of speech; repetition often impaired; not fluent/semantic-dominant.",
      "- **C. lvPPA:** **Impaired sentence repetition** and phonologic errors; temporoparietal atrophy; semantics comparatively spared early.",
      "- **D. Pseudodementia:** Inconsistent effort, prominent mood symptoms, “don’t know” responses; language structure/semantics typically intact; imaging not ATL-selective.",
      "- **E. Wernicke stroke:** **Acute** onset, poor comprehension **and** poor repetition with paraphasias; course here is insidious and repetition intact.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language screen targeting naming, single-word comprehension, repetition, and grammar. Confirms? ❌ Suggests svPPA pattern.",
      "- **Next Diagnostic step:** Formal neuropsychology (semantic battery: word–picture matching, category fluency ↓ > letter fluency). Confirms? ➕ Strengthens svPPA vs nfvPPA/lvPPA.",
      "- **Best Diagnostic Step:** MRI brain (volumetric preferred) → [blue]left > right anterior temporal atrophy[/blue] with relative parietal sparing. Confirms? ✅ Clinicoradiologic signature.",
      "- **Helpful adjuncts:** FDG-PET (anterior temporal hypometabolism); CSF AD biomarkers to exclude AD/lvPPA; EEG if episodic confusion or seizures cloud the picture.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, education, and communication aids[/green] (semantic feature analysis, visual supports); caregiver training; driving/work safety; advanced care planning.",
      "- **First Line:** [green]Speech–language therapy[/green] with compensatory strategies; environmental modifications; [green]multidisciplinary care[/green] (neurology, SLT, OT, social work); SSRIs for behavioral features if needed.",
      "- **Gold Standard:** No disease-modifying therapy; [green]ongoing person-centred, team-based support[/green] with periodic re-goaling and caregiver respite; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained (DDx focus)**",
      "- **svPPA:** [blue]TDP-43 type C[/blue]–mediated degeneration of ATL semantic hub → concept knowledge and word–meaning links erode.",
      "- **nfvPPA:** Fronto-insular/IFG degeneration (often tauopathy) → motor speech and grammar networks fail → non-fluent, agrammatic speech.",
      "- **lvPPA:** Posterior perisylvian/temporoparietal network (often Alzheimer pathology) → phonologic-loop breakdown → impaired repetition and phonologic errors.",
      "- **Stroke (Wernicke):** Acute lesion in posterior superior temporal cortex → comprehension and repetition deficits with paraphasias.",
      "- **Depression:** Network intact; psychomotor slowing/inattention mimic cognitive issues but language architecture remains structurally sound.",
      "**6️⃣ Symptoms — pattern recognition for DDx**",
      "- **svPPA:** Fluent but empty speech; severe anomia; single-word comprehension loss; **surface dyslexia**; ATL atrophy.",
      "- **nfvPPA:** Non-fluent, agrammatic output; apraxia of speech; effortful production; IFG/insular atrophy.",
      "- **lvPPA:** Word-finding pauses; **impaired repetition**; phonologic errors; temporoparietal atrophy; AD biomarkers often positive.",
      "- **Wernicke stroke:** Acute onset; poor comprehension and repetition; paraphasic jargon; vascular risk; CT/MRI acute changes.",
      "- **Pseudodementia:** Mood disorder context; variable test effort; language semantics intact; improves with depression treatment.",
      "- [purple]Exam pearl:[/purple] ==Preserved repetition + semantic failure + ATL atrophy== → **svPPA**.",
    ],
  },
  {
    id: "FTD-INV-11001",
    topic: "Geriatrics • Frontotemporal Dementia — Best Initial Investigation",
    difficulty: "Medium",
    vignetteTitle: "First test for suspected primary progressive aphasia",
    stem: "A 64-year-old right-handed teacher has 18 months of progressive language change: fluent but content-light speech, severe naming difficulty, and impaired single-word comprehension. Repetition and grammar are intact. Examination is otherwise nonfocal. You suspect a primary progressive aphasia, likely semantic variant. What is the **best initial investigation**?",
    options: [
      { key: "A", text: "Non-contrast CT head" },
      { key: "B", text: "MRI brain with volumetric sequences" },
      { key: "C", text: "CSF Alzheimer biomarkers (Aβ42, total tau, p-tau)" },
      { key: "D", text: "FDG-PET brain" },
      { key: "E", text: "Comprehensive neuropsychological testing" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **MRI brain with volumetric sequences** is the **best initial investigation** for suspected PPA/FTD because it both **excludes structural mimics** (tumor, subdural, stroke) and identifies a **syndrome-specific atrophy pattern**.",
      "- In **semantic-variant PPA (svPPA)**, MRI typically shows [blue]**left > right anterior temporal lobe (ATL) atrophy**[/blue] with relative parietal sparing—high-yield for clinico-radiologic confirmation.",
      "- MRI outperforms CT for **gray-matter resolution** and **pattern recognition**; volumetrics help quantify asymmetry and track progression.",
      "- [green]Practical win:[/green] one scan answers two questions early: “Is there something acute I must treat?” and “Does the pattern fit svPPA?” 🧠🖥️",
      "**2️⃣ Why the other options are wrong**",
      "- **A. CT head:** Quick but **insensitive** to frontotemporal cortical atrophy; may miss early svPPA patterns and subtle lesions.",
      "- **C. CSF AD biomarkers:** Useful to **exclude Alzheimer pathology** (e.g., lvPPA) but **not first**; invasive and not primary for FTD confirmation.",
      "- **D. FDG-PET:** Shows **hypometabolism** (anterior temporal in svPPA) yet is typically a **second-line adjunct** after MRI or when MRI is equivocal/unavailable.",
      "- **E. Neuropsychological testing:** Crucial for **phenotyping** and documenting deficits, but it’s **clinical assessment**, not the first **imaging investigation** to rule out structural causes.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** 🩺 *Focused bedside language assessment* (naming, single-word comprehension, repetition, grammar). **Confirms?** ❌ No—raises svPPA suspicion.",
      "- **Next Diagnostic step:** 🧠 *MRI brain with volumetrics* → [blue]Left > right ATL atrophy[/blue], parietal sparing. **Confirms?** ✅ Best initial investigation; strongly supports svPPA and rules out surgical lesions.",
      "- **Best Diagnostic Step (for maximal accuracy after MRI):** 🧠 *Comprehensive neuropsychology ± FDG-PET/CSF (when indicated)* → defines semantic deficits; PET shows anterior temporal hypometabolism; CSF non-AD profile. **Confirms?** ➕ Completes clinico-pathway and excludes AD/lvPPA.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Diagnosis disclosure, education, safety planning[/green]; initiate **communication aids** (semantic feature analysis, visual supports).",
      "- **First Line:** [green]Speech–language therapy[/green] (compensatory strategies), environmental modifications, [green]multidisciplinary team** (neurology, SLT, OT, social work); SSRIs if behavioral symptoms.",
      "- **Gold Standard:** No disease-modifying drug; [green]ongoing person-centred supportive care[/green], caregiver training/respite; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- svPPA is driven by [blue]**TDP-43 type C**[/blue]–mediated degeneration of the **anterior temporal semantic hub**, disconnecting word–meaning networks.",
      "- This yields **fluent but empty speech**, **anomia**, and **single-word comprehension loss** with **preserved repetition/grammar** early—mirrored by **ATL-predominant atrophy** on MRI.",
      "**6️⃣ Symptoms — pattern recognition**",
      "- **Fluent but empty speech** 🗣️ → semantic content loss, intact motor speech.",
      "- **Severe anomia + impaired single-word comprehension** 🧠 → ATL semantic hub failure.",
      "- **Surface dyslexia/dysgraphia** ✍️ → irregular word errors.",
      "- [purple]Pearl:[/purple] ==Suspected svPPA? Do **MRI with volumetrics** first== — it shows the pattern and rules out dangerous mimics.",
    ],
  },
  {
    id: "FTD-GOLD-12001",
    topic: "Geriatrics • Frontotemporal Dementia — Gold Standard Investigation",
    difficulty: "Medium",
    vignetteTitle: "What truly confirms semantic-variant PPA etiology?",
    stem: "A 65-year-old teacher has 2 years of fluent but empty speech, severe anomia, and loss of single-word comprehension with preserved repetition/grammar. MRI shows left-predominant anterior temporal lobe atrophy; FDG-PET shows anterior temporal hypometabolism. CSF Alzheimer biomarkers are non-AD. Which single investigation is the **gold standard** for definitively establishing the underlying proteinopathy?",
    options: [
      { key: "A", text: "MRI brain with volumetric analysis" },
      { key: "B", text: "FDG-PET brain" },
      { key: "C", text: "CSF Alzheimer biomarkers (Aβ42, total tau, p-tau)" },
      {
        key: "D",
        text: "Neuropathology with immunohistochemistry (post-mortem or rarely biopsy) demonstrating TDP-43 type C",
      },
      { key: "E", text: "Targeted genetic panel for GRN, MAPT, and C9orf72" },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Gold standard = tissue diagnosis**: **Neuropathology with immunohistochemistry** directly visualizes pathogenic protein aggregates.",
      "- In svPPA, definitive confirmation is **TDP-43 type C** pathology (and negative for tau/α-synuclein) on tissue.",
      "- Imaging and CSF are **supportive/triaging** tools; they **cannot** prove the molecular proteinopathy.",
      "- Clinically we rarely biopsy for degenerative disease; **post-mortem** confirmation remains the practical gold standard. [yellow]Supportive tests guide care, but tissue is truth[/yellow]. 🧠🔬",
      "**2️⃣ Why the other options are wrong**",
      "- **A. MRI volumetrics:** Best **initial** structural test; shows **pattern** (left ATL atrophy) but not the **protein**.",
      "- **B. FDG-PET:** Shows **hypometabolism** in anterior temporal cortex; helpful when MRI is equivocal, but still **nonspecific** for proteinopathy.",
      "- **C. CSF AD biomarkers:** Rules **in/out Alzheimer biology** (useful to exclude lvPPA/AD) but does **not** confirm TDP-43.",
      "- **E. Genetic panel:** Explains some **familial** FTD; svPPA is often **sporadic**. A variant can suggest tau or TDP-43 risk, but it is **not** pathologic confirmation.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** 🩺 *Bedside language screen* → fluent but empty speech; severe anomia; impaired single-word comprehension; preserved repetition/grammar. **Confirms?** ❌ Suggests svPPA.",
      "- **Next Diagnostic step:** 🧠 *MRI brain with volumetrics* → [blue]Left > right anterior temporal atrophy[/blue] with parietal sparing. **Confirms?** ➕ Strong clinicoradiologic support.",
      "- **Best Diagnostic Step (Gold Standard):** 🔬 *Neuropathology with immunohistochemistry* (post-mortem; biopsy rarely) → [blue]**TDP-43 type C inclusions**[/blue], tau/α-syn negative. **Confirms?** ✅ **Yes** — molecular etiology proven.",
      "- **Helpful adjuncts:** FDG-PET (anterior temporal hypometabolism), CSF AD biomarkers (non-AD profile), genetics if young/familial (GRN/MAPT/C9orf72).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, communication aids[/green] (semantic feature analysis, visual supports); caregiver training; safety/advance care planning.",
      "- **First Line:** [green]Speech–language therapy[/green] (compensatory scripts, spaced retrieval); environmental modification; [green]multidisciplinary team[/green] (neurology, SLT, OT, social work); SSRIs for behavioral symptoms if needed.",
      "- **Gold Standard:** No disease-modifying drug; [green]sustained person-centred supportive care[/green]; caregiver respite; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- svPPA reflects degeneration of the **anterior temporal semantic hub**, most commonly due to **TDP-43 type C** proteinopathy.",
      "- Mislocalized TDP-43 disrupts **RNA processing/axonal transport**, causing synaptic failure and neuronal loss in ventral temporal networks.",
      "- The result is **semantic memory erosion**: fluent but **content-light** speech, **anomia**, and **single-word comprehension loss** with early preservation of grammar/repetition.",
      "**6️⃣ Symptoms — pattern recognition**",
      "- **Fluent but empty speech** 🗣️ → intact motor/phonologic systems with semantic store failure.",
      "- **Severe anomia** 🔎 and **loss of single-word comprehension** 🧠 → ATL semantic hub degeneration.",
      "- **Surface dyslexia/dysgraphia** ✍️ → irregular word errors; reliance on letter–sound rules.",
      "- [purple]Pearl:[/purple] ==MRI/FDG/CSF steer you; **only tissue** seals the diagnosis of proteinopathy==.",
    ],
  },
  {
    id: "FTD-CURE-13001",
    topic:
      "Geriatrics • Frontotemporal Dementia — Definitive / Curative Therapy",
    difficulty: "Medium",
    vignetteTitle:
      "Is there a curative treatment for semantic-variant PPA (svPPA)?",
    stem: "A 63-year-old editor with a 2-year history of fluent but empty speech, severe anomia, and loss of single-word comprehension is diagnosed with semantic-variant primary progressive aphasia (svPPA) on clinical exam and MRI showing left-predominant anterior temporal atrophy. She asks whether there is a surgery or medicine that can cure or slow the disease. Which option best reflects the current state of curative therapy?",
    options: [
      {
        key: "A",
        text: "High-dose cholinesterase inhibitor titration to maximal tolerated dose",
      },
      {
        key: "B",
        text: "Anti-amyloid monoclonal antibody infusion (e.g., lecanemab) to modify disease course",
      },
      {
        key: "C",
        text: "Approved targeted therapy that clears TDP-43 type C aggregates",
      },
      {
        key: "D",
        text: "No established curative or disease-modifying therapy; provide multidisciplinary supportive care and consider clinical trials",
      },
      {
        key: "E",
        text: "Anterior temporal lobectomy to remove diseased cortex and halt progression",
      },
    ],
    correct: "D",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- For **svPPA/FTD**, there is **no proven curative or disease-modifying therapy** at present.",
      "- Best practice is [green]**multidisciplinary supportive care**[/green]: speech–language therapy, caregiver education, safety planning, psychosocial support, and symptom-targeted meds.",
      "- [yellow]Clinical trials[/yellow] may be appropriate (biomarker/gene-directed in select familial cases), but **standard-of-care remains supportive**.",
      "- Clear counseling prevents harmful or futile treatments; align goals of care early; revisit as disease evolves. 🧠🤝",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Cholinesterase inhibitors:** Evidence shows **little benefit in FTD** and they may **worsen behavior**; they target cholinergic deficits typical of Alzheimer’s, not svPPA. ❌",
      "- **B. Anti-amyloid mAb:** Designed for **amyloid-positive Alzheimer’s**; svPPA is usually **TDP-43**–mediated and **amyloid-negative** → not indicated and not disease-modifying for FTD. ❌",
      "- **C. TDP-43–clearing therapy:** **No approved agent** currently removes **TDP-43 type C** aggregates in humans; this remains **experimental**. ❌",
      "- **E. Temporal lobectomy:** svPPA is a **neurodegenerative network disease**; resection **does not halt progression** and would worsen deficits; surgery is not a treatment. ❌",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language screen (naming, single-word comprehension, repetition, grammar). **Confirms?** ❌ Raises suspicion for svPPA.",
      "- **Next Diagnostic step:** MRI brain with volumetrics → [blue]left > right anterior temporal atrophy[/blue] and parietal sparing. **Confirms?** ➕ Clinicoradiologic support.",
      "- **Best Diagnostic Step:** Formal neuropsychology ± FDG-PET; CSF AD biomarkers (usually non-AD) to exclude lvPPA/AD; genetics if young/familial (GRN, MAPT, C9orf72). **Confirms?** ✅ Phenotype secured; etiology inferred.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, communication aids[/green] (semantic feature analysis, visual supports), caregiver training, driving/work/safety review, advance care planning.",
      "- **First Line:** [green]Speech–language therapy[/green] (compensatory strategies, scripts, spaced retrieval), environment modification, [green]multidisciplinary care[/green] (neurology, SLT, OT, social work); **SSRIs** for behavioral symptoms if they arise.",
      "- **Gold Standard (Definitive / Curative):** [yellow]**None available**[/yellow] for svPPA/FTD today; enroll in **clinical trials** when eligible; prioritize person-centred supportive care; [red]avoid routine cholinesterase inhibitors/memantine in FTD[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- svPPA typically reflects **TDP-43 type C** proteinopathy affecting the **anterior temporal semantic hub**.",
      "- Mislocalized TDP-43 disrupts RNA handling → synaptic dysfunction → neuronal loss in semantic networks.",
      "- Current therapies **do not target TDP-43 pathobiology** effectively; hence **no disease-modifying option** yet.",
      "- Symptom-focused rehab leverages **neuroplastic compensation** even as degeneration progresses.",
      "**6️⃣ Symptoms — pattern recognition**",
      "- **Fluent but empty speech** 🗣️ → semantic content loss with intact phonology/syntax early.",
      "- **Severe anomia** 🔎 and **single-word comprehension loss** 🧠 → anterior temporal semantic hub failure.",
      "- **Surface dyslexia/dysgraphia** ✍️ → irregular-word errors; reliance on letter-sound rules.",
      "- [purple]Pearl:[/purple] ==When asked about a “cure” for svPPA/FTD, the high-yield answer is **no curative therapy**—deliver **supportive, multidisciplinary care** and consider **trials**==.",
    ],
  },
  {
    id: "FTD-COMP-14001",
    topic: "Geriatrics • Frontotemporal Dementia — Complications",
    difficulty: "Medium",
    vignetteTitle: "What’s the high-risk downstream complication in svPPA?",
    stem: "A 66-year-old former teacher with semantic-variant PPA (svPPA) has fluent but empty speech, loss of single-word comprehension, and left-predominant anterior temporal atrophy on MRI. Over 3 years she has developed reduced food variety, occasional choking with solids, and weight loss. Which complication is most important to anticipate and prevent over the next year?",
    options: [
      {
        key: "A",
        text: "Intracerebral hemorrhage due to anticoagulation for atrial fibrillation",
      },
      {
        key: "B",
        text: "Aspiration pneumonia from progressive oropharyngeal dysphagia",
      },
      {
        key: "C",
        text: "Early, prominent visual hallucinations with fluctuating cognition and REM sleep behavior disorder",
      },
      {
        key: "D",
        text: "Rapid myoclonus with akinetic mutism within months of onset",
      },
      {
        key: "E",
        text: "Bradycardia and syncope from high-dose cholinesterase inhibitor therapy",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **Aspiration pneumonia** is a major downstream complication across dementias and is particularly relevant as **swallowing becomes unsafe** with disease progression.",
      "- In **svPPA**, early language loss dominates; with time, **oropharyngeal dysphagia**, **weight loss**, and **recurrent aspiration** can emerge—especially as cognitive–behavioral features spread.",
      "- Leading causes of morbidity/mortality in advanced FTD include **infections (notably pneumonia)** and complications of immobility/malnutrition.",
      "- [green]Proactive swallow assessment, diet texture modification, and aspiration precautions[/green] reduce risk. [yellow]High-yield safety target[/yellow].",
      "- The vignette’s **choking episodes + weight loss** signal evolving dysphagia → **anticipate aspiration**. 🫁🍽️",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Intracerebral hemorrhage from anticoagulation:** Possible in anyone anticoagulated, but **not a disease-specific** svPPA complication and not signaled here.",
      "- **C. DLB phenotype:** **Visual hallucinations, RBD, fluctuations** point to **Lewy body dementia**, not svPPA.",
      "- **D. Prion disease:** **Rapid** course with **myoclonus** and early akinetic mutism suggests **CJD**, not the **years-long** svPPA trajectory.",
      "- **E. Cholinesterase inhibitor bradycardia:** Routine cholinesterase inhibitors are **not recommended in FTD**; risk exists if used, but this is **not standard care** and thus not the key anticipated complication.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Clinical screen for **dysphagia** (history of choking, cough with meals, weight loss). **Confirms?** ❌ Suggests aspiration risk.",
      "- **Next Diagnostic step:** **Bedside swallow assessment** by SLP with trial textures/liquids. **Confirms?** ➕ Risk stratification; immediate precautions.",
      "- **Best Diagnostic Step:** **Instrumental swallow study** (videofluoroscopic swallow study or FEES) → identifies **aspiration/penetration**, residue, safest textures. **Confirms?** ✅ Objective evidence guides management.",
      "- **Adjuncts:** Nutritional panel (albumin, weight/BMI trend), CXR if cough/fever, pulse-ox; consider **speech–language cognitive-communication** review to align strategies.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Aspiration precautions[/green] (upright posture, slow rate, small boluses), **texture-modified diet** (per study), supervised feeding; oral hygiene to reduce bacterial load.",
      "- **First Line:** [green]Speech–language therapy[/green] for **compensatory swallow techniques** (chin tuck, effortful swallow), caregiver training; **calorie-dense supplements**; treat reflux/constipation; immunize (influenza, pneumococcal).",
      "- **Gold Standard:** There is **no curative therapy**; for severe unsafe swallowing with recurrent aspiration, discuss **goals of care** (including comfort feeding), [blue]PEG rarely prevents aspiration of saliva and may not improve outcomes[/blue]. Shared decision-making is essential. [red]Avoid reflex PEG without goals/risks discussion[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **svPPA** begins with **anterior temporal (semantic hub)** degeneration → language/meaning loss.",
      "- Disease spreads within FTD networks, adding **behavioral change**, **apathy/rigidity**, and later **bulbar involvement** contributing to **oropharyngeal discoordination**.",
      "- This yields **ineffective airway protection** and **silent aspiration**; malnutrition further weakens cough and immunity → **pneumonia risk**.",
      "- [purple]Pearl:[/purple] “**Language fades first, lungs suffer later**” — anticipate swallow issues as networks widen.",
      "**6️⃣ Symptoms — pattern recognition for complications**",
      "- **Red flags for aspiration risk:** coughing/choking with meals, wet/gurgly voice, recurrent chest infections, weight loss, prolonged mealtimes.",
      "- **Nutritional decline:** early **food faddism**/restricted variety → later **weight loss** and **frailty**.",
      "- **Functional cascade:** dehydration, delirium during infections, pressure injuries with immobility.",
      "- [blue]Bundle the plan:[/blue] swallow study + diet modification + SLP strategies + oral care + vaccination + caregiver training = **fewer pneumonias**.",
    ],
  },

  {
    id: "FTD-ETIO-5001",
    topic: "Geriatrics • Frontotemporal Dementia — Etiology (Causes)",
    difficulty: "Medium",
    vignetteTitle: "What’s the underlying cause in semantic-variant PPA?",
    stem: "A 62-year-old right-handed editor has 18 months of progressive word comprehension loss. She speaks fluently but uses non-specific terms and cannot name common objects. Repetition and grammar are preserved. MRI shows predominant left anterior temporal lobe atrophy with relative parietal sparing. There is no family history of dementia or movement disorder. Which underlying proteinopathy most likely explains this presentation?",
    options: [
      {
        key: "A",
        text: "Tau (4R) accumulation characteristic of corticobasal degeneration",
      },
      { key: "B", text: "TDP-43 type C pathology" },
      { key: "C", text: "Alpha-synuclein (Lewy body) pathology" },
      {
        key: "D",
        text: "Amyloid-β plaques with tau neurofibrillary tangles (Alzheimer’s disease)",
      },
      { key: "E", text: "Misfolded prion protein (PrPSc) pathology" },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- The syndrome fits **semantic-variant primary progressive aphasia (svPPA)**: fluent but empty speech, severe anomia, impaired single-word comprehension, preserved grammar/repetition.",
      "- Imaging hallmark is [blue]anterior temporal lobe atrophy (often L > R)[/blue] with relative parietal sparing.",
      "- svPPA is most commonly caused by **TDP-43 type C** aggregation, making B the best etiologic answer.",
      "- [yellow]Clinicoradiologic pattern → TDP-43 type C[/yellow] is a classic high-yield association.",
      "- Sporadic presentation without strong family history further aligns with TDP-43 in svPPA. 🧠📖",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Tau (4R) corticobasal**: More linked to nonfluent/agrammatic PPA or corticobasal syndrome with apraxia and parkinsonism, not svPPA’s semantic loss.",
      "- **C. Alpha-synuclein**: Causes dementia with Lewy bodies or Parkinson disease dementia, featuring visual hallucinations, REM sleep behavior disorder, and parkinsonism—pattern mismatch.",
      "- **D. Alzheimer pathology**: Ties to **logopenic PPA** with impaired repetition and phonological errors; svPPA preserves repetition and targets semantics instead.",
      "- **E. Prion disease**: Rapidly progressive dementia, myoclonus, ataxia; course is subacute, not the slowly progressive svPPA picture.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language screen focusing on naming and single-word comprehension → Fluent but empty speech with anomia and impaired word meaning. Confirms diagnosis? ❌ Suggests svPPA.",
      "- **Next Diagnostic step:** Formal neuropsychology with semantic battery (word–picture matching, irregular word reading) → Disproportionate semantic deficits with preserved grammar/phonology. Confirms diagnosis? ➕ Supports svPPA and excludes mimics.",
      "- **Best Diagnostic Step:** MRI brain (volumetric preferred) → [blue]Anterior temporal lobe atrophy (L > R)[/blue], relative parietal sparing. Confirms diagnosis? ✅ Most definitive antemortem pattern with clinical phenotype.",
      "- **Adjuncts:** FDG-PET showing anterior temporal hypometabolism; CSF/AD biomarkers often non-AD pattern helping exclude logopenic/AD; genetics if young onset or family history (GRN, MAPT, C9orf72 though svPPA often sporadic).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, communication aids[/green] (semantic feature analysis, visual supports), caregiver training, driving/work safety review.",
      "- **First Line:** [green]Speech–language therapy[/green] focused on compensatory strategies and environmental modification; multidisciplinary care (neurology, SLT, OT, social work). Consider **SSRIs** for behavioral symptoms if present.",
      "- **Gold Standard:** No disease-modifying therapy; [green]sustained multidisciplinary, person-centred support[/green], periodic re-goaling, caregiver respite and community resources.",
      "- [red]Avoid routine cholinesterase inhibitors/memantine in FTD—limited benefit and can worsen behavior[/red].",
      "**5️⃣ Full Pathophysiology Explained (Etiology focus)**",
      "- **FTD** comprises heterogeneous proteinopathies affecting frontal and/or temporal networks.",
      "- In **svPPA**, the etiologic driver is most often **TDP-43 type C** misfolded protein aggregation disrupting RNA processing and axonal transport.",
      "- Resulting synaptic failure and neuronal loss target the **anterior temporal semantic network**, eroding conceptual knowledge and word–meaning links.",
      "- Genetics: while svPPA is frequently **sporadic**, broader FTD may involve **GRN, MAPT, C9orf72** mutations; tauopathies skew toward nfvPPA/CBS, TDP-43 toward svPPA/bvFTD spectra.",
      "- [purple]Pearl:[/purple] “**svPPA → Semantic hub hit → TDP-43 type C**.”",
      "**6️⃣ Symptoms (cause → effect mapping)**",
      "- **Anomia** 🔎 → Loss of concept–label associations from anterior temporal degeneration.",
      "- **Loss of single-word comprehension** 🧠 → Breakdown of semantic network due to TDP-43 pathology.",
      "- **Fluent but empty speech** 🗣️ → Speech production intact, semantic content depleted.",
      "- **Surface dyslexia/dysgraphia** ✍️ → Reliance on phonology when irregular word semantics are lost.",
      "- **Pattern to remember:** ==Fluent speech + empty content + severe anomia + impaired word meaning + ATL atrophy== → think **TDP-43 type C**.",
    ],
  },

  {
    id: "EPI-2101",
    topic: "Clinical Epidemiology • Screening test metrics in geriatrics",
    difficulty: "Medium",
    vignetteTitle: "Interpreting a new dementia screening test in clinic",
    stem: "A community clinic adopts a new blood-based screening test for dementia. In a memory clinic serving many symptomatic older adults, clinicians notice more true positives than when the same test was piloted in a low-prevalence general practice. Which test characteristic most strongly increases when disease prevalence rises?",
    options: [
      { key: "A", text: "Sensitivity" },
      { key: "B", text: "Specificity" },
      { key: "C", text: "Positive predictive value (PPV)" },
      { key: "D", text: "Negative predictive value (NPV)" },
      { key: "E", text: "Likelihood ratio for a positive test (LR+)" },
    ],
    correct: "C",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- **PPV** = probability of disease *given* a positive test (P[D|+]).",
      "- PPV **moves with prevalence**: higher pretest probability → more positives are true positives. [blue]Bayes theorem[/blue] links this directly.",
      "- In a memory clinic (high prevalence), the same test yields **higher PPV** than in general practice (low prevalence).",
      "- [yellow]Rule of thumb:[/yellow] ↑Prevalence → ↑PPV and ↓NPV; test’s sensitivity/specificity stay the same.",
      "- Clinically: better to act on a positive in high-prevalence settings; confirm more cautiously in low-prevalence settings. 🧠📈",
      "**2️⃣ Why the other options are wrong**",
      "- **A. Sensitivity:** Intrinsic to the test (P[+|D]); **does not change** with prevalence; depends on threshold and biology, not setting.",
      "- **B. Specificity:** Intrinsic (P[−|no D]); **stable across populations** assuming similar spectrum and thresholds.",
      "- **D. NPV:** Probability of *no disease* given a negative test; **decreases** as prevalence rises (more false negatives matter).",
      "- **E. LR+:** = sensitivity ÷ (1 − specificity); **prevalence-independent** summary of how much a positive shifts odds.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Estimate **pretest probability** from setting/epidemiology (clinic vs community). **Confirms?** ❌ No—sets the baseline for interpretation.",
      "- **Next Diagnostic step:** Apply test and compute **post-test probability** using **PPV/NPV** tables or Bayes nomogram. **Confirms?** ➕ Improves certainty but may still need confirmation.",
      "- **Best Diagnostic Step:** Use **LRs** with Bayes theorem to update odds precisely; then perform a **reference standard** (e.g., comprehensive neurocognitive assessment ± imaging) when action hinges on accuracy. **Confirms?** ✅ Confirmation requires the reference standard.",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Communicate results with context[/green] (prevalence and PPV/NPV), assess symptoms/function, review meds and reversible causes.",
      "- **First Line:** [green]Confirmatory evaluation[/green] for positives: standardized cognitive testing, depression screen, labs (B12/TSH), and targeted imaging when indicated.",
      "- **Gold Standard:** Diagnosis anchored to **reference standard** clinical criteria (e.g., DSM/ICD/NIA-AA) rather than screening alone; avoid starting disease-specific therapy on screen result only. [red]Do not over-treat on screening positives without confirmation[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- This is the **statistical ‘path’ of information**: Prevalence sets **pretest odds**.",
      "- A test contributes **likelihood** (LRs) that multiplies those odds (Bayes).",
      "- **PPV** rises in high-prevalence settings because true positives become more common relative to false positives.",
      "- **Sensitivity/specificity** are properties of the assay/threshold—changing the population alone doesn’t alter them.",
      "- [purple]Mnemonic:[/purple] “**Prevalence Pushes Predictive values**” → PPP.",
      "**6️⃣ Symptoms (pattern recognition for exam questions)**",
      "- **High-prevalence clinic** → **↑PPV** because a positive is more likely a true positive.",
      "- **Low-prevalence screening day** → **↑NPV** because a negative is more likely a true negative.",
      "- **Unchanged sensitivity/specificity/LRs** across settings → differences you see are **predictive values responding to prevalence**.",
      "- [purple]Pattern to remember:[/purple] ==If vignette swaps from general practice to specialty clinic and asks what changes, pick **PPV**==. 📊✅",
    ],
  },
  {
    id: "FTD-PATH-6001",
    topic: "Geriatrics • Frontotemporal Dementia — Pathophysiology",
    difficulty: "Medium",
    vignetteTitle: "Why does semantic-variant PPA lose word meaning?",
    stem: "A 63-year-old copywriter has 2 years of fluent but empty speech, severe anomia, and impaired single-word comprehension with preserved repetition and grammar. MRI demonstrates left-dominant anterior temporal lobe atrophy with relative parietal sparing. Which pathophysiologic mechanism best explains this syndrome?",
    options: [
      {
        key: "A",
        text: "Degeneration of the left inferior frontal gyrus and premotor speech networks causing apraxia of speech",
      },
      {
        key: "B",
        text: "Neurodegeneration of the anterior temporal semantic hub with TDP-43 type C–mediated network failure",
      },
      {
        key: "C",
        text: "Posterior perisylvian (temporoparietal) phonologic-loop breakdown typical of Alzheimer-related logopenic aphasia",
      },
      {
        key: "D",
        text: "Acute infarct of posterior superior temporal gyrus leading to Wernicke aphasia",
      },
      {
        key: "E",
        text: "Demyelination of the arcuate fasciculus disrupting repetition pathways",
      },
    ],
    correct: "B",
    explanation_detail: [
      "**1️⃣ Why it is the correct answer**",
      "- svPPA targets the [blue]anterior temporal lobe (ATL) semantic hub[/blue], the network that stores concept knowledge and word–meaning links.",
      "- Pathology most often involves [blue]TDP-43 type C cytoplasmic aggregates[/blue] causing synaptic failure and neuronal loss in ATL and ventral temporal streams.",
      "- Loss of the semantic hub produces **fluent but empty speech**, **anomia**, and **single-word comprehension deficits** while sparing phonology and syntax early.",
      "- Imaging with left-dominant ATL atrophy and relative parietal sparing matches this clinicopathologic pattern.",
      "- [yellow]Key link:[/yellow] ATL semantic hub degeneration → meaning erodes first, not grammar or repetition. 🧠📚",
      "**2️⃣ Why the other options are wrong**",
      "- **A. IFG/premotor apraxia network:** Explains **non-fluent/agrammatic PPA** with effortful speech and grammar errors, not fluent semantic loss.",
      "- **C. Posterior perisylvian phonologic-loop:** Drives **logopenic PPA** with impaired repetition and phonologic errors; our case has preserved repetition.",
      "- **D. Acute Wernicke infarct:** Sudden onset with impaired comprehension **and** repetition; this vignette is insidious and neurodegenerative.",
      "- **E. Arcuate fasciculus demyelination:** Would primarily disrupt **repetition** (conduction aphasia), which remains intact here.",
      "**3️⃣ Investigations / Diagnostic Steps (in order)**",
      "- **Initial Diagnostic step:** Bedside language screen focusing on naming and single-word comprehension → Fluent but empty speech; anomia; impaired word meaning; repetition/grammar preserved. Confirms? ❌ Suggests svPPA.",
      "- **Next Diagnostic step:** Formal neuropsychology (word–picture matching, semantic association, irregular word reading) → Disproportionate **semantic** deficits with intact phonology/syntax. Confirms? ➕ Strengthens diagnosis; excludes mimics.",
      "- **Best Diagnostic Step:** MRI brain (volumetric preferred) → [blue]Anterior temporal lobe atrophy (L>R)[/blue] with relative parietal sparing. Confirms? ✅ Clinicoradiologic signature for svPPA.",
      "- **Adjuncts:** FDG-PET showing ATL hypometabolism; CSF AD biomarkers often non-AD pattern; genetics if young/familial (GRN/MAPT/C9orf72 though svPPA often sporadic).",
      "**4️⃣ Management / Treatment (in order)**",
      "- **Initial Management:** [green]Education, diagnosis disclosure, communication aids[/green] (semantic feature analysis, visual supports), caregiver training, safety/drive/work review.",
      "- **First Line:** [green]Speech–language therapy[/green] with compensatory strategies (scripts, spaced retrieval), environment tweaks, [green]multidisciplinary care[/green] (neurology, SLT, OT, social work); SSRIs for behavioral symptoms if needed.",
      "- **Gold Standard:** No disease-modifying therapy; [green]sustained person-centered, team-based support[/green] with periodic re-goaling, caregiver respite, community resources.",
      "- [red]Avoid routine cholinesterase inhibitors/memantine in FTD—limited benefit and may worsen behavior[/red].",
      "**5️⃣ Full Pathophysiology Explained**",
      "- **Network level:** The ATL acts as a **semantic hub**, integrating distributed modality-specific inputs (visual, auditory, tactile) into **concepts**; degeneration disconnects these hubs from their spokes.",
      "- **Cellular/molecular:** [blue]TDP-43 type C[/blue] mislocalizes to cytoplasm → disordered RNA processing/transport → synaptic dysfunction → neuronal loss, especially in ATL and ventral temporal pathways.",
      "- **Systems consequences:** Early preservation of **phonology and syntax** (dorsal/fronto-insular circuits) yields **fluent** output with **low information content**.",
      "- **Temporal progression:** Rare/low-frequency words lost first → common nouns → person/face concepts (right ATL involvement → prosopagnosia and socioemotional semantic loss).",
      "- [purple]Mnemonic:[/purple] “**Hub crumbles, words tumble**” — ATL hub failure makes speech smooth but meaning-thin.",
      "**6️⃣ Symptoms (mechanism mapping + pattern recognition)**",
      "- **Fluent but empty speech** 🗣️ → speech motor/phonologic systems intact while semantic hub fails.",
      "- **Anomia** 🔎 → severed concept–label links in ATL.",
      "- **Single-word comprehension loss** 🧠 → impaired mapping from sounds to meaning within the semantic hub.",
      "- **Surface dyslexia/dysgraphia** ✍️ → reliance on letter–sound rules when irregular-word semantic knowledge is gone.",
      "- **Pattern to remember:** ==Fluent speech + empty content + severe anomia + impaired word meaning + left ATL atrophy== → [blue]semantic hub degeneration with TDP-43 type C[/blue].",
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
export default function FrontotemporalDementia() {
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

  // selection highlighting
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

  // start mode
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

  // actions
  const choose = (opt) => setAnswers((a) => ({ ...a, [q.id]: opt }));
  const submit = () => setRevealed((r) => ({ ...r, [q.id]: true }));
  const next = () => {
    const last = currentIdx >= total - 1;
    if (!last) {
      setCurrentIdx((i) => i + 1);
    }
  };
  const prev = () => currentIdx > 0 && setCurrentIdx((i) => i - 1);

  // finished state
  const finished = currentIdx === total - 1 && !!revealed[q.id];
  useEffect(() => {
    if (finished && !endRef.current) {
      endRef.current = Date.now();
    }
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
                        {finished && (
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

      {/* Mobile question list modal */}
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
        elapsedMs={elapsedMs}
        jumpTo={(i) => setCurrentIdx(i)}
      />

      {/* Start choice overlay */}
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
      title="Start Frontotemporal Dementia Bank"
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
