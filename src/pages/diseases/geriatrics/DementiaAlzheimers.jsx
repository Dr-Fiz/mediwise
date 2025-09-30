import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------ Question Data ------------------------ */
/* NOTE: Add images in /public and set q.image = "/file.png" if needed */
const QUESTIONS = [
  {
    id: "AD-1001",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem:
      "A 74-year-old woman presents with 18 months of progressive memory problems. " +
      "Her daughter notes repeated questions and difficulty recalling recent conversations. " +
      "Examination shows preserved motor function and normal gait. MoCA is 22/30 with impaired delayed recall. " +
      "Which SINGLE investigation is most appropriate first line to evaluate potentially reversible contributors?",
    options: [
      { key: "A", text: "Lumbar puncture for CSF amyloid and tau" },
      { key: "B", text: "FDG-PET to assess temporoparietal hypometabolism" },
      { key: "C", text: "Routine blood tests incl. TSH, B12, folate, and CMP" }, // correct
      { key: "D", text: "EEG for diffuse slowing" },
      { key: "E", text: "Genetic testing for APP/PSEN mutations" },
    ],
    correct: "C",
    explanation_detail: [
      "First principles: before diagnosing a primary neurodegenerative dementia, screen for reversible contributors. Low-cost labs pick up common culprits such as hypothyroidism, B12/folate deficiency, anaemia, infection and metabolic derangements.",
      "Typical initial panel: FBC, U&E/CMP, LFT, TSH, B12/folate (± HbA1c/lipids, CRP/ESR as context dictates) and a depression screen. Imaging with CT/MRI is recommended, but bloods are usually the earliest, most accessible test.",
      "Advanced biomarkers (CSF Aβ/tau) and FDG-PET are specialist tests reserved for atypical/early-onset or diagnostically uncertain cases. Routine EEG is not used for standard Alzheimer’s workup unless seizures/encephalopathy are suspected. APP/PSEN testing is for strong, early-onset familial patterns.",
    ],
  },
  {
    id: "AD-1002",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Medium",
    vignetteTitle: "Therapeutics",
    stem:
      "An otherwise independent 76-year-old man is diagnosed with mild Alzheimer’s disease. " +
      "Which SINGLE treatment is most appropriate to initiate for symptomatic benefit at this stage?",
    options: [
      { key: "A", text: "Memantine monotherapy" },
      { key: "B", text: "Rivastigmine (acetylcholinesterase inhibitor)" }, // correct
      { key: "C", text: "Haloperidol regular for behavioural symptoms" },
      { key: "D", text: "High-dose vitamin E supplementation" },
      { key: "E", text: "No pharmacologic therapy until moderate stage" },
    ],
    correct: "B",
    explanation_detail: [
      "For mild–moderate Alzheimer’s, start a cholinesterase inhibitor (donepezil, rivastigmine, or galantamine). These agents provide modest improvements in cognition/ADLs and may slow decline.",
      "Memantine is more often used in moderate–severe disease or when cholinesterase inhibitors are contraindicated/not tolerated; it can be added later in combination therapy.",
      "Avoid routine antipsychotics: small, targeted, short-term use may be considered only for severe distress/psychosis after non-pharmacologic measures, given higher risks (stroke/mortality). Antioxidants (e.g., high-dose vitamin E) lack robust benefit and may carry harm.",
      "Counsel on adverse effects (GI upset, bradycardia/syncope risk), do med reconciliation for anticholinergics, and combine with non-drug approaches (education, routines, carer support, exercise, hearing/vision optimisation).",
    ],
  },
  {
    id: "AD-1003",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Medium",
    vignetteTitle: "Neuroimaging",
    stem:
      "A 72-year-old woman with gradual amnestic decline undergoes MRI brain. " +
      "Which SINGLE radiologic feature most supports a diagnosis of Alzheimer’s pathology?",
    options: [
      { key: "A", text: "Marked frontal and anterior temporal lobe atrophy" },
      { key: "B", text: "Occipital hypometabolism with visual hallucinations" },
      { key: "C", text: "Medial temporal (hippocampal) and parietal atrophy" }, // correct
      { key: "D", text: "Large-vessel territory infarcts in MCA distribution" },
      { key: "E", text: "Symmetric basal ganglia calcifications" },
    ],
    correct: "C",
    explanation_detail: [
      "Structural imaging in Alzheimer’s commonly shows disproportionate medial temporal (hippocampal) and parietal atrophy, supporting an amnestic presentation.",
      "Differentials by pattern: prominent frontal/anterior temporal atrophy suggests frontotemporal dementia; occipital involvement with visual hallucinations is more typical of Lewy body disease; territorial infarcts point to vascular dementia; basal ganglia calcifications are nonspecific and suggest other processes (e.g., metabolic).",
      "Imaging is primarily to exclude structural/cerebrovascular causes and to support the clinical syndrome; advanced biomarkers/PET are reserved for atypical cases or research settings.",
    ],
  },
  {
    id: "AD-1001",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 78-year-old retired teacher presents with complaints from her family about increasing forgetfulness over the past year. She frequently misplaces items like her glasses and keys and has trouble remembering recent conversations or appointments. She remains independent in daily activities. Her MMSE score is 24/30, with deficits in short-term recall and orientation to time. No history of stroke or substance abuse is reported. Which SINGLE management option is most appropriate to initiate for her suspected early Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Start high-dose donepezil to reverse cognitive decline",
      },
      {
        key: "B",
        text: "Recommend cognitive behavioral therapy as the primary intervention",
      },
      {
        key: "C",
        text: "Initiate cholinesterase inhibitor therapy, such as donepezil at a low dose",
      }, // correct
      { key: "D", text: "Prescribe memantine to manage behavioral symptoms" },
      {
        key: "E",
        text: "Advise immediate institutionalization due to safety concerns",
      },
    ],
    correct: "C",
    explanation_detail: [
      "First principles: Early Alzheimer’s disease (AD) is managed with cholinesterase inhibitors (e.g., donepezil) to improve cognition and function by increasing acetylcholine. Low-dose initiation (5 mg daily) minimizes side effects like nausea.",
      "Management considerations: Donepezil is FDA-approved for mild AD (MMSE 21-26). Lifestyle interventions (e.g., exercise, cognitive stimulation) complement pharmacotherapy. Monitoring with MMSE every 6 months is recommended.",
      "Why not others: High-dose donepezil (A) risks side effects without reversing disease. CBT (B) is adjunctive, not primary. Memantine (D) is for moderate-severe AD. Institutionalization (E) is premature for independent patients; safety aids (e.g., reminders) suffice.",
    ],
  },
  {
    id: "AD-1002",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Emergency Department Vignette",
    stem: "An 82-year-old former engineer is brought to the emergency department due to worsening agitation and wandering at night over the last 6 months. He has a 3-year history of Alzheimer’s disease, with progressive memory loss and difficulty recognizing family. He requires assistance with dressing but eats independently. His MMSE score is 15/30. Current medications include donepezil 10 mg daily. Which SINGLE pharmacologic addition is most appropriate for his moderate Alzheimer’s disease and behavioral symptoms?",
    options: [
      {
        key: "A",
        text: "Increase donepezil dose to maximum to address agitation",
      },
      {
        key: "B",
        text: "Add an antipsychotic like haloperidol for immediate symptom control",
      },
      { key: "C", text: "Initiate memantine to complement donepezil therapy" }, // correct
      { key: "D", text: "Prescribe lorazepam for sundowning" },
      { key: "E", text: "Start sertraline without further evaluation" },
    ],
    correct: "C",
    explanation_detail: [
      "First principles: Moderate AD (MMSE 10-20) with behavioral symptoms (e.g., agitation, sundowning) is managed with memantine (NMDA antagonist) added to cholinesterase inhibitors to reduce glutamate excitotoxicity and improve cognition/behavior.",
      "Management considerations: Start memantine at 5 mg daily, titrating to 10 mg twice daily. Non-pharmacologic strategies (e.g., structured routines) are first-line for agitation. Antipsychotics are reserved for severe, refractory cases due to risks.",
      "Why not others: Increasing donepezil (A) may worsen agitation. Haloperidol (B) increases stroke/mortality risk. Lorazepam (D) worsens confusion/falls. Sertraline (E) requires mood evaluation first, as no depression is noted.",
    ],
  },
  {
    id: "AD-1003",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 85-year-old woman with a 7-year history of Alzheimer’s disease is nonverbal, requires full assistance with all ADLs, and has swallowing difficulties with 10% weight loss in 6 months. Her MMSE score is 6/30. She exhibits agitation during care. Current medications include donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE management option is most appropriate to address her severe Alzheimer’s disease and agitation?",
    options: [
      {
        key: "A",
        text: "Discontinue donepezil and memantine due to lack of efficacy",
      },
      { key: "B", text: "Add low-dose quetiapine for agitation" }, // correct
      {
        key: "C",
        text: "Increase memantine dose to address cognitive decline",
      },
      {
        key: "D",
        text: "Prescribe a high-calorie supplement without evaluation",
      },
      { key: "E", text: "Recommend immediate hospice referral" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Severe AD (MMSE <10) with agitation requires non-pharmacologic strategies first (e.g., calm environment). If ineffective, low-dose atypical antipsychotics (e.g., quetiapine 25 mg) can manage behavioral symptoms, with monitoring for stroke risk.",
      "Management considerations: Palliative care addresses complications (e.g., swallowing issues). Swallowing evaluation is needed for weight loss. Donepezil/memantine may continue for modest benefits unless side effects dominate.",
      "Why not others: Discontinuing medications (A) is controversial; benefits may persist. Increasing memantine (C) lacks evidence. Supplements (D) require swallowing assessment to prevent aspiration. Hospice (E) is premature without terminal prognosis.",
    ],
  },
  {
    id: "AD-1004",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 62-year-old accountant presents with a 2-year history of difficulty with problem-solving and organizing tasks. He struggles with spreadsheets and forgets colleague names but recalls recent events. His MMSE score is 26/30, with deficits in executive function. Family history includes a mother with dementia at age 65. Brain MRI shows mild frontal and temporal atrophy, and amyloid PET is positive. Which SINGLE management option is most appropriate for his suspected early-onset Alzheimer’s disease?",
    options: [
      { key: "A", text: "Start memantine to target executive dysfunction" },
      { key: "B", text: "Initiate donepezil and refer for genetic counseling" }, // correct
      { key: "C", text: "Order lumbar puncture for CSF analysis" },
      { key: "D", text: "Prescribe an SSRI for possible depression" },
      {
        key: "E",
        text: "Recommend cognitive training as the sole intervention",
      },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Early-onset AD (EOAD) with executive dysfunction is managed with cholinesterase inhibitors (e.g., donepezil 5 mg) to improve cognition. Family history suggests genetic risk (e.g., PSEN1/APP), warranting genetic counseling.",
      "Management considerations: Amyloid PET positivity confirms AD. Non-pharmacologic strategies (e.g., cognitive stimulation) complement therapy. Monitor with MoCA for atypical presentations.",
      "Why not others: Memantine (A) is for moderate-severe AD. CSF analysis (C) is redundant with positive PET. SSRI (D) requires mood assessment; no depression is noted. Cognitive training (E) is adjunctive, not sole therapy.",
    ],
  },
  {
    id: "AD-1005",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 76-year-old retired librarian presents with a 2-year history of increasing memory difficulties, forgetting where she parked her car and names of new acquaintances. She remains independent in daily activities. Her MMSE score is 27/30, and MoCA is 22/30, with deficits in delayed recall. Blood tests (thyroid, B12, folate) are normal. Which SINGLE management option is most appropriate for her suspected mild cognitive impairment progressing to Alzheimer’s disease?",
    options: [
      { key: "A", text: "Initiate memantine to prevent progression" },
      { key: "B", text: "Start donepezil to treat early Alzheimer’s disease" },
      {
        key: "C",
        text: "Recommend observation with follow-up cognitive testing",
      }, // correct
      { key: "D", text: "Prescribe lorazepam for memory-related anxiety" },
      { key: "E", text: "Order lumbar puncture for CSF biomarkers" },
    ],
    correct: "C",
    explanation_detail: [
      "First principles: Mild cognitive impairment (MCI) with amnestic features (MoCA <26, MMSE ≥24) is often prodromal to AD. Observation with serial cognitive testing (e.g., MoCA every 6-12 months) monitors progression (10-15% annual conversion rate).",
      "Management considerations: Lifestyle interventions (e.g., exercise, Mediterranean diet) reduce progression risk. Cholinesterase inhibitors are not FDA-approved for MCI.",
      "Why not others: Memantine (A) is for moderate-severe AD. Donepezil (B) lacks strong evidence in MCI. Lorazepam (D) worsens cognition. CSF biomarkers (E) are unnecessary unless diagnostic uncertainty exists.",
    ],
  },
  {
    id: "AD-1006",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 80-year-old former engineer with a 10-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs. He has recurrent urinary tract infections and a pressure ulcer. His MMSE score is 3/30. Brain MRI shows severe global atrophy. He is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE management option is most appropriate to address his severe Alzheimer’s disease and caregiver burden?",
    options: [
      { key: "A", text: "Increase donepezil dose to improve cognition" },
      {
        key: "B",
        text: "Refer caregiver to support group and assess for palliative care",
      }, // correct
      { key: "C", text: "Start a high-dose antipsychotic for agitation" },
      { key: "D", text: "Prescribe prophylactic antibiotics for UTIs" },
      { key: "E", text: "Discontinue all AD medications" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Severe AD (MMSE <10) focuses on palliative care and caregiver support. Support groups and respite care address caregiver burnout (60% prevalence). Palliative consultation optimizes symptom management (e.g., infections, ulcers).",
      "Management considerations: Continue donepezil/memantine unless side effects outweigh benefits. Address UTIs and ulcers with targeted therapies (e.g., wound care, antibiotics as needed).",
      "Why not others: Increasing donepezil (A) is futile in severe AD. Antipsychotics (C) are for severe, documented agitation. Prophylactic antibiotics (D) are not standard. Discontinuing medications (E) may worsen symptoms without clear indication.",
    ],
  },
  {
    id: "AD-1007",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 74-year-old woman presents with an 18-month history of progressive memory problems, repeating questions, and difficulty recalling conversations. Examination shows preserved motor function and normal gait. MoCA is 22/30 with impaired delayed recall. Brain MRI shows mild hippocampal atrophy. Which SINGLE feature of her clinical presentation is most characteristic of early Alzheimer’s disease rather than vascular dementia?",
    options: [
      { key: "A", text: "Hippocampal atrophy on MRI" },
      {
        key: "B",
        text: "Absence of cardiovascular risk factors and stroke history",
      }, // correct
      { key: "C", text: "MoCA score of 22/30" },
      { key: "D", text: "Family history of dementia" },
      { key: "E", text: "Slow processing speed" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Early AD presents with gradual memory loss, contrasting with vascular dementia’s (VaD) stepwise decline tied to strokes or vascular risk factors (e.g., hypertension). Absence of stroke history and vascular lesions on MRI favors AD.",
      "Diagnostic considerations: AD shows hippocampal atrophy; VaD shows infarcts/white matter changes. Hachinski Ischemic Score (<4 for AD, >7 for VaD) aids differentiation.",
      "Why not others: Hippocampal atrophy (A) can occur in VaD. MoCA 22/30 (C) is nonspecific. Family history (D) suggests AD risk but doesn’t rule out VaD. Slow processing (E) occurs in both.",
    ],
  },
  {
    id: "AD-1008",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 68-year-old man with a 2-year history of worsening memory, word-finding difficulty, and social withdrawal presents with occasional inappropriate comments. He requires assistance with complex tasks but performs basic ADLs independently. His MMSE score is 18/30, with deficits in memory and language. Brain MRI shows bilateral temporal lobe atrophy. Which SINGLE feature of his clinical presentation best distinguishes moderate Alzheimer’s disease from frontotemporal dementia?",
    options: [
      { key: "A", text: "MMSE score of 18/30" },
      { key: "B", text: "Prominent memory and language deficits" }, // correct
      { key: "C", text: "Absence of early personality changes" },
      { key: "D", text: "Temporal lobe atrophy on MRI" },
      { key: "E", text: "Lack of family history" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Moderate AD (MMSE 10-20) features memory and language deficits due to temporoparietal pathology, while frontotemporal dementia (FTD) emphasizes early behavioral changes (behavioral variant) or isolated language deficits (PPA variants).",
      "Diagnostic considerations: AD shows memory-predominant decline; FTD spares memory early. FDG-PET (temporoparietal vs. frontal hypometabolism) aids differentiation.",
      "Why not others: MMSE 18/30 (A) is nonspecific. Mild behavioral changes (C) can occur in AD. Temporal atrophy (D) is seen in both. Lack of family history (E) doesn’t distinguish, as both can be sporadic.",
    ],
  },
  {
    id: "AD-1009",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 80-year-old woman presents with a 1.5-year history of forgetting recent events and misplacing items. She is independent in daily activities but struggles with appointments. Her MMSE score is 26/30, with deficits in delayed recall. Brain MRI shows mild hippocampal atrophy, and amyloid PET is positive. Which SINGLE pathophysiological mechanism drives her memory impairment in early Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Loss of dopaminergic neurons in the substantia nigra",
      },
      {
        key: "B",
        text: "Accumulation of amyloid-beta plaques and tau tangles in the hippocampus",
      }, // correct
      { key: "C", text: "Chronic microvascular ischemia" },
      { key: "D", text: "Autoimmune-mediated neuronal destruction" },
      {
        key: "E",
        text: "Acetylcholine deficiency from basal ganglia dysfunction",
      },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Early AD is driven by amyloid-beta plaques and tau neurofibrillary tangles in the hippocampus, causing synaptic dysfunction and neuronal loss, leading to memory impairment.",
      "Pathophysiology considerations: Amyloid PET confirms amyloid pathology. Hippocampal involvement underlies episodic memory deficits. Cholinergic loss (nucleus basalis) is secondary.",
      "Why not others: Dopaminergic loss (A) is for Parkinson’s. Microvascular ischemia (C) causes vascular dementia. Autoimmune destruction (D) is for encephalitis. Acetylcholine deficiency (E) is secondary and not basal ganglia-related.",
    ],
  },
  {
    id: "AD-1010",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 77-year-old man with a 3-year history of Alzheimer’s disease presents with worsening memory, disorientation, and new-onset agitation. He struggles to recognize family and needs help with dressing. His MMSE score is 16/30. Brain MRI shows temporal and parietal atrophy. He is on donepezil 10 mg daily. Which SINGLE pathophysiological process is most likely contributing to his agitation in moderate Alzheimer’s disease?",
    options: [
      { key: "A", text: "Dopamine depletion in the nigrostriatal pathway" },
      {
        key: "B",
        text: "Neuroinflammation and neuronal loss in frontal and limbic regions",
      }, // correct
      { key: "C", text: "Hypoperfusion of the occipital cortex" },
      { key: "D", text: "Autoimmune attack on glutamatergic neurons" },
      { key: "E", text: "Mitochondrial dysfunction in the cerebellum" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Agitation in moderate AD results from neuroinflammation and neuronal loss in frontal and limbic regions (e.g., amygdala, prefrontal cortex), disrupting emotional regulation.",
      "Pathophysiology considerations: Amyloid/tau pathology spreads to frontal/limbic areas, causing behavioral symptoms (BPSD). Microglial activation exacerbates inflammation.",
      "Why not others: Dopamine depletion (A) is for Parkinson’s. Occipital hypoperfusion (C) is for PCA-AD or vascular dementia. Autoimmune attack (D) is for encephalitis. Cerebellar dysfunction (E) is irrelevant, as AD spares the cerebellum.",
    ],
  },
  {
    id: "AD-1011",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 83-year-old woman with a 9-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all activities of daily living, including feeding and mobility. Her MMSE score is 4/30. She has developed recurrent aspiration pneumonia. Brain MRI shows severe global cortical atrophy. She is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE pathophysiological mechanism underlies the severe functional decline and aspiration risk in this patient’s advanced Alzheimer’s disease?",
    options: [
      { key: "A", text: "Degeneration of motor neurons in the spinal cord" },
      {
        key: "B",
        text: "Extensive neuronal loss and synaptic failure across cortical and subcortical regions",
      }, // correct
      { key: "C", text: "Primary vascular damage to the brainstem" },
      { key: "D", text: "Loss of GABAergic neurons in the thalamus" },
      { key: "E", text: "Amyloid deposition confined to the cerebellum" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Severe Alzheimer’s disease (AD) is characterized by extensive neuronal loss and synaptic failure due to amyloid-beta plaques and tau neurofibrillary tangles spreading across cortical (e.g., frontal, temporal, parietal) and subcortical (e.g., hippocampus, basal forebrain) regions. This widespread neurodegeneration disrupts neural networks critical for cognition, language, and motor coordination. In advanced stages, involvement of brainstem nuclei (e.g., nucleus ambiguus) impairs swallowing, increasing aspiration pneumonia risk, a leading cause of death in severe AD, affecting ~50% of patients.",
      "Pathophysiology considerations: Global cortical atrophy on MRI reflects profound neuronal loss. Amyloid-beta aggregates disrupt synaptic function, while tau tangles impair axonal transport, leading to cell death. Swallowing dysfunction arises from degeneration in the medulla’s swallowing centers, compounded by cortical input loss. Recurrent pneumonia and dependency in ADLs (e.g., feeding, mobility) indicate end-stage disease (FAST stage 7). Amyloid PET or CSF biomarkers (low Aβ42, high tau) confirm AD pathology earlier, but in severe stages, clinical and imaging findings suffice for diagnosis.",
      "Why not others: Motor neuron degeneration (A) is characteristic of amyotrophic lateral sclerosis, not AD, which spares spinal motor neurons. Vascular brainstem damage (C) occurs in stroke, not AD; this patient’s MRI shows no vascular lesions. GABAergic thalamic loss (D) is minimal in AD and unrelated to aspiration or ADL dependence. Amyloid deposition in the cerebellum (E) is not a feature of AD, which primarily affects cortical/hippocampal regions, sparing the cerebellum.",
    ],
  },
  {
    id: "AD-1012",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 60-year-old former journalist presents with a 2-year history of difficulty finding words and organizing thoughts when writing. He struggles with recalling names of objects but has relatively preserved recent memory. He remains independent in daily activities. His MMSE score is 28/30, with deficits in language tasks. Brain MRI shows mild left temporal lobe atrophy, and amyloid PET is positive. Family history includes a mother with dementia at age 62. Which SINGLE pathophysiological mechanism causes the language deficits in this patient’s early-onset Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Selective degeneration of dopaminergic neurons in the basal ganglia",
      },
      {
        key: "B",
        text: "Amyloid-beta and tau pathology in the left temporal and parietal lobes",
      }, // correct
      { key: "C", text: "Chronic hypoperfusion of the frontal cortex" },
      {
        key: "D",
        text: "Mitochondrial dysfunction primarily affecting the occipital lobe",
      },
      { key: "E", text: "Loss of serotonergic neurons in the raphe nuclei" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Early-onset Alzheimer’s disease (EOAD) with language deficits, as in the logopenic variant, is driven by amyloid-beta plaques and tau neurofibrillary tangles in the left temporal and parietal lobes (e.g., Wernicke’s area, angular gyrus). These aggregates cause synaptic dysfunction and neuronal loss, disrupting language networks responsible for word retrieval and sentence processing. The logopenic variant is characterized by word-finding difficulties and impaired repetition, distinguishing it from amnestic AD, which primarily affects memory.",
      "Pathophysiology considerations: Amyloid PET positivity confirms AD pathology. Left temporal/parietal atrophy on MRI correlates with language impairment. Tau pathology predominates in logopenic AD, affecting posterior language areas. EOAD (onset <65) often has a genetic component (e.g., PSEN1 mutations), as suggested by the family history. Cholinergic deficits in the nucleus basalis of Meynert contribute secondarily to cognitive decline. The prevalence of logopenic AD is ~15-20% of EOAD cases, requiring targeted diagnosis via biomarkers or imaging.",
      "Why not others: Dopaminergic degeneration (A) occurs in Parkinson’s disease, causing motor symptoms, not language deficits. Frontal hypoperfusion (C) is associated with vascular dementia or frontotemporal dementia, not AD; this patient has no vascular risk factors. Mitochondrial dysfunction in the occipital lobe (D) is relevant to posterior cortical atrophy AD, not language deficits. Serotonergic loss in the raphe nuclei (E) affects mood, not language, and is not a primary AD feature.",
    ],
  },
  {
    id: "AD-1013",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "An 81-year-old retired nurse presents with a 1-year history of difficulty remembering names of new people and occasionally forgetting where she placed her keys. She remains independent in daily activities, such as cooking and driving, but takes longer to complete tasks. Her MMSE score is 28/30, with mild deficits in delayed recall. Brain MRI shows subtle hippocampal atrophy. She has a family history of dementia. Which SINGLE clinical feature is most characteristic of early Alzheimer’s disease in this patient?",
    options: [
      { key: "A", text: "Prominent motor slowing and rigidity" },
      {
        key: "B",
        text: "Gradual memory impairment, particularly for recent events",
      }, // correct
      {
        key: "C",
        text: "Sudden onset of confusion with visual hallucinations",
      },
      {
        key: "D",
        text: "Early loss of language fluency and word-finding difficulty",
      },
      { key: "E", text: "Severe apathy and social disinhibition" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Early Alzheimer’s disease (AD) is characterized by gradual memory impairment, particularly for recent events (episodic memory), due to amyloid-beta and tau pathology in the hippocampus and entorhinal cortex. Patients often forget conversations, misplace items, or rely on reminders, yet maintain independence in daily activities, as seen in mild cognitive impairment (MCI) or early AD. This is distinct from other dementias with different clinical patterns.",
      "Clinical considerations: MMSE scores of 26-30 or MoCA <26 indicate early AD or MCI. Subtle hippocampal atrophy on MRI supports AD pathology. Family history increases genetic risk (e.g., APOE ε4), present in ~40% of AD patients. Differential diagnosis includes vascular dementia (stepwise decline, vascular lesions), Lewy body dementia (hallucinations, parkinsonism), and frontotemporal dementia (behavioral/language changes). Non-pharmacologic strategies (e.g., cognitive training) and cholinesterase inhibitors are considered if AD is confirmed.",
      "Why not others: Motor slowing and rigidity (A) are features of Parkinson’s or Lewy body dementia, not AD. Sudden confusion with hallucinations (C) suggests delirium or Lewy body dementia, not AD’s gradual onset. Early language deficits (D) are typical of logopenic AD or primary progressive aphasia, not amnestic AD. Severe apathy and disinhibition (E) indicate frontotemporal dementia, not early AD, where behavioral changes are minimal.",
    ],
  },
  {
    id: "AD-1014",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 79-year-old man with a 4-year history of Alzheimer’s disease presents with worsening memory and difficulty managing finances. He requires assistance with dressing but can eat independently. His wife reports evening agitation and occasional wandering. His MMSE score is 17/30, with deficits in orientation and recall. Brain MRI shows temporal and parietal atrophy. He is on donepezil 10 mg daily. Which SINGLE clinical feature best indicates progression to moderate Alzheimer’s disease?",
    options: [
      { key: "A", text: "Visual hallucinations and fluctuating cognition" },
      {
        key: "B",
        text: "Dependence on assistance for complex activities like finances and dressing",
      }, // correct
      { key: "C", text: "Prominent tremor and bradykinesia" },
      { key: "D", text: "Acute memory loss following a recent stroke" },
      { key: "E", text: "Complete inability to communicate or ambulate" },
    ],
    correct: "B",
    explanation_detail: [
      "First principles: Moderate Alzheimer’s disease (AD, MMSE 10-20) is marked by increased dependence in complex activities of daily living (ADLs) like finances and dressing due to amyloid/tau pathology spreading to parietal and frontal lobes. Behavioral and psychological symptoms (BPSD), such as agitation and wandering, emerge in ~50% of patients, reflecting limbic/frontal dysfunction. This progression distinguishes moderate from early AD, where independence is preserved.",
      "Clinical considerations: Temporal/parietal atrophy on MRI correlates with cognitive and functional decline. Wandering, seen in 20-40% of moderate AD patients, poses safety risks, necessitating interventions like ID bracelets or door alarms. Differential diagnosis includes Lewy body dementia (hallucinations, parkinsonism) and vascular dementia (stroke-related deficits). Adding memantine to donepezil and non-pharmacologic strategies (e.g., structured routines) manages BPSD and slows decline.",
      "Why not others: Hallucinations and fluctuating cognition (A) are typical of Lewy body dementia, not AD. Tremor and bradykinesia (C) indicate Parkinson’s or related disorders. Acute memory loss post-stroke (D) suggests vascular dementia, not AD’s gradual progression. Complete inability to communicate/ambulate (E) indicates severe AD (MMSE <10), not moderate.",
    ],
  },
  {
    id: "AD-1015",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 86-year-old woman with an 8-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs, including feeding. She has had two episodes of aspiration pneumonia in the past year. Her MMSE score is 5/30. Brain MRI shows severe global atrophy. She is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE clinical feature is most indicative of severe Alzheimer’s disease in this patient?",
    options: [
      {
        key: "A",
        text: "Mild forgetfulness for recent events with preserved ADLs",
      },
      {
        key: "B",
        text: "Prominent language deficits with intact social behavior",
      },
      {
        key: "C",
        text: "Complete dependence on caregivers for all ADLs and nonverbal status",
      }, // correct
      { key: "D", text: "Early executive dysfunction with preserved memory" },
      {
        key: "E",
        text: "Visual hallucinations and REM sleep behavior disorder",
      },
    ],
    correct: "C",
    explanation_detail: [
      "First principles: Severe Alzheimer’s disease (AD, MMSE <10) is characterized by complete dependence on caregivers for all ADLs (e.g., feeding, toileting) and loss of meaningful communication (nonverbal or single words) due to widespread neuronal loss from amyloid/tau pathology affecting cortical and subcortical regions. Complications like aspiration pneumonia, seen in ~50% of severe AD patients, result from swallowing dysfunction due to brainstem/cortical degeneration.",
      "Clinical considerations: Global atrophy on MRI reflects end-stage neurodegeneration. Aspiration pneumonia is a leading cause of mortality, necessitating swallowing assessments by speech therapists. Differential diagnosis includes severe Lewy body dementia (hallucinations, parkinsonism) or vascular dementia (vascular lesions). Palliative care focuses on comfort, with continuation of donepezil/memantine unless side effects predominate. Caregiver support is critical, as burnout affects ~60% of caregivers.",
      "Why not others: Mild forgetfulness with preserved ADLs (A) indicates MCI or early AD, not severe. Language deficits with intact behavior (B) suggest primary progressive aphasia, not classic severe AD. Early executive dysfunction (D) is typical of frontotemporal dementia or atypical AD. Hallucinations and REM sleep behavior disorder (E) are features of Lewy body dementia, not severe AD.",
    ],
  },
  {
    id: "AD-1016",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 61-year-old graphic designer presents with a 2-year history of difficulty with spatial tasks, such as drawing layouts or navigating familiar routes. Her memory for recent events is relatively intact. She remains independent in most ADLs. Her MMSE score is 27/30, with deficits in visuospatial tasks. Brain MRI shows parietal and occipital atrophy, and amyloid PET is positive. Family history includes a father with dementia at age 60. Which SINGLE clinical feature best characterizes the presentation of this patient’s early-onset Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Prominent visuospatial impairment with relatively spared memory",
      }, // correct
      { key: "B", text: "Severe apathy and personality changes" },
      {
        key: "C",
        text: "Acute onset of memory loss with focal neurological signs",
      },
      { key: "D", text: "Complete dependence on others for basic ADLs" },
      { key: "E", text: "Fluctuating cognition with parkinsonism" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Early-onset Alzheimer’s disease (EOAD, onset <65) can present with atypical features, such as the posterior cortical atrophy (PCA) variant, characterized by prominent visuospatial impairment (e.g., difficulty with drawing, navigation) due to amyloid-beta and tau pathology in parietal and occipital lobes. Unlike classic AD, memory is relatively spared early on, making PCA distinct. This variant affects ~5-10% of AD cases and is often misdiagnosed as a visual or psychiatric disorder initially.",
      "🧠 **Clinical considerations**: The MMSE score of 27/30 is typical in early PCA-AD, with deficits in visuospatial tasks (e.g., clock-drawing test). MRI showing parietal/occipital atrophy and positive amyloid PET confirm AD pathology. Family history (father with dementia at 60) suggests genetic risk, such as PSEN1 mutations, present in ~50% of familial EOAD cases. Differential diagnoses include corticobasal degeneration (asymmetric motor signs), Lewy body dementia (hallucinations, parkinsonism), and vascular dementia (stroke-related deficits). Management includes cholinesterase inhibitors (e.g., donepezil) and occupational therapy for visuospatial deficits.",
      "❌ **Why not others**: Severe apathy and personality changes (B) are hallmarks of frontotemporal dementia (FTD), not PCA-AD. Acute memory loss with focal signs (C) suggests vascular dementia, not the gradual onset of AD. Complete ADL dependence (D) indicates severe AD, not early-stage. Fluctuating cognition and parkinsonism (E) are features of Lewy body dementia, not PCA-AD.",
    ],
  },
  {
    id: "AD-1017",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 75-year-old woman with a 3-year history of Alzheimer’s disease presents with worsening difficulty finding words and understanding complex instructions. She needs help with household tasks like cooking but can manage personal hygiene. Her MMSE score is 19/30, with deficits in language and memory. Brain MRI shows left temporal and parietal atrophy. She is on donepezil 10 mg daily. Which SINGLE clinical feature is most indicative of the progression of this patient’s moderate Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Prominent word-finding difficulty and impaired comprehension",
      }, // correct
      { key: "B", text: "Severe motor impairment with gait instability" },
      {
        key: "C",
        text: "Sudden onset of delusions and auditory hallucinations",
      },
      { key: "D", text: "Early memory loss with preserved language function" },
      { key: "E", text: "Complete loss of ambulation and communication" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Moderate Alzheimer’s disease (AD, MMSE 10-20) shows progression of cognitive deficits beyond memory to include language difficulties, particularly in the logopenic variant, due to tau-predominant pathology in the left temporal and parietal lobes. Word-finding difficulty and impaired comprehension (e.g., trouble with complex sentences) reflect disruption of language networks, affecting ~15-20% of AD patients in this stage. This contrasts with early AD’s memory-predominant presentation.",
      "🧠 **Clinical considerations**: Left temporal/parietal atrophy on MRI correlates with language deficits. The MMSE score of 19/30 indicates moderate AD, with increasing dependence on complex ADLs (e.g., cooking). Differential diagnoses include semantic primary progressive aphasia (FTD variant, with loss of word meaning) and vascular dementia (stepwise decline, vascular lesions). Management involves adding memantine to donepezil for synergistic effects and speech therapy to support communication. Non-pharmacologic strategies (e.g., simplified communication) reduce frustration. Approximately 30% of moderate AD patients develop behavioral symptoms, necessitating monitoring.",
      "❌ **Why not others**: Severe motor impairment (B) suggests Parkinson’s or progressive supranuclear palsy, not AD. Sudden delusions and hallucinations (C) indicate delirium or Lewy body dementia, not AD’s gradual progression. Early memory loss with preserved language (D) is typical of early amnestic AD, not moderate logopenic AD. Complete loss of ambulation/communication (E) indicates severe AD (MMSE <10), not moderate.",
    ],
  },
  {
    id: "AD-1018",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 78-year-old woman presents with a 1-year history of forgetting recent conversations and misplacing items like her phone. She is independent in daily activities but relies on lists for reminders. Her MMSE score is 27/30, with deficits in short-term recall. Brain MRI shows mild hippocampal atrophy, and amyloid PET is positive. She has no history of stroke or vascular risk factors. Her mother and sister had dementia in their 70s. Which SINGLE etiological factor is most likely contributing to this patient’s early Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Chronic traumatic brain injury from repeated head trauma",
      },
      {
        key: "B",
        text: "Genetic predisposition involving APOE ε4 allele or familial mutations",
      }, // correct
      {
        key: "C",
        text: "Chronic cerebral hypoperfusion from untreated hypertension",
      },
      { key: "D", text: "Autoimmune-mediated neuronal damage" },
      { key: "E", text: "Long-term exposure to heavy metals like lead" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Alzheimer’s disease (AD) etiology involves a combination of genetic and environmental factors, with genetic predisposition being a primary driver in cases with family history. The APOE ε4 allele, present in ~40% of AD patients, increases risk 3-15-fold, promoting amyloid-beta accumulation. Familial AD, caused by autosomal dominant mutations in PSEN1, PSEN2, or APP genes, is rare (<1%) but more common in early-onset or familial cases. These mutations enhance amyloid production, leading to early plaque formation.",
      "🧬 **Etiology considerations**: The patient’s family history (mother and sister with dementia) strongly suggests a genetic predisposition, likely APOE ε4 or, less commonly, PSEN1/PSEN2/APP mutations. Amyloid PET positivity confirms amyloid pathology, and hippocampal atrophy supports early AD. The absence of vascular risk factors or trauma rules out other causes. Genetic counseling is recommended, as familial AD has a 50% inheritance risk in mutation carriers. Lifestyle factors (e.g., low education, obesity) may amplify genetic risk but are secondary. Prevalence of APOE ε4 in sporadic AD is ~25% in the general population vs. 60% in AD patients.",
      "❌ **Why not others**: Chronic traumatic brain injury (A) increases AD risk but requires a trauma history, absent here. Cerebral hypoperfusion (C) causes vascular dementia, not AD; no hypertension or vascular lesions are noted. Autoimmune neuronal damage (D) is seen in encephalitis, not AD’s neurodegenerative process. Heavy metal exposure (E) like lead lacks strong evidence as a primary AD cause compared to genetic factors.",
    ],
  },
  {
    id: "AD-1019",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 76-year-old man presents with a 3-year history of worsening memory and difficulty managing finances. He requires assistance with dressing and has occasional agitation. His MMSE score is 18/30, with deficits in memory and executive function. Brain MRI shows temporal and parietal atrophy. He has no family history of dementia and no significant vascular risk factors. He is on donepezil 10 mg daily. Which SINGLE etiological factor is most likely for this patient’s moderate Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Sporadic amyloid-beta accumulation influenced by aging and environmental factors",
      }, // correct
      { key: "B", text: "Repeated ischemic strokes causing cortical infarcts" },
      { key: "C", text: "Chronic alcohol abuse leading to neuronal loss" },
      {
        key: "D",
        text: "Mitochondrial DNA mutations causing oxidative stress",
      },
      { key: "E", text: "Viral infection triggering neuroinflammation" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Sporadic Alzheimer’s disease (AD), accounting for >95% of cases, is driven by amyloid-beta accumulation and tau pathology, exacerbated by aging—the strongest risk factor—and environmental factors (e.g., low education, sedentary lifestyle). These lead to synaptic dysfunction and neuronal loss, particularly in temporoparietal regions, causing cognitive and functional decline. Sporadic AD typically presents after age 65, unlike familial AD, which is genetically driven.",
      "🧬 **Etiology considerations**: The absence of family history and vascular risk factors, combined with temporal/parietal atrophy and memory/executive deficits, supports sporadic AD. Aging increases amyloid clearance failure, with prevalence rising from 3% at age 65 to 32% at age 85. Environmental factors like low cognitive reserve or obesity amplify risk, though not specified here. Amyloid PET or CSF biomarkers (low Aβ42, high tau) would confirm pathology. Differential diagnoses include vascular dementia (stroke-related) and alcohol-related dementia, ruled out by history and imaging. Management includes donepezil, with memantine added for moderate AD.",
      "❌ **Why not others**: Ischemic strokes (B) cause vascular dementia, not AD; no infarcts or vascular risk factors are noted. Chronic alcohol abuse (C) leads to alcohol-related dementia, absent in this patient’s history. Mitochondrial mutations (D) contribute secondarily to oxidative stress but are not the primary etiology. Viral infections (E) are hypothesized but lack strong evidence compared to amyloid/tau pathology.",
    ],
  },
  {
    id: "AD-1020",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 84-year-old woman with a 10-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs. She has recurrent urinary tract infections and weight loss. Her MMSE score is 3/30. Brain MRI shows severe global atrophy. She is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE etiological factor underlies this patient’s severe Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Progressive amyloid and tau pathology leading to widespread neurodegeneration",
      }, // correct
      {
        key: "B",
        text: "Chronic microvascular ischemia from untreated diabetes",
      },
      {
        key: "C",
        text: "Long-term exposure to pesticides causing neuronal toxicity",
      },
      { key: "D", text: "Autoimmune attack on cortical synapses" },
      {
        key: "E",
        text: "Degeneration of dopaminergic neurons in the substantia nigra",
      },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Severe Alzheimer’s disease (AD) results from progressive amyloid-beta plaques and tau neurofibrillary tangles causing widespread neuronal loss and synaptic failure across cortical and subcortical regions. This leads to global atrophy, loss of basic functions (e.g., communication, mobility), and complications like infections and weight loss. Aging is the primary risk factor, with sporadic AD comprising >95% of cases, driven by cumulative amyloid/tau pathology over decades.",
      "🧬 **Etiology considerations**: Severe global atrophy on MRI confirms end-stage neurodegeneration. Amyloid and tau disrupt neural networks, with prevalence of AD reaching ~32% by age 85. Complications like urinary tract infections (UTIs) occur in ~40% of severe AD patients due to incontinence and immobility. Weight loss reflects dysphagia or reduced intake, common in FAST stage 7. Differential diagnoses include vascular dementia (vascular lesions) and Parkinson’s dementia (dopaminergic loss), ruled out by history and imaging. Palliative care and caregiver support are critical, with ~60% of caregivers experiencing burnout.",
      "❌ **Why not others**: Microvascular ischemia from diabetes (B) causes vascular dementia, not AD; no diabetes or vascular findings are reported. Pesticide exposure (C) is a hypothesized risk factor but not a primary cause compared to amyloid/tau. Autoimmune synaptic attack (D) occurs in encephalitis, not AD. Dopaminergic degeneration (E) is characteristic of Parkinson’s, not AD, which spares the substantia nigra.",
    ],
  },
  {
    id: "AD-1021",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 62-year-old professor presents with a 2-year history of difficulty recalling recent lectures and organizing research papers. He remains independent but struggles with complex tasks. His MMSE score is 26/30, with deficits in memory and executive function. Brain MRI shows mild temporal atrophy, and amyloid PET is positive. His father and aunt had dementia in their early 60s. Which SINGLE etiological factor is most likely for this patient’s early-onset Alzheimer’s disease?",
    options: [
      {
        key: "A",
        text: "Autosomal dominant mutations in PSEN1, PSEN2, or APP genes",
      }, // correct
      {
        key: "B",
        text: "Chronic cerebral hypoperfusion from atrial fibrillation",
      },
      { key: "C", text: "Repeated concussions from prior sports injuries" },
      { key: "D", text: "Chronic viral infection causing neuroinflammation" },
      { key: "E", text: "Deficiency of neuroprotective neurotrophic factors" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Early-onset Alzheimer’s disease (EOAD, onset <65) is frequently driven by autosomal dominant mutations in PSEN1, PSEN2, or APP genes, which increase amyloid-beta production, leading to early plaque formation and neuronal loss. These mutations account for ~50-70% of familial EOAD cases and are highly penetrant, causing dementia in multiple family members across generations. The prevalence of EOAD is ~5-10% of all AD cases, contrasting with sporadic AD’s later onset.",
      "🧬 **Etiology considerations**: The patient’s family history (father and aunt with dementia in their 60s) strongly suggests genetic etiology, likely PSEN1 (most common, ~80% of familial EOAD), PSEN2, or APP mutations. Positive amyloid PET confirms amyloid pathology, and mild temporal atrophy aligns with early AD. Genetic counseling is critical due to 50% inheritance risk for first-degree relatives. Differential diagnoses include vascular dementia (stroke-related) and traumatic encephalopathy (trauma history), ruled out here. Environmental factors (e.g., low cognitive reserve) may amplify risk but are secondary. Management includes cholinesterase inhibitors (e.g., donepezil 5 mg) and genetic testing to confirm mutations.",
      "❌ **Why not others**: Chronic hypoperfusion from atrial fibrillation (B) causes vascular dementia, not EOAD; no vascular risk factors or MRI infarcts are reported. Repeated concussions (C) increase AD risk but require trauma history, absent here. Chronic viral infections (D) like herpes simplex are hypothesized but lack evidence as a primary cause. Neurotrophic factor deficiency (E) is a secondary feature, not the primary etiology, unlike genetic mutations in EOAD.",
    ],
  },
  {
    id: "AD-1022",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 80-year-old retired farmer presents with a 4-year history of memory loss, disorientation, and difficulty managing household tasks. He needs help with finances and meal preparation but can perform basic ADLs. His MMSE score is 19/30, with deficits in memory and orientation. Brain MRI shows temporal and parietal atrophy. He has no family history of dementia but a long history of pesticide exposure. Blood tests are normal, and he has no vascular risk factors. Which SINGLE investigation is most appropriate to confirm the diagnosis of moderate Alzheimer’s disease in this patient?",
    options: [
      { key: "A", text: "Amyloid PET scan to detect amyloid-beta plaques" }, // correct
      { key: "B", text: "Brain CT to detect vascular lesions" },
      { key: "C", text: "EEG to evaluate for epileptiform activity" },
      {
        key: "D",
        text: "Serum inflammatory markers to rule out autoimmune causes",
      },
      { key: "E", text: "Genetic testing for APOE ε4 status" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Confirming moderate Alzheimer’s disease (AD, MMSE 10-20) requires evidence of amyloid-beta pathology, as memory and functional deficits alone are nonspecific. Amyloid PET scans detect amyloid plaques with >90% sensitivity/specificity, confirming AD diagnosis in moderate stages when clinical symptoms are prominent. This distinguishes AD from mimics like vascular dementia or frontotemporal dementia (FTD).",
      "🧠 **Investigation considerations**: Temporal/parietal atrophy on MRI supports AD, but amyloid PET is definitive for pathology. CSF analysis (low Aβ42, high tau) is an alternative but invasive. The patient’s pesticide exposure may increase AD risk (~1.5-2x relative risk for organophosphates), but amyloid confirmation is key. Differential diagnoses include vascular dementia (vascular lesions), FTD (frontal atrophy), and encephalopathy (EEG abnormalities), ruled out by normal blood tests and MRI findings. Prevalence of sporadic AD in this age group is ~15-20%, and amyloid PET is increasingly used in specialized settings. Management includes adding memantine to donepezil and addressing environmental risk reduction.",
      "❌ **Why not others**: Brain CT (B) is less sensitive than MRI for AD and is used for vascular dementia, not indicated here without vascular risk factors. EEG (C) is for seizures or encephalopathy, not routine for AD; no seizure history exists. Serum inflammatory markers (D) are nonspecific and relevant for autoimmune encephalitis, not AD. Genetic testing for APOE ε4 (E) assesses risk, not diagnosis, and is less specific than amyloid PET.",
    ],
  },
  {
    id: "AD-1023",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 79-year-old woman presents with a 1-year history of forgetting recent events, such as appointments, and occasionally repeating questions. She remains independent in daily activities like cooking and shopping. Her MMSE score is 27/30, with deficits in delayed recall. She has no history of stroke, trauma, or significant vascular risk factors. Her mother had dementia in her 80s. Blood tests (thyroid, B12, folate) are normal. Which SINGLE investigation is most appropriate to confirm the diagnosis of early Alzheimer’s disease in this patient?",
    options: [
      { key: "A", text: "Brain CT to assess for cortical infarcts" },
      { key: "B", text: "Amyloid PET scan to detect amyloid-beta plaques" }, // correct
      { key: "C", text: "EEG to evaluate for epileptiform activity" },
      { key: "D", text: "Lumbar puncture for bacterial culture" },
      {
        key: "E",
        text: "Dopamine transporter scan (DaTscan) to assess nigrostriatal function",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Early Alzheimer’s disease (AD, MMSE 21-26) diagnosis requires confirmation of amyloid-beta pathology, as memory deficits alone may reflect mild cognitive impairment (MCI) or other dementias. Amyloid PET scans detect amyloid plaques with high sensitivity (>90%) and specificity (>85%), confirming AD in early stages when clinical symptoms are mild. This is critical to differentiate AD from reversible causes or other neurodegenerative disorders.",
      "🧠 **Investigation considerations**: The patient’s MMSE of 27/30 and deficits in delayed recall suggest early AD or amnestic MCI (10-15% annual conversion to AD). Normal blood tests rule out reversible causes (e.g., hypothyroidism, B12 deficiency). Family history increases APOE ε4 risk (~40% prevalence in AD). MRI showing hippocampal atrophy supports AD, but amyloid PET is definitive. Differential diagnoses include vascular dementia (infarcts), Lewy body dementia (hallucinations), and frontotemporal dementia (behavioral changes). Amyloid PET is used in ~10% of specialized AD evaluations due to cost but is highly accurate. CSF biomarkers (low Aβ42, high tau) are an alternative if PET is unavailable. Management includes cholinesterase inhibitors if AD is confirmed.",
      "❌ **Why not others**: Brain CT (A) is less sensitive than MRI and used for vascular dementia, not AD; no vascular risk factors exist. EEG (C) is for seizures or encephalopathy, not routine AD workup; no seizures are reported. Lumbar puncture for bacterial culture (D) is for meningitis, not AD; CSF biomarkers could be considered but are secondary to PET. DaTscan (E) is for Parkinson’s or Lewy body dementia, not AD, which spares nigrostriatal pathways.",
    ],
  },
  {
    id: "AD-1024",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 77-year-old man with a 3-year history of Alzheimer’s disease presents with worsening memory, disorientation, and new-onset agitation, particularly in the evenings. He requires assistance with dressing and has an MMSE score of 16/30, with deficits in memory and orientation. Brain MRI shows temporal and parietal atrophy. He is on donepezil 10 mg daily. Which SINGLE investigation is most useful to assess the progression of this patient’s moderate Alzheimer’s disease?",
    options: [
      { key: "A", text: "Repeat MMSE to monitor cognitive decline" }, // correct
      { key: "B", text: "Brain SPECT to evaluate cerebral blood flow" },
      { key: "C", text: "Lumbar puncture for inflammatory markers" },
      { key: "D", text: "PET scan for dopamine receptor binding" },
      { key: "E", text: "Serum amyloid A levels to assess disease severity" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Monitoring progression in moderate Alzheimer’s disease (AD, MMSE 10-20) relies on serial cognitive testing, such as the MMSE or MoCA, to quantify decline in memory, orientation, and other domains. The MMSE tracks progression cost-effectively, with a typical annual decline of 2-4 points in moderate AD. This informs management adjustments, such as adding memantine or addressing behavioral symptoms like agitation.",
      "🧠 **Investigation considerations**: The MMSE score of 16/30 confirms moderate AD, with new agitation (sundowning) affecting ~30% of patients in this stage. Temporal/parietal atrophy on MRI is consistent with AD progression. Functional assessments (e.g., ADCS-ADL) complement cognitive scores, showing increased dependence (e.g., dressing). Differential diagnoses include delirium (acute onset) and Lewy body dementia (hallucinations), ruled out by history. Brain SPECT or CSF analysis is reserved for diagnostic uncertainty, not routine progression monitoring. Approximately 50% of moderate AD patients require medication adjustments within 2-3 years. Non-pharmacologic strategies (e.g., light therapy) address sundowning.",
      "❌ **Why not others**: Brain SPECT (B) evaluates perfusion in vascular dementia or FTD, not AD progression; MRI is sufficient. Lumbar puncture for inflammatory markers (C) is for encephalitis, not AD monitoring. Dopamine PET (D) is for Lewy body dementia, not AD. Serum amyloid A (E) is a nonspecific inflammatory marker, not validated for AD progression.",
    ],
  },
  {
    id: "AD-1025",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 85-year-old man with a 9-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs, including feeding. He has had recurrent aspiration pneumonia. His MMSE score is 4/30. Brain MRI shows severe global atrophy. He is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE investigation is most appropriate to evaluate the complications associated with this patient’s severe Alzheimer’s disease?",
    options: [
      { key: "A", text: "Chest X-ray to assess for aspiration pneumonia" }, // correct
      { key: "B", text: "Amyloid PET to quantify amyloid burden" },
      { key: "C", text: "EEG to detect subclinical seizures" },
      { key: "D", text: "Brain CT to evaluate for acute stroke" },
      { key: "E", text: "Blood tests for dopamine levels" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Severe Alzheimer’s disease (AD, MMSE <10) is associated with complications like aspiration pneumonia, occurring in ~50% of patients due to swallowing dysfunction from brainstem and cortical neurodegeneration. Chest X-ray is the first-line investigation to confirm pneumonia, guiding antibiotic therapy and swallowing assessments to prevent recurrence. This addresses a leading cause of mortality in severe AD.",
      "🧠 **Investigation considerations**: Global atrophy on MRI reflects end-stage AD (FAST stage 7). Recurrent aspiration pneumonia requires urgent evaluation with chest X-ray, as dysphagia affects ~60% of severe AD patients. Swallowing assessment by a speech therapist reduces aspiration risk. Differential diagnoses include heart failure (pulmonary edema) or stroke (focal deficits), ruled out by history and imaging. EEG or amyloid PET is unnecessary in severe AD, where complications, not diagnosis, are the focus. Palliative care consultation aligns treatment with comfort goals, with ~20% of severe AD patients transitioning to hospice annually.",
      "❌ **Why not others**: Amyloid PET (B) is for early diagnosis, not complications in severe AD. EEG (C) is for seizures, not indicated without seizure history. Brain CT (D) is for acute stroke, not relevant without focal signs or vascular risk factors. Dopamine levels (E) are irrelevant to AD complications and not used in dementia evaluation.",
    ],
  },
  {
    id: "AD-1026",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 63-year-old architect presents with a 2-year history of difficulty with spatial tasks, such as designing blueprints, and trouble navigating familiar places. Her memory for recent events is relatively preserved. Her MMSE score is 28/30, with deficits in visuospatial tasks. Brain MRI shows parietal and occipital atrophy, and family history includes a mother with dementia at age 64. Blood tests are normal. Which SINGLE investigation is most critical to confirm the diagnosis of early-onset Alzheimer’s disease in this patient?",
    options: [
      { key: "A", text: "CSF analysis for amyloid-beta and tau biomarkers" }, // correct
      { key: "B", text: "Brain CT to assess for hydrocephalus" },
      {
        key: "C",
        text: "Serum glucose levels to rule out diabetes-related cognitive impairment",
      },
      { key: "D", text: "SPECT scan to evaluate frontal lobe perfusion" },
      { key: "E", text: "Genetic testing for Huntington’s disease mutations" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Early-onset Alzheimer’s disease (EOAD, onset <65) with atypical visuospatial deficits, suggestive of the posterior cortical atrophy (PCA) variant, requires confirmation of amyloid-beta and tau pathology. CSF analysis measuring low amyloid-beta (Aβ42) and high total/phosphorylated tau has >90% sensitivity and specificity for AD, confirming diagnosis in atypical presentations. This is critical to distinguish EOAD from other neurodegenerative or non-neurodegenerative causes.",
      "🧠 **Investigation considerations**: The patient’s visuospatial deficits and parietal/occipital atrophy on MRI suggest PCA-AD, which affects ~5-10% of AD cases. Family history (mother with dementia at 64) raises suspicion for genetic mutations (e.g., PSEN1, ~80% of familial EOAD). Normal blood tests rule out metabolic causes (e.g., B12 deficiency, hypothyroidism). Amyloid PET is an alternative but less accessible; CSF is widely used in specialized centers (~15% of EOAD evaluations). Differential diagnoses include corticobasal degeneration (asymmetric motor signs), normal pressure hydrocephalus (NPH, gait/apathy), and Huntington’s (chorea), all unlikely here. Genetic testing may follow if CSF confirms AD. Management includes cholinesterase inhibitors and occupational therapy for visuospatial deficits.",
      "❌ **Why not others**: Brain CT (B) assesses NPH, but the patient’s atrophy pattern and lack of gait/apathy symptoms rule it out. Serum glucose (C) is irrelevant without diabetes history; blood tests are normal. SPECT (D) is for vascular dementia or FTD, less specific than CSF for AD. Huntington’s genetic testing (E) is for movement disorders, not visuospatial deficits.",
    ],
  },
  {
    id: "AD-1027",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 74-year-old woman with a 4-year history of Alzheimer’s disease presents with worsening word-finding difficulty and trouble understanding conversations. She needs assistance with complex tasks like cooking but manages personal hygiene. Her MMSE score is 18/30, with deficits in language and memory. She has no history of stroke. Brain MRI shows left temporal and parietal atrophy. Which SINGLE investigation is most appropriate to differentiate this patient’s moderate Alzheimer’s disease from frontotemporal dementia?",
    options: [
      {
        key: "A",
        text: "Fluorodeoxyglucose (FDG)-PET scan to assess regional hypometabolism",
      }, // correct
      { key: "B", text: "Brain CT to detect vascular lesions" },
      {
        key: "C",
        text: "Serum inflammatory markers to rule out autoimmune encephalitis",
      },
      { key: "D", text: "EEG to evaluate for temporal lobe epilepsy" },
      { key: "E", text: "Blood tests for vitamin D deficiency" },
    ],
    correct: "A",
    explanation_detail: [
      "🌟 **First principles**: Differentiating moderate Alzheimer’s disease (AD, MMSE 10-20) with language deficits (logopenic variant) from frontotemporal dementia (FTD) requires assessing regional brain dysfunction. FDG-PET shows distinct hypometabolism patterns: temporoparietal and posterior cingulate in AD vs. frontal and anterior temporal in FTD. This has ~85-90% accuracy in distinguishing logopenic AD from FTD’s primary progressive aphasia (PPA) variants, critical for guiding management.",
      "🧠 **Investigation considerations**: The patient’s language deficits and left temporal/parietal atrophy suggest logopenic AD, affecting ~15-20% of AD patients. FDG-PET is used in ~10% of complex dementia evaluations to confirm diagnosis. CSF biomarkers (low Aβ42, high tau) or amyloid PET are alternatives but less specific for FTD differentiation. No stroke history or vascular lesions rule out vascular dementia. FTD’s semantic PPA (word meaning loss) or nonfluent PPA (speech production issues) differ from AD’s logopenic profile (word-finding, repetition issues). Management includes memantine addition and speech therapy. Approximately 30% of moderate AD patients develop language deficits, impacting communication strategies.",
      "❌ **Why not others**: Brain CT (B) is for vascular dementia, not relevant without stroke history; MRI is sufficient. Serum inflammatory markers (C) are for autoimmune encephalitis, not AD/FTD. EEG (D) is for seizures, not indicated without seizure history. Vitamin D deficiency tests (E) are irrelevant; blood tests are normal and unrelated to AD/FTD differentiation.",
    ],
  },
  {
    id: "AD-1028",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Easy",
    vignetteTitle: "Clinic Vignette",
    stem: "A 78-year-old retired accountant presents with a 1-year history of forgetting recent events, such as appointments, and difficulty recalling names. She remains independent in daily activities like cooking and driving but uses a calendar for reminders. Her MMSE score is 26/30, with deficits in delayed recall. Brain MRI shows mild hippocampal atrophy, and amyloid PET is positive. Blood tests (thyroid, B12, folate) are normal. Which SINGLE management strategy is most appropriate for this patient’s early Alzheimer’s disease?",
    options: [
      { key: "A", text: "Start memantine to slow cognitive decline" },
      {
        key: "B",
        text: "Initiate donepezil at a low dose and provide lifestyle counseling",
      }, // correct
      {
        key: "C",
        text: "Prescribe a low-dose antipsychotic for memory-related anxiety",
      },
      { key: "D", text: "Recommend immediate institutionalization for safety" },
      {
        key: "E",
        text: "Order cognitive behavioral therapy as the primary treatment",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Early Alzheimer’s disease (AD, MMSE 21-26) is managed with cholinesterase inhibitors (e.g., donepezil) to enhance acetylcholine levels, modestly improving cognition and function. Starting at a low dose (5 mg daily) minimizes side effects (e.g., nausea, diarrhea). Lifestyle counseling, including aerobic exercise, Mediterranean diet, and cognitive stimulation, reduces progression risk by ~30% and supports cognitive reserve, critical in early AD.",
      "🧠 **Management considerations**: The patient’s MMSE of 26/30 and amyloid PET positivity confirm early AD. Independence in ADLs suggests mild stage (CDR 0.5-1). Donepezil is FDA-approved for mild AD, with ~60% of patients showing modest cognitive benefit. Lifestyle interventions (e.g., 150 min/week moderate exercise) are evidence-based for slowing decline. Family history increases APOE ε4 risk (~40% prevalence in AD). Differential diagnoses include MCI (less functional impact) and depression (no mood symptoms here). Monitoring with MMSE/MoCA every 6 months tracks progression. Caregiver education on AD trajectory is essential, as ~20% of early AD patients progress to moderate stage within 2 years.",
      "❌ **Why not others**: Memantine (A) is for moderate-severe AD, not early, where cholinergic deficits predominate. Antipsychotics (C) are for severe behavioral symptoms, not memory issues; they carry stroke/mortality risks. Institutionalization (D) is premature for independent patients; safety aids (e.g., calendars) suffice. CBT (E) is adjunctive for mood disorders, not a primary AD treatment.",
    ],
  },
  {
    id: "AD-1029",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 80-year-old man with a 4-year history of Alzheimer’s disease presents with worsening memory, disorientation, and agitation, especially in the evenings (sundowning). He requires assistance with finances and dressing but can eat independently. His MMSE score is 17/30. Brain MRI shows temporal and parietal atrophy. He is on donepezil 10 mg daily. Which SINGLE management step is most appropriate to address this patient’s moderate Alzheimer’s disease and behavioral symptoms?",
    options: [
      {
        key: "A",
        text: "Increase donepezil dose to 20 mg daily to reduce agitation",
      },
      {
        key: "B",
        text: "Add memantine and implement non-pharmacologic strategies for agitation",
      }, // correct
      { key: "C", text: "Start a high-dose benzodiazepine for sundowning" },
      { key: "D", text: "Discontinue donepezil due to disease progression" },
      { key: "E", text: "Prescribe an SSRI without further evaluation" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Moderate Alzheimer’s disease (AD, MMSE 10-20) with behavioral symptoms like sundowning (evening agitation, affecting ~30% of patients) is managed by adding memantine, an NMDA receptor antagonist, to cholinesterase inhibitors (e.g., donepezil) to reduce glutamate excitotoxicity, improving cognition and behavior. Non-pharmacologic strategies (e.g., structured routines, light therapy) are first-line for agitation, reducing reliance on risky medications.",
      "🧠 **Management considerations**: The MMSE score of 17/30 and temporal/parietal atrophy confirm moderate AD. Memantine (start 5 mg daily, titrate to 10 mg twice daily) is FDA-approved for moderate-severe AD, with ~50% of patients showing reduced BPSD. Non-pharmacologic interventions (e.g., ABC approach: Antecedents, Behavior, Consequences) are effective in ~70% of agitation cases. Differential diagnoses include delirium (acute onset) and Lewy body dementia (hallucinations), ruled out by history. Caregiver education reduces stress, as ~40% of moderate AD caregivers report burnout. Monitoring with MMSE and functional assessments every 6 months guides therapy adjustments.",
      "❌ **Why not others**: Increasing donepezil to 20 mg (A) risks cholinergic side effects without behavioral benefit. High-dose benzodiazepines (C) increase confusion and fall risk, contraindicated in AD. Discontinuing donepezil (D) may worsen symptoms, as it retains benefit in moderate AD. SSRIs (E) require mood evaluation; no depression is noted here.",
    ],
  },
  {
    id: "AD-1030",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 87-year-old woman with a 10-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs, including feeding. She has recurrent aspiration pneumonia and a stage II pressure ulcer. Her MMSE score is 3/30. Brain MRI shows severe global atrophy. She is on donepezil 10 mg and memantine 10 mg twice daily. Her caregiver reports significant stress. Which SINGLE management strategy is most appropriate for this patient’s severe Alzheimer’s disease and caregiver burden?",
    options: [
      {
        key: "A",
        text: "Increase memantine dose to improve functional status",
      },
      {
        key: "B",
        text: "Refer caregiver to support services and consider palliative care consultation",
      }, // correct
      {
        key: "C",
        text: "Start a high-dose antipsychotic for presumed agitation",
      },
      {
        key: "D",
        text: "Discontinue all AD medications due to advanced disease",
      },
      {
        key: "E",
        text: "Prescribe antibiotics prophylactically for pressure ulcers",
      },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Severe Alzheimer’s disease (AD, MMSE <10) focuses on palliative care to manage complications (e.g., aspiration pneumonia, pressure ulcers) and optimize comfort. Caregiver support services (e.g., Alzheimer’s Association groups, respite care) address burnout, affecting ~60% of severe AD caregivers. Palliative care consultation aligns treatment with comfort goals, addressing infections and wounds in FAST stage 7 patients.",
      "🧠 **Management considerations**: The MMSE score of 3/30 and global atrophy confirm end-stage AD. Aspiration pneumonia (prevalence ~50%) and pressure ulcers (~20% in severe AD) require targeted interventions (e.g., swallowing therapy, wound care). Donepezil and memantine may continue for modest benefits unless side effects dominate. Differential diagnoses include severe vascular dementia (vascular lesions) or Lewy body dementia (hallucinations), ruled out by history. Palliative care is used in ~25% of severe AD cases, with hospice considered if life expectancy is <6 months. Caregiver support reduces stress and improves patient outcomes.",
      "❌ **Why not others**: Increasing memantine (A) beyond 10 mg twice daily lacks evidence and risks side effects (e.g., dizziness). High-dose antipsychotics (C) are for severe, documented agitation, not presumed, due to stroke/mortality risks. Discontinuing AD medications (D) is controversial; benefits may persist. Prophylactic antibiotics (E) are not standard for pressure ulcers; targeted treatment is preferred.",
    ],
  },
  {
    id: "AD-1031",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 79-year-old woman with a 5-year history of Alzheimer’s disease presents with worsening memory, disorientation, and increased agitation, particularly at night (sundowning). She requires assistance with complex tasks like managing finances but can perform basic ADLs independently. Her MMSE score is 16/30, with deficits in memory and orientation. Brain MRI shows temporal and parietal atrophy. She is on donepezil 10 mg daily and memantine 5 mg daily. Her caregiver reports she has started wandering outside the home. Which SINGLE complication of this patient’s moderate Alzheimer’s disease requires urgent management?",
    options: [
      { key: "A", text: "Aspiration pneumonia due to swallowing dysfunction" },
      { key: "B", text: "Wandering leading to safety risks" }, // correct
      { key: "C", text: "Acute stroke causing focal neurological deficits" },
      { key: "D", text: "Seizures secondary to cortical hyperexcitability" },
      { key: "E", text: "Urinary tract infection from incontinence" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Wandering, affecting 20-40% of moderate Alzheimer’s disease (AD, MMSE 10-20) patients, is a critical complication due to safety risks (e.g., getting lost, falls, injury). It results from frontal and limbic dysfunction disrupting spatial orientation and impulse control. Urgent management with non-pharmacologic strategies (e.g., door alarms, GPS trackers) prevents harm and is prioritized over other complications in this stage.",
      "🧠 **Complication considerations**: The MMSE score of 16/30 and temporal/parietal atrophy confirm moderate AD. Wandering requires immediate safety measures, as ~60% of AD wanderers risk serious injury if unsupervised. Sundowning (prevalence ~30%) is managed with structured routines and light therapy. Differential diagnoses include delirium (acute onset) and Lewy body dementia (hallucinations), ruled out by history. Memantine (titrated to 10 mg twice daily) and donepezil address cognitive/behavioral symptoms, with ~50% of patients showing BPSD improvement. Caregiver education on safety reduces stress, as ~40% report burnout in moderate AD.",
      "❌ **Why not others**: Aspiration pneumonia (A) is a severe AD complication, not moderate, as the patient retains ADL function. Acute stroke (C) is unlikely without focal signs or vascular risk factors; MRI shows AD-related atrophy. Seizures (D) occur in ~10% of AD patients, typically later, with no evidence here. Urinary tract infections (E) are common in severe AD with incontinence, not reported in this mobile patient.",
    ],
  },
  {
    id: "AD-1032",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "An 83-year-old man with an 8-year history of Alzheimer’s disease is nonverbal, incontinent, and fully dependent on caregivers for all ADLs, including feeding and mobility. His MMSE score is 5/30. He has had two episodes of aspiration pneumonia in the past 6 months and recent weight loss. Brain MRI shows severe global atrophy. He is on donepezil 10 mg and memantine 10 mg twice daily. Which SINGLE complication of this patient’s severe Alzheimer’s disease requires targeted management?",
    options: [
      { key: "A", text: "Wandering due to disorientation" },
      {
        key: "B",
        text: "Aspiration pneumonia secondary to swallowing dysfunction",
      }, // correct
      {
        key: "C",
        text: "Visual hallucinations from occipital lobe involvement",
      },
      { key: "D", text: "Peripheral neuropathy from vitamin deficiencies" },
      { key: "E", text: "Acute delirium from medication side effects" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Aspiration pneumonia, affecting ~50% of severe Alzheimer’s disease (AD, MMSE <10) patients, is a leading complication due to swallowing dysfunction from brainstem (e.g., nucleus ambiguus) and cortical neurodegeneration. It causes recurrent infections and is a top cause of mortality, requiring targeted management with antibiotics, swallowing therapy, and nutritional support to prevent recurrence and improve quality of life.",
      "🧠 **Complication considerations**: The MMSE score of 5/30 and global atrophy confirm end-stage AD (FAST stage 7). Aspiration pneumonia and weight loss (prevalence ~60% in severe AD due to dysphagia) necessitate chest X-ray for diagnosis and speech therapy for swallowing assessment. Differential diagnoses include heart failure (pulmonary edema) and stroke (focal deficits), ruled out by history and imaging. Palliative care, used in ~25% of severe AD cases, focuses on comfort, with hospice considered for <6-month prognosis. Donepezil/memantine may continue unless side effects outweigh benefits. Caregiver support is critical, as ~60% experience burnout.",
      "❌ **Why not others**: Wandering (A) is typical in moderate AD, not severe, where immobility predominates. Visual hallucinations (C) suggest Lewy body dementia, not AD. Peripheral neuropathy (D) from vitamin deficiencies is not reported; blood tests are normal. Acute delirium (E) is possible but less likely without medication changes or acute triggers.",
    ],
  },
  {
    id: "AD-1033",
    topic: "Geriatrics • Alzheimer’s disease",
    difficulty: "Moderate",
    vignetteTitle: "Clinic Vignette",
    stem: "A 76-year-old woman with a 4-year history of Alzheimer’s disease presents with worsening memory, difficulty following conversations, and occasional agitation. She requires assistance with cooking and finances but manages personal hygiene. Her MMSE score is 18/30. Her caregiver reports a recent fall at home, resulting in a bruised hip. Brain MRI shows temporal and parietal atrophy. She is on donepezil 10 mg and memantine 5 mg daily. Which SINGLE complication of this patient’s moderate Alzheimer’s disease needs immediate attention?",
    options: [
      { key: "A", text: "Aspiration pneumonia from impaired swallowing" },
      {
        key: "B",
        text: "Falls due to impaired visuospatial function and gait instability",
      }, // correct
      { key: "C", text: "Seizures from cortical neuronal loss" },
      { key: "D", text: "Psychotic symptoms causing severe agitation" },
      { key: "E", text: "Deep vein thrombosis from prolonged immobility" },
    ],
    correct: "B",
    explanation_detail: [
      "🌟 **First principles**: Falls, affecting ~30% of moderate Alzheimer’s disease (AD, MMSE 10-20) patients, are a major complication due to impaired visuospatial function and gait instability from parietal and frontal lobe pathology. They lead to injuries (e.g., fractures, bruises), increasing morbidity and requiring urgent safety interventions like home modifications and physical therapy to prevent recurrence.",
      "🧠 **Complication considerations**: The MMSE score of 18/30 and temporal/parietal atrophy confirm moderate AD. Falls are driven by visuospatial deficits (e.g., misjudging distances) and executive dysfunction, with ~25% of AD patients experiencing at least one fall annually. The recent fall and bruise necessitate home safety assessments (e.g., grab bars, clear walkways) and gait training. Differential diagnoses include orthostatic hypotension (no autonomic symptoms) and Lewy body dementia (no parkinsonism). Memantine (titrated to 10 mg twice daily) and donepezil manage cognition/agitation, with non-pharmacologic strategies (e.g., calm environment) reducing agitation in ~70% of cases. Caregiver education on fall prevention is critical, as ~40% report stress.",
      "❌ **Why not others**: Aspiration pneumonia (A) is typical in severe AD with swallowing issues, not moderate AD with preserved ADLs. Seizures (C) occur in ~10% of AD patients, usually later, with no evidence here. Psychotic symptoms (D) are less common than agitation in AD; her agitation is mild. Deep vein thrombosis (E) is a risk in severe AD with immobility, not this mobile patient.",
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

/* A mobile question list rendered in a modal (instead of a fixed sidebar) */
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
export default function DementiaAlzheimers() {
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

      {/* Floating toggle: on mobile bottom-right; on desktop left edge */}
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

              {/* Right tool rail */}
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
