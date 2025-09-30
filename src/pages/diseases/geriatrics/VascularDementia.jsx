import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------ Question Data ------------------------ */
/* NOTE: Add images in /public and set q.image = "/file.png" if needed */
const QUESTIONS = [
  {
    id: "VaD-2001",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Easy",
    vignetteTitle: "Presentation pattern",
    stem:
      "A 78-year-old man has cognitive decline over 3 years following multiple TIAs. " +
      "Family report stepwise deterioration and early executive dysfunction. Neuro exam shows mild right-sided weakness and brisk reflexes. " +
      "Which SINGLE clinical pattern most supports vascular dementia over Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Gradual purely amnestic decline with preserved executive function",
      },
      {
        key: "B",
        text: "Early visuospatial neglect with visual hallucinations",
      },
      {
        key: "C",
        text: "Stepwise decline with focal neurological signs and dysexecutive syndrome",
      }, // correct
      { key: "D", text: "Early behavioural disinhibition and loss of empathy" },
      { key: "E", text: "Rapidly progressive myoclonus and akinetic mutism" },
    ],
    correct: "C",
    explanation_detail: [
      "Vascular dementia (VaD) often shows a *stepwise* course tied to clinical strokes/TIAs, with early executive dysfunction (planning, processing speed) rather than a purely amnestic picture.",
      "Focal neurological signs (e.g., hemiparesis, brisk reflexes, dysarthria) reflect accumulated infarcts. Alzheimer’s is typically insidious and amnestic; Lewy body disease features visual hallucinations and fluctuations; FTD has early behavioural/language change; rapidly progressive myoclonus suggests prion disease.",
    ],
  },
  {
    id: "VaD-2002",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Medium",
    vignetteTitle: "Neuroimaging",
    stem:
      "A 74-year-old woman with cognitive impairment undergoes MRI. " +
      "Which SINGLE radiologic pattern most supports a vascular aetiology?",
    options: [
      {
        key: "A",
        text: "Bilateral hippocampal/medial temporal atrophy with parietal involvement",
      },
      {
        key: "B",
        text: "Confluent periventricular white matter hyperintensities with lacunes and microbleeds",
      }, // correct
      {
        key: "C",
        text: "Marked occipital hypometabolism with preserved medial temporal lobes",
      },
      { key: "D", text: "Pronounced anterior temporal and frontal atrophy" },
      {
        key: "E",
        text: "Symmetric basal ganglia calcifications without WM change",
      },
    ],
    correct: "B",
    explanation_detail: [
      "Small-vessel ischaemic disease underpins many VaD cases: MRI commonly shows periventricular and deep white-matter hyperintensities, lacunar infarcts, and sometimes microbleeds (on susceptibility sequences).",
      "Medial temporal atrophy supports Alzheimer’s; occipital involvement suggests Lewy body disease; anterior temporal/frontal atrophy suggests FTD; basal ganglia calcifications are nonspecific (consider metabolic or idiopathic).",
    ],
  },
  {
    id: "VaD-2003",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Medium",
    vignetteTitle: "Secondary prevention",
    stem:
      "A 79-year-old man with vascular dementia and a prior lacunar stroke has persistent atrial fibrillation (CHA₂DS₂-VASc = 5, HAS-BLED = 2). " +
      "What is the SINGLE most appropriate antithrombotic strategy for stroke prevention?",
    options: [
      {
        key: "A",
        text: "Dual antiplatelet therapy (aspirin + clopidogrel) indefinitely",
      },
      { key: "B", text: "Aspirin alone" },
      {
        key: "C",
        text: "Oral anticoagulation (e.g., a DOAC) unless contraindicated",
      }, // correct
      { key: "D", text: "No antithrombotic due to dementia" },
      { key: "E", text: "Low-dose LMWH long term" },
    ],
    correct: "C",
    explanation_detail: [
      "In AF with high thromboembolic risk (CHA₂DS₂-VASc ≥2 in men), oral anticoagulation reduces stroke risk and is indicated unless contraindicated. Dementia alone is not a reason to omit therapy; weigh bleeding risk, falls risk, and adherence.",
      "Dual antiplatelet is not standard long-term for AF stroke prevention. LMWH is not used chronically for non-valvular AF outside special scenarios (e.g., bridging).",
    ],
  },
  {
    id: "VaD-2004",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Medium",
    vignetteTitle: "Mixed pathology",
    stem:
      "A 72-year-old woman with MRI-proven small-vessel disease has cognitive decline with amnestic and executive deficits, suggesting mixed Alzheimer’s/vascular pathology. " +
      "Which SINGLE therapy is the most reasonable to trial for symptomatic cognitive benefit after addressing stroke prevention and risk factors?",
    options: [
      { key: "A", text: "High-dose haloperidol nightly" },
      { key: "B", text: "Cholinesterase inhibitor (e.g., donepezil) trial" }, // correct
      {
        key: "C",
        text: "No treatment—cognitive drugs are ineffective in vascular involvement",
      },
      { key: "D", text: "High-dose vitamin E" },
      { key: "E", text: "Topiramate for cognition" },
    ],
    correct: "B",
    explanation_detail: [
      "In *mixed* Alzheimer’s/vascular cases, a trial of a cholinesterase inhibitor (or memantine) is reasonable for symptomatic benefit. Evidence for pure VaD is limited, but mixed pathology is common in older adults.",
      "Optimise vascular risk (BP, lipids, diabetes), institute antiplatelet/anticoagulation where indicated, encourage exercise and cognitive stimulation. Avoid routine antipsychotics; reserve for severe distress/psychosis after non-drug measures.",
    ],
  },
  {
    id: "VD-1001",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 72-year-old man with a history of hypertension and diabetes presents with stepwise cognitive decline over the past 2 years, including difficulty with planning and sudden worsening after a recent stroke. He has mild left hemiparesis and an MMSE score of 22/30, with deficits in executive function. Brain MRI shows multiple lacunar infarcts and white matter hyperintensities. Which SINGLE clinical feature is most characteristic of vascular dementia in this patient?",
    options: [
      { key: "A", text: "Gradual memory loss without focal signs" },
      {
        key: "B",
        text: "Stepwise cognitive decline with vascular risk factors and focal neurological deficits",
      }, // correct
      { key: "C", text: "Early personality changes and social disinhibition" },
      { key: "D", text: "Prominent language deficits with preserved memory" },
      { key: "E", text: "Visual hallucinations and fluctuating cognition" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Vascular dementia (VaD) is characterized by stepwise cognitive decline linked to cerebrovascular events, often with vascular risk factors (e.g., hypertension, diabetes) and focal neurological signs (e.g., hemiparesis). This reflects impaired cerebral blood flow from strokes or small vessel disease, affecting executive function more than memory early on.",
      "🧠 **Clinical considerations**: The MMSE score of 22/30 indicates mild-moderate VaD. MRI showing lacunar infarcts and white matter hyperintensities supports diagnosis, with Hachinski Ischemic Score (>7) favoring VaD over AD. Prevalence of VaD is ~15-20% of dementia cases, often mixed with AD. Differential includes Alzheimer’s (gradual memory loss) and Lewy body dementia (hallucinations). Management focuses on vascular risk control (e.g., antihypertensives, statins) to prevent progression.",
      "❌ **Why not others**: Gradual memory loss (A) is typical of AD, not VaD’s stepwise pattern. Personality changes (C) suggest FTD. Language deficits with preserved memory (D) indicate primary progressive aphasia. Hallucinations and fluctuation (E) are for Lewy body dementia.",
    ],
  },
  {
    id: "VD-1002",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 75-year-old woman with a 3-year history of vascular dementia presents with worsening executive dysfunction and gait instability. She has a history of multiple TIAs, hypertension, and an MMSE score of 18/30. Brain MRI shows periventricular white matter changes. She is on aspirin and lisinopril. Which SINGLE management strategy is most appropriate for her moderate vascular dementia?",
    options: [
      { key: "A", text: "Start donepezil to improve memory" },
      {
        key: "B",
        text: "Optimize vascular risk factor control with blood pressure management and antiplatelet therapy",
      }, // correct
      { key: "C", text: "Initiate memantine for behavioral symptoms" },
      {
        key: "D",
        text: "Recommend cognitive behavioral therapy as primary treatment",
      },
      {
        key: "E",
        text: "Prescribe a low-dose antipsychotic for gait instability",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Moderate vascular dementia (VaD) management prioritizes preventing further vascular events through control of risk factors like hypertension and use of antiplatelets (e.g., aspirin), as cognitive decline is driven by cerebrovascular disease. This halts progression, unlike in AD where symptomatic treatments predominate.",
      "🧠 **Management considerations**: The MMSE score of 18/30 and white matter changes confirm moderate VaD. Blood pressure targets (<130/80 mmHg) reduce stroke risk by ~30%. Antiplatelets prevent TIAs. Cholinesterase inhibitors like donepezil show modest benefits in VaD (~50% of mixed VaD/AD cases). Physical therapy addresses gait instability, common in ~40% of VaD patients. Differential includes normal pressure hydrocephalus (triad of symptoms). Annual monitoring with MMSE tracks progression.",
      "❌ **Why not others**: Donepezil (A) is for AD; limited evidence in pure VaD. Memantine (C) is for moderate-severe AD, not first-line for VaD. CBT (D) is adjunctive, not primary. Antipsychotics (E) are for severe agitation, not gait issues, and increase stroke risk.",
    ],
  },
  {
    id: "VD-1003",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 70-year-old man with vascular dementia and a history of stroke presents with sudden worsening of confusion, urinary incontinence, and falls. His MMSE score is 15/30. Brain MRI shows acute infarct in the frontal lobe. He is on clopidogrel and atorvastatin. Which SINGLE complication of this patient’s vascular dementia requires immediate attention?",
    options: [
      { key: "A", text: "Aspiration pneumonia from swallowing dysfunction" },
      {
        key: "B",
        text: "Recurrent stroke leading to acute neurological deterioration",
      }, // correct
      { key: "C", text: "Seizures secondary to cortical damage" },
      { key: "D", text: "Pressure ulcers from immobility" },
      { key: "E", text: "Delirium from medication side effects" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Recurrent stroke is a major complication in vascular dementia (VaD), causing sudden worsening of symptoms like confusion and incontinence due to new infarcts disrupting neural circuits. This affects ~30% of VaD patients annually, requiring urgent evaluation to prevent further damage.",
      "🧠 **Complication considerations**: The MMSE score of 15/30 and frontal infarct confirm VaD progression. Falls and incontinence suggest new stroke, necessitating CT/MRI and thrombolysis if acute. Antiplatelet therapy (clopidogrel) reduces recurrence risk by ~20%. Differential includes delirium (reversible) and seizures (post-stroke, ~10% prevalence). Palliative care may be considered in recurrent cases. Caregiver support addresses burden, as ~50% report stress in VaD.",
      "❌ **Why not others**: Aspiration pneumonia (A) is more common in severe AD, not VaD. Seizures (C) are possible but not the primary issue here. Pressure ulcers (D) occur in immobility, not acute worsening. Delirium (E) is possible but less likely without triggers; stroke is the acute cause.",
    ],
  },
  {
    id: "VD-1004",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 68-year-old woman with suspected vascular dementia presents with executive dysfunction, apathy, and a history of hypertension. Her MMSE score is 24/30. Blood tests are normal. Which SINGLE investigation is most appropriate to confirm the diagnosis of vascular dementia?",
    options: [
      { key: "A", text: "Amyloid PET scan to detect plaques" },
      {
        key: "B",
        text: "Brain MRI to assess for infarcts and white matter changes",
      }, // correct
      { key: "C", text: "EEG to evaluate for slowing" },
      { key: "D", text: "Lumbar puncture for tau biomarkers" },
      { key: "E", text: "Genetic testing for APOE ε4" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Confirming vascular dementia (VaD) requires imaging evidence of cerebrovascular disease, such as infarcts or white matter hyperintensities on MRI, which has >90% sensitivity for detecting vascular pathology underlying cognitive impairment.",
      "🧠 **Investigation considerations**: The MMSE score of 24/30 suggests mild VaD. MRI identifies lacunar infarcts or periventricular changes, with Hachinski Score (>7) supporting diagnosis. Hypertension increases VaD risk by ~2x. Differential includes AD (amyloid PET positive) and FTD (frontal atrophy). Carotid ultrasound or CT angiography may follow for large vessel disease. Prevalence of VaD is ~15-20% of dementias, often mixed with AD.",
      "❌ **Why not others**: Amyloid PET (A) is for AD, not VaD. EEG (C) is for seizures or encephalopathy, not routine. Lumbar puncture (D) assesses AD biomarkers, not vascular. APOE ε4 testing (E) assesses AD risk, not diagnostic for VaD.",
    ],
  },
  {
    id: "VD-1005",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 73-year-old man with vascular dementia and a history of smoking and hyperlipidemia presents with cognitive impairment. He has no family history of dementia. Brain MRI shows small vessel disease. Which SINGLE etiological factor is most likely contributing to this patient’s vascular dementia?",
    options: [
      { key: "A", text: "Autosomal dominant mutations in NOTCH3 gene" },
      {
        key: "B",
        text: "Vascular risk factors like smoking and hyperlipidemia leading to small vessel disease",
      }, // correct
      { key: "C", text: "Amyloid-beta accumulation in the hippocampus" },
      { key: "D", text: "Chronic traumatic brain injury" },
      { key: "E", text: "Autoimmune-mediated vasculitis" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Vascular dementia (VaD) etiology primarily involves modifiable vascular risk factors (e.g., smoking, hyperlipidemia) causing small vessel disease, atherosclerosis, or infarcts, leading to cognitive impairment through reduced cerebral blood flow.",
      "🧬 **Etiology considerations**: Smoking increases VaD risk by ~2x via endothelial damage, and hyperlipidemia promotes atherosclerosis. MRI showing small vessel disease confirms etiology. No family history rules out genetic forms like CADASIL (NOTCH3 mutations, ~1% of VaD). Differential includes AD (amyloid pathology) and vasculitis (inflammatory markers). Prevalence of multi-infarct VaD is ~10% of dementias. Prevention through risk factor control (e.g., statins, smoking cessation) reduces incidence by ~30%.",
      "❌ **Why not others**: NOTCH3 mutations (A) cause CADASIL, rare and familial. Amyloid-beta (C) is for AD, not VaD. Traumatic brain injury (D) requires trauma history. Vasculitis (E) is autoimmune, requiring inflammatory evidence.",
    ],
  },
  {
    id: "VD-1006",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 69-year-old retired mechanic with a history of hypertension, smoking, and atrial fibrillation presents with a 2-year history of stepwise cognitive decline, including difficulty with problem-solving and recent worsening after a transient ischemic attack (TIA). He has mild right-sided weakness and an MMSE score of 20/30, with deficits in executive function and attention. Brain MRI shows multiple cortical infarcts. Which SINGLE clinical feature is most characteristic of this patient’s vascular dementia?",
    options: [
      {
        key: "A",
        text: "Gradual memory loss with preserved executive function",
      },
      {
        key: "B",
        text: "Stepwise cognitive decline with focal neurological signs and vascular risk factors",
      }, // correct
      { key: "C", text: "Prominent visual hallucinations and parkinsonism" },
      { key: "D", text: "Early language deficits with fluent speech" },
      { key: "E", text: "Severe apathy and social disinhibition" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Vascular dementia (VaD) is defined by stepwise cognitive decline tied to cerebrovascular events, such as strokes or TIAs, often accompanied by vascular risk factors (e.g., hypertension, smoking, atrial fibrillation) and focal neurological deficits (e.g., hemiparesis). This reflects ischemic damage to cortical or subcortical regions, impairing executive function and attention more than memory early on, distinguishing VaD from Alzheimer’s disease (AD).",
      "🧠 **Clinical considerations**: The MMSE score of 20/30 indicates moderate VaD, with cortical infarcts on MRI confirming cerebrovascular pathology. The Hachinski Ischemic Score (>7) supports VaD over AD. Atrial fibrillation increases stroke risk by ~5x, and smoking doubles VaD risk. Differential diagnoses include AD (gradual memory loss, amyloid pathology), Lewy body dementia (hallucinations, parkinsonism), and frontotemporal dementia (FTD, behavioral changes). Prevalence of VaD is ~15-20% of dementia cases, often mixed with AD in ~30% of patients. Management focuses on vascular risk control (e.g., anticoagulation, antihypertensives) and physical therapy for weakness. Caregiver education is vital, as ~50% report stress in VaD.",
      "❌ **Why not others**: Gradual memory loss (A) is characteristic of AD, not VaD’s stepwise pattern. Visual hallucinations and parkinsonism (C) suggest Lewy body dementia. Language deficits with fluent speech (D) indicate semantic primary progressive aphasia, not VaD. Severe apathy and disinhibition (E) are typical of FTD, not VaD.",
    ],
  },
  {
    id: "VD-1007",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 76-year-old woman with vascular dementia, hypertension, and a history of stroke presents with worsening executive dysfunction, apathy, and gait difficulties. She requires assistance with complex tasks like managing medications but can perform basic ADLs. Her MMSE score is 19/30. Brain MRI shows white matter hyperintensities and a prior lacunar infarct. She is on aspirin, lisinopril, and atorvastatin. Which SINGLE management strategy is most appropriate to address her moderate vascular dementia and gait impairment?",
    options: [
      { key: "A", text: "Initiate donepezil to improve executive function" },
      {
        key: "B",
        text: "Optimize vascular risk factor control and refer to physical therapy for gait training",
      }, // correct
      { key: "C", text: "Start memantine to address apathy" },
      {
        key: "D",
        text: "Prescribe a low-dose benzodiazepine for gait instability",
      },
      { key: "E", text: "Recommend immediate institutionalization for safety" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Moderate vascular dementia (VaD, MMSE 10-20) management centers on preventing further cerebrovascular events through aggressive control of vascular risk factors (e.g., hypertension, hyperlipidemia) and addressing functional impairments like gait difficulties. Physical therapy improves mobility and reduces fall risk, a key concern in VaD due to subcortical white matter damage.",
      "🧠 **Management considerations**: The MMSE score of 19/30 and MRI findings (white matter hyperintensities, lacunar infarct) confirm moderate VaD. Hypertension control (<130/80 mmHg) reduces stroke risk by ~30%, and statins lower recurrence risk by ~25%. Gait impairment, affecting ~40% of VaD patients, benefits from physical therapy, with ~60% showing improved mobility. Differential diagnoses include normal pressure hydrocephalus (NPH, with urinary incontinence) and Parkinson’s disease (tremor, rigidity), ruled out by history and imaging. Cholinesterase inhibitors like donepezil have modest benefits in mixed VaD/AD (~50% of cases). Caregiver support is critical, as ~50% experience burnout. Monitoring with MMSE every 6-12 months tracks progression.",
      "❌ **Why not others**: Donepezil (A) is primarily for AD; evidence in pure VaD is limited. Memantine (C) is for moderate-severe AD, not first-line for VaD apathy. Benzodiazepines (D) increase fall risk and confusion, contraindicated in VaD. Institutionalization (E) is premature for patients with preserved basic ADLs; safety aids (e.g., walkers) suffice.",
    ],
  },
  {
    id: "VD-1008",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Emergency Department Vignette",
    stem: "A 71-year-old man with vascular dementia, diabetes, and a history of multiple strokes presents to the emergency department with sudden worsening of confusion, slurred speech, and a new left-sided facial droop. His MMSE score is 14/30, down from 18/30 three months ago. Brain CT shows a new acute ischemic stroke in the right frontal lobe. He is on clopidogrel and metformin. Which SINGLE complication of this patient’s vascular dementia requires immediate management?",
    options: [
      { key: "A", text: "Aspiration pneumonia due to swallowing dysfunction" },
      {
        key: "B",
        text: "Acute ischemic stroke causing new neurological deficits",
      }, // correct
      { key: "C", text: "Seizures secondary to cortical infarcts" },
      { key: "D", text: "Urinary tract infection from incontinence" },
      { key: "E", text: "Delirium from medication side effects" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Acute ischemic stroke is a critical complication in vascular dementia (VaD), causing sudden neurological deterioration (e.g., facial droop, slurred speech) due to new infarcts disrupting brain function. It affects ~30% of VaD patients annually and requires urgent imaging (CT/MRI) and management (e.g., thrombolysis if within 4.5 hours) to limit damage and prevent recurrence.",
      "🧠 **Complication considerations**: The MMSE drop to 14/30 and new right frontal infarct confirm acute stroke in moderate VaD. Diabetes and prior strokes increase recurrence risk by ~3x. Clopidogrel reduces secondary stroke risk by ~20%. Differential diagnoses include seizures (~10% post-stroke risk, requiring EEG if suspected) and delirium (acute, reversible), ruled out by focal findings and CT evidence. Post-stroke rehabilitation (e.g., speech therapy) is essential, with ~40% of patients regaining partial function. Palliative care may be considered for recurrent strokes. Caregiver burden, affecting ~50% in VaD, requires support services.",
      "❌ **Why not others**: Aspiration pneumonia (A) is more common in severe AD, not VaD, without swallowing issues here. Seizures (C) are possible but not primary without convulsive symptoms. Urinary tract infections (D) require incontinence symptoms, not reported. Delirium (E) is less likely with clear stroke findings on CT.",
    ],
  },
  {
    id: "VD-1009",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 74-year-old woman with a history of hypertension and hyperlipidemia presents with a 1-year history of difficulty with organization, slowed thinking, and occasional urinary incontinence. Her MMSE score is 23/30, with deficits in executive function. Blood tests (thyroid, B12, folate) are normal. Which SINGLE investigation is most appropriate to confirm the diagnosis of vascular dementia in this patient?",
    options: [
      { key: "A", text: "Amyloid PET scan to detect amyloid-beta plaques" },
      {
        key: "B",
        text: "Brain MRI to evaluate for infarcts and white matter hyperintensities",
      }, // correct
      { key: "C", text: "Lumbar puncture for CSF tau levels" },
      { key: "D", text: "EEG to assess for subclinical seizures" },
      {
        key: "E",
        text: "Dopamine transporter scan (DaTscan) for nigrostriatal degeneration",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Diagnosing vascular dementia (VaD) requires imaging evidence of cerebrovascular disease, such as infarcts or white matter hyperintensities on brain MRI, which has >90% sensitivity for detecting vascular pathology underlying cognitive impairment. This confirms VaD in patients with vascular risk factors and executive dysfunction.",
      "🧠 **Investigation considerations**: The MMSE score of 23/30 and executive deficits suggest mild VaD. Hypertension and hyperlipidemia increase VaD risk by ~2x each. MRI is the gold standard, with Hachinski Ischemic Score (>7) supporting VaD over AD. Differential diagnoses include AD (amyloid pathology), normal pressure hydrocephalus (NPH, gait/incontinence triad), and Lewy body dementia (hallucinations). Carotid ultrasound may follow to assess stenosis (~10% of VaD cases). Prevalence of VaD is ~15-20% of dementias, often mixed with AD in ~30% of cases. Management includes vascular risk control (e.g., antihypertensives, statins) to slow progression.",
      "❌ **Why not others**: Amyloid PET (A) is for AD, not VaD. CSF tau levels (C) are for AD diagnosis, not vascular pathology. EEG (D) is for seizures, not indicated without seizure history. DaTscan (E) is for Lewy body dementia or Parkinson’s, not VaD.",
    ],
  },
  {
    id: "VD-1010",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 77-year-old man with a 5-year history of vascular dementia presents with worsening cognitive impairment and gait instability. He has a history of smoking, diabetes, and a prior stroke. His MMSE score is 16/30, with deficits in executive function and attention. Brain MRI shows extensive white matter hyperintensities and old infarcts. He has no family history of dementia. Which SINGLE etiological factor is most likely contributing to this patient’s vascular dementia?",
    options: [
      {
        key: "A",
        text: "Genetic mutations in the NOTCH3 gene causing CADASIL",
      },
      {
        key: "B",
        text: "Chronic small vessel disease from vascular risk factors like smoking and diabetes",
      }, // correct
      { key: "C", text: "Amyloid-beta and tau pathology in the hippocampus" },
      {
        key: "D",
        text: "Chronic heavy metal exposure causing neuronal toxicity",
      },
      { key: "E", text: "Autoimmune-mediated cortical inflammation" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Vascular dementia (VaD) is primarily driven by chronic small vessel disease from modifiable vascular risk factors, such as smoking and diabetes, leading to ischemia, white matter damage, and cognitive impairment. This disrupts subcortical networks, impairing executive function and gait, unlike AD’s amyloid-driven pathology.",
      "🧬 **Etiology considerations**: Smoking (2x risk) and diabetes (1.5-2x risk) promote small vessel disease, confirmed by MRI white matter hyperintensities and old infarcts. The MMSE score of 16/30 indicates moderate VaD. No family history rules out rare genetic forms like CADASIL (NOTCH3 mutations, ~1% of VaD). Differential includes AD (hippocampal atrophy, amyloid PET positive) and autoimmune encephalitis (inflammatory markers), both unlikely here. Prevalence of small vessel VaD is ~50% of VaD cases. Management with statins, glycemic control, and smoking cessation reduces progression risk by ~30%. Physical therapy addresses gait issues, affecting ~40% of VaD patients.",
      "❌ **Why not others**: NOTCH3 mutations (A) cause CADASIL, a rare familial condition, not supported by history. Amyloid/tau pathology (C) is for AD, not VaD. Heavy metal exposure (D) lacks evidence as a primary VaD cause. Autoimmune inflammation (E) requires systemic symptoms, not present here.",
    ],
  },
  {
    id: "VD-1011",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Stepwise Decline After Stroke",
    stem: "A 74-year-old woman presents with sudden-onset cognitive decline following a left MCA ischemic stroke 1 year ago. Her family reports abrupt worsening of memory and language after the event, followed by periods of stability and then further sudden drops after additional TIAs. MMSE is 18/30 with impaired naming and executive function. MRI brain reveals multiple cortical infarcts. Which SINGLE feature best distinguishes vascular dementia from Alzheimer’s dementia in this patient?",
    options: [
      {
        key: "A",
        text: "Gradual progressive memory loss with prominent hippocampal atrophy",
      },
      {
        key: "B",
        text: "Stepwise cognitive decline with focal neurological deficits",
      },
      {
        key: "C",
        text: "Early visuospatial disorientation and hallucinations",
      },
      {
        key: "D",
        text: "Parkinsonian motor features and fluctuating cognition",
      },
      { key: "E", text: "Episodic memory loss without vascular risk factors" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Vascular dementia (VaD) is a consequence of brain ischemia — damage from strokes (large or small) or chronic vascular injury. Unlike Alzheimer’s, where memory loss is gradual and hippocampal-driven, VaD often progresses in a ‘stair-step’ pattern: periods of sudden decline after an infarct, then plateaus, then further sudden drops.",
      "🧠 **Why correct**: This patient had a left MCA stroke with abrupt loss of language and cognition, followed by TIAs that worsened function further. This ‘stepwise deterioration’ combined with focal deficits (aphasia, hemiparesis, visual field loss, etc.) is the most telling clue toward vascular dementia.",
      "📸 **Imaging correlation**: MRI showing multiple cortical infarcts supports multi-infarct dementia. These infarcts disrupt cortical and subcortical networks needed for memory, executive function, and speech.",
      "❌ **Why not others**: (A) Gradual decline with hippocampal atrophy is Alzheimer’s. (C) Visual hallucinations and disorientation = Lewy body dementia. (D) Parkinsonism with fluctuating cognition = Parkinson’s disease dementia or Lewy body dementia. (E) Pure episodic memory loss without risk factors = Alzheimer’s. None fit the sudden-onset, stepwise course here.",
      "💡 **Exam pearl**: If you see ‘stepwise decline’ + vascular risk factors + stroke/TIA history → think vascular dementia. In contrast, Alzheimer’s = insidious onset, no focal neuro deficits early.",
    ],
  },
  {
    id: "VD-1012",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Subcortical Small Vessel Disease",
    stem: "An 80-year-old man with hypertension, hyperlipidemia, and atrial fibrillation presents with cognitive slowing, difficulty with planning, and unsteady gait. His MMSE is 20/30, with impaired executive function but relatively preserved episodic memory. MRI brain demonstrates diffuse periventricular white matter hyperintensities and lacunar infarcts in the basal ganglia. Which SINGLE cognitive pattern is most typical of small vessel vascular dementia?",
    options: [
      {
        key: "A",
        text: "Early episodic memory loss with hippocampal involvement",
      },
      {
        key: "B",
        text: "Executive dysfunction, slowed processing, and gait disturbance",
      },
      {
        key: "C",
        text: "Prominent hallucinations and REM sleep behavior disorder",
      },
      { key: "D", text: "Aphasia, apraxia, and agnosia as primary deficits" },
      { key: "E", text: "Behavioral disinhibition and personality change" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Pathophysiology**: Small vessel disease damages the subcortical white matter tracts that connect the frontal lobes with deeper brain structures. When these pathways are disrupted, you get slowed processing (bradyphrenia), poor planning, impaired attention, mood changes, and gait/balance problems. Episodic memory can remain relatively intact in early stages because the hippocampus is spared.",
      "🧠 **Why correct**: The clinical picture — executive dysfunction, cognitive slowing, and gait disturbance — combined with MRI white matter hyperintensities + lacunar infarcts = classic ‘subcortical vascular dementia.’ This form is extremely common in patients with hypertension and diabetes.",
      "📸 **Imaging correlation**: Periventricular white matter hyperintensities (aka leukoaraiosis) are a radiological hallmark of chronic ischemic injury. Lacunar infarcts in basal ganglia and thalamus further impair subcortical circuits.",
      "❌ **Why not others**: (A) Hippocampal episodic memory loss = Alzheimer’s. (C) Hallucinations/REM disturbance = Lewy body dementia. (D) Aphasia/apraxia/agnosia = cortical dementias like Alzheimer’s or frontotemporal dementia. (E) Behavioral disinhibition = frontotemporal dementia.",
      "💡 **Clinical pearl**: When you see a patient with slow thinking, shuffling gait, mood changes, and vascular risk factors + diffuse white matter disease → think small vessel VaD. Some call this the ‘subcortical dementia syndrome.’",
    ],
  },
  {
    id: "VD-1013",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Binswanger’s Disease",
    stem: "A 72-year-old woman with long-standing poorly controlled hypertension presents with progressive forgetfulness, urinary urgency, and frequent falls. Family describes emotional lability and slowed responses. MRI shows diffuse subcortical white matter lesions. Which SINGLE diagnosis best explains her presentation?",
    options: [
      { key: "A", text: "Binswanger’s subcortical leukoencephalopathy" },
      { key: "B", text: "Alzheimer’s disease" },
      { key: "C", text: "Normal pressure hydrocephalus" },
      { key: "D", text: "Parkinson’s disease dementia" },
      { key: "E", text: "Frontotemporal dementia" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **Binswanger’s disease**: A specific form of vascular dementia caused by hypertensive small vessel disease leading to diffuse demyelination of the deep white matter. Think of it as a severe, diffuse version of small vessel VaD.",
      "🧠 **Clinical triad**: (1) Cognitive decline with executive dysfunction, (2) gait disturbance with falls, (3) urinary incontinence. Emotional changes like pseudobulbar affect (involuntary laughing/crying) are common.",
      "📸 **Imaging correlation**: MRI shows diffuse subcortical white matter changes — a striking appearance often called leukoaraiosis. No hippocampal atrophy is seen, which distinguishes it from Alzheimer’s.",
      "❌ **Why not others**: (B) Alzheimer’s → memory-first, no urinary incontinence early. (C) NPH also has gait + urinary + cognitive triad but shows ventriculomegaly, not diffuse white matter disease. (D) Parkinson’s dementia requires prior parkinsonism. (E) FTD = personality/behavioral changes, not incontinence/falls.",
      "💡 **Exam pearl**: If you see the triad ‘gait + incontinence + dementia’ → always think of two possibilities: (1) Normal pressure hydrocephalus (ventriculomegaly) or (2) Binswanger’s disease (diffuse white matter damage). MRI distinguishes them.",
    ],
  },
  {
    id: "VD-1014",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Strategic Infarct Dementia",
    stem: "A 70-year-old man develops acute memory and language impairment following a left thalamic stroke. His cognition declined abruptly after this single vascular event. He has hypertension and atrial fibrillation. Which SINGLE mechanism best explains his vascular dementia?",
    options: [
      { key: "A", text: "Chronic hypoperfusion due to microangiopathy" },
      { key: "B", text: "Accumulation of amyloid plaques in temporal lobes" },
      {
        key: "C",
        text: "Disruption of critical cognitive networks from a single strategic infarct",
      },
      { key: "D", text: "Autoimmune-mediated neuronal inflammation" },
      { key: "E", text: "Cholinergic neuron degeneration in nucleus basalis" },
    ],
    correct: "C",
    explanation_detail: [
      "🌟 **Strategic infarct dementia**: Unlike diffuse small vessel disease, here a single infarct in a key brain region (like the thalamus, hippocampus, angular gyrus, or caudate) can cripple major cognitive networks and produce dementia. Think of it as ‘one well-placed bullet’ rather than ‘many tiny shrapnel wounds.’",
      "🧠 **Why correct**: This patient had a thalamic stroke followed by sudden cognitive decline — a classic example. The thalamus is a relay station; damage here disrupts widespread cortical–subcortical communication, leading to immediate cognitive impairment.",
      "❌ **Why not others**: (A) Microangiopathy = chronic small vessel VaD, but not the case here. (B) Amyloid = Alzheimer’s disease. (D) Autoimmune inflammation = autoimmune encephalitis. (E) Cholinergic neuron degeneration = Alzheimer’s, not vascular.",
      "💡 **Clinical pearl**: Sudden dementia after a single stroke in a ‘strategic’ location = Strategic infarct dementia. MRI/CT will show one focal lesion, not diffuse white matter disease.",
    ],
  },
  {
    id: "VD-1015",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Mixed Dementia Trap",
    stem: "A 76-year-old woman with hypertension and diabetes presents with progressive memory loss. She has both executive dysfunction and significant episodic memory impairment. MRI shows global atrophy, white matter changes, and hippocampal volume loss. Which SINGLE diagnosis best explains her presentation?",
    options: [
      { key: "A", text: "Pure Alzheimer’s disease" },
      { key: "B", text: "Mixed dementia (Alzheimer’s + vascular pathology)" },
      { key: "C", text: "Pure vascular dementia from small vessel disease" },
      { key: "D", text: "Frontotemporal dementia" },
      { key: "E", text: "Lewy body dementia" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Mixed dementia**: Up to 40% of dementia cases in older adults are ‘mixed,’ with both Alzheimer’s pathology (amyloid + tau, hippocampal atrophy) and vascular changes (white matter lesions, infarcts). Risk factors like hypertension and diabetes accelerate both processes.",
      "🧠 **Why correct**: This patient has signs of both diseases: (1) Episodic memory impairment + hippocampal atrophy → Alzheimer’s; (2) Executive dysfunction + vascular risk factors + white matter changes → vascular dementia. Together, this = mixed dementia.",
      "📸 **Imaging correlation**: Hippocampal atrophy (seen on coronal MRI) = Alzheimer’s; periventricular white matter lesions and infarcts = vascular dementia. The coexistence is key.",
      "❌ **Why not others**: (A) Pure AD would lack vascular lesions. (C) Pure VaD usually spares early episodic memory. (D) FTD = personality/behavior change, not early memory + executive dysfunction. (E) Lewy body = hallucinations, REM disturbance, parkinsonism.",
      "💡 **Clinical pearl**: If an elderly patient with vascular risk factors has BOTH prominent memory loss and executive dysfunction, always consider mixed dementia — it’s more common than exam writers admit.",
    ],
  },
  {
    id: "VD-1016",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Cognitive Decline with Silent Strokes",
    stem: "A 79-year-old man with hypertension and chronic atrial fibrillation presents with progressive cognitive slowing, poor attention, and frequent minor falls. His MMSE is 21/30, showing executive dysfunction. He never had a clinically apparent stroke. MRI brain reveals multiple silent lacunar infarcts in the basal ganglia and thalamus. Which SINGLE mechanism best explains his vascular dementia?",
    options: [
      {
        key: "A",
        text: "Progressive amyloid deposition in medial temporal lobes",
      },
      {
        key: "B",
        text: "Multiple silent infarcts accumulating to impair networks",
      },
      { key: "C", text: "Frontotemporal lobar degeneration" },
      { key: "D", text: "Lewy body accumulation in visual association cortex" },
      { key: "E", text: "Chronic demyelination from autoimmune attack" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Mechanism**: Vascular dementia can arise from multiple silent or ‘covert’ infarcts — strokes that don’t cause obvious acute deficits but, over time, damage key subcortical circuits. This is called ‘multi-infarct dementia.’",
      "🧠 **Why correct**: The patient never had a clinical stroke, but MRI shows accumulated silent lacunes. These disrupt attention, executive functioning, and motor pathways, leading to dementia + gait instability.",
      "📸 **Imaging pearl**: Lacunar infarcts are small (<15 mm) deep infarcts in basal ganglia, thalamus, or internal capsule. Multiple lacunes = strong predictor of cognitive decline.",
      "❌ **Why not others**: (A) = Alzheimer’s. (C) = FTD (behavioral change). (D) = Lewy body dementia (hallucinations). (E) = autoimmune encephalitis/MS, not suggested here.",
      "💡 **Clinical pearl**: Always think vascular dementia even if there’s no overt stroke history. Silent infarcts can ‘chip away’ cognition over years.",
    ],
  },
  {
    id: "VD-1017",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "The CT vs MRI Trap",
    stem: "A 75-year-old woman with diabetes and hypertension presents with memory complaints. CT head is reported as ‘age-related changes, no acute findings.’ Her MMSE is 19/30 with executive dysfunction. Family reports she is slow in daily activities and struggles with planning. An MRI is ordered, revealing periventricular white matter hyperintensities and multiple lacunar infarcts. Which SINGLE investigation is the most sensitive for diagnosing vascular dementia?",
    options: [
      { key: "A", text: "EEG" },
      { key: "B", text: "CT brain" },
      { key: "C", text: "MRI brain with FLAIR sequences" },
      { key: "D", text: "FDG-PET brain" },
      { key: "E", text: "CSF amyloid and tau levels" },
    ],
    correct: "C",
    explanation_detail: [
      "🌟 **Core diagnostic point**: CT is widely available but often misses small vessel disease and subtle ischemic injury. MRI, especially with FLAIR sequences, is far more sensitive in detecting white matter hyperintensities and lacunar infarcts.",
      "🧠 **Why correct**: The patient’s CT was ‘normal,’ but MRI uncovered the vascular burden. MRI remains the gold standard for VaD imaging, detecting silent infarcts, strategic infarcts, and diffuse small vessel disease.",
      "❌ **Why not others**: (A) EEG = nonspecific slowing in dementia. (B) CT can show infarcts/atrophy but is less sensitive. (D) FDG-PET helps in Alzheimer’s vs FTD, not vascular dementia. (E) CSF amyloid/tau = Alzheimer’s biomarkers.",
      "💡 **Clinical pearl**: If CT is ‘normal’ but suspicion for vascular dementia remains → always escalate to MRI. This is a common OSCE trap.",
    ],
  },
  {
    id: "VD-1018",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Cognitive Decline vs Delirium",
    stem: "An 82-year-old man with hypertension and peripheral vascular disease is admitted for pneumonia. During hospitalization, he is acutely confused, disoriented, and agitated. His baseline includes executive dysfunction and mild memory loss, with MRI showing white matter changes. Which SINGLE statement best differentiates vascular dementia from delirium in this case?",
    options: [
      {
        key: "A",
        text: "Vascular dementia presents with acute fluctuating cognition",
      },
      { key: "B", text: "Delirium has acute onset and fluctuating attention" },
      {
        key: "C",
        text: "Dementia symptoms always improve after infection resolves",
      },
      { key: "D", text: "Vascular dementia never coexists with delirium" },
      { key: "E", text: "Delirium primarily impairs episodic memory only" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Key distinction**: Dementia = chronic, progressive cognitive decline. Delirium = acute, fluctuating disturbance in attention and awareness, usually triggered by illness, drugs, or metabolic derangement.",
      "🧠 **Why correct**: This patient has baseline vascular dementia but developed superimposed delirium due to pneumonia. Fluctuating confusion + acute onset = delirium hallmark.",
      "❌ **Why not others**: (A) Acute fluctuations = delirium, not VaD. (C) Dementia does not ‘resolve.’ (D) Delirium can occur *on top of* dementia — common in older patients. (E) Delirium = global attention impairment, not just episodic memory.",
      "💡 **Clinical pearl**: Always assess for delirium in hospitalized elderly patients with dementia. It’s reversible if you treat the underlying trigger — missing this is a common exam pitfall.",
    ],
  },
  {
    id: "VD-1019",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Vascular Risk Factor Control",
    stem: "A 73-year-old woman with vascular dementia is reviewed in clinic. She has hypertension, type 2 diabetes, and a 40-pack-year smoking history. Her MMSE is 17/30. She is on no secondary prevention therapy. Which SINGLE intervention has the strongest evidence for slowing progression of vascular dementia?",
    options: [
      { key: "A", text: "Cholinesterase inhibitors (donepezil)" },
      {
        key: "B",
        text: "Tight control of vascular risk factors (BP, diabetes, smoking cessation)",
      },
      { key: "C", text: "Antipsychotic therapy for agitation" },
      { key: "D", text: "Omega-3 fatty acid supplementation" },
      { key: "E", text: "Cognitive rehabilitation therapy alone" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Core principle**: The best way to slow vascular dementia is to stop further vascular injury. This means aggressive management of modifiable risk factors: blood pressure control, glycemic control, lipid lowering, antiplatelets/anticoagulation if indicated, and smoking cessation.",
      "🧠 **Why correct**: Donepezil and other cholinesterase inhibitors have *limited* efficacy in VaD (though sometimes used off-label). Risk factor control has strong evidence in reducing future infarcts, thus slowing progression.",
      "❌ **Why not others**: (A) Donepezil = modest benefit in AD > VaD. (C) Antipsychotics = only for severe behavioral symptoms, increase mortality. (D) Omega-3 = weak evidence. (E) Cognitive rehab helps function but doesn’t modify disease biology.",
      "💡 **Clinical pearl**: In VaD, drugs are secondary; lifestyle and vascular control are first line. The exam loves to test this difference from Alzheimer’s.",
    ],
  },
  {
    id: "VD-1020",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "The OSCE Gait Clue",
    stem: "A 78-year-old man is being assessed in clinic for cognitive decline. He has executive dysfunction, bradyphrenia (slowed responses), and difficulty managing daily tasks. On exam, he has a wide-based shuffling gait. MRI brain shows diffuse periventricular white matter disease. Which SINGLE dementia subtype is most likely?",
    options: [
      { key: "A", text: "Alzheimer’s disease" },
      { key: "B", text: "Lewy body dementia" },
      { key: "C", text: "Frontotemporal dementia" },
      {
        key: "D",
        text: "Subcortical vascular dementia (small vessel disease)",
      },
      { key: "E", text: "Normal pressure hydrocephalus" },
    ],
    correct: "D",
    explanation_detail: [
      "🌟 **Clinical clue**: Gait disturbance + executive dysfunction + slowed processing = the ‘subcortical dementia syndrome,’ classic for small vessel vascular dementia. MRI showing white matter disease clinches it.",
      "🧠 **Why correct**: Subcortical VaD arises from ischemic injury to white matter tracts connecting frontal lobes with basal ganglia/thalamus. This produces cognitive slowing, poor planning, mood changes, and gait disturbance.",
      "❌ **Why not others**: (A) AD = memory first, gait late. (B) Lewy body = hallucinations, REM sleep disorder, parkinsonism. (C) FTD = disinhibition, apathy, language changes. (E) NPH also has gait + incontinence + dementia, but MRI would show ventriculomegaly, not diffuse white matter lesions.",
      "💡 **OSCE pearl**: If the examiner describes dementia + gait disturbance early → think vascular dementia or NPH. MRI is your tie-breaker: ventriculomegaly = NPH; white matter hyperintensities = VaD.",
    ],
  },
  {
    id: "VD-1021",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "CADASIL – Genetic Small Vessel Dementia",
    stem: "A 62-year-old man presents with progressive cognitive decline, migraine with aura since young adulthood, and recurrent small strokes. Family history reveals similar problems in his father. MRI shows extensive white matter hyperintensities, especially in the anterior temporal lobes. Which SINGLE underlying genetic abnormality is most likely responsible?",
    options: [
      { key: "A", text: "NOTCH3 gene mutation" },
      { key: "B", text: "Presenilin-1 mutation" },
      { key: "C", text: "Apolipoprotein E4 allele" },
      { key: "D", text: "HTT trinucleotide repeat expansion" },
      { key: "E", text: "MAPT mutation" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **CADASIL (Cerebral Autosomal Dominant Arteriopathy with Subcortical Infarcts and Leukoencephalopathy)**: Rare but classic exam case. Caused by NOTCH3 mutations on chromosome 19, leading to smooth muscle dysfunction in small vessels → recurrent strokes + subcortical dementia.",
      "🧠 **Clues**: Migraine with aura (often early), family history (autosomal dominant), recurrent small strokes, cognitive decline. MRI with anterior temporal lobe white matter lesions is pathognomonic.",
      "❌ **Why not others**: (B) Presenilin = early-onset Alzheimer’s. (C) ApoE4 = risk factor for Alzheimer’s, not VaD. (D) HTT = Huntington’s disease. (E) MAPT = frontotemporal dementia.",
      "💡 **Clinical pearl**: If you see young-onset dementia + migraines + strokes + strong family history = always think CADASIL.",
    ],
  },
  {
    id: "VD-1022",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "CARASIL – The Recessive Cousin",
    stem: "A 59-year-old man presents with early cognitive decline, spastic paraparesis, and alopecia. He has no vascular risk factors. MRI shows diffuse white matter changes consistent with small vessel disease. His brother has a similar disorder. Which SINGLE genetic defect is most likely?",
    options: [
      { key: "A", text: "HTRA1 gene mutation" },
      { key: "B", text: "NOTCH3 mutation" },
      { key: "C", text: "ApoE4 allele" },
      { key: "D", text: "C9orf72 repeat expansion" },
      { key: "E", text: "Presenilin-2 mutation" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **CARASIL (Cerebral Autosomal Recessive Arteriopathy with Subcortical Infarcts and Leukoencephalopathy)**: Ultra-rare. Caused by HTRA1 mutations. Unlike CADASIL, it is recessive and associated with alopecia and spondylosis.",
      "🧠 **Clues**: No vascular risk factors, family history with recessive inheritance, systemic features (hair loss, spine problems) + white matter disease.",
      "❌ **Why not others**: (B) NOTCH3 = CADASIL (dominant). (C) ApoE4 = Alzheimer’s risk. (D) C9orf72 = ALS/FTD. (E) Presenilin-2 = early Alzheimer’s.",
      "💡 **Exam pearl**: If alopecia + dementia + spasticity + white matter disease in a recessive pattern → CARASIL.",
    ],
  },
  {
    id: "VD-1023",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Post-Intracerebral Hemorrhage Dementia",
    stem: "A 76-year-old man had a large left basal ganglia intracerebral hemorrhage 2 years ago. Since then, his family notes progressive cognitive decline, personality change, and impaired executive function. MRI shows hemosiderin deposits and surrounding white matter gliosis. Which SINGLE mechanism most explains his dementia?",
    options: [
      {
        key: "A",
        text: "Direct cortical neuronal degeneration by amyloid-beta",
      },
      {
        key: "B",
        text: "Disruption of subcortical circuits due to hemorrhage and secondary gliosis",
      },
      { key: "C", text: "Autoimmune-mediated cortical inflammation" },
      { key: "D", text: "Tau protein accumulation in frontal lobes" },
      { key: "E", text: "Synuclein accumulation in substantia nigra" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Mechanism**: Large intracerebral hemorrhage causes direct tissue destruction + disruption of white matter tracts. Over time, hemosiderin and gliosis lead to chronic subcortical disconnection → cognitive and executive dysfunction.",
      "🧠 **Why correct**: Patient’s basal ganglia bleed directly damaged frontal-subcortical loops → classic vascular dementia picture.",
      "❌ **Why not others**: (A) Amyloid = Alzheimer’s. (C) Autoimmune = limbic encephalitis. (D) Tau = Alzheimer’s/FTD. (E) Synuclein = Parkinson’s/Lewy body dementia.",
      "💡 **Clinical pearl**: Dementia post-hemorrhage is vascular dementia, not Alzheimer’s. MRI will show hemosiderin (old bleed) + gliosis.",
    ],
  },
  {
    id: "VD-1024",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Prognosis Question",
    stem: "A 79-year-old woman with vascular dementia secondary to small vessel disease asks about her prognosis. Which SINGLE statement best reflects the natural history of vascular dementia?",
    options: [
      {
        key: "A",
        text: "Vascular dementia always progresses linearly without fluctuation",
      },
      {
        key: "B",
        text: "Progression is often stepwise with sudden declines after strokes",
      },
      { key: "C", text: "Most patients improve spontaneously with time" },
      { key: "D", text: "Progression is identical to Alzheimer’s disease" },
      {
        key: "E",
        text: "Life expectancy is unaffected compared to healthy peers",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Natural history**: VaD progression is usually ‘stepwise’ — sudden deterioration after strokes or TIAs, then periods of plateau. Contrast with Alzheimer’s → slow, steady, continuous decline.",
      "🧠 **Prognosis**: Average survival after diagnosis is 5–7 years, similar to Alzheimer’s, but comorbid vascular disease increases cardiovascular mortality.",
      "❌ **Why not others**: (A) Linear = Alzheimer’s, not VaD. (C) Dementia is irreversible. (D) AD and VaD differ: stepwise vs gradual. (E) Life expectancy is shortened due to both dementia and vascular comorbidities.",
      "💡 **Clinical pearl**: In OSCE stations, if asked about prognosis → emphasize stepwise course and importance of preventing further strokes with vascular risk control.",
    ],
  },
  {
    id: "VD-1025",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Overlap with Alzheimer’s Pathology",
    stem: "A 78-year-old woman has both executive dysfunction and severe episodic memory loss. MRI shows hippocampal atrophy, diffuse white matter disease, and multiple old lacunar infarcts. Which SINGLE term best describes her diagnosis?",
    options: [
      { key: "A", text: "Pure Alzheimer’s disease" },
      { key: "B", text: "Pure vascular dementia" },
      { key: "C", text: "Mixed dementia (Alzheimer’s and vascular)" },
      { key: "D", text: "Frontotemporal dementia" },
      { key: "E", text: "Lewy body dementia" },
    ],
    correct: "C",
    explanation_detail: [
      "🌟 **Mixed dementia**: Very common in older adults (>40%). Both Alzheimer’s pathology (amyloid, tau, hippocampal atrophy) and vascular damage (infarcts, white matter disease) coexist, accelerating decline.",
      "🧠 **Why correct**: Patient has hippocampal atrophy (AD) + infarcts/white matter disease (VaD) → definition of mixed dementia.",
      "❌ **Why not others**: (A) Pure AD = memory first, no infarcts. (B) Pure VaD = executive dysfunction, memory relatively spared early. (D) FTD = behavior/language changes, not memory + infarcts. (E) Lewy = hallucinations, REM disorder.",
      "💡 **Clinical pearl**: Mixed dementia is often under-recognized. Always suspect it in elderly with vascular risk factors + strong memory impairment.",
    ],
  },
  {
    id: "VD-1026",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Secondary Prevention After Stroke",
    stem: "A 74-year-old man with a history of TIA and vascular dementia is reviewed in clinic. He is hypertensive and smokes daily. He is not on any secondary prevention medications. Which SINGLE intervention is the most evidence-based first-line step to reduce further cognitive decline?",
    options: [
      { key: "A", text: "Start aspirin and optimize blood pressure control" },
      { key: "B", text: "Start memantine for cognitive improvement" },
      { key: "C", text: "Start SSRI for mood stabilization" },
      { key: "D", text: "Begin vitamin E supplementation" },
      { key: "E", text: "Arrange for cognitive behavioral therapy" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **Management principle**: In vascular dementia, the most effective way to slow progression is preventing further vascular insults. This means aggressive vascular risk factor control + antiplatelet therapy if stroke/TIA history is present.",
      "🧠 **Why correct**: Aspirin (or clopidogrel if intolerant) + tight BP control lowers risk of recurrent infarcts, thus slowing cognitive decline. Smoking cessation, statin therapy, and diabetes management are also essential.",
      "❌ **Why not others**: (B) Memantine/cholinesterase inhibitors = limited evidence, not first-line in pure VaD. (C) SSRIs treat depression, not core dementia. (D) Vitamin E lacks benefit, may increase mortality. (E) CBT supportive, but not disease-modifying.",
      "💡 **Exam pearl**: If asked about slowing progression of VaD → always pick ‘vascular risk factor optimization’ over cognitive enhancers.",
    ],
  },
  {
    id: "VD-1027",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Cholinesterase Inhibitors in VaD",
    stem: "A 79-year-old woman with mixed dementia (vascular + Alzheimer’s) is trialed on donepezil. Her family reports some mild improvement in memory but no change in executive dysfunction or gait disturbance. Which SINGLE statement best explains this response?",
    options: [
      {
        key: "A",
        text: "Donepezil is primarily effective in subcortical small vessel dementia",
      },
      {
        key: "B",
        text: "Cholinesterase inhibitors target Alzheimer’s pathology, not vascular",
      },
      {
        key: "C",
        text: "Donepezil has strong evidence in preventing new infarcts",
      },
      {
        key: "D",
        text: "Vascular dementia patients cannot respond to cognitive enhancers",
      },
      {
        key: "E",
        text: "Cholinesterase inhibitors are contraindicated in dementia",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Drug role**: Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) improve cognition in Alzheimer’s disease by enhancing acetylcholine in surviving neurons. Their benefit in pure VaD is minimal, but in mixed dementia (common in elderly), they may help memory deficits from the Alzheimer’s component.",
      "🧠 **Why correct**: The patient improved in memory (Alzheimer’s feature) but not executive/gait (vascular feature). This matches the expected partial response.",
      "❌ **Why not others**: (A) Subcortical VaD doesn’t respond. (C) Donepezil does not prevent infarcts. (D) Some mixed dementia patients improve. (E) They are not contraindicated; in fact, they are NICE-approved for AD and mixed dementia.",
      "💡 **Clinical pearl**: Always consider mixed dementia if you see partial benefit from cholinesterase inhibitors.",
    ],
  },
  {
    id: "VD-1028",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Depression vs Dementia",
    stem: "A 76-year-old man presents with poor concentration, low mood, and forgetfulness. His wife reports loss of interest and early morning wakening. On testing, he is slow but recalls details when prompted. MRI shows moderate white matter hyperintensities. Which SINGLE diagnosis best fits?",
    options: [
      { key: "A", text: "Pure vascular dementia" },
      { key: "B", text: "Depression (‘pseudodementia’)" },
      { key: "C", text: "Alzheimer’s disease" },
      { key: "D", text: "Frontotemporal dementia" },
      { key: "E", text: "Delirium" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **Key distinction**: Depression can mimic dementia (‘pseudodementia’). Patients may complain of memory loss but often recall with cues, unlike dementia patients who confabulate or forget entirely.",
      "🧠 **Why correct**: This patient’s depressive symptoms (anhedonia, early morning wakening) + recall with prompting = depression. MRI white matter changes may reflect incidental small vessel disease, not causative.",
      "❌ **Why not others**: (A) VaD = executive dysfunction, gait, not recall improvement. (C) AD = progressive episodic memory loss, no recall with cues. (D) FTD = personality change, disinhibition. (E) Delirium = acute, fluctuating, not chronic.",
      "💡 **Exam pearl**: Always rule out depression in elderly with cognitive complaints before diagnosing dementia.",
    ],
  },
  {
    id: "VD-1029",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Hard",
    vignetteTitle: "Rehabilitation in VaD",
    stem: "A 72-year-old woman with vascular dementia after a lacunar stroke struggles with dressing, cooking, and managing finances. She has preserved insight and motivation. Which SINGLE supportive intervention will most improve her functional independence?",
    options: [
      {
        key: "A",
        text: "Occupational therapy with executive function training",
      },
      { key: "B", text: "Antipsychotics to reduce behavioral issues" },
      { key: "C", text: "SSRIs for depression" },
      { key: "D", text: "Donepezil to enhance memory" },
      { key: "E", text: "Vitamin B12 injections" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **Supportive management**: Non-pharmacological interventions are crucial. Occupational therapy helps patients develop strategies to compensate for executive dysfunction (lists, structured routines, cue cards). This preserves independence for longer.",
      "🧠 **Why correct**: Patient has preserved motivation/insight → excellent candidate for OT and cognitive rehabilitation.",
      "❌ **Why not others**: (B) Antipsychotics are last resort, with ↑ mortality. (C) SSRIs help mood, not core executive impairment. (D) Donepezil = minimal effect in VaD. (E) B12 deficiency = dementia mimic, but here diagnosis is established.",
      "💡 **OSCE pearl**: If asked about supportive care in VaD → always mention OT, PT (gait), and speech therapy (language/executive tasks).",
    ],
  },
  {
    id: "VD-1030",
    topic: "Geriatrics • Vascular dementia",
    difficulty: "Moderate",
    vignetteTitle: "Agitation in Vascular Dementia",
    stem: "An 81-year-old man with vascular dementia becomes increasingly agitated and aggressive on the ward. Non-pharmacological strategies have failed, and he poses a risk to staff. Which SINGLE pharmacological intervention is most appropriate short-term?",
    options: [
      { key: "A", text: "Haloperidol low-dose, short-term use" },
      { key: "B", text: "Long-term benzodiazepine use" },
      { key: "C", text: "High-dose haloperidol for sedation" },
      { key: "D", text: "Start memantine" },
      { key: "E", text: "Start SSRI therapy immediately" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **Behavioral management**: First-line = non-drug approaches (environmental control, reassurance, staff training). If risk persists, NICE allows short-term low-dose antipsychotics (haloperidol, risperidone). Always reassess regularly.",
      "🧠 **Why correct**: Low-dose haloperidol is effective for acute agitation, but only for the shortest period necessary due to ↑ risk of stroke, mortality, and extrapyramidal side effects.",
      "❌ **Why not others**: (B) Benzodiazepines cause sedation, falls, delirium. (C) High-dose haloperidol = dangerous. (D) Memantine = cognitive drug, not acute agitation. (E) SSRIs = long-term mood, not acute control.",
      "💡 **Clinical pearl**: Always document non-pharmacological attempts first. In OSCEs, examiners love if you mention risk–benefit discussion with family.",
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
  // md = 768px
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

/* Mobile question list modal (instead of fixed sidebar) */
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
                    {QUESTIONS[qi].stem}
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

/* --------------------------- Page --------------------------- */
export default function VascularDementia() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  // session/order state
  const [order, setOrder] = useState(QUESTIONS.map((_, i) => i));
  const [started, setStarted] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showLabs, setShowLabs] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // highlighting
  const [highlightMode, setHighlightMode] = useState(false);
  const highlightRef = useRef(null);

  const q = QUESTIONS[order[currentIdx]];
  const total = QUESTIONS.length;
  const progress = ((currentIdx + 1) / Math.max(total, 1)) * 100;

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

  // start overlay pick
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
  };

  // keyboard navigation
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
  const next = () => currentIdx < total - 1 && setCurrentIdx((i) => i + 1);
  const prev = () => currentIdx > 0 && setCurrentIdx((i) => i - 1);

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

      {/* Floating toggle: mobile bottom-right; desktop left edge */}
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
          {/* Desktop slide-out Sidebar */}
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
                            {qq.stem}
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
                            onChange={() => choose(opt.key)}
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
                      </>
                    )}
                  </div>

                  {/* Explanation (single card) */}
                  {revealed[q.id] && (
                    <div className="mt-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900 mb-2">
                          Explanation
                        </p>
                        <div className="space-y-2 text-slate-800">
                          {q.explanation_detail?.map((para, i) => (
                            <p
                              key={i}
                              dangerouslySetInnerHTML={{ __html: para }}
                            />
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

      {/* Start choice (solid white overlay) */}
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
      title="Start Vascular Dementia Question Bank"
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
