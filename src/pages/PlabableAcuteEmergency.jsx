import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------ Question Data ------------------------ */
/* NOTE: Place the ECG image at: public/ecg-pe.png */
const QUESTIONS = [
  {
    id: "EM-1155",
    topic: "Emergency Medicine",
    difficulty: "Medium",
    vignetteTitle: "Clinical Vignette",
    stem:
      "A 20 year old man is rushed into the Emergency Department following a major road traffic accident. " +
      "Upon examination, he exhibits significant difficulty in breathing and complains of intense chest pain. " +
      "Vital signs show a systolic blood pressure of 70 mmHg and a pulse rate of 130 beats/minute. " +
      "What is the SINGLE most appropriate initial action?",
    options: [
      { key: "A", text: "Antibiotics" },
      { key: "B", text: "Analgesia" },
      { key: "C", text: "High flow oxygen" }, // correct
      { key: "D", text: "Secure venous access" },
      { key: "E", text: "Refer to surgeon" },
    ],
    correct: "C",
    explanation_plabable: [
      "In this question, the examiners want you to know the basics of life-threatening emergencies. ABC — airway, breathing, circulation should always be addressed first.",
      "This patient is in shock. In reality, high flow oxygen, securing venous access and analgesia would all be done simultaneously. But for the purpose of the exam, we follow NHS-style priorities: secure the airway and give oxygen first. Thus, ‘High flow oxygen’ is the best single initial action.",
    ],
    explanation_detail: [
      "Primary survey principles (DRABC) take precedence in the multi-trauma patient: ensure a patent airway and adequate oxygenation before circulation interventions. Profound hypotension with tachycardia is consistent with shock; immediate high-flow oxygen improves tissue delivery and buys time for definitive management.",
    ],
  },

  /* ---------- NEW QUESTION (from your screenshots) ---------- */
  {
    id: "CA-2221",
    topic: "Emergency Medicine",
    difficulty: "Medium",
    vignetteTitle: "Clinical Vignette",
    image: "/ecg-pe.png",
    stem:
      "A 35 year old woman presents to the Emergency Department with sudden onset of shortness of breath and pleuritic chest pain. " +
      "She describes feeling breathless over the past hour and denies any history of fever or cough. " +
      "Her symptoms began while she was sitting at her desk at work. She has no significant past medical history. " +
      "On examination, she appears tachypnoeic (RR 26). Her oxygen saturation is 91% on room air. " +
      "Her pulse is 110 beats per minute and regular, and her blood pressure is 110/70 mmHg. ECG is seen below. " +
      "What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Acute myocardial infarction" },
      { key: "B", text: "Anxiety attack" },
      { key: "C", text: "Aortic dissection" },
      { key: "D", text: "Pericarditis" },
      { key: "E", text: "Pulmonary embolism" }, // correct
    ],
    correct: "E",
    /* Plabable Explanation (verbatim from your screenshot) */
    explanation_plabable: [
      "The presentation of sudden onset shortness of breath and pleuritic chest pain, coupled with tachypnoea (respiratory rate of 26), hypoxia (oxygen saturation of 91% on room air), and tachycardia (pulse of 110 beats per minute) is highly suggestive of a pulmonary embolism (PE).",
      "The ECG shows a right bundle branch block (RBBB) which can be associated with a PE. Even if a right bundle branch block (RBBB) is not evident on the ECG, the absence of ST elevation in a 35 year old woman should still raise suspicion for a pulmonary embolism (PE). Myocardial infarctions (MIs) are relatively uncommon in young individuals without significant cardiovascular risk factors.",
      "Anxiety could cause hyperventilation but would not typically result in hypoxia.",
      "Plabable tip: Not all exam questions on pulmonary embolism (PE) will present with the classic or textbook features (e.g. recent surgery, long-haul flights, active cancer, use of combined oral contraception, or a prior history of deep vein thrombosis (DVT)).",
    ],
    /* Detailed Explanation (my expanded teaching notes) */
    explanation_detail: [
      "Why PE fits best: sudden pleuritic chest pain + acute dyspnoea with tachycardia, tachypnoea and resting hypoxaemia are classic for pulmonary embolism. Normal BP and regular pulse suggest submassive PE rather than massive PE (no persistent hypotension).",
      "ECG in PE: often non-specific but can show sinus tachycardia (commonest), right heart strain patterns—RBBB (complete or incomplete), T-wave inversions V1–V4, right axis deviation, and occasionally S1Q3T3. The provided tracing demonstrates features consistent with right ventricular strain rather than ischaemic ST-segment elevation.",
      "Why other options are less likely: MI typically causes crushing central pain, risk factors, and ST-segment changes; pericarditis produces pleuritic pain classically better when leaning forward with diffuse ST elevation and PR depression; aortic dissection causes tearing pain radiating to the back with pulse/BP differentials; panic/anxiety may cause tachypnoea but not true hypoxaemia.",
      "Initial ED approach: assess stability (ABCs). Give oxygen to target SpO₂ ≥94% (or ≥90% if COPD), establish IV access and send labs including D-dimer if pre-test probability is low/intermediate. Calculate a Wells score (e.g., signs of DVT, HR >100, recent immob/surgery, haemoptysis, cancer, alternative diagnosis less likely). High probability or positive D-dimer → proceed to CTPA. If CTPA contraindicated (e.g., contrast allergy, pregnancy) use V/Q scan. Consider bedside leg ultrasound if DVT suspected.",
      "Treatment: haemodynamically stable PE → prompt anticoagulation (e.g., LMWH or DOAC per local guidance). Haemodynamically unstable (massive) PE → thrombolysis is indicated unless contraindicated; consider surgical or catheter-directed therapy if lysis is contraindicated/unsuccessful. Provide analgesia for pleuritic pain and treat precipitating factors.",
      "Prognosis & follow-up: risk-stratify (PESI/sPESI), screen for provoking factors (recent immobility, OCP, malignancy); typical anticoagulation duration is 3 months if provoked, longer if unprovoked or with persistent risk. Educate on recurrence signs and when to seek care.",
    ],
  },
  {
  id: "SS-0003",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Clinical Vignette",
  stem:
    "An 18 month old boy accidentally pulled a cup of hot tea off a high table. The hot liquid splashed over him, and he now presents with a partial thickness burn covering 6% of his total body surface area (TBSA), localised to his chest. What is the best treatment for him?",
  options: [
    { key: "A", text: "IV crystalloids" },
    { key: "B", text: "IV colloids" },
    { key: "C", text: "No need for IV treatment" },   // ✅ correct
    { key: "D", text: "IV dextrose bolus" },
    { key: "E", text: "IV albumin infusion" }
  ],
  correct: "C",

  // ---- Plabable Explanation (as requested) ----
  explanation_plabable: [
    "Any child with more than <mark>10% of the total body surface area (TBSA)</mark> burned requires fluid replacement. Here, there is only <strong>6%</strong>.",
    "Further reading: <a class='underline text-purple-700' href='http://patient.info/doctor/burns-assessment-and-management' target='_blank' rel='noreferrer'>patient.info — Burns: assessment & management</a>."
  ],

  // ---- Detailed Explanation (NICE-aligned; with emphasis) ----
  explanation_detail: [
    "<strong>Why C is correct:</strong> This is a scald in an <em>18-month-old</em> with a <em>partial-thickness</em> burn of <strong>6% TBSA</strong>, confined to the chest. In children, formal IV fluid <mark>resuscitation is generally started when TBSA ≥10%</mark> (adults ≥15%). Below these thresholds, manage with oral fluids, analgesia and wound care; monitor clinically rather than reflex IV therapy.",
    "<strong>Initial management (NICE-aligned first aid):</strong> Cool the burn under <em>cool running water</em> for 20 minutes (ideally within 3 hours). Remove clothing/jewellery. <strong>Do not use ice</strong> or creams. Cover with <em>cling film</em> or a non-adherent sterile dressing. Give weight-appropriate analgesia (paracetamol/ibuprofen). Keep warm to avoid hypothermia. Check <strong>tetanus</strong> status.",
    "<strong>Assessment points:</strong> Estimate TBSA using the <em>Lund & Browder</em> chart in children (or the child’s palm incl. fingers ≈ <strong>1% TBSA</strong>). Determine depth (superficial ↔ full thickness). Assess ABCs and <strong>consider non-accidental injury</strong> if history/pattern is atypical.",
    "<strong>When to give IV fluids:</strong> Start IV crystalloid (e.g., Hartmann’s) when <mark>TBSA ≥10% in children</mark> or if there are signs of shock/dehydration. Use a formula such as <em>Parkland</em> (4 mL × weight(kg) × %TBSA over 24 h — half in first 8 h) <em>plus paediatric maintenance fluids</em>. Target urine output ≈ <strong>1 mL/kg/h</strong>. <strong>Avoid colloids/albumin early</strong>; they’re not first-line for initial resuscitation. Dextrose bolus is for documented hypoglycaemia only.",
    "<strong>Referral / escalation (typical UK criteria):</strong> Refer early to a burns service for <mark>≥5% TBSA in children</mark>, any full-thickness burn, burns of the <em>face, hands, feet, perineum/genitals, or major joints</em>, circumferential burns, electrical/chemical/inhalation injury, or safeguarding concerns.",
    "<strong>Disposition & safety-netting:</strong> With <strong>6% TBSA</strong> and good oral intake, outpatient care is reasonable: clear return advice (reduced urine output, fever, increasing pain/redness suggesting infection, lethargy), review/dressing plan, and precise analgesia dosing."
  ]
},
{
  id: "EM-0507",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  // ABG values separated by blank lines using <br/><br/>
  stem:
    "A 23 year old woman presents to the Emergency Department with symptoms of dizziness, sweating, and tinnitus. She admits to having ingested a large number of aspirin tablets approximately three hours prior to arrival. On examination, she is tachypnoeic with a respiratory rate of 30 breaths per minute and appears agitated. An arterial blood gas (ABG) analysis reveals the following:<br/><br/>" +
    "pH 7.49 (7.35 – 7.45)<br/>" +
    "PaO2 12.0 kPa (10–14)<br/>" +
    "PaCO2 2.9 kPa (4.7–6.0)<br/>" +
    "Bicarbonate 22 mmol/L (22–26)<br/><br/>" +
    "Which of the following best describes the primary acid-base disturbance in this patient?",
  options: [
    { key: "A", text: "Respiratory acidosis" },
    { key: "B", text: "Respiratory acidosis with compensation" },
    { key: "C", text: "Respiratory alkalosis" },      // ✅ correct
    { key: "D", text: "Metabolic acidosis" },
    { key: "E", text: "Mixed respiratory alkalosis and metabolic acidosis" }
  ],
  correct: "C",

  // EXACT Plabable explanation (unchanged)
  explanation_plabable: [
    "The patient has an elevated pH indicating alkalosis. The low PaCO2 suggests a primary respiratory cause, as it reflects hyperventilation.",
    "Aspirin overdose, or salicylate poisoning, has a characteristic pathophysiological effect on the acid-base balance of the body, which can sometimes lead to a mixed picture of disturbances.",
    "In the early stages of salicylate (aspirin) toxicity, respiratory alkalosis often occurs first. This is due to direct stimulation of the respiratory center in the brain by salicylates, leading to increased breathing rate and depth (hyperventilation), which lowers carbon dioxide levels and raises the blood pH.",
    "As the toxicity progresses, metabolic acidosis can develop. This occurs because salicylates interfere with cellular metabolism, leading to an accumulation of organic acids in the blood. The body's efforts to compensate for this acidosis can be overwhelmed, especially if the toxicity is severe or prolonged.",
    "Therefore, it is important to monitor for any changes in her acid-base status. However, based on the provided ABG values, the primary disturbance at this time is respiratory alkalosis.",
    "The patient's bicarbonate level is within the normal range at 22 mmol/L, suggesting that there is no significant metabolic compensation occurring at this stage."
  ],

  // (Optional) Extra teaching – keep or remove as you like
  explanation_detail: [
    "<strong>Stepwise ABG interpretation</strong>: (1) pH 7.49 → <mark>alkalaemia</mark>. (2) PaCO₂ 2.9 kPa (low) → points toward a <strong>respiratory alkalosis</strong>. (3) HCO₃⁻ 22 mmol/L is ~normal → <em>little/no metabolic process</em> influencing the pH right now. Therefore, the <strong>primary disturbance = respiratory alkalosis</strong>.",
    "<strong>Why salicylates do this</strong>: Salicylates stimulate the medullary respiratory centre → <em>hyperventilation</em> → <mark>↓PaCO₂</mark> → <strong>respiratory alkalosis</strong> (often within the first few hours). Later, salicylates uncouple oxidative phosphorylation and increase organic acid production, generating an <strong>anion gap metabolic acidosis</strong>. Many patients ultimately have a <em>mixed</em> picture, but <u>this ABG</u> still shows predominant respiratory alkalosis (normal HCO₃⁻, alkalemic pH).",
    "<strong>Why the other options are wrong</strong>:",
    "• <strong>A/B (respiratory acidosis)</strong>—would require <mark>high</mark> PaCO₂ with low/normal pH; here PaCO₂ is <em>low</em> and pH is high.<br/>• <strong>D (metabolic acidosis)</strong>—would show low HCO₃⁻ and acidemia (pH &lt; 7.35); neither is present.<br/>• <strong>E (mixed)</strong>—possible in salicylate toxicity, but you’d expect <em>alkalaemia with a <strong>low</strong> HCO₃⁻</em> (or a more equivocal pH). Here HCO₃⁻ is 22 mmol/L and the findings fit a <strong>primary respiratory alkalosis</strong> best.",
    "<strong>Immediate management pearls in suspected salicylate overdose</strong>:",
    "• <mark>ABCs</mark>, repeat vitals, IV access, glucose check (treat hypoglycaemia).<br/>• Measure salicylate level, VBG/ABG, U&amp;Es, glucose, lactate, LFTs; consider co-ingestants (e.g., paracetamol).<br/>• <strong>Avoid intubation if possible</strong>—loss of hyperventilation can rapidly worsen acidaemia and CNS salicylate entry. If intubation is unavoidable, <em>match pre-intubation minute ventilation</em> and use high rates to keep PaCO₂ low.<br/>• <strong>Alkalinise serum/urine</strong> with IV sodium bicarbonate when indicated (e.g., significant levels/symptoms): target serum pH 7.45–7.55 and urine pH &gt; 7.5; maintain potassium &gt; 4.0 mmol/L to enable urine alkalinisation.<br/>• <strong>Haemodialysis</strong> for severe toxicity (very high levels, severe acidosis, renal failure, pulmonary/cerebral oedema, refractory symptoms).<br/>• Activated charcoal if early and airway protected (per local toxicology guidance).",
    "<strong>Exam takeaway</strong>: In early salicylate poisoning, think <mark>respiratory alkalosis</mark>. If a later ABG shows <em>low HCO₃⁻</em> with near-normal pH, suspect a <strong>mixed respiratory alkalosis + metabolic acidosis</strong>. Here, normal HCO₃⁻ and high pH make <strong>Respiratory alkalosis</strong> the best single answer."
  ]
},
{
  id: "EM-3139",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 21 year old lady after a heavy bout of drinking last night comes to the emergency department with vomiting blood, feeling dizzy, and having intense abdominal pain. On examination, her limbs feel cold. She has a pulse of <strong>130 beats/minute</strong> and blood pressure of <strong>85/58 mmHg</strong>. After initial resuscitation with oxygen and fluids, she still continues to bleed and continues to vomit blood. <br/><br/><strong>What is the SINGLE next best step?</strong>",
  options: [
    { key: "A", text: "Clotting screen" },
    { key: "B", text: "Ultrasound" },
    { key: "C", text: "Computed tomography" },
    { key: "D", text: "Endoscopy" },                 // ✅ correct
    { key: "E", text: "Intravenous omeprazole" }
  ],
  correct: "D",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "This is a classic presentation of Mallory-Weiss syndrome (MWS). It is characterised by upper gastrointestinal bleeding (UGIB) from mucosal lacerations in the upper gastrointestinal tract, usually at the gastro-oesophageal junction or gastric cardia.",
    "Excessive alcohol ingestion is one of the main causes as prolonged or forceful bout of vomiting can cause a tear in the upper gastrointestinal tract.",
    "Light-headedness and dizziness and features associated with the initial cause of the vomiting - eg, abdominal pain may be seen and are seen in this stem.",
    "Resuscitation is a priority - maintain airway, provide high-flow oxygen, correct fluid losses by giving IV fluids. Intravenous blood can also be given in severe cases.",
    "Haemodynamically unstable patients like in this stem should have endoscopy immediately after resuscitation. It is the primary diagnostic investigation and can be used to stop the bleeding.",
    "Note proton pump inhibitor (PPI) use is not recommended prior to diagnosis by endoscopy. A Cochrane review found PPI use at this stage was not associated with a reduction in re-bleeding, need for surgery or mortality.",
    "Reference:",
    "<a class='underline text-purple-700' href='http://patient.info/doctor/mallory-weiss-syndrome-pro' target='_blank' rel='noreferrer'>http://patient.info/doctor/mallory-weiss-syndrome-pro</a>"
  ],

  /* -------------------- Detailed Explanation (long, NICE-aligned) -------------------- */
  explanation_detail: [
    "<strong>Why the answer is <mark>Endoscopy</mark>:</strong> She remains <em>haemodynamically unstable</em> (HR 130, BP 85/58) and is <em>still vomiting blood</em> after initial resuscitation. NICE CG141 (<em>Acute upper GI bleeding in over-16s</em>) recommends <mark>urgent endoscopy immediately after resuscitation in unstable patients with severe ongoing bleeding</mark>, both to diagnose the source and to deliver endoscopic haemostasis. Therefore, <strong>endoscopy</strong> is the single next best step.",
    "<strong>Typical cause in this stem—Mallory–Weiss tear:</strong> A mucosal laceration at the <em>gastro-oesophageal junction</em> or <em>gastric cardia</em> after forceful retching, commonly precipitated by alcohol binges. Most tears stop spontaneously, but a subset bleed briskly and require endoscopic therapy (e.g., <em>adrenaline injection</em> plus a second modality such as <em>clips</em> or <em>thermal coagulation</em>).",
    "<strong>Initial ED priorities (resuscitation) — ABC:</strong> Secure airway if ongoing haematemesis threatens aspiration; give high-flow oxygen, obtain two large-bore IV cannulae, draw blood (FBC, U&amp;Es, LFTs, group &amp; save/crossmatch ± coagulation profile), start IV crystalloids and activate massive haemorrhage protocols if needed. <em>Restrictive transfusion</em> strategy is recommended (generally Hb threshold around <strong>70 g/L</strong>, or <strong>80 g/L</strong> if ACS). Transfuse platelets if <strong>&lt;50 ×10⁹/L</strong> with active bleeding; correct coagulopathy (vitamin K, PCC for warfarin; specific reversal for DOACs where indicated).",
    "<strong>Risk scoring:</strong> At first assessment, calculate the <em>Glasgow-Blatchford Score (GBS)</em> to stratify risk and need for admission/intervention. After endoscopy, use the <em>full Rockall score</em> to estimate re-bleeding/mortality. In this case, shock vital signs mandate admission and urgent endoscopy regardless of score.",
    "<strong>Timing of endoscopy:</strong> NICE advises endoscopy <em>within 24 hours</em> for most suspected UGIB; <mark>sooner (immediate)</mark> after resuscitation if unstable or with continued haematemesis—this patient qualifies.",
    "<strong>What happens at endoscopy (non-variceal UGIB):</strong> For actively bleeding non-variceal lesions, use <em>adrenaline</em> injection plus a <em>second modality</em> (mechanical clip or thermal coagulation) to secure haemostasis. For Mallory–Weiss tears, clips or thermal methods are commonly effective; banding can also be used. If endoscopic therapy fails, consider <em>interventional radiology</em> (embolisation) or <em>surgery</em>.",
    "<strong>PPI timing:</strong> Do <mark>not</mark> start PPI <em>before</em> diagnostic endoscopy (no outcome benefit for re-bleeding, surgery or mortality). After endoscopic haemostasis for high-risk non-variceal lesions, start <strong>high-dose IV PPI</strong> (e.g., bolus + infusion for 72 h) then step down to oral. If a clean-based, low-risk lesion is found, routine PPI infusion is unnecessary.",
    "<strong>Why the other options are wrong <em>as the next step</em>:</strong><br/>• <strong>A. Clotting screen</strong> — appropriate work-up but <em>should not delay</em> life-saving haemostasis when bleeding continues after resuscitation.<br/>• <strong>B. Ultrasound</strong> — not useful for diagnosing the source of UGIB or stopping the bleed.<br/>• <strong>C. CT</strong> — may be used if endoscopy and IR fail or diagnosis is uncertain, but it <em>doesn’t provide immediate haemostasis</em> and is not first line in active haematemesis.<br/>• <strong>E. IV omeprazole</strong> — <mark>not recommended prior to endoscopy</mark>; evidence (including Cochrane) shows no reduction in re-bleeding/need for surgery/mortality when given pre-diagnosis.",
    "<strong>Differentials to keep in mind:</strong> <em>Variceal bleeding</em> (cirrhosis, stigmata of chronic liver disease) — give <strong>IV antibiotics</strong> and <strong>terlipressin</strong> early; endoscopic <em>band ligation</em> is preferred. <em>Peptic ulcer</em> (NSAIDs/H. pylori), <em>gastritis</em>, <em>Dieulafoy lesion</em>, <em>Boerhaave</em> (if severe chest/neck pain and mediastinal signs after vomiting).",
    "<strong>Aftercare & disposition:</strong> Observe for re-bleeding (tachycardia, falling Hb, fresh haematemesis/melaena). Optimise analgesia and anti-emetics, treat alcohol-related issues, and plan follow-up. Use the <em>post-endoscopy Rockall</em> to decide ward vs higher level care.",
    "<strong>Key exam takeaways:</strong> (1) <mark>Ongoing haematemesis + haemodynamic instability → urgent endoscopy after resuscitation</mark>. (2) Don’t give a pre-endoscopy PPI. (3) For non-variceal bleeds, adrenaline <em>plus</em> a second modality. (4) Risk-assess with GBS (pre-scope) and Rockall (post-scope)."
  ]
},
{
  id: "EM-1023",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 58 year old woman presents to the Emergency Department with shortness of breath that started 12 hours ago. Her blood pressure is <strong>145/98 mmHg</strong>, heart rate is <strong>111 beats/minute</strong>, respiratory rate is <strong>23 breaths/minute</strong>, and oxygen saturation is <strong>92% on room air</strong>. Physical examination reveals a mildly distressed woman with tachypnoea. <br/><br/>What is the most appropriate <strong>initial investigation</strong>?",
  options: [
    { key: "A", text: "Immediate computed tomography pulmonary angiography (CTPA)" },
    { key: "B", text: "Echocardiogram" },
    { key: "C", text: "Creatine kinase" },
    { key: "D", text: "Lower limb venous Doppler ultrasound" },
    { key: "E", text: "Chest X-ray" } // ✅ correct
  ],
  correct: "E",

  // -------- Plabable Explanation (exact text) --------
  explanation_plabable: [
    "A chest X-ray is quick, widely available, and can provide crucial information on a range of potential issues including heart failure, pneumonia, pneumothorax and other causes of acute respiratory distress. Even if one suspects a pulmonary embolism, it would be prudent to perform a chest X-ray first to rule out other pathologies before proceeding with a CTPA."
  ],

  // -------- Detailed Explanation (expanded teaching) --------
  explanation_detail: [
    "<strong>Why E (Chest X-ray) is the best initial investigation:</strong> In an undifferentiated patient with <em>acute dyspnoea</em> and abnormal vitals (SpO₂ 92%, RR 23, HR 111), a <mark>portable chest radiograph</mark> is fast, widely available, low-radiation, and helps identify or exclude common life-threatening causes such as <strong>pneumonia</strong>, <strong>pulmonary oedema/heart failure</strong>, <strong>pneumothorax</strong>, large pleural effusion, or gross lung collapse. It also provides a baseline before further imaging and can reveal alternative diagnoses that would change the immediate plan.",
    "<strong>What about suspected PE?</strong> CXR is <em>not diagnostic</em> for PE, but guidelines favour obtaining it early because it may explain hypoxaemia (e.g., consolidation, pneumothorax) and helps interpret/plan subsequent imaging. After CXR, if PE remains a concern, assess pre-test probability (e.g., Wells). <em>Low/intermediate</em> probability → D-dimer then CTPA if positive. <em>High</em> probability and haemodynamically stable → proceed to CTPA directly; if unstable, consider bedside echo for right-heart strain and treat empirically as per local protocol.",
    "<strong>Why the other options are not the first step here:</strong><br/>• <strong>A. Immediate CTPA</strong> — appropriate only after clinical risk assessment or if high pre-test probability; as an <em>initial</em> test in undifferentiated dyspnoea it is premature, higher radiation/contrast risk, and may miss alternative diagnoses found on CXR.<br/>• <strong>B. Echocardiogram</strong> — useful for suspected acute heart failure, pericardial tamponade, or to look for RV strain in massive PE, but it is not the routine first investigation in a stable dyspnoeic patient.<br/>• <strong>C. Creatine kinase</strong> — CK is for myopathy/rhabdomyolysis or some cardiac workups but is not helpful in the immediate evaluation of dyspnoea.<br/>• <strong>D. Lower limb venous Doppler</strong> — may support a PE diagnosis if DVT is found, but it does not evaluate primary thoracic causes of dyspnoea and is not the first test in this presentation.",
    "<strong>Initial ED bundle for undifferentiated dyspnoea (quick checklist):</strong> ABCs and continuous monitoring; pulse oximetry ± arterial/venous blood gas if needed; ECG; <mark>portable CXR</mark>; basic labs (FBC, U&amp;Es, CRP, troponin if chest pain/ischemia suspected); consider D-dimer guided by pre-test probability; bedside lung ultrasound if skilled operator available (can rapidly detect pneumothorax, B-lines in pulmonary oedema, consolidation, effusion).",
    "<strong>Exam takeaway:</strong> When the stem asks for the <em>most appropriate initial investigation</em> for acute breathlessness without a definite diagnosis, choose the <strong>Chest X-ray</strong> first, then escalate testing according to the evolving differential."
  ]
},
{
  id: "EM-2473",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 45 year old man is brought to the Emergency Department by ambulance following an intentional overdose of propranolol. He is drowsy and pale, and initial observations reveal a heart rate of 45 beats per minute and a blood pressure of 80/50 mmHg. The man reports feeling lightheaded, and examination shows cold peripheries with delayed capillary refill time. He was commenced on intravenous fluids en route. ECG shows sinus bradycardia without evidence of heart block. Which of the following is the most appropriate antidote?",
  options: [
    { key: "A", text: "Atropine" },
    { key: "B", text: "Calcium chloride" },
    { key: "C", text: "Glucagon" },      // ✅ correct
    { key: "D", text: "Insulin and glucose" },
    { key: "E", text: "Sodium bicarbonate" }
  ],
  correct: "C",

  // —— Plabable Explanation (exact text) ——
  explanation_plabable: [
    "Glucagon is the most appropriate antidote for beta-blocker overdose, as it increases heart rate and myocardial contractility through a mechanism independent of beta-adrenergic receptors.",
    "Atropine is commonly used for bradycardia as it blocks vagal activity at the sinoatrial (SA) node, which can increase heart rate. It can be used first line here, but it is NOT considered an antidote."
  ],

  // —— Detailed Explanation (expanded) ——
  explanation_detail: [
    "Why glucagon: Propranolol blocks β1 receptors, reducing chronotropy/inotropy and causing hypotension and bradycardia. Glucagon activates its own receptors, increasing cAMP via a β-independent pathway to restore heart rate and contractility—hence the specific antidote.",
    "Dosing (adult exam level): IV bolus 5–10 mg (or 50–150 micrograms/kg), repeat if needed; then infusion 2–5 mg/h titrated to effect. Monitor for nausea/vomiting, hyperglycaemia and hypokalaemia.",
    "ED algorithm: ABCs, monitors, large-bore IV access; check glucose (β-blockers can cause hypoglycaemia). Consider activated charcoal if early and airway protected. If bradycardic/hypotensive: fluids → atropine (symptomatic, not antidote) → glucagon. If inadequate response, start high-dose insulin euglycaemia therapy (regular insulin 1 U/kg bolus, then 1–10 U/kg/h with dextrose; maintain K⁺ > 4). Add vasopressors as needed; consider lipid emulsion (lipophilic agents like propranolol), pacing, and ECMO for refractory shock.",
    "Other options: Calcium chloride helps CCB toxicity more than β-blocker poisoning. Insulin/glucose is escalation therapy but not the specific antidote. Sodium bicarbonate is for QRS widening/ventricular arrhythmias (membrane-stabilising effect), not routine in isolated sinus bradycardia."
  ]
},
{
  id: "CK-2900",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 12 year old comes into the Emergency Department with <strong>severe burns</strong> all over his body from a house fire. There is <strong>oropharyngeal swelling</strong> and <strong>soot in the mouth</strong>. He is in severe pain. <br/><br/>What is the <strong>SINGLE</strong> most appropriate management?",
  options: [
    { key: "A", text: "Refer to burn unit" },
    { key: "B", text: "Intravenous fluids" },
    { key: "C", text: "Intravenous antibiotic" },
    { key: "D", text: "Intravenous analgesia" },
    { key: "E", text: "Call a senior anaesthetist" }  // ✅ correct
  ],
  correct: "E",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "After major burns, If there is any evidence of impending airway obstruction (stridor, oropharyngeal swelling, call for senior ED help and a senior anaesthetist immediately. Urgent general anaesthesia and tracheal intubation may be life-saving.",
    "Airway, breathing, and circulation — Always in this order",
    "Smoke inhalation injury is a common cause of death in burn victims. Initial assessment may reveal no evidence of injury, but laryngeal oedema can develop suddenly and unexpectedly thus early intubation is warranted if there is evidence of inhalation injury.",
    "Signs and symptoms of smoke inhalation injury",
    "<ul class='list-disc ml-5'><li>Persistent cough</li><li>Stridor</li><li>Wheezing</li><li>Black sputum suggests excessive exposure to soot</li><li>Use of accessory muscles of respiration</li><li>Blistering or oedema of the oropharynx</li><li>Hypoxia or hypercapnia</li></ul>",
    "Further reading:",
    "<a class='underline text-purple-700' href='http://patient.info/doctor/inhalation-injury' target='_blank' rel='noreferrer'>http://patient.info/doctor/inhalation-injury</a>"
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Call a senior anaesthetist</mark> is the best single step:</strong> The child has <em>oropharyngeal swelling</em> and <em>soot in the mouth</em> after an enclosed-space fire — classic red flags for <strong>impending airway obstruction</strong> from inhalational injury. Airway oedema can progress rapidly; attempts at late intubation may fail. Therefore, per ABC priorities and UK practice, <strong>early senior anaesthetic involvement for urgent RSI and tracheal intubation</strong> is potentially life-saving and supersedes fluids/analgesia/referral as the <em>immediate</em> step.",
    "<strong>Key airway indicators for early intubation in burns/smoke inhalation:</strong> facial burns or singed nasal hairs; hoarseness/stridor; carbonaceous sputum or soot; oropharyngeal blisters/oedema; enclosed-space fire; progressive swelling; GCS reduction; hypoxia/hypercapnia. <em>Any of these in a child</em> should prompt <strong>senior airway help now</strong>.",
    "<strong>Practical airway approach (ED):</strong> Prepare for <em>rapid sequence induction</em> with experienced anaesthetist; anticipate difficult view and choose a <strong>smaller ETT size</strong> due to swelling; have adjuncts/backup (video laryngoscope, bougie, supraglottic, front-of-neck access kit). Give <strong>100% oxygen</strong> via non-rebreather while setting up. Maintain cervical spine precautions if trauma suspected.",
    "<strong>Concurrent priorities after calling anaesthetics (do not delay airway):</strong><br/>• <mark>High-flow O₂</mark> for potential carbon monoxide (CO) exposure; send co-oximetry if available. Consider <strong>hydroxocobalamin</strong> for suspected cyanide toxicity (soot + AMS + lactic acidosis).<br/>• Stop the burning process, remove constricting items, keep the child <strong>warm</strong> (hypothermia worsens outcomes). Cover burns with clean dry film/dressings; <em>no ice</em>.<br/>• Establish two IV lines (or IO) after airway is secure; draw labs (FBC, U&amp;Es, VBG/ABG with co-oximetry, lactate, carboxyhaemoglobin).",
    "<strong>Fluids — when and how (children):</strong> After the airway is secured, calculate TBSA (Lund &amp; Browder chart). For children, start formal IV fluid resuscitation when <strong>TBSA ≥ 10%</strong> (adults ≥ 15%) or if there are signs of shock. Use a burn formula (e.g., Parkland <em>4 mL × weight(kg) × %TBSA</em> over 24 h) <em>plus paediatric maintenance</em>. Give half in the first 8 h from time of burn. Titrate to <strong>urine output ≈ 1 mL/kg/h</strong>; avoid over-resuscitation (risk of oedema/compartment syndrome).",
    "<strong>Pain & wound care:</strong> Give <em>intravenous</em> analgesia (e.g., morphine titrated) once airway/ventilation are secured; consider ketamine if haemodynamically unstable and airway protected. Cover wounds with film; cleanse/debride later in specialised care. Check <strong>tetanus</strong> status.",
    "<strong>When to involve the burns centre (children):</strong> <mark>All suspected inhalational injuries</mark>; ≥5% TBSA; any full-thickness burn; burns to face, hands, feet, genitalia, perineum or major joints; circumferential limb/torso burns; electrical/chemical burns; safeguarding concerns. Initiate early discussion even while stabilising.",
    "<strong>Why the other options are not the single best next step:</strong><br/>• <strong>Refer to burn unit (A)</strong> — necessary, but <em>not</em> before the airway is secured; deterioration may occur en route.<br/>• <strong>IV fluids (B)</strong> — important after the airway; starting them <em>before</em> addressing impeding obstruction risks losing the airway.<br/>• <strong>IV antibiotic (C)</strong> — not indicated routinely in acute thermal burns without infection.<br/>• <strong>IV analgesia (D)</strong> — appropriate, but analgesia must not precede management of a threatened airway; opioids can depress respiration.",
    "<strong>Exam takeaways:</strong> (1) In burns from a house fire with <mark>soot/oropharyngeal swelling/stridor</mark> → <strong>call senior anaesthetist; intubate early</strong>. (2) Give 100% O₂ and consider CO/cyanide. (3) Warm, cover, then fluids using paediatric thresholds/formulae. (4) Early burns-centre involvement and safeguarding assessment."
  ]
},
{
  id: "EM-0241",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 4 year old girl is brought to the Emergency Department after pulling a kettle of boiling water onto herself. She has sustained a <strong>3% total body surface area</strong> burn across her chest. The affected area is red, blistered, and very painful. She is distressed, crying, and unable to tolerate assessment due to pain. She is haemodynamically stable. <strong>She does not have an IV line.</strong> <br/><br/>What is the most appropriate pain management?",
  options: [
    { key: "A", text: "Intranasal diamorphine" },   // ✅ correct
    { key: "B", text: "IV morphine" },
    { key: "C", text: "Rectal diclofenac" },
    { key: "D", text: "Oral paracetamol" },
    { key: "E", text: "Buccal midazolam" }
  ],
  correct: "A",

  /* -------------------- Plabable Explanation (from your screenshot) -------------------- */
  explanation_plabable: [
    "This child has a superficial partial-thickness burn, as indicated by blistering, redness, and significant pain. She is highly distressed and unable to tolerate assessment, making intranasal diamorphine the most appropriate choice for rapid, effective pain relief. Intranasal diamorphine has a fast onset of action, is less invasive than IV opioids, and is well tolerated in young children.",
    "IV morphine is also suitable but in this case, it is less ideal. While effective, it requires IV access, which may be difficult to achieve quickly in a distressed, crying child.",
    "Oral paracetamol is insufficient here as the scenario describes a superficial partial-thickness burn with severe pain.",
    "Further Reading:",
    "https://www.nn.nhs.scot/cobis/wp-content/uploads/sites/9/2024/02/NSD610-006.15-Pa...",
    "https://www.evelinalondon.nhs.uk/resources/our-services/hospital/south-thames-ret..."
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Intranasal diamorphine</mark> is best here:</strong> The child has a <em>small TBSA (3%) superficial partial-thickness</em> scald but is <strong>very distressed</strong> and <strong>has no IV access</strong>. Intranasal (IN) opioid provides <mark>rapid, titratable analgesia</mark> without cannulation, which is ideal for painful burns in young children.",
    "<strong>How to use it (ED practice, UK):</strong> Typical IN diamorphine dose <strong>0.1 mg/kg</strong> (max commonly 5 mg), delivered via mucosal atomiser, onset ~<em>5–10 min</em>. Reassess after 10 minutes; repeat small doses if needed. If diamorphine is unavailable, many EDs use <strong>IN fentanyl 1.5–2 micrograms/kg</strong> (max per local policy) with similar onset.",
    "<strong>Why the other options are not first choice in this stem:</strong><br/>• <strong>IV morphine</strong>—effective, but requires cannulation; securing IV access in a crying 4-year-old with a painful burn <em>delays</em> timely analgesia.<br/>• <strong>Rectal diclofenac</strong>—NSAID route/absorption is unreliable in acute severe burn pain and provides <em>insufficient</em> relief as monotherapy; also avoid NSAIDs if dehydration/AKI risk.<br/>• <strong>Oral paracetamol</strong>—useful adjunct, but onset is slower and inadequate alone for severe partial-thickness burn pain.<br/>• <strong>Buccal midazolam</strong>—a sedative/anticonvulsant, <em>not an analgesic</em>; may worsen airway/respiratory status without treating pain.",
    "<strong>Immediate burn care alongside analgesia:</strong> Cool the burn with <em>cool running water</em> for 20 minutes (if within ~3 hours), remove clothing/jewellery, avoid ice/creams. Cover with <strong>cling film</strong>/non-adherent dressing; keep child <strong>warm</strong> to prevent hypothermia. Check <strong>tetanus</strong> status.",
    "<strong>Escalation/adjuncts:</strong> Add oral paracetamol and (if no contraindication) ibuprofen once the child can tolerate PO. If ongoing severe pain or wound care required, proceed to <em>IV opioids</em> once access is obtained or consider <strong>ketamine procedural sedation</strong> via a senior-led pathway.",
    "<strong>When to involve a burns service:</strong> Children with ≥5% TBSA, any <em>full-thickness</em> burn, burns to face/hands/feet/genitals/perineum/major joints, circumferential burns, chemical/electrical/inhalational injury, suspicion of non-accidental injury, or concerns about pain control / dressing tolerance.",
    "<strong>Exam takeaways:</strong> (1) Severe pain + no IV → choose a <mark>rapid intranasal opioid</mark>. (2) Paracetamol/NSAIDs are <em>adjuncts</em>, not primary therapy here. (3) Midazolam is <em>not</em> an analgesic."
  ]
},
{
  id: "NE-1352",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 5 year old boy with a febrile convulsion lasting eight minutes. He has been given intravenous lorazepam to control his seizures. What is the SINGLE most likely side effect of intravenous lorazepam that is potentially life-threatening?",
  options: [
    { key: "A", text: "Amnesia" },
    { key: "B", text: "Anaphylactic shock" },
    { key: "C", text: "Respiratory depression" },   // ✅ correct
    { key: "D", text: "Bronchospasm" },
    { key: "E", text: "Cardiac arrhythmia" }
  ],
  correct: "C",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "Lorazepam is a benzodiazepine. Respiratory depression is a known effect of benzodiazepine overdose. Amnesia can occur as well, but it will not be life-threatening.",
    "Side effects of benzodiazepines include:",
    "<ul class='list-disc ml-5'><li>Sedation</li><li>Cognitive impairment</li><li>Respiratory depression</li><li>Hypotension</li><li>Anterograde amnesia</li></ul>"
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Respiratory depression</mark> is the most likely life-threatening effect:</strong> Lorazepam is a <em>benzodiazepine</em> that enhances GABA<sub>A</sub>-mediated inhibition. At therapeutic/especially repeated doses it can <strong>reduce ventilatory drive</strong> and <strong>decrease upper-airway tone</strong>, causing hypoventilation/obstruction. In children treated for seizures, this is the key danger to anticipate and monitor for.",
    "<strong>Paediatric status/febrile seizure dosing (APLS-style):</strong> IV lorazepam <strong>0.1 mg/kg</strong> (max 4 mg) may be repeated once after 5–10 min (max cumulative 0.2 mg/kg). If no IV access, use buccal midazolam. <em>Risk of respiratory depression increases with repeated benzodiazepine doses</em> or co-administration of other CNS depressants.",
    "<strong>Monitoring & management after benzodiazepine:</strong> Continuous SpO₂ and cardiorespiratory monitoring; consider capnography if available. Have airway equipment and bag-valve-mask ready; provide high-flow oxygen and support ventilation if needed. Treat hypotension with fluids. <strong>Avoid routine flumazenil</strong> in seizure patients (can precipitate seizures, particularly with mixed overdoses or chronic benzodiazepine use).",
    "<strong>Why the other options are less appropriate:</strong><br/>• <strong>Amnesia (A)</strong> — common (anterograde) but usually not dangerous.<br/>• <strong>Anaphylactic shock (B)</strong> — extremely rare with lorazepam.<br/>• <strong>Bronchospasm (D)</strong> — not a typical benzodiazepine effect.<br/>• <strong>Cardiac arrhythmia (E)</strong> — uncommon; benzodiazepines are generally cardio-stable.",
    "<strong>Next steps if seizures persist (&gt;5–10 min after two benzos):</strong> Escalate to second-line anti-seizure therapy (e.g., IV levetiracetam or phenytoin/fosphenytoin per local protocol) while maintaining airway/ventilation.",
    "<strong>Exam takeaways:</strong> After giving lorazepam to a child for seizures, the <mark>danger you must watch for is respiratory depression</mark>. Prepare for airway support; avoid flumazenil in seizure contexts; escalate antiepileptic therapy if seizures continue."
  ]
},
{
  id: "EM-3780",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 65 year old woman presented to the Emergency Department. She has developed a productive cough over the last 3 days and started feeling short of breath a few hours ago. She has not passed urine for the past 8 hours and feels unwell. She is tired with generalised body aches. On examination, her heart rate is <strong>135 beats/minute</strong>, blood pressure is <strong>86/60 mmHg</strong>, respiratory rate is <strong>22 breaths/minute</strong>, and body temperature is <strong>38.9°C</strong>.<br/><br/>Which of the following is the <strong>SINGLE</strong> most appropriate management plan?",
  options: [
    { key: "A", text: "Perform a lumbar puncture" },
    { key: "B", text: "Admission with oral amoxicillin" },
    { key: "C", text: "Admission with oral co-amoxiclav" },
    { key: "D", text: "Home treatment with oral amoxicillin and follow up with GP" },
    { key: "E", text: "Admission and in-patient management" } // ✅ correct
  ],
  correct: "E",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The question tests one's ability to recognise the features of sepsis.",
    "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. In this case, the patient's source of infection is most likely a lower respiratory tract infection.",
    "The patient is grossly unwell and meets a few of the red flags of sepsis. It is important to be familiar with the red flags as 1 or more warrants the completion of the 'sepsis six' within 1 hour. Therefore, the most appropriate step would be admitting the patient for further management.",
    "As part of sepsis 6, intravenous antibiotics are given (not oral). You can scratch off all options with oral antibiotics as the answer.",
    "Discharging the patient is inappropriate as she will deteriorate.",
    "There is no indication for a lumbar puncture as she does not elicit the features of meningitis or meningococcal sepsis."
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Admission and in-patient management</mark> is correct:</strong> She is hypotensive (<strong>86/60</strong>), tachycardic (<strong>135</strong>), febrile (<strong>38.9°C</strong>) with new breathlessness and reduced urine output. These findings meet <em>high-risk/red-flag</em> criteria for suspected <strong>sepsis</strong> from a likely <em>lower respiratory tract infection</em>. She requires urgent hospital admission for immediate resuscitation and sepsis care.",
    "<strong>Sepsis Six — complete within 1 hour:</strong> <ul class='list-disc ml-5'><li>Give <strong>high-flow oxygen</strong> to maintain SpO₂ targets.</li><li><strong>Take blood cultures</strong> (and other cultures) <em>before</em> antibiotics.</li><li><strong>Give IV broad-spectrum antibiotics</strong> (not oral) per local pneumonia/sepsis guidelines (e.g., IV co-amoxiclav ± macrolide, or piperacillin-tazobactam if severe/penicillin allergy alternatives as per policy).</li><li><strong>Give IV fluids</strong> — crystalloid bolus (e.g., 500 mL) and reassess; repeat as needed if no fluid overload; aim MAP ≥65 mmHg.</li><li><strong>Measure lactate</strong> (VBG/ABG) and send sepsis bloods (FBC, U&amp;Es, CRP).</li><li><strong>Monitor urine output</strong> (catheterise if appropriate).</li></ul>",
    "<strong>Further ED work-up:</strong> ECG, <strong>chest X-ray</strong>, sputum culture if possible, viral swabs as indicated. Early senior review; consider escalation to critical care if persistent hypotension after fluids or lactate ≥4 mmol/L.",
    "<strong>Why other options are wrong:</strong><br/>• <strong>A. Lumbar puncture</strong> — no meningitic features; unsafe in an unstable patient.<br/>• <strong>B/C. Admission with <em>oral</em> antibiotics</strong> — oral therapy is inadequate in suspected sepsis; IV antibiotics are required within 1 hour.<br/>• <strong>D. Home with oral antibiotics</strong> — unsafe given hypotension/tachycardia and likely deterioration.",
    "<strong>Exam takeaways:</strong> Recognise red flags (hypotension, tachycardia, fever, altered urine output). In suspected sepsis: <mark>Admit, start the Sepsis Six, and give IV antibiotics</mark>—do not discharge or use oral agents."
  ]
},
{
  id: "EM-0308",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 38 year old man presents to the Emergency Department visibly distressed, reporting a sudden and overwhelming episode of chest pain, palpitations, and shortness of breath that started about 30 minutes ago. He experienced noticeable tremors in his hands and felt excessively warm and sweaty. His father had a myocardial infarction at the age of 61. He has a heart rate of 102 beats/minute, blood pressure of 120/75 mmHg, respiratory rate of 25 breaths/minute and an oxygen saturation of 98%. An electrocardiogram (ECG) shows no evidence of ischaemia, and blood tests reveal a negative troponin. Which is the most likely diagnosis?",
  options: [
    { key: "A", text: "Pulmonary embolism" },
    { key: "B", text: "Acute coronary syndrome" },
    { key: "C", text: "Costochondritis" },
    { key: "D", text: "Panic attack" }, // ✅ correct
    { key: "E", text: "Gastro-oesophageal reflux disease" }
  ],
  correct: "D",

  // ——— Plabable Explanation (exact text) ———
  explanation_plabable: [
    "The most likely diagnosis for this man is a panic attack. The sudden onset of symptoms, the negative troponin, and the absence of ischaemic changes on ECG are consistent with this diagnosis.",
    "His father's myocardial infarction at age 61, while relevant for long-term cardiovascular risk, does not necessarily increase his immediate risk significantly at his current age.",
    "In the context of evaluating a young individual's risk for cardiovascular diseases, a family history of premature cardiovascular events can be significant. A family history of myocardial infarction or other cardiovascular events in a first-degree relative at a young age (for instance, before age 55 for men and before age 65 for women) would increase an individual's risk. The age of 61 in the stem is NOT considered \"premature\" for an MI.",
    "Costochondritis is incorrect. While it can cause chest pain, it does not usually cause palpitations or shortness of breath."
  ],

  // ——— Detailed Explanation (expanded teaching) ———
  explanation_detail: [
    "<strong>Why panic attack fits best:</strong> Sudden onset of chest pain, palpitations, dyspnoea, tremor, diaphoresis, and a sense of overwhelming distress are classic <em>panic attack</em> features. Objective data are reassuring: normal BP/SpO₂, sinus tachycardia only, <strong>ECG without ischaemia</strong>, and <strong>negative troponin</strong> shortly after symptom onset.",
    "<strong>Risk context:</strong> A family history of MI in a first-degree relative is considered <em>premature</em> if <strong>&lt;55 years (men)</strong> or <strong>&lt;65 years (women)</strong>. The father’s MI at 61 is <em>not</em> premature for a male relative; it does not meaningfully elevate short-term ACS probability in a 38-year-old with otherwise low-risk presentation.",
    "<strong>Ruling out the distractors:</strong><br/>• <strong>Pulmonary embolism</strong> usually has pleuritic pain, risk factors, hypoxaemia, or clear PE signs; normal SpO₂ 98% and a benign ECG make PE less likely (though always consider if risk factors exist).<br/>• <strong>Acute coronary syndrome</strong> classically has pressure-like chest pain ± radiation, dynamic ECG changes, and rising troponin; here ECG/troponin are negative and symptoms are highly autonomic/anxious.<br/>• <strong>Costochondritis</strong> causes localized, reproducible chest wall tenderness without palpitations/dyspnoea and lacks autonomic surge.<br/>• <strong>GORD</strong> gives burning retrosternal pain related to meals/lying; it does not cause tremor, tachypnoea, or marked autonomic symptoms.",
    "<strong>ED approach when panic suspected (after life-threatening causes screened):</strong> Provide calm reassurance, breathing coaching (slow diaphragmatic breathing), consider a brief-acting anxiolytic if severe and safe (e.g., low-dose benzodiazepine), and arrange follow-up for CBT/psychological support. Safety-net for recurrent/worsening chest pain, syncope, or new risk features.",
    "<strong>Exam tip:</strong> When a young patient has abrupt chest pain with prominent autonomic symptoms, normal ECG and negative troponin, pick <mark>Panic attack</mark> over ACS/PE—unless the stem adds red flags or high-risk features."
  ]
},
{
  id: "EM-4310",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 70 year old male presents with a 2 day history of productive cough and shortness of breath. He complains of chills and rigors. He is ill-looking. He has a temperature of <strong>38.5°C</strong>, respiratory rate of <strong>26 breaths/minute</strong>, and a pulse rate of <strong>125 beats/min</strong>. His blood pressure is <strong>88/45 mmHg</strong> and oxygen saturation is <strong>90% on room air</strong>. On auscultation, bronchial breath sounds are heard in the periphery. He is given a fluid challenge of 1 L normal saline. His blood pressure post fluid challenge is <strong>90/40 mmHg</strong>.<br/><br/>What is the <strong>SINGLE best term</strong> to use in his condition?",
  options: [
    { key: "A", text: "Sepsis" },
    { key: "B", text: "Severe sepsis" },
    { key: "C", text: "Septic shock" },      // ✅ correct
    { key: "D", text: "Systemic inflammatory response syndrome (SIRS)" },
    { key: "E", text: "Infection" }
  ],
  correct: "C",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "Although, infection, sepsis and SIRS are correct terms to use, the best term, in this case, is septic shock.",
    "Septic shock is defined as severe sepsis with persistently low blood pressure which has failed to respond to the administration of intravenous fluids."
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Septic shock</mark> is the best term here:</strong> The patient has suspected infection (productive cough, fever, bronchial breath sounds) with <strong>hypotension</strong> that <em>persists after a fluid challenge</em> (88/45 → 90/40 mmHg after 1 L). Fluid-refractory hypotension in the context of sepsis = <strong>septic shock</strong> in exam terminology.",
    "<strong>Definitions you should know (exam + Sepsis-3 context):</strong><br/>• <strong>Infection</strong> — suspected/confirmed microbial cause.<br/>• <strong>SIRS</strong> — physiological response criteria (legacy term; no longer used to define sepsis).<br/>• <strong>Sepsis</strong> — life-threatening organ dysfunction from a dysregulated host response to infection (often inferred by hypotension, hypoxia, altered mentation, oliguria).<br/>• <strong>Severe sepsis</strong> — legacy term (sepsis + organ dysfunction).<br/>• <strong>Septic shock</strong> — sepsis with <em>persistent hypotension despite adequate fluids</em> (and, in Sepsis-3, need for vasopressors to keep MAP ≥65 mmHg with lactate &gt;2 mmol/L). On exams that still use older labels, the key trigger is <mark>fluid-refractory hypotension</mark>.",
    "<strong>Immediate management priorities (Sepsis Six within 1 hour):</strong> <ul class='list-disc ml-5'><li>Give <strong>high-flow oxygen</strong> to target saturations.</li><li><strong>Take blood cultures</strong> before antibiotics (do not delay therapy).</li><li><strong>Start IV broad-spectrum antibiotics</strong> promptly as per local policy for severe CAP/HCAP.</li><li><strong>Give IV crystalloids</strong> (e.g., 30 mL/kg cumulative or repeated boluses with reassessment).</li><li><strong>Measure lactate</strong> (VBG/ABG) and send sepsis labs.</li><li><strong>Monitor urine output</strong> (consider catheterisation).</li></ul> If hypotension persists after fluids, begin <strong>vasopressors (noradrenaline)</strong> and consider ICU; arrange early senior/critical-care review and source control.",
    "<strong>Why the other options are not the single best term:</strong><br/>• <strong>Infection</strong> and <strong>Sepsis</strong> are true but <em>not specific enough</em> for persistent hypotension.<br/>• <strong>Severe sepsis</strong> (legacy) implies organ dysfunction, but the stem emphasises <mark>fluid-refractory hypotension</mark>, which upgrades to <strong>septic shock</strong>.<br/>• <strong>SIRS</strong> is outdated and nonspecific.",
    "<strong>Exam takeaways:</strong> In a hypotensive, febrile patient whose BP remains low after fluids, choose <strong>Septic shock</strong> and initiate the full sepsis bundle with early vasopressors and critical-care involvement."
  ]
},
{
  id: "RM-0453",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 54 year old smoker is seen in the Emergency Department with extensive wheeze and breathlessness. He is known to have COPD. On auscultation, he has widespread wheezing throughout his chest. He has a temperature of <strong>36.7°C</strong>, heart rate of <strong>115 beats/minute</strong>, blood pressure of <strong>130/80 mmHg</strong>, respiratory rate of <strong>28 breaths/minute</strong> and an oxygen saturation of <strong>85%</strong>. He is started on <strong>24% oxygen</strong> by Venturi face mask. What is the most appropriate next step in management?",
  options: [
    { key: "A", text: "Oral amoxicillin" },
    { key: "B", text: "Intravenous co-amoxiclav" },
    { key: "C", text: "Intubation" },
    { key: "D", text: "Intravenous aminophylline" },
    { key: "E", text: "Salbutamol nebulizers" }  // ✅ correct
  ],
  correct: "E",

  // —— Plabable Explanation (exact text from your screenshot) ——
  explanation_plabable: [
    "This question is testing your knowledge on the management of acute exacerbation of COPD.",
    "Salbutamol nebulisers, ipratropium nebulisers, oral/IV corticosteroids, and oxygen are usually the first-line medical therapy.",
    "Oral antibiotics should ONLY be given if there is purulent sputum or clinical signs of pneumonia. While it is common practice for all patients with an exacerbation of COPD to receive antibiotics in the hospital, it is not according to NICE guidelines and for the purpose of this exam, antibiotics should not be administered to manage acute exacerbation COPD unless we suspect pneumonia."
  ],

  // —— Detailed Explanation (expanded; not shortened) ——
  explanation_detail: [
    "<strong>Why <mark>Salbutamol nebulizers</mark> are the next step:</strong> He has an acute exacerbation of COPD (AECOPD) with hypoxaemia (SpO₂ 85%). Controlled oxygen has already been started via 24% Venturi (appropriate target <strong>88–92%</strong>). The next immediate therapy is a <strong>short-acting bronchodilator</strong> delivered by nebuliser—<em>salbutamol</em>—often given <em>with</em> ipratropium.",
    "<strong>Initial AECOPD bundle (NICE/BTS style):</strong><ul class='list-disc ml-5'><li><strong>Controlled O₂</strong> to 88–92% (Venturi 24–28%); obtain ABG if saturations are low or patient is acidotic/drowsy.</li><li><strong>Nebulised bronchodilators:</strong> salbutamol 2.5–5 mg via air-driven nebuliser, repeat 4-hourly (or more frequently early); add <strong>ipratropium</strong> 500 micrograms 4-6-hourly.</li><li><strong>Systemic corticosteroid:</strong> oral <strong>prednisolone 30–40 mg daily for 5 days</strong> (or IV hydrocortisone if unable to take PO).</li><li><strong>Antibiotics</strong> only if there is <em>increased sputum purulence/volume</em> or clinical/radiographic pneumonia (fever, focal consolidation).</li><li><strong>Escalation:</strong> consider <strong>NIV (BiPAP)</strong> if pH &lt; 7.35 with PaCO₂ &gt; 6 kPa and respiratory acidosis despite optimal medical therapy; ICU/intubation if NIV fails or there’s impending arrest.</li></ul>",
    "<strong>Why the other options are not first:</strong><br/>• <strong>A. Oral amoxicillin</strong> — not indicated without purulent sputum or pneumonia; antibiotics are not routine for all AECOPD.<br/>• <strong>B. IV co-amoxiclav</strong> — same rationale; IV reserved for severe pneumonia/sepsis or inability to take PO.<br/>• <strong>C. Intubation</strong> — premature; use medical therapy ± NIV first unless arrest/impending failure (coma, peri-arrest, refractory hypoxaemia).<br/>• <strong>D. IV aminophylline</strong> — <em>not</em> first-line; consider only if poor response to maximal nebulised β₂-agonist + antimuscarinic and after checking for contraindications/toxicity; monitor levels and interactions.",
    "<strong>Practical notes:</strong> Use air-driven nebulisers (to avoid excessive O₂ delivery in CO₂ retainers) or adjust FiO₂ if O₂-driven. Reassess RR, SpO₂, work of breathing, and ABG after starting therapy. Provide venous thromboembolism prophylaxis if admitted, smoking cessation support, and inhaler technique/plan on discharge.",
    "<strong>Exam takeaway:</strong> In AECOPD on controlled oxygen, the immediate next step is <mark>nebulised bronchodilator therapy (salbutamol ± ipratropium)</mark>; steroids follow early; antibiotics only with evidence of bacterial infection."
  ]
},
{
  id: "CT-3120",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 32 year old woman presents to the Emergency Department with a sudden onset of <strong>high fever, vomiting, diarrhoea, and a diffuse rash</strong>. She reports feeling generally unwell for the past 24 hours. On examination, her temperature is <strong>39.5°C</strong>, heart rate is <strong>120 beats per minute</strong>, blood pressure is <strong>90/60 mmHg</strong>, and she appears <strong>confused</strong>. There is a widespread erythematous rash, including <strong>desquamation on the palms and soles</strong>. Her menstrual period began three days ago, and she has been using tampons. Laboratory tests reveal <strong>leukocytosis</strong>. What is the most likely diagnosis?",
  options: [
    { key: "A", text: "Meningococcal septicaemia" },
    { key: "B", text: "Dengue fever" },
    { key: "C", text: "Staphylococcal scalded skin syndrome" },
    { key: "D", text: "Systemic lupus erythematosus" },
    { key: "E", text: "Toxic shock syndrome" } // ✅ correct
  ],
  correct: "E",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "Toxic shock syndrome (TSS) is a severe condition typically associated with tampon use in menstruating women, though it can also occur in men, children, and postmenopausal women. It is characterised by high fever, hypotension, multi-organ involvement, and a diffuse erythematous rash with subsequent desquamation.",
    "The management of suspected TSS involves immediate hospital admission, removal of the source of infection (e.g., tampon), and aggressive supportive care, including fluids and antibiotics targeting Staphylococcus aureus and Streptococcus pyogenes."
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Toxic shock syndrome (TSS)</mark> is most likely:</strong> The stem links <em>tampon use</em> with <strong>high fever</strong>, <strong>hypotension</strong>, <strong>GI upset</strong> (vomiting/diarrhoea), <strong>confusion</strong>, and a <mark>diffuse erythematous rash with desquamation of palms/soles</mark> — the classic toxin-mediated picture.",
    "<strong>Pathophysiology & organisms:</strong> Classically due to <em>Staphylococcus aureus</em> producing TSST-1; a similar syndrome occurs with <em>Streptococcus pyogenes</em> (invasive GAS). Superantigen toxins trigger massive cytokine release → shock and multi-organ dysfunction.",
    "<strong>Diagnostic pointers (Severe TSS pattern):</strong><ul class='list-disc ml-5'><li>Fever ≥38.9°C</li><li>Hypotension (SBP ≤90 mmHg)</li><li>Diffuse macular erythroderma → <em>desquamation</em> 1–2 weeks later</li><li>Involvement of ≥3 organ systems (GI, renal, hepatic, muscular, mucous membranes, CNS, haematologic)</li><li>Leukocytosis common; cultures may be negative in staphylococcal TSS</li></ul>",
    "<strong>Immediate management (ED):</strong><ul class='list-disc ml-5'><li><mark>Source control</mark>: <strong>remove the tampon</strong>; inspect/drain any wounds or abscesses; send cultures.</li><li><strong>Aggressive fluids</strong> (balanced crystalloids) for shock; early vasopressors (noradrenaline) if fluid-refractory.</li><li><strong>Empiric antibiotics</strong>: cover staph and strep and <em>block toxin production</em>. A typical regimen: <strong>IV clindamycin</strong> (protein synthesis/toxin suppression) + <strong>anti-staphylococcal agent</strong> (e.g., flucloxacillin; use <strong>vancomycin</strong> if MRSA risk). If streptococcal TSS suspected, add <strong>benzylpenicillin</strong> + clindamycin.</li><li>Consider <strong>IVIG</strong> in severe refractory cases (to neutralise toxin).</li><li>Monitor and correct organ dysfunction (renal/hepatic, coagulopathy); manage electrolyte/acid–base issues; ICU referral early.</li></ul>",
    "<strong>Why the other options are less likely:</strong><br/>• <strong>Meningococcal septicaemia</strong> → typically <em>petechial/purpuric</em> non-blanching rash, meningism; not classic desquamation and tampon link.<br/>• <strong>Dengue</strong> → travel history to endemic area, severe myalgia, thrombocytopenia/haemorrhagic features.<br/>• <strong>Staphylococcal scalded skin syndrome</strong> → tender erythema with <em>superficial</em> blistering/positive Nikolsky; usually children, <em>no shock</em> or multiorgan failure.<br/>• <strong>SLE</strong> → chronic autoimmune features; does not present with acute toxin-mediated shock and desquamating rash.",
    "<strong>Exam takeaways:</strong> In a menstruating patient with shock, GI symptoms and <mark>diffuse erythroderma + desquamation</mark> after tampon use, choose <strong>Toxic shock syndrome</strong>. Treat with <em>source control</em>, <em>fluids/vasopressors</em>, and <em>clindamycin-based antibiotics</em>; consider <em>IVIG</em> if severe."
  ]
},
{
  id: "EM-2570",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 32 year old man is found unconscious in a park late in the evening. Emergency services are called, and on arrival, paramedics note that the man is breathing but unresponsive. His pupils are markedly dilated. He is promptly transported to the hospital. In the Emergency Department, his vital signs are as follows: blood pressure <strong>110/70 mmHg</strong>, heart rate <strong>120 bpm</strong>, respiratory rate <strong>16 per minute</strong>, and oxygen saturation <strong>98% on room air</strong>. His temperature is <strong>37.2°C</strong>. He gains consciousness and is restless and agitated. His Glasgow Coma Scale score is 10. There is no evidence of head injury, trauma, or injection sites. A toxicology screen is performed, which reveals an <strong>ethanol level of 40 mmol/L</strong> and a <strong>salicylate level of 10 mg/dL</strong>. An ECG is performed shows sinus tachycardia with no abnormalities. Which substance is most likely to have been taken by this man?",
  options: [
    { key: "A", text: "Alcohol" },
    { key: "B", text: "Amphetamines" },     // ✅ correct
    { key: "C", text: "Amitriptyline" },
    { key: "D", text: "Morphine" },
    { key: "E", text: "Aspirin" }
  ],
  correct: "B",

  /* -------------------- Plabable Explanation (exact text from your screenshot) -------------------- */
  explanation_plabable: [
  "The clinical presentation of this man – agitation, dilated pupils and increased heart rate – is consistent with amphetamine use. Amphetamines typically cause sympathomimetic effects such as tachycardia, hypertension, and dilated pupils (mydriasis). The presence of ethanol can compound these effects.",
  "To contextualise the ethanol level of 40 mmol/L, it's important to understand the typical reference ranges for blood ethanol levels and their associated effects:",
  "<em>Legal Driving Limit in the UK:</em> The legal limit for driving in the UK is 80 mg/dL (17.4 mmol/L). A level of 40 mmol/L is more than double this limit.",
  "<em>Levels and Effects:</em>",
  "<ul class='list-disc ml-5'><li>20–100 mg/dL (4.3–21.7 mmol/L): This range can cause mild euphoria, decreased coordination, and impaired judgment.</li><li>100–200 mg/dL (21.7–43.4 mmol/L): At this level, individuals might experience increased impairment of motor coordination and judgment, mood swings, and possibly nausea or vomiting. → <em>This is where the patient's blood value sits</em></li><li>200–300 mg/dL (43.4–65.1 mmol/L): This range is associated with confusion, disorientation, and profound impairment of motor functions.</li><li>Over 300 mg/dL (65.1 mmol/L): Levels in this range can lead to stupor, unconsciousness, or even coma.</li></ul>",
  "Let's again revisit why all the other options are less appropriate:",
  "<strong>Alcohol:</strong> While the ethanol level is elevated, alcohol intoxication alone does not typically cause marked pupil dilation. The ethanol level of 40 mmol/L as well would not generally cause unconsciousness.",
  "<strong>Amitriptyline:</strong> This tricyclic antidepressant can cause dilated pupils and altered mental status, but it typically leads to other signs like urinary retention, dry skin, and cardiac arrhythmias, which are not mentioned in the vignette. The ECG in this vignette is normal.",
  "<strong>Morphine:</strong> An opioid like morphine would likely cause pinpoint pupils (miosis), respiratory depression.",
  "<em>Aspirin:</em> Aspirin (acetylsalicylic acid) overdose could account for the salicylate level, but the clinical presentation of an aspirin overdose often includes tinnitus, hyperventilation due to respiratory alkalosis, and gastrointestinal symptoms, which are not prominent in this case. The value given (10 mg/dL) is not very significant. The therapeutic blood concentration for aspirin (salicylate) typically ranges from 10 to 30 mg/dL and toxic levels are above 30 mg/dL. Only at values of around 70 mg/dL would one expect to start becoming unconscious.",
  "This question is very difficult to answer. One can expect some values of blood tests in the exam that need to be contextualised. We recommend remembering two values for ethanol and for salicylates:",
  "<ul class='list-disc ml-5'><li>Ethanol level of &gt;65.1 mmol/L → Consider the aetiology of the unconscious patient to be alcohol intoxication</li><li>Salicylate level of &gt;70 mg/dL → Consider the aetiology of the unconscious patient to be aspirin intoxication</li></ul>",
  "Lastly, remember to focus on the units too!"
],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>Why <mark>Amphetamines</mark> fit best:</strong> The triad of <em>agitation/restlessness</em>, <strong>mydriasis</strong>, and <strong>sinus tachycardia</strong> with normal oxygenation and temperature in a young adult is classic for a <em>sympathomimetic toxidrome</em> (amphetamines, cocaine, MDMA). The ECG shows no QRS/QT abnormalities (argues against TCA toxicity), and miosis/respiratory depression that would suggest opioids is absent.",
    "<strong>Interpreting the labs:</strong> The <em>ethanol 40 mmol/L ≈ 184 mg/dL</em> — intoxicated but not typically enough alone to cause coma in a tolerant adult; it can, however, <em>augment agitation</em> or cloud the picture. The salicylate <em>10 mg/dL</em> is low and not compatible with symptomatic salicylate poisoning.",
    "<strong>ED management of suspected amphetamine/stimulant toxicity:</strong><ul class='list-disc ml-5'><li><mark>Support ABCs</mark>, place on continuous cardiac/SpO₂ monitoring; check glucose.</li><li><strong>Benzodiazepines</strong> are first-line for agitation, tachycardia, hypertension and to prevent hyperthermia (e.g., diazepam IV/lorazepam). Avoid antipsychotics that lower seizure threshold or impair thermoregulation if severe stimulant toxicity.</li><li><strong>Active cooling</strong> and IV fluids if hyperthermic; check CK and renal function for rhabdomyolysis risk.</li><li>Treat severe hypertension with titratable agents (e.g., <em>labetalol</em> or <em>nitroprusside</em>); avoid isolated beta-blockade in pure stimulant toxicity.</li><li>Consider screening for co-ingestants (ethanol present here), and observe until settled with normal vitals and mentation.</li></ul>",
    "<strong>Why the other options don’t fit:</strong><br/>• <strong>Alcohol</strong> — usually causes ataxia, dysarthria, nystagmus; <em>not</em> marked mydriasis; level here unlikely to cause deep coma on its own.<br/>• <strong>Amitriptyline (TCA)</strong> — would more likely show anticholinergic features <em>plus</em> ECG changes (widened QRS, right axis, terminal R in aVR); absent here.<br/>• <strong>Morphine</strong> — causes <mark>miosis</mark>, hypoventilation, and ↓GCS; opposite to findings.<br/>• <strong>Aspirin</strong> — would give tinnitus, vomiting, <em>respiratory alkalosis progressing to metabolic acidosis</em>; not suggested by the story or numbers.",
    "<strong>Exam takeaway:</strong> Young patient with agitation + tachycardia + dilated pupils and clean ECG → pick a <mark>sympathomimetic</mark> (here, <strong>Amphetamines</strong>). Treat with <strong>benzodiazepines</strong>, fluids, and cooling; look for complications (hyperthermia, rhabdomyolysis, dysrhythmia)."
  ]
},
{
  id: "EM-2390",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 35 year old woman presents to the Emergency department with a history of asthma. She reports increasing difficulty in breathing over the past 6 hours. Upon arrival, she was given nebulised salbutamol, ipratropium bromide, intravenous corticosteroids and intravenous magnesium sulphate. On examination, she appears dyspnoeic and is using accessory muscles to breathe. Her respiratory rate is noted to be <strong>10 breaths per minute</strong>. Oxygen saturation on room air is <strong>88%</strong>. Auscultation of the chest reveals widespread wheezes.<br/><br/>" +
    "pH 7.21 (7.35 – 7.45)<br/>" +
    "PaO2: 7.8 kPa (10–14)<br/>" +
    "PaCO2: 7.1 kPa (4.7–6.0)<br/>" +
    "Bicarbonate 24 mmol/L (22–26)<br/><br/>" +
    "Her peak expiratory flow rate is <strong>45%</strong> of her predicted normal value. What is the most appropriate <strong>immediate</strong> action?",
  options: [
    { key: "A", text: "Start intravenous antibiotics" },
    { key: "B", text: "Admit to the Intensive Care Unit" }, // ✅ correct
    { key: "C", text: "Administer intravenous morphine" },
    { key: "D", text: "Admit to the medical ward" },
    { key: "E", text: "Request a chest X-ray" }
  ],
  correct: "B",

  /* -------------------- Plabable Explanation (exact text from your image) -------------------- */
  explanation_plabable: [
    "The patient’s clinical presentation suggests a severe asthma exacerbation, characterised by a significantly reduced respiratory rate, low oxygen saturation, hypercapnia, and poor peak expiratory flow rate. These signs indicate impending respiratory failure. The most appropriate immediate action is to admit the patient to the Intensive Care Unit for close monitoring and consideration for mechanical ventilation.",
    "<em>In the context of this vignette, the patient with asthma exhibits a low respiratory rate (10 breaths per minute) because of respiratory muscle fatigue. In severe asthma attacks, there is often a significant increase in the work of breathing due to airway obstruction, bronchospasm, and inflammation. Over time, this can lead to respiratory muscle fatigue. When the respiratory muscles are exhausted, the patient may not be able to maintain a high respiratory rate, resulting in a lower respiratory rate.</em>"
  ],

  /* -------------------- Detailed Explanation (expanded; not shortened) -------------------- */
  explanation_detail: [
    "<strong>ABG interpretation:</strong> pH 7.21 (acidaemia) with <strong>high PaCO₂ 7.1 kPa</strong> = <mark>hypercapnic respiratory failure</mark> (type 2). Low PaO₂ 7.8 kPa and SpO₂ 88% confirm significant hypoxaemia. In acute asthma, a <em>normal or high</em> PaCO₂ is a red flag for <strong>impending ventilatory failure</strong> due to exhaustion.",
    "<strong>Severity:</strong> PEF 45% predicted suggests at least <em>acute severe</em> asthma; combined with hypercapnia, acidaemia, altered effort (RR 10 with accessory use) → treat as <strong>life-threatening / near-fatal asthma</strong>.",
    "<strong>Immediate action = ICU admission:</strong> Needs continuous monitoring, senior review and readiness for <strong>mechanical ventilation</strong> if deterioration (worsening acidosis/CO₂, falling consciousness, refractory hypoxaemia). <em>NIV is generally not recommended in acute asthma</em>; proceed to intubation/ventilation if failing.",
    "<strong>Ongoing ED/ICU management while arranging transfer:</strong><ul class='list-disc ml-5'><li><strong>High-flow oxygen</strong> to target SpO₂ 94–98% (titrate by ABG/VBG).</li><li><strong>Back-to-back nebulisers</strong> with salbutamol (2.5–5 mg) + ipratropium (500 μg) via oxygen/air as appropriate; consider continuous salbutamol.</li><li><strong>Systemic corticosteroid</strong> (e.g., prednisolone 40–50 mg PO or hydrocortisone 100 mg IV if unable to take PO).</li><li><strong>IV magnesium sulphate</strong> 2 g over 20 minutes has already been given; consider <em>IV salbutamol infusion</em> if poor response (specialist-led). <em>Aminophylline</em> is rarely used; seek senior advice.</li><li>Early arterial/venous gases and repeat after interventions; correct electrolytes (especially <strong>K⁺</strong>).</li></ul>",
    "<strong>Why other options are wrong:</strong><br/>• <strong>IV antibiotics (A)</strong> — no evidence of bacterial infection; antibiotics don’t treat bronchospasm.<br/>• <strong>IV morphine (C)</strong> — contraindicated; depresses respiration and worsens CO₂ retention.<br/>• <strong>Medical ward (D)</strong> — inadequate level of care for impending respiratory failure.<br/>• <strong>Chest X-ray (E)</strong> — may be done later (rule out pneumothorax, infection) but <em>not</em> the immediate life-saving step.",
    "<strong>Intubation triggers (know for exams):</strong> rising PaCO₂ or worsening acidaemia, exhaustion/confusion, silent chest/poor air entry, refractory hypoxaemia, peri-arrest. Use RSI with experienced operator (ketamine often preferred), then controlled ventilation with permissive hypercapnia and careful dynamic hyperinflation management.",
    "<strong>Key exam takeaway:</strong> In acute asthma with <mark>hypercapnia + acidaemia</mark> despite maximal therapy → <strong>ICU now</strong> and prepare for ventilation."
  ]
},
{
  id: "EN-1327",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 67 year old man presents to A&amp;E with generalised weakness and malaise for the past week. He has a history of chronic kidney disease.<br/><br/>" +
    "<strong>Investigations:</strong><br/>" +
    "Sodium 137 mmol/L (135–145)<br/>" +
    "Potassium <strong>6.8 mmol/L</strong> (3.5–5)<br/>" +
    "Urea 28 mmol/L (2.0–7)<br/>" +
    "Creatinine <strong>680 µmol/L</strong> (70–150)<br/>" +
    "eGFR <strong>8 mL/min</strong> (&gt;90)<br/><br/>" +
    "An ECG reveals <em>peaked T waves</em>, a <em>widened QRS</em> complex, and a <em>prolonged PR</em> interval. What is the most appropriate <strong>initial</strong> treatment for this patient?",
  options: [
    { key: "A", text: "Administering intravenous furosemide" },
    { key: "B", text: "Initiating intravenous fluids" },
    { key: "C", text: "Initiating insulin and dextrose infusion" },
    { key: "D", text: "Administering intravenous calcium chloride" }, // ✅ correct (initial)
    { key: "E", text: "Immediate haemodialysis" }
  ],
  correct: "D",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "His blood results show severe hyperkalaemia. He has ECG changes which are consistent with hyperkalaemia",
    "Protecting the heart from the effects of hyperkalaemia, which can lead to fatal arrhythmias is the first action. This is done with calcium (either gluconate or chloride).",
    "Following that, we should act with shifting potassium from the extracellular fluid to the intracellular compartment, typically with insulin and dextrose.",
    "Then we should think about removing the potassium from the body altogether, often using haemodialysis in patients with renal failure.",
    "Given the patient's symptoms, laboratory values, and especially the ECG changes, the immediate threat is the effect of hyperkalemia on cardiac myocytes. Calcium stabilizes the myocardial cell membranes and decreases the risk of a life-threatening arrhythmia. It works rapidly, within minutes, but does not lower the serum potassium level; it just mitigates its effects on the heart."
  ],

  /* -------------------- Detailed Explanation (expanded) -------------------- */
  explanation_detail: [
    "<strong>Why calcium <em>first</em>:</strong> The patient has <mark>severe hyperkalaemia (K⁺ 6.8)</mark> plus <strong>ECG changes</strong> (peaked T, wide QRS, prolonged PR) and advanced CKD. The immediate risk is <em>malignant arrhythmia</em>. Give IV <strong>calcium</strong> to <em>stabilise the myocardium</em> within minutes.",
    "<strong>Which calcium?</strong> Use <em>10 mL of 10% calcium chloride</em> (via central line if possible) or <em>30 mL of 10% calcium gluconate</em> (peripheral OK). Chloride contains ~3× more elemental Ca and has a stronger effect but is more irritant peripherally. <em>Repeat</em> every 5–10 min if ECG changes persist; continuous cardiac monitoring.",
    "<strong>Then shift K⁺ intracellularly:</strong> Start <strong>insulin + dextrose</strong> (e.g., 10 units soluble insulin IV with 25 g dextrose), reassess glucose at 15–30 min and hourly; consider <strong>nebulised salbutamol 10–20 mg</strong>. Give <strong>IV sodium bicarbonate</strong> if there is significant <em>metabolic acidosis</em>.",
    "<strong>Remove K⁺ from the body:</strong> In ESRD/oliguric patients or refractory hyperkalaemia, arrange <strong>urgent haemodialysis</strong>. Other options include <em>loop diuretics</em> (if making urine), and potassium binders (e.g., sodium zirconium cyclosilicate or patiromer) as adjuncts—these are <em>not</em> immediate fixes.",
    "<strong>Why the other options are not the <em>initial</em> step:</strong><br/>• <strong>A. IV furosemide</strong> — only helps if the patient has urine output and acts slowly; does not stabilise myocardium.<br/>• <strong>B. IV fluids</strong> — may be needed for volume depletion but won’t protect the heart.<br/>• <strong>C. Insulin + dextrose</strong> — crucial second step to <em>shift</em> K⁺, but you must <em>first</em> give calcium when ECG changes are present.<br/>• <strong>E. Immediate haemodialysis</strong> — likely required soon given eGFR 8 mL/min, but arranging dialysis takes time; <strong>calcium now</strong> prevents arrest while definitive therapy is organised.",
    "<strong>ED checklist:</strong> Cardiac monitoring, large-bore IV access, repeat ECG after calcium, frequent K⁺/glucose checks, review meds (stop ACEi/ARB, K⁺-sparing diuretics), consider causes (AKI on CKD, tissue breakdown), and consult nephrology early.",
    "<strong>Exam takeaway:</strong> Hyperkalaemia + ECG changes → <mark>IV calcium immediately</mark> to stabilise; then <em>shift</em> K⁺ (insulin/dextrose ± salbutamol ± bicarbonate), then <em>remove</em> K⁺ (dialysis/diuretics/binders)."
  ]
},
{
  id: "CA-2220",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 68 year old man has sudden onset of shortness of breath and chest discomfort. He reports that the symptoms started while he was at rest. He had a knee replacement surgery 10 days ago. On examination, he appears anxious, diaphoretic, and tachypnoeic with a respiratory rate of <strong>28 breaths per minute</strong>. An ECG is done and is seen below:",
  // 👇 THIS makes the 3rd picture visible in the question
  image: "/ecg-q19.png",

  options: [
    { key: "A", text: "Acute myocardial infarction" },
    { key: "B", text: "Pulmonary embolism" },            // ✅ correct
    { key: "C", text: "Chronic obstructive pulmonary disease exacerbation" },
    { key: "D", text: "Pericarditis" },
    { key: "E", text: "Aortic dissection" }
  ],
  correct: "B",

  // ——— Plabable Explanation (your screenshots’ wording + annotated image) ———
  explanation_plabable: [
    "He has a recent knee replacement surgery (10 days ago), which is a significant risk factor for venous thromboembolism (VTE) due to immobility and potential deep vein thrombosis (DVT).",
    "The specific findings on the electrocardiogram (ECG) of <strong>S1Q3T3</strong> pattern are characteristic of PE.",
    // 👇 THIS inlines the annotated 5th picture inside the explanation
    "<div class='my-3'><img src='/ecg-q19a.png' alt='Annotated ECG highlighting S1Q3T3 pattern' class='rounded-md border max-w-full' /></div>",
    "This pattern can help raise suspicion for PE, particularly in the appropriate clinical context.",
    "<em>S1:</em> Refers to a deep S wave in lead I.<br/><em>Q3:</em> Refers to a Q wave in lead III.<br/><em>T3:</em> This is a T wave inversion in lead III.",
    "The S1Q3T3 pattern is seen in about 10% of patients with pulmonary embolism. It has a low sensitivity for PE (meaning it is not present in the majority of PE cases). Its specificity is also not high enough to use it as a definitive marker for PE, as it can be observed in other conditions such as right heart strain from other causes. Therefore, it is important to use additional diagnostic methods when PE is suspected such as a computed tomography pulmonary angiography (CTPA).",
    "Lastly, remember that the most common rhythm observed on an electrocardiogram (ECG) in patients with pulmonary embolism (PE) is <strong>sinus tachycardia</strong>. It is more commonly seen than the S1Q3T3 pattern, which many may incorrectly assume to be the most frequent ECG manifestation of PE.",
    "<em>RBBB can also occur due to the increased strain or acute pressure on the right heart which is seen on this ECG too.</em>"
  ],

  // ——— My detailed teaching explanation ———
  explanation_detail: [
    "<strong>Why PE is most likely:</strong> Sudden dyspnoea and chest discomfort at rest, recent <em>major lower-limb surgery</em> (knee replacement 10 days ago), tachypnoea and anxiety are classic for PE. The ECG shows right-heart strain pattern (S1Q3T3 ± RBBB) which, while insensitive, fits the picture.",
    "<strong>Risk framework:</strong> Recent surgery/immobility is a major Wells factor. Haemodynamic stability determines the pathway (massive vs submassive vs low-risk).",
    "<strong>ECG in PE (exam pearls):</strong> <em>Sinus tachycardia</em> most common. Right-axis deviation, incomplete/complete RBBB, S1Q3T3, T-inversions V1–V4 and III/aVF can occur with acute RV strain.",
    "<strong>Next steps:</strong> If stable, assess pre-test probability (Wells/Geneva). If low/intermediate → D-dimer then CTPA if positive. If high probability → <strong>CTPA</strong> directly (or V/Q if CTPA contraindicated). Start anticoagulation when suspicion is high and imaging not immediately available, unless contraindicated.",
    "<strong>Management snapshot:</strong> Anticoagulation (DOAC/LMWH per local policy). Consider thrombolysis for <em>massive</em> PE (shock) or carefully selected submassive PE with RV dysfunction and clinical deterioration. Address oxygenation, analgesia, and precipitating factors; arrange early follow-up and PE education.",
    "<strong>Exam takeaway:</strong> S1Q3T3 + recent surgery + sudden dyspnoea → think <mark>Pulmonary embolism</mark>; use CTPA for confirmation and treat promptly."
  ]
},
{
  id: "NE-0111",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 35 year old woman presents to the Emergency Department with a 2-day history of vomiting and diarrhoea. She reports feeling weak, dizzy, and increasingly breathless. On examination, she appears mildly dehydrated, her respiratory rate is <strong>24 breaths/min</strong>, and her oxygen saturation is <strong>96% on room air</strong>. Arterial blood gas (ABG) analysis reveals the following:<br/><br/>" +
    "pH <strong>7.32</strong> (7.35 – 7.45)<br/>" +
    "PaO₂: <strong>12 kPa</strong> (10–14)<br/>" +
    "PaCO₂: <strong>4.2 kPa</strong> (4.7–6.0)<br/>" +
    "Bicarbonate <strong>18 mmol/L</strong> (22–26)<br/><br/>" +
    "Which of the following is the most likely diagnosis based on the patient’s arterial blood gas results?",
  options: [
    { key: "A", text: "Metabolic acidosis with respiratory compensation" }, // ✅ correct
    { key: "B", text: "Metabolic alkalosis with compensation" },
    { key: "C", text: "Mixed respiratory and metabolic acidosis" },
    { key: "D", text: "Respiratory acidosis" },
    { key: "E", text: "Respiratory alkalosis" }
  ],
  correct: "A",

  // —— Plabable Explanation (exact text from your screenshot) ——
  explanation_plabable: [
    "Metabolic acidosis with partial respiratory compensation is the answer here.",
    "<ul class='list-disc ml-5'><li><strong>pH: 7.32</strong>, which is below the normal range, indicating acidosis.</li><li><strong>Bicarbonate: 18 mmol/L</strong>, which is below the normal range, suggesting metabolic acidosis.</li><li><strong>PaCO2: 4.2 kPa</strong>, which is slightly lower than the normal range, suggesting a compensatory respiratory alkalosis (hyperventilation to reduce CO2).</li></ul>"
  ],

  // —— Detailed Teaching ——
  explanation_detail: [
    "<strong>Stepwise read:</strong> (1) pH low → <em>acidaemia</em>. (2) HCO₃⁻ low (18) → primary <strong>metabolic acidosis</strong>. (3) PaCO₂ low (4.2 kPa ≈ 31.5 mmHg) → appropriate respiratory compensation (hyperventilation).",
    "<strong>Winter’s formula</strong> (expected PaCO₂ in mmHg) = 1.5 × HCO₃⁻ + 8 ± 2 → 1.5×18 + 8 = 35 ± 2 mmHg (≈ 4.7–4.9 kPa). Observed ≈ 31.5 mmHg (4.2 kPa) is close and compatible with <em>compensation</em> rather than a second primary disorder.",
    "<strong>Likely cause here:</strong> diarrhoea → loss of bicarbonate from the gut → <em>non–anion gap (hyperchloraemic) metabolic acidosis</em>. The raised RR in the stem supports compensatory respiratory alkalosis.",
    "<strong>Management pearls:</strong> treat the cause and volume depletion (oral/IV rehydration with appropriate electrolytes), monitor U&amp;Es/ABG, consider bicarbonate only in severe acidaemia or specific indications per local guidance.",
    "<strong>Exam tips:</strong> Low pH + low HCO₃⁻ with low PaCO₂ → think <mark>metabolic acidosis with respiratory compensation</mark>. Use Winter’s formula to check for mixed disorders."
  ]
},
{
  id: "CA-1101",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 56 year old patient is brought in by his wife and friends to the Emergency Department unconscious. His wife reports that he suddenly lost consciousness in the car with no movement or response. He is not breathing, and you cannot feel his pulse. CPR starts immediately and the ECG monitor records the picture as shown below:<br/><br/>What is the most appropriate medication to give?",
  // 👇 shows your 2nd picture in the question
  image: "/ecg-q21.png",

  options: [
    { key: "A", text: "Atropine" },
    { key: "B", text: "Ephedrine" },
    { key: "C", text: "Amiodarone" },
    { key: "D", text: "Adenosine" },
    { key: "E", text: "Epinephrine" } // ✅ correct
  ],
  correct: "E",

  // ——— Plabable Explanation (exact text + the 4th image embedded) ———
  explanation_plabable: [
    "NICE guidelines recommend using epinephrine (adrenaline) as soon as possible in case of non-shockable rhythms such as asystole without delaying initiation or continuation of CPR.",
    "The following sequence should be followed:",
    "<ul class='list-disc ml-5'><li>CPR should be started with a 30:2 ratio of compressions to rescue breaths</li><li>Secure IV access</li><li>Administer adrenaline 1 mg intravenously</li><li>Continue CPR until the airway is secured</li><li>Recheck after 2 minutes for a pulse;</li></ul>",
    "→ If still no pulse:",
    "<ul class='list-disc ml-5'><li>Continue CPR</li><li>Recheck rhythm after 2 minutes</li><li>Repeat adrenaline injection every alternate rhythm check (if still no pulse)</li></ul>",
    "Here is one of our diagrams which can be found on our Emergency Medicine Gems",
    // 👇 shows your 4th picture inside the explanation
    "<div class='my-3'><img src='/ALS.png' alt='ALS algorithm for pulseless non-shockable rhythms' class='rounded-md border max-w-full' /></div>"
  ],

  // ——— Detailed teaching (for your ‘Other Explanation’ section) ———
  explanation_detail: [
    "<strong>Rhythm:</strong> Flat trace/asystole = <em>non-shockable</em>. Defibrillation is not indicated.",
    "<strong>Drug & timing:</strong> Give <strong>epinephrine 1 mg IV/IO</strong> as soon as IV/IO access is obtained; continue high-quality CPR and give further epinephrine <strong>every 3–5 minutes</strong> (i.e., every alternate rhythm check). Secure airway when feasible.",
    "<strong>Why the others are wrong:</strong><br/>• <strong>Atropine</strong> is no longer recommended in cardiac arrest due to asystole/PEA.<br/>• <strong>Ephedrine</strong> is for hypotension in anaesthesia, not cardiac arrest.<br/>• <strong>Amiodarone</strong> is for <em>shockable</em> rhythms (VF/pulseless VT) after defibrillation attempts.<br/>• <strong>Adenosine</strong> treats stable narrow-complex tachycardias and has no role in pulseless arrest.",
    "<strong>Don’t forget Hs & Ts:</strong> hypoxia, hypovolaemia, hypo/hyperkalaemia & metabolic, hypothermia, tension pneumothorax, tamponade, toxins, thrombosis (coronary/pulmonary). Treat reversible causes while CPR continues."
  ]
},
{
  id: "EN-1201",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 10 year old girl is brought to the Emergency Department by her parents approximately 2 hours after ingesting 10 paracetamol tablets. Her parents report that she had been experiencing bullying at school and had been increasingly withdrawn over the past month. On examination, the girl appears asymptomatic with stable vital signs, and a blood paracetamol level drawn on arrival is within the safe therapeutic range. Psychosocial assessment reveals she felt overwhelmed and took the tablets impulsively without understanding the potential consequences fully. Which of the following is the most appropriate next step in the management of this patient?",
  options: [
    { key: "A", text: "Refer to the psychiatric liaison team" }, // ✅ correct
    { key: "B", text: "Refer to a psychologist" },
    { key: "C", text: "Discharge with parental supervision" },
    { key: "D", text: "Admit to a psychiatric ward" },
    { key: "E", text: "Start antidepressants" }
  ],
  correct: "A",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "This scenario indicates a case of acute stress response and impulsive behaviour, possibly linked to underlying psychological distress or a mood disorder. The ingestion of paracetamol, although not currently posing a toxicological risk as indicated by the safe blood levels, signifies a serious cry for help and necessitates further assessment for underlying psychiatric conditions or psychosocial issues. Referral to a psychiatric liaison is appropriate to ensure comprehensive assessment and formulation of a management plan, which may include outpatient follow-up with mental health services as needed.",
    "A psychiatric liaison service provides specialised mental health assessment and treatment to patients who are being treated in the hospital setting but have concurrent mental health needs. This service acts as a bridge between psychiatry and other medical specialities, ensuring that the psychological aspects of a patient's care are addressed. In A&E, the psychiatric liaison team member, who in most cases is a psychiatric liaison nurse, would take initial referrals. These nurses are specifically trained in mental health. They work as the initial triage and determine the urgency of the mental health concern. They decide whether the patient needs immediate psychiatric intervention, can be referred to community services, requires admission to a psychiatric unit or can be safely discharged.",
    "Option B is incorrect. Psychologists do not work in A&E. If a referral for a psychologist is required, it will come from the psychiatric liaison team or the patient’s GP.",
    "Option C is incorrect. It is recommended for any patient with an intentional overdose to first speak to a psychiatric liaison before discharge."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why the liaison team first?</strong> Intentional ingestion—even with a <em>non-toxic paracetamol level</em>—is a <mark>red flag for self-harm</mark>. NICE self-harm guidance advocates a <strong>same-day psychosocial assessment</strong> by a trained mental-health professional before discharge. Liaison psychiatry in the ED coordinates risk assessment, safety planning, and appropriate follow-up (e.g., CAMHS).",
    "<strong>Priorities in ED (child/young person):</strong><ul class='list-disc ml-5'><li><strong>Safeguarding</strong>: assess for bullying, abuse, neglect; involve paediatrics and the hospital safeguarding team early.</li><li><strong>Capacity & consent</strong>: under 16 → involve parents/guardians; document Gillick competence if applicable.</li><li><strong>Toxicology</strong>: timing/amount cross-checked; repeat levels if indicated by timing; provide <em>paracetamol overdose education</em> even when non-toxic.</li><li><strong>Psychosocial assessment</strong>: mood, anxiety, impulsivity, intent/lethality, protective factors, access to means, social supports.</li><li><strong>Safety plan</strong>: remove medicines/sharps at home, crisis numbers, follow-up with CAMHS/school counselling, anti-bullying plan.</li></ul>",
    "<strong>Why other options are inappropriate now:</strong><br/>• <strong>Refer to a psychologist</strong>—route is via liaison/CAMHS; psychologists typically are not the initial ED pathway.<br/>• <strong>Discharge with parental supervision</strong>—unsafe until a full psychosocial assessment and safety plan are completed.<br/>• <strong>Admit to a psychiatric ward</strong>—reserved for high acute risk, psychosis, or inability to maintain safety; not automatically required here.<br/>• <strong>Start antidepressants</strong>—not started from ED for an impulsive ingestion; requires comprehensive assessment, diagnosis, and CAMHS follow-up.",
    "<strong>Exam takeaway:</strong> In children/teens with <em>intentional overdose</em> but medically stable, the next step is <mark>ED psychiatric liaison assessment</mark> with safeguarding and CAMHS follow-up, not automatic discharge or immediate medications."
  ]
},
{
  id: "EM-0303",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 25 year old woman has been feeling anxious and nervous for the last few months. She also complains of several episodes of palpitations and tremors in the past few weeks. Her symptoms develop <strong>rapidly</strong> and last for a <strong>few minutes</strong>. She mentions that taking alcohol initially helped her relieve her symptoms but now this effect is wearing off and she has palpitations and tremors even after drinking alcohol. What is the <strong>SINGLE</strong> most likely diagnosis?",
  options: [
    { key: "A", text: "Panic attacks" }, // ✅ correct
    { key: "B", text: "Depression" },
    { key: "C", text: "Obsessive–compulsive disorder (OCD)" },
    { key: "D", text: "Alcohol addiction" },
    { key: "E", text: "Generalised Anxiety Disorder (GAD)" }
  ],
  correct: "A",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "There is a fine line between Generalised Anxiety Disorder (GAD) and Panic attacks. They both can present similarly. However, in this question, her symptoms develop rapidly and only last for a few minutes. This is the key phrase that you should look out for that tells you this is Panic attacks rather than GAD."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why this is panic attacks:</strong> A panic attack is a <em>sudden surge of intense fear</em> that <strong>peaks within minutes</strong> and is accompanied by autonomic symptoms such as palpitations, tremor, sweating, chest tightness, dyspnoea, derealisation, or fear of dying/losing control. The stem emphasises <mark>abrupt onset</mark> and <mark>brief duration (minutes)</mark>—classic for panic attacks.",
    "<strong>How it differs from GAD:</strong> <em>Generalised Anxiety Disorder</em> is characterised by <strong>excessive, persistent worry for ≥6 months</strong> about multiple domains, with symptoms like fatigue, restlessness, poor concentration, irritability and muscle tension. GAD is more chronic and baseline; panic attacks are <em>paroxysmal</em>.",
    "<strong>Panic disorder vs isolated attacks:</strong> Panic <em>disorder</em> requires recurrent unexpected attacks plus ≥1 month of persistent concern/behaviour change (avoidance). In ED stems, the immediate label is often “panic attacks” unless that persistence/avoidance criterion is provided.",
    "<strong>Alcohol note:</strong> Some patients self-medicate with alcohol; rebound anxiety, tremor and palpitations can occur as the effect wears off and with withdrawal. This does <em>not</em> change the underlying diagnosis here.",
    "<strong>ED approach:</strong> Rule out medical mimics (hypoglycaemia, thyrotoxicosis, arrhythmia, PE when risk factors, stimulant use). If benign work-up and typical history: reassurance, breathing coaching, short-acting benzodiazepine can be considered for severe acute distress (avoid routine use). Safety-net and arrange GP/primary care follow-up.",
    "<strong>Long-term management (primary care/psych):</strong> First-line is <strong>CBT</strong>; pharmacotherapy with <strong>SSRIs/SNRIs</strong> (start low, go slow), consider propranolol for performance anxiety, and advise limiting caffeine/alcohol. Encourage sleep hygiene and graded exposure if avoidance behaviours develop.",
    "<strong>Exam tips:</strong> <ul class='list-disc ml-5'><li><strong>Rapid onset + short duration</strong> → choose <mark>panic attacks</mark>.</li><li><strong>Persistent daily worry for months</strong> → choose <mark>GAD</mark>.</li><li>Don’t confuse alcohol self-medication with a primary alcohol-use diagnosis unless dependence features are provided (tolerance, loss of control, withdrawal pattern, continuing use despite harm).</li></ul>"
  ]
},
{
  id: "CT-0220",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 78 year old woman presents to the Emergency Department with severe epigastric pain and vomiting for the past 2 days. The pain is referred to her right shoulder. Generalised rigidity of the abdomen is noted when examining. She denies chest pain. She has a temperature of <strong>37.2°C</strong>, a respiratory rate of <strong>22 breaths/minute</strong> and a pulse of <strong>102 beats/minute</strong>. Her medical history is significant for rheumatoid arthritis. Which of the following is the <strong>SINGLE</strong> most appropriate initial investigation?",
  options: [
    { key: "A", text: "Ultrasound abdomen" },
    { key: "B", text: "Pelvic X-ray" },
    { key: "C", text: "Colonoscopy" },
    { key: "D", text: "Erect chest X-ray" },             // ✅ correct
    { key: "E", text: "Upper gastrointestinal endoscopy" }
  ],
  correct: "D",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The history of rheumatoid arthritis tells you that she is more than likely to be taking NSAIDS to manage with the pain. This is a risk factor for peptic ulcer which if perforates gives the signs and symptoms that she is describing.",
    "Perforation of a peptic ulcer causes an acute abdomen with epigastric pain that may progress to generalised rigidity. Shoulder tip pain is seen in perforation.",
    "A diagnosis is made by taking an erect abdominal/chest X-ray. Air under the diaphragm gives the diagnosis of a perforation.",
    "Further reading:",
    "http://patient.info/doctor/peptic-ulcer-disease",
    "https://www.nice.org.uk/guidance/cg141/chapter/1-Guidance",
    "https://pathways.nice.org.uk/pathways/acute-upper-gastrointestinal-bleeding"
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why erect chest X-ray first?</strong> Suspected <mark>perforated peptic ulcer</mark>—elderly patient, NSAID risk (rheumatoid arthritis), sudden severe epigastric pain, <em>generalised rigidity</em>, and <strong>right shoulder tip pain</strong> from diaphragmatic irritation via the phrenic nerve. The quickest, widely available test that can immediately confirm perforation is an <strong>erect CXR</strong> showing <em>free sub-diaphragmatic air</em>. (If the patient cannot stand, a left lateral decubitus abdominal film or CT is alternative.)",
    "<strong>Initial ED management bundle:</strong> ABCs, keep <em>NPO</em>, large-bore IV access, <strong>IV fluids</strong>, broad-spectrum <strong>IV antibiotics</strong>, <strong>IV PPI</strong>, analgesia, bloods (FBC/U&amp;Es/LFTs/CRP/lactate), group & save/crossmatch, urgent <strong>surgical</strong> review. CT abdomen with contrast often follows for operative planning if CXR is equivocal.",
    "<strong>Why other options are wrong now:</strong><br/>• <strong>Ultrasound abdomen</strong>—good for biliary pathology/AAA bedside, but insensitive for free intraperitoneal air.<br/>• <strong>Pelvic X-ray</strong>—no diagnostic value here.<br/>• <strong>Colonoscopy</strong>—contraindicated in suspected perforation; insufflation risks worsening free air.<br/>• <strong>Upper GI endoscopy</strong>—not the initial investigation when perforation is suspected (risk of further perforation and usually unnecessary to make the diagnosis).",
    "<strong>Exam takeaway:</strong> Elderly on NSAIDs + acute epigastric pain with peritonism and shoulder tip pain → think <mark>perforated PUD</mark>; order an <strong>erect CXR</strong> to look for air under diaphragm and start resus + surgical referral."
  ]
},
{
  id: "EM-0932",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 71 year old woman is admitted to the hospital with confusion and weakness. On examination, her blood pressure is <strong>90/55 mmHg</strong>. She has a history of diabetes insipidus and is currently on desmopressin. Over the past few days, she has had reduced oral intake. Her heart rate is <strong>110</strong> beats per minute, and skin turgor is poor.<br/><br/><strong>Investigations:</strong><br/>Sodium <strong>158 mmol/L</strong> (135–145)<br/>Potassium <strong>3.9 mmol/L</strong> (3.5–5)<br/><br/>Which of the following is the most appropriate <strong>initial</strong> management?",
  options: [
    { key: "A", text: "5% dextrose infusion" },
    { key: "B", text: "0.45% normal saline" },
    { key: "C", text: "0.9% normal saline" }, // ✅ correct
    { key: "D", text: "Hypertonic saline" },
    { key: "E", text: "Hydrocortisone" }
  ],
  correct: "C",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The patient presents with signs of hypernatraemia and hypotension, likely due to hypovolaemia. The initial management focuses on stabilising her blood pressure and correcting the hypernatraemia. 0.9% normal saline is suitable for both expanding the intravascular volume and gradually lowering the serum sodium.",
    "Option B, which is 0.45% normal saline, is a hypotonic solution. In the context of this patient's clinical presentation with severe hypernatraemia and signs of hypovolaemia, using a hypotonic solution like 0.45% normal saline could lower the sodium levels too quickly. Rapid correction of hypernatraemia can lead to serious neurological complications, including cerebral oedema and central pontine myelinolysis. 0.9% normal saline provides a safer initial approach by stabilising blood pressure and gradually correcting the sodium imbalance."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>What’s going on?</strong> This is <mark>hypovolaemic hypernatraemia</mark> (Na⁺ 158) from reduced intake ± osmotic water loss (history of diabetes insipidus). She is clinically dehydrated and hypotensive (90/55) with tachycardia.",
    "<strong>First step:</strong> In hypernatraemia with <em>hypovolaemia/haemodynamic instability</em>, restore intravascular volume with <strong>0.9% NaCl</strong>. Once perfusion is stabilised, switch to a <em>hypotonic</em> fluid (e.g., 5% dextrose or 0.45% saline) to replace free water <em>slowly</em>.",
    "<strong>Correction targets:</strong> For chronic/unknown-duration hypernatraemia, lower Na⁺ by ≤ <strong>10–12 mmol/L per 24 h</strong> (≈0.5 mmol/L/h) to avoid cerebral oedema. Check U&amp;Es/Na⁺ every 2–4 h initially and adjust rate.",
    "<strong>Role of desmopressin:</strong> After resuscitation, review DI control and continue/adjust desmopressin if central DI suspected; closely monitor urine output/osmolality and sodium trend.",
    "<strong>Why the other options are wrong initially:</strong><br/>• <strong>5% dextrose</strong>—hypotonic; gives free water and may drop Na⁺ too quickly before circulation is restored.<br/>• <strong>0.45% saline</strong>—also hypotonic, same risk for rapid fall in Na⁺ at the outset.<br/>• <strong>Hypertonic saline</strong>—would <em>raise</em> Na⁺ further; used for <em>hyponatraemia</em>/raised ICP, not here.<br/>• <strong>Hydrocortisone</strong>—for adrenal crisis/shock with suspected adrenal insufficiency; the stem points to hypovolaemic hypernatraemia instead.",
    "<strong>Exam takeaway:</strong> Hypernatraemia + hypotension/dehydration → <mark>volume first with 0.9% saline</mark>, then carefully correct free-water deficit to safe targets."
  ]
},
{
  id: "EM-1331",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 64 year old man with a history of Alzheimer’s disease and poorly controlled type 2 diabetes mellitus presents to the Emergency Department with a three-day history of pain and redness affecting his left foot. His carer mentions that the man has become increasingly confused over the past week and has been complaining of pain in the affected foot.",
  // 👇 shows the 3rd picture in the question
  image: "/burn-foot.png",

  options: [
    { key: "A", text: "Burn" },                         // ✅ correct
    { key: "B", text: "Diabetic foot" },
    { key: "C", text: "Eczema" },
    { key: "D", text: "Necrotising fasciitis" },
    { key: "E", text: "Pressure ulcer" }
  ],
  correct: "A",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The most likely diagnosis is burn. The clinical history indicates a three-day history of pain, redness with an image showing a raw exposed dermis.",
    "The patient’s Alzheimer’s and diabetic status may have contributed to delayed recognition and treatment of this injury."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why burn?</strong> The photo shows large areas of <em>denuded, pink ‘raw’ dermis</em> with sloughing—typical of a <strong>partial-thickness (superficial–deep) burn</strong>. The history is acute (days) and painful.",
    "<strong>Why not the others?</strong><br/>• <strong>Diabetic foot</strong>: classically neuropathic/ischemic ulcers at pressure points with surrounding callus; often <em>painless</em> due to neuropathy.<br/>• <strong>Eczema</strong>: pruritic, chronic eczematous patches/lichenification, not large sheets of exposed dermis.<br/>• <strong>Necrotising fasciitis</strong>: rapidly progressive severe systemic toxicity, <em>pain out of proportion</em>, crepitus, dusky skin/bullae—emergency debridement.<br/>• <strong>Pressure ulcer</strong>: over bony prominences from prolonged pressure, not this appearance/distribution.",
    "<strong>Initial ED management (adult):</strong> Analgesia; gently cleanse/irrigate; remove loose non-viable tissue; apply non-adherent dressing; check tetanus status. Assess <strong>TBSA</strong> and depth; consider burn service referral criteria (e.g., >3% TBSA partial-thickness in extremes of age, functional areas, circumferential burns, suspected inhalation/chemical/electrical). In diabetics, have a <em>low threshold</em> to review for superadded infection and optimise glucose/perfusion.",
    "<strong>Follow-up:</strong> Early wound review (24–48 h), elevation, strict glucose control, safety-net for infection (increasing pain, spreading erythema, fever)."
  ]
},
{
  id: "CU-2830",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 9 month old child aspirated a foreign object which was removed at the hospital. The child is now fine. His parents would like to know what they should do should this occur again. What is the SINGLE most appropriate advice to give them?",
  options: [
    { key: "A", text: "Heimlich maneuver" },
    { key: "B", text: "Turn the infant into a supine position and give chest thrust" },
    { key: "C", text: "Turn the infant into a prone position and give five sharp blows with heel of hand to the middle of the back" }, // ✅ correct
    { key: "D", text: "Place a clenched fist between the umbilicus and xiphisternum and give abdominal thrusts" },
    { key: "E", text: "Turn infant into recovery position and open infant’s mouth" }
  ],
  correct: "C",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "Choking and Foreign Body Airway Obstruction (FBAO) in Infants",
    "",
    "For infants :",
    "<ul class='list-disc ml-5'><li>In a seated position, support the infant in a head-downwards, prone position to let gravity aid removal of the foreign body</li><li>Deliver up to five sharp blows with the heel of your hand to the middle of the back (between the shoulder blades)</li><li>After five unsuccessful back blows, use chest thrusts: turn the infant into a supine position and deliver five chest thrusts. These are similar to chest compressions for CPR, but sharper in nature and delivered at a slower rate.</li></ul>",
    "Reference:",
    "http://patient.info/doctor/choking-and-foreign-body-airway-obstruction-fbao",
    "http://awesomema.com/what-to-do-when-your-child-is-choking/"
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why option C?</strong> For <em>infants &lt; 1 year</em> with suspected severe FBAO (ineffective cough/cry, silent cough, cyanosis): place the infant <strong>prone, head-down</strong> along your forearm or thigh and give <strong>up to 5 back blows</strong> with the <em>heel of the hand</em> between the scapulae. This uses gravity + percussion to dislodge the object.",
    "<strong>If still obstructed</strong>: turn supine and perform <strong>up to 5 chest thrusts</strong>—on the lower half of the sternum, just below the nipple line, depth similar to compressions but <em>slower and sharper</em>. Alternate 5 back blows and 5 chest thrusts while you <em>call for help/EMS</em>.",
    "<strong>Do NOT</strong> perform <em>abdominal (Heimlich) thrusts</em> in infants because of risk of abdominal organ injury and ineffectiveness in this age group. Avoid blind finger sweeps (may push the object deeper).",
    "<strong>If the infant becomes unresponsive</strong>: start <strong>CPR</strong> (30:2 for a single rescuer; 15:2 if two trained rescuers), check the mouth for a visible object <em>before</em> each set of breaths, and remove only if you can see it. Continue until the airway clears or help arrives.",
    "<strong>Recognising severity</strong>: Effective cough/cry with good air entry → encourage coughing and observe. Ineffective cough, stridor/silence, cyanosis, decreased responsiveness → treat as severe FBAO (algorithm above).",
    "<strong>Parent advice essentials</strong>: keep small objects away, supervise feeds, cut food appropriately, and seek infant first-aid training. After any choking episode—even if resolved—have the child reviewed for residual airway oedema/aspiration."
  ]
},
{
  id: "PE-2190",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 22 year old man presents to the Emergency Department with coughing and dyspnoea. He is a known asthmatic and usually uses salbutamol occasionally. His respiratory rate is <strong>30 breaths/minute</strong>, heart rate is <strong>110 beats/minute</strong>, and oxygen saturation is <strong>93%</strong>. He is given oxygen <strong>100%</strong> by face mask. What is the <strong>SINGLE</strong> most appropriate initial management?",
  options: [
    { key: "A", text: "Intravenous salbutamol" },
    { key: "B", text: "Intravenous corticosteroids" },
    { key: "C", text: "Nebulised salbutamol" }, // ✅ correct
    { key: "D", text: "Reduce oxygen" },
    { key: "E", text: "Intravenous antibiotics" }
  ],
  correct: "C",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The next most important management is salbutamol nebulizers to reverse his obstructive airways. Steroids should follow shortly after."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why nebulised salbutamol now?</strong> This is an <em>acute asthma exacerbation</em> with tachypnoea (RR 30), tachycardia (HR 110) and SpO₂ 93%. First-line bronchodilation is a <strong>short-acting β₂-agonist</strong> (salbutamol) delivered by <strong>nebuliser</strong>—often repeated or continuous early. Add ipratropium if moderate–severe.",
    "<strong>Oxygen:</strong> Maintain saturations 94–98%. Starting with high-flow oxygen is acceptable initially; titrate to target once monitored. Do <em>not</em> reduce oxygen before stabilisation.",
    "<strong>Steroids:</strong> Give <strong>oral prednisolone 40–50 mg</strong> (or IV hydrocortisone if unable to take PO) soon after bronchodilator therapy—onset is hours, so it’s the next step, not the immediate fix.",
    "<strong>Why the other options are wrong:</strong><br/>• <strong>IV salbutamol</strong> — reserved for refractory cases after maximal nebulised therapy; more adverse effects.<br/>• <strong>IV corticosteroids</strong> — route isn’t needed if the patient can take oral; and steroids are adjuncts, not the immediate bronchodilator.<br/>• <strong>Reduce oxygen</strong> — inappropriate during acute hypoxaemia; keep target 94–98%.<br/>• <strong>IV antibiotics</strong> — no evidence of bacterial infection; antibiotics are not routine in asthma exacerbations.",
    "<strong>ED bundle:</strong> O₂ to target 94–98%, <strong>nebulised salbutamol</strong> (± ipratropium), <strong>steroids</strong>, consider <strong>MgSO₄ IV</strong> if poor response, monitor with peak flow/ABG if severe, and safety-net/observe."
  ]
},
{
  id: "EM-1036",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Clinical Vignette",
  stem:
    "A 75 year old man has sudden-onset shortness of breath and pleuritic chest pain. He underwent a transurethral resection of the prostate (TURP) three days ago for benign prostatic hyperplasia. On examination, he has a pulse of <strong>110 beats per minute</strong>, respiratory rate of <strong>24 breaths per minute</strong>, and oxygen saturation of <strong>94% on room air</strong>. His blood pressure is <strong>130/80 mmHg</strong>. Chest auscultation reveals clear lung fields with no added sounds. What is the most appropriate investigation?",
  options: [
    { key: "A", text: "CT pulmonary angiography (CTPA)" }, // ✅ correct
    { key: "B", text: "Chest X-ray" },
    { key: "C", text: "D-dimer" },
    { key: "D", text: "Lower limb ultrasound" },
    { key: "E", text: "Ventilation-perfusion (V/Q) scan" }
  ],
  correct: "A",

  /* -------------------- Plabable Explanation (exact text) -------------------- */
  explanation_plabable: [
    "The most appropriate next investigation is CT pulmonary angiography (CTPA), as the patient has a high clinical suspicion for pulmonary embolism (PE) following recent surgery.",
    "A chest X-ray may be performed to rule out other causes but is not diagnostic for PE.",
    "While a D-dimer is useful in low-risk patients, it is not appropriate in this case due to his high pre-test probability based on the Wells score",
    "A lower limb ultrasound may confirm deep vein thrombosis (DVT) but does not exclude PE.",
    "A ventilation-perfusion (V/Q) scan is an alternative when CTPA is contraindicated, such as in renal impairment or contrast allergy."
  ],

  /* -------------------- Detailed Explanation (expanded teaching) -------------------- */
  explanation_detail: [
    "<strong>Why CTPA?</strong> Post-operative patient (TURP 3 days ago) with sudden pleuritic pain, tachycardia, tachypnoea and borderline hypoxia → <strong>high pre-test probability</strong> of PE. In high probability, go straight to <mark>CT pulmonary angiography</mark> unless contraindicated.",
    "<strong>What about the other tests?</strong><br/>• <strong>CXR</strong> rules out alternative diagnoses (e.g., pneumothorax, pneumonia) but cannot confirm/deny PE.<br/>• <strong>D-dimer</strong> is only for <em>low</em> clinical probability; using it here delays definitive imaging and can be misleading.<br/>• <strong>Leg ultrasound</strong> may detect DVT, but a negative scan does not exclude PE and a positive scan still leaves the extent/management questions.<br/>• <strong>V/Q scan</strong> is reserved for when CTPA can’t be done (contrast allergy, significant renal impairment, pregnancy depending on local protocols) and requires a normal CXR for best accuracy.",
    "<strong>Management preview (after confirmation):</strong> Initiate anticoagulation (DOAC/LMWH per local policy) unless contraindicated; consider thrombolysis if haemodynamically unstable (massive PE); address risk factors and plan duration of therapy."
  ]
},
{
  id: "EM-0045",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Anaphylaxis after peanut ingestion",
  stem: "A 35-year-old man with a known peanut allergy presents to A&E 20 minutes after unknowingly eating a cupcake containing nuts. He is acutely breathless with a hoarse voice and difficulty swallowing. Examination reveals widespread wheeze and stridor, with swelling of the lips and tongue. <br/><br/><strong>Observations:</strong> HR <strong>110 bpm</strong>, BP <strong>88/59 mmHg</strong>, RR <strong>26/min</strong>, SpO₂ <strong>91%</strong> on air, Temp <strong>36.6°C</strong>. Intravenous access has been established. What is the SINGLE most appropriate immediate treatment?",
  options: [
    { key: "A", text: "Intramuscular adrenaline 0.5 ml 1 in 1,000" },
    { key: "B", text: "Intravenous adrenaline 0.5 ml 1 in 1,000" },
    { key: "C", text: "Intravenous hydrocortisone" },
    { key: "D", text: "Intramuscular adrenaline 0.3 ml 1 in 1,000" },
    { key: "E", text: "Intramuscular adrenaline 0.5 ml 1 in 10,000" }
  ],
  correct: "A",
  explanation_plabable: [
    "Even though IV access has been established, the best treatment to resolve his hypersensitivity reaction is STILL intramuscular adrenaline.",
    "Intravenous adrenaline can be dangerous and should only be used in certain specialist settings with someone very skilled and experienced its used.",
    "Further reading:",
    "https://www.resus.org.uk/anaphylaxis/emergency-treatment-of-anaphylactic-reactions/"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This is life‑threatening anaphylaxis (airway oedema, bronchospasm and hypotension). First‑line treatment is <strong>IM adrenaline 0.5 mg (0.5 ml of 1:1,000)</strong> into the anterolateral thigh; repeat every 5 minutes if there is inadequate response. Adrenaline reverses vasodilatation and capillary leak (α₁), relieves bronchospasm (β₂), and reduces further mediator release.",
    "<strong>Why the other options are wrong:</strong> B) IV adrenaline bolus risks arrhythmias and severe hypertension; it is reserved for specialist settings using titrated infusions. C) Hydrocortisone has delayed onset and is an adjunct only. D) 0.3 ml is an adult under‑dose and may fail to correct shock/airway swelling. E) 1 in 10,000 is the cardiac arrest concentration and is inappropriate for IM use in anaphylaxis.",
    "<strong>Management/algorithm:</strong> <ul><li>Call for help; lie patient <em>flat with legs raised</em>; give high‑flow oxygen.</li><li>IM adrenaline 0.5 mg (1:1,000) to the thigh; repeat every 5 min as needed.</li><li>Establish IV access; give rapid 0.9% saline bolus 500–1000 ml for hypotension; reassess and repeat if required.</li><li>Adjuncts <em>after adrenaline</em>: chlorphenamine and hydrocortisone; consider nebulised bronchodilator for persistent wheeze.</li><li>Prepare for airway support and early anaesthetics/ICU involvement if stridor or refractory shock.</li><li>Observe for biphasic reaction; provide adrenaline auto‑injector training, clear documentation of the trigger, and allergy clinic referral prior to discharge.</li></ul>",
    "<strong>Exam takeaway:</strong> In adult anaphylaxis, the immediate life‑saving step is <strong>IM adrenaline 0.5 mg (1:1,000)</strong> in the anterolateral thigh; IV adrenaline is for specialists only."
  ]
},
{
  id: "EM-1792",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "TCA overdose with widened QRS and acidosis",
  stem: "A 34-year-old man with a 3-year history of depression attends the Emergency Department after deliberate ingestion of a significant amount of amitriptyline tablets a few hours ago. He is agitated and confused with mydriasis and feels very thirsty. He had a single brief convulsion which he recovered from. An ECG shows sinus tachycardia with <strong>widened QRS complexes</strong>. <br/><br/><strong>Observations:</strong> HR <strong>130 bpm</strong>, BP <strong>80/40 mmHg</strong> despite fluid resuscitation, RR <strong>20/min</strong>, Temp <strong>39.1°C</strong>. <br/><br/><strong>Arterial blood gas:</strong><br/>PaO₂: <strong>8.5 kPa</strong> (&gt;10 kPa)<br/>PaCO₂: <strong>4.3 kPa</strong> (4.7–6 kPa)<br/>pH: <strong>7.22</strong> (7.35–7.45)<br/>HCO₃⁻: <strong>16 mmol/L</strong> (22–26 mmol/L)<br/><br/>What is the most appropriate management?",
  options: [
    { key: "A", text: "Lorazepam" },
    { key: "B", text: "Sodium bicarbonate" },
    { key: "C", text: "Flumazenil" },
    { key: "D", text: "Clozapine" },
    { key: "E", text: "Activated charcoal and nasogastric tube suction" }
  ],
  correct: "B",
  explanation_plabable: [
    "Tricyclic antidepressants (TCA) are very toxic by ingestion. It is important to monitor and treat as fatal cardiac arrhythmias may occur soon after ingestion. Cardiac complications include prolonged QRS complexes and tachyarrhythmias.",
    "Most arrhythmias occur within a few hours of an overdose and should be managed by correcting hypoxia and acidosis. Sodium bicarbonate is given to reverse the acidosis which improves cardiac rhythm. It is considered in TCA overdose patients where there is severe metabolic acidosis, the QRS is greater than 120 ms or if they are hypotensive despite fluid resuscitation.",
    "Lorazepam is not part of the management of tricyclic antidepressant overdose unless his convulsions are frequent or prolonged.",
    "Activated charcoal and nasogastric tube suction should only be considered within the first hour of tricyclic antidepressant overdose.",
    "Plabable take-home point - always consider sodium bicarbonate infusion in TCA overdose if there is a QRS of greater than 120 ms or hypotension unresponsive to fluids (even if the patient is not acidotic) - this is because we are aiming for a pH of 7.5 to 7.55"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Amitriptyline overdose causes anticholinergic features, CNS toxicity and sodium-channel blockade in the His–Purkinje system and myocardium, producing QRS widening, ventricular arrhythmias and hypotension. IV sodium bicarbonate provides a sodium load and alkalinises serum to displace TCA from Na⁺ channels, narrowing the QRS and improving blood pressure. In TCA toxicity, give sodium bicarbonate when there is significant metabolic acidosis, <strong>QRS >120 ms</strong>, ventricular arrhythmia, or hypotension despite fluids; target a pH of 7.5–7.55.",
    "<strong>Why the other options are wrong:</strong> A) Lorazepam is for recurrent or prolonged seizures but does not treat QRS widening or shock. C) Flumazenil is contraindicated in mixed/unknown overdoses and seizure‑prone ingestions; it offers no benefit here. D) Clozapine is an antipsychotic and inappropriate. E) Activated charcoal/NG suction is only useful within 1 hour of ingestion and risks aspiration in an agitated patient; the priority is cardiac stabilisation with bicarbonate.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE, high‑flow O₂, IV access; treat hypoxia and correct temperature.</li><li>Bolus <strong>IV sodium bicarbonate</strong> (e.g., 50–100 mmol; 1–2 mL/kg of 8.4%) and repeat/titrate to narrow QRS and achieve pH 7.5–7.55; consider infusion.</li><li>Fluids for hypotension; if refractory, start vasopressor (e.g., noradrenaline).</li><li>Seizures: benzodiazepines. Avoid phenytoin and class Ia/Ic antiarrhythmics; consider magnesium for TdP.</li><li>Charcoal only if presentation ≤1 hour and airway protected.</li><li>Continuous ECG monitoring for at least 12–24 h; involve toxicology/ICU early.</li></ul>",
    "<strong>Exam takeaway:</strong> In TCA overdose, a <strong>widened QRS or hypotension</strong> is an indication for <strong>IV sodium bicarbonate</strong> with an alkalinisation target pH of 7.5–7.55; avoid flumazenil and sodium‑channel–blocking antiarrhythmics."
  ]
},
{
  id: "EN-1319",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Hyperkalaemia on ABG — next step",
  stem: "A 60-year-old man presents to the Emergency Department complaining of feeling exhausted and unwell since earlier in the day. Over the past hour he has felt his heart racing. He has type 2 diabetes mellitus (10 years) on metformin, and ramipril was added 5 years ago for hypertension. An urgent ABG has been performed.<br/><br/><strong>ABG / labs:</strong><br/>pH: <strong>7.33</strong> (7.35–7.45)<br/>pCO₂: <strong>5.0 kPa</strong> (4.7–6.0)<br/>pO₂: <strong>12 kPa</strong> (12–14)<br/>Sodium: <strong>138 mmol/L</strong> (135–145)<br/>Potassium: <strong>6.8 mmol/L</strong> (3.5–5.0)<br/><br/>Which of the following is the most appropriate next step in the management of this patient?",
  options: [
    { key: "A", text: "12 lead ECG" },
    { key: "B", text: "Chest X-ray" },
    { key: "C", text: "Renal function test" },
    { key: "D", text: "Venous blood gas analysis" },
    { key: "E", text: "Serum ramipril concentration" }
  ],
  correct: "A",
  explanation_plabable: [
    "The patient presents with nonspecific complaints. However, the patient's current medication - ACE inhibitors (prescribed for hypertension) should raise a red flag for a possible electrolyte imbalance, specifically hyperkalaemia. The arterial blood gas sample confirms this suspicion.",
    "Severity of hyperkalaemia",
    "• Mild → 5.5 - 5.9 mmol/L",
    "• Moderate → 6.0 - 6.4 mmol/L",
    "• Severe → ≥ 6.5 mmol/L",
    "",
    "Drug-induced hyperkalaemia (think of the following)",
    "• Angiotensin-converting enzyme inhibitors",
    "• Angiotensin receptor blockers",
    "• Potassium-sparing agents",
    "",
    "Hyperkalaemia leads to hyperexcitability of the myocardium, which may precipitate ventricular fibrillation/cardiac arrest. Therefore, the most important subsequent step in the management of this patient is to obtain an ECG tracing as well as monitor the patient on a cardiac monitor.",
    "",
    "Further reading:",
    "https://patient.info/doctor/hyperkalaemia-in-adults"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> A potassium of <strong>6.8 mmol/L</strong> is severe hyperkalaemia (≥6.5 mmol/L) and carries a high risk of malignant arrhythmias. The immediate next step is to obtain a <strong>12‑lead ECG</strong> and commence continuous cardiac monitoring to detect life‑threatening changes (peaked T waves, PR prolongation, QRS widening, sine‑wave pattern, VT/VF).",
    "<strong>Why the other options are wrong:</strong> B) Chest X‑ray will not address imminent arrhythmic risk. C) Renal function is relevant but should not delay ECG/monitoring and emergent treatment. D) A venous gas adds little after an ABG has confirmed hyperkalaemia. E) Serum ramipril concentration is not clinically useful and would not change acute management.",
    "<strong>Management/algorithm:</strong> <ul><li>Immediate ECG and continuous monitoring; stop offending drugs (ACEi/ARBs, K‑sparing diuretics).</li><li>If ECG changes or K⁺ ≥6.5 mmol/L, give <strong>IV calcium (e.g., 10 mL 10% calcium gluconate)</strong> to stabilise myocardium; repeat if no ECG improvement.</li><li>Shift potassium intracellularly: <strong>IV insulin (10 units soluble) with 25 g glucose</strong>; consider nebulised salbutamol 10–20 mg; consider IV sodium bicarbonate if severe acidaemia.</li><li>Remove potassium: loop diuretics and/or potassium binders; urgent renal referral for dialysis if refractory or in renal failure.</li><li>Recheck potassium and glucose at 1 hour; continue monitoring until stable.</li></ul>",
    "<strong>Exam takeaway:</strong> Suspected hyperkalaemia (especially ≥6.5 mmol/L) → <strong>ECG and cardiac monitoring first</strong>; treat urgently if there are ECG changes or severe elevation."
  ]
},
{
  id: "EN-1202",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Paracetamol and alcohol ingestion — next step",
  stem: "A 29-year-old woman presents to the Emergency Department 2 hours after ingesting twelve paracetamol tablets with an unspecified amount of alcohol following acute personal stress. She feels remorseful and now denies any current suicidal ideation. She is alert, cooperative and haemodynamically stable. Examination is unremarkable, and initial blood tests including liver function tests are within normal limits. Which of the following is the most appropriate next step in management?",
  options: [
    { key: "A", text: "Refer to psychiatric liaison" },
    { key: "B", text: "Refer to a psychologist" },
    { key: "C", text: "Discharge with follow-up in primary care" },
    { key: "D", text: "Admit to a psychiatric ward" },
    { key: "E", text: "Schedule an outpatient liver function test in one week" }
  ],
  correct: "A",
  explanation_plabable: [
    "This patient has engaged in a potentially harmful act by ingesting a significant quantity of paracetamol and alcohol, indicating acute distress or a possible underlying mental health condition. Referral to a psychiatric liaison is indicated to assess her mental health needs thoroughly. This would usually be a psychiatric nurse who is trained to accept mental health referrals from A&E. They would be able to determine whether this patient requires inpatient treatment, close follow-up in the community, or can be safely discharged."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Any patient presenting after self-harm or an overdose requires a comprehensive psychosocial assessment by <em>liaison psychiatry</em> before discharge, regardless of currently denying suicidal ideation. The assessment addresses suicide risk, precipitating factors, safeguarding, and safety planning, and coordinates appropriate follow‑up (crisis team/CMHT).",
    "<strong>Why the other options are wrong:</strong> B) A psychologist referral is not an acute ED pathway and does not replace urgent risk assessment. C) Discharging with GP follow‑up alone is unsafe after an overdose without a formal mental health assessment. D) Psychiatric admission is reserved for patients with ongoing intent, high risk, psychosis, or inability to ensure safety; this cooperative, stable patient does not automatically require admission. E) Scheduling delayed LFTs misses the immediate priority of psychosocial assessment (and does not guide acute risk); early LFTs may be normal and paracetamol management depends on timed levels and NAC criteria, not a routine one‑week LFT check.",
    "<strong>Management/algorithm:</strong> <ul><li>Medically assess and treat overdose as indicated (time a paracetamol level at ≥4 h post-ingestion; start NAC if above nomogram or per local protocol).</li><li>Place on appropriate observations; address alcohol intoxication and safeguarding.</li><li>Request <strong>liaison psychiatry</strong> for psychosocial and suicide risk assessment, safety planning, and follow‑up arrangements.</li><li>Only consider psychiatric admission if high/ongoing risk or inability to maintain safety in the community.</li><li>Document capacity, risk, and discharge plan; provide crisis contacts.</li></ul>",
    "<strong>Exam takeaway:</strong> After overdose/self-harm, medical stabilisation plus <strong>mandatory liaison psychiatry assessment</strong> precede discharge—even if the patient currently denies suicidal thoughts."
  ]
},
{
  id: "PY-1010",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Paracetamol overdose — when to take the level",
  stem: "A 14-year-old girl is brought to the Emergency Department having taken an <em>unknown amount</em> of paracetamol approximately <strong>2 hours</strong> ago. She has no prior psychiatric history and is currently well, alert and haemodynamically stable. When should you obtain a plasma paracetamol concentration following her presentation?",
  options: [
    { key: "A", text: "Immediately" },
    { key: "B", text: "In 2 hours' time" },
    { key: "C", text: "In 4 hours' time" },
    { key: "D", text: "In 8 hours' time" },
    { key: "E", text: "In 22 hours' time" }
  ],
  correct: "B",
  explanation_plabable: [
    "If one takes an unknown amount of paracetamol, we admit.",
    "Serum paracetamol concentration levels are attained at 4 hours post ingestion if consumed >150mg/kg (or an unknown amount)."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Paracetamol levels are interpreted on the Rumack–Matthew nomogram only when taken at <strong>\u2265 4 hours post-ingestion</strong>. She presented 2 hours after ingestion, so the appropriate plan is to obtain the level <strong>in 2 hours</strong> (i.e., at the 4-hour mark). Earlier samples may underestimate absorption and are not interpretable.",
    "<strong>Why the other options are wrong:</strong> A) An immediate level (<4 h) cannot be interpreted and risks false reassurance. C) Waiting 4 more hours (to 6 h post-ingestion) delays decision-making unnecessarily. D) 8 hours would further delay care; if \u2265 8 h since ingestion and toxicity suspected, start NAC while awaiting the result. E) 22 hours is inappropriate for initial risk assessment; late levels are used to guide completion of treatment.",
    "<strong>Management/algorithm:</strong> <ul><li>Admit for observation/risk assessment when the amount is unknown.</li><li>Take first level at <strong>4 h</strong> post-ingestion (draw at 2 h from now); plot on nomogram and manage per local threshold (e.g., treatment line / 150 mg/kg).</li><li>If presentation is <strong>>8 h</strong> after ingestion or uncertain timing with high suspicion, commence <strong>N-acetylcysteine (NAC)</strong> immediately while awaiting levels.</li><li>Consider activated charcoal if within 1 h of a potentially toxic dose and airway protected.</li><li>Ensure psychosocial assessment before discharge and provide safety planning.</li></ul>",
    "<strong>Exam takeaway:</strong> For acute paracetamol overdose, draw the first paracetamol level at <strong>4 hours post-ingestion</strong>; if the patient presents at 2 hours, take it <strong>in 2 hours' time</strong>."
  ]
},
{
  id: "EM-1560",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Minor head injury in a child — next step",
  stem: "An 11-year-old boy fell from his bicycle earlier today and struck his head on a lamppost. He lost consciousness for a few seconds and on arrival cannot remember the event or riding the bicycle; his mother confirms the amnesia has persisted for <strong>more than 5 minutes</strong>. He was not wearing a helmet. Examination shows a small frontal scalp swelling with no lacerations or bleeding. Neurological examination is normal and his Glasgow Coma Scale is <strong>15/15</strong>. What is the SINGLE most appropriate management?",
  options: [
    { key: "A", text: "CT head within 1 hour" },
    { key: "B", text: "MRI head within 6 hours" },
    { key: "C", text: "Observe for a minimum of 4 hours post head injury" },
    { key: "D", text: "Observe for a minimum of 24 hours post head injury" },
    { key: "E", text: "Prescribe pain relief and discharge" }
  ],
  correct: "C",
  explanation_plabable: [
    "There is ONE risk factor present from the injury which is amnesia lasting more than 5 minutes. With only ONE risk factor present, children need to be observed for a minimum of 4 hours post head injury. If the GCS drops less than 15 OR if there is further vomiting OR further episodes of abnormal drowsiness, he would require a CT scan within the hour.",
    "If he had more than ONE risk factor, for example, if he had a loss of consciousness for more than 5 minutes AND amnesia lasting more than 5 minutes, then he would be a candidate for a CT scan within the hour.",
    "A good summary of risk factors and action plans can be found on NICE CKS here:",
    "https://www.nice.org.uk/guidance/cg176/resources/imaging-algorithm-pdf-498950893"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> NICE head injury guidance for children (<16 years) recommends <strong>observation for at least 4 hours</strong> when there is a single intermediate‑risk factor (e.g., amnesia >5 minutes) and GCS 15 with a normal examination. During observation, if GCS falls <15, vomiting recurs, or abnormal drowsiness develops, perform a CT head within 1 hour.",
    "<strong>Why the other options are wrong:</strong> A) CT within 1 hour is indicated when there are <em>two or more</em> intermediate‑risk factors or high‑risk features (e.g., suspected skull fracture, focal deficit, seizure, GCS <14). With only one risk factor, immediate CT is not required. B) MRI is not used acutely for minor head injury. D) 24‑hour observation is unnecessary if the child remains well after the recommended 4‑hour period. E) Immediate discharge is unsafe because a period of ED observation is mandated with any risk factor.",
    "<strong>Management/algorithm:</strong> <ul><li>Observe in ED for ≥4 hours with neuro‑obs (GCS, HR, RR, BP, SpO₂, pain, behaviour).</li><li>CT head within 1 hour if deterioration: GCS <15, further vomiting, or increasing drowsiness; also if a second risk factor emerges.</li><li>If remains well after observation: discharge with head‑injury advice, responsible adult supervision, and return precautions.</li><li>Consider safeguarding and helmet/road safety counselling.</li></ul>",
    "<strong>Exam takeaway:</strong> Child with minor head injury and a <strong>single</strong> risk factor (e.g., amnesia >5 min, GCS 15) → <strong>observe for ≥4 hours</strong>; escalate to CT only if additional risk factors or deterioration occur."
  ]
},
{
  id: "EM-0590",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Unresponsive trauma patient — first action",
  stem: "A 24-year-old man is brought to the Emergency Department after being punched while under police custody. He is now <strong>cyanosed</strong> and <strong>unresponsive</strong>. On assessment there are <strong>absent breath sounds</strong>. What is the SINGLE most appropriate initial action?",
  options: [
    { key: "A", text: "IV fluids" },
    { key: "B", text: "Clear airway" },
    { key: "C", text: "Turn patient and put in recovery position" },
    { key: "D", text: "Give 100% oxygen" },
    { key: "E", text: "Analgesia" }
  ],
  correct: "B",
  explanation_plabable: [
    "In this question, the examiners want you to know the basics of life-threatening emergencies. ABC - airway, breathing, circulation should always be addressed first.",
    "You would turn the patient in a recovery position if the patient has decreased level of responsiveness, breathing and does not meet the criteria for rescue breaths or CPR. This patient here is not breathing or responsive."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> In an unresponsive, apnoeic trauma patient the immediate priority is the <strong>airway</strong>. Open and clear the airway (suction, remove visible obstruction) while maintaining cervical spine alignment; perform a jaw thrust (or head‑tilt–chin‑lift if no concern for C‑spine). Only after an airway is established can effective ventilation and oxygenation occur.",
    "<strong>Why the other options are wrong:</strong> A) IV fluids address circulation but will not treat apnoea; airway/ventilation must precede circulation. C) Recovery position is for patients who are breathing spontaneously and do not need rescue breaths or CPR; inappropriate in an apnoeic patient. D) Administering oxygen is ineffective if the airway is obstructed; ventilate with a bag‑valve mask <em>after</em> opening the airway. E) Analgesia is irrelevant in an unresponsive apnoeic patient and may depress respiration.",
    "<strong>Management/algorithm:</strong> <ul><li>Shout for help; apply basic monitoring.</li><li>Open/clear airway with jaw thrust and suction; insert an oropharyngeal airway if tolerated while maintaining C‑spine.</li><li>Assess breathing: if not breathing normally, deliver <strong>bag‑valve‑mask ventilation with 100% oxygen</strong>; check for signs of life and pulse, and start CPR per ALS if pulseless.</li><li>Escalate to advanced airway (e.g., intubation) and definitive trauma management as required.</li></ul>",
    "<strong>Exam takeaway:</strong> In any collapsed patient, follow <strong>ABC</strong>—<em>open/clear the airway first</em>; oxygen and fluids are useless until the airway is patent and the patient is ventilated."
  ]
},
{
  id: "EM-1253",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Coughing, cyanosis and urticaria after food exposure",
  stem: "An 8-year-old boy is rushed into A&E coughing, cyanosed and with an urticarial rash. His mother reports that he began to cough shortly after eating a cookie at a garden party. What is the SINGLE most likely diagnosis?",
  options: [
    { key: "A", text: "Aspiration of food" },
    { key: "B", text: "Allergic reaction" },
    { key: "C", text: "Diffuse oesophageal spasm" },
    { key: "D", text: "Tracheoesophageal fistula" },
    { key: "E", text: "Achalasia" }
  ],
  correct: "B",
  explanation_plabable: [
    "This boy is having anaphylaxis which is a type of allergic reaction.",
    "",
    "The other options are far less likely:",
    "",
    "Aspiration of food → Although this makes sense and many will choose this, aspiration of food will not account for the urticarial rash seen on this boy.",
    "",
    "Diffuse oesophageal spasm → Usually presents with intermittent chest pain and dysphagia. The pain can simulate that of a myocardial infarction, but it bears no relationship with exertion. There is no relationship with eating, ruling out odynophagia. The pain can be precipitated by drinking cold liquids.",
    "",
    "Tracheoesophageal fistula → Is suggested in a newborn by copious salivation associated with choking, coughing, vomiting, and cyanosis coincident with the onset of feeding.",
    "",
    "Achalasia → Presents with slowly progressive dysphagia. Initially worse for liquids than solids. Frequent regurgitation of undigested food is common in late disease. Secondary recurrent respiratory infections can occur due to aspiration. Achalasia cannot present suddenly like in this scenario."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Sudden respiratory symptoms after food exposure with an urticarial rash are classic for an <strong>allergic reaction</strong> (anaphylaxis if airway/breathing/circulation involvement). Food triggers are common in children; coughing and cyanosis indicate respiratory involvement, and the cutaneous features (urticaria) rule against simple aspiration.",
    "<strong>Why the other options are wrong:</strong> Aspiration does not cause urticaria. Diffuse oesophageal spasm causes intermittent chest pain/dysphagia unrelated to exertion or meals and is precipitated by cold drinks. Tracheoesophageal fistula typically presents in the neonatal period with choking/cyanosis with feeds. Achalasia causes chronic, progressive dysphagia and regurgitation—not an acute presentation immediately after a cookie.",
    "<strong>Management/algorithm:</strong> <ul><li>Assess <strong>ABC</strong>; if anaphylaxis, give <strong>IM adrenaline 1:1000</strong> (6–12 years: 0.3 mg), call for help, lie flat with legs raised, give high‑flow oxygen.</li><li>Establish IV access and give fluid bolus if hypotensive.</li><li>Adjuncts after adrenaline: chlorphenamine and hydrocortisone; consider nebulised bronchodilator for wheeze.</li><li>Observe for biphasic reactions and provide allergy advice and referral on discharge.</li></ul>",
    "<strong>Exam takeaway:</strong> Food exposure + acute cough/respiratory compromise + urticaria = <strong>allergic reaction/anaphylaxis</strong>, not aspiration or chronic oesophageal pathology."
  ]
},
{
  id: "EM-4315",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Sepsis with lactic acidosis — immediate next step",
  stem: "A 46-year-old man presents to the Emergency Department with breathlessness and fever after several days of cough. He feels very short of breath on exertion. <br/><br/><strong>Observations:</strong> Temp <strong>40.3°C</strong>, HR <strong>120 bpm</strong>, BP <strong>110/80 mmHg</strong>, RR <strong>26/min</strong>, SpO₂ <strong>96%</strong> on <strong>15 L</strong> oxygen via non-rebreathe mask. Intravenous Hartmann's solution has been started. <br/><br/><strong>ABG:</strong><br/>pH: <strong>7.21</strong> (7.35–7.45)<br/>PaO₂: <strong>11 kPa</strong> (10–14)<br/>PaCO₂: <strong>3.5 kPa</strong> (4.7–6.0)<br/>Bicarbonate: <strong>17 mmol/L</strong> (22–26)<br/>Lactate: <strong>9 mmol/L</strong> (2–4)<br/>Base excess: <strong>−4 mmol/L</strong> (± 2)<br/><br/>What is the SINGLE most appropriate management?",
  options: [
    { key: "A", text: "Intravenous antibiotics" },
    { key: "B", text: "High flow oxygen" },
    { key: "C", text: "Intravenous sodium bicarbonate" },
    { key: "D", text: "Intravenous sodium chloride" },
    { key: "E", text: "Intermittent positive-pressure ventilation (IPPV)" }
  ],
  correct: "A",
  explanation_plabable: [
    "This question tests your knowledge of sepsis 6.",
    "",
    "Sepsis Six → Take 3, Give 3",
    "",
    "Take 3",
    "• Blood cultures",
    "• FBC, urea and electrolytes, clotting, lactate",
    "• Start monitoring urine output",
    "",
    "Give 3",
    "• High flow oxygen",
    "• Intravenous fluid challenge",
    "• Intravenous antibiotics",
    "",
    "As he is saturating fine on 15 litres of oxygen and intravenous fluids have been started, the next item to give is intravenous antibiotics.",
    "",
    "His arterial blood gas shows evidence of metabolic acidosis, likely from increased acid load due to sepsis. The pH is < 7.35, bicarbonates are low, base excess is < -2 and lactate is high. There is some compensatory hypocarbia which is the reason that the pCO2 is low. It is more important to treat the cause of metabolic acidosis first rather than administer sodium bicarbonate."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This man meets criteria for sepsis with raised lactate (9 mmol/L) and metabolic acidosis. Two elements of the Sepsis Six bundle have already been started (oxygen and IV fluids), so the next immediate action is to <strong>administer IV broad‑spectrum antibiotics within 1 hour</strong> of recognising sepsis. Early antibiotics reduce mortality and target the source (likely pneumonia).",
    "<strong>Why the other options are wrong:</strong> B) High‑flow oxygen is already being delivered. C) Sodium bicarbonate does not treat the cause of lactic acidosis and is not routinely indicated; priority is source control and perfusion. D) Additional sodium chloride beyond guided fluid resuscitation is not the next step once fluids are running. E) IPPV is reserved for ventilatory failure; his PaO₂ is acceptable on supplemental oxygen and the problem is sepsis with lactic acidosis, not primary ventilatory failure.",
    "<strong>Management/algorithm:</strong> <ul><li>Implement <strong>Sepsis Six</strong> within 1 hour: <em>Take</em> blood cultures, bloods (FBC/U&E/coag/lactate), and start urine output monitoring; <em>Give</em> high‑flow oxygen, IV fluid bolus (e.g., crystalloid 500 mL–1 L then reassess), and <strong>IV antibiotics</strong>.</li><li>Repeat lactate, review for source (e.g., CXR, cultures), and escalate to critical care if persistent hypotension/lactate ≥4 despite fluids.</li><li>Aim to treat metabolic acidosis by restoring perfusion and treating infection rather than with bicarbonate.</li></ul>",
    "<strong>Exam takeaway:</strong> In a septic patient already on oxygen and fluids, the next lifesaving step is <strong>IV antibiotics within the first hour</strong>; treat the cause of acidaemia rather than giving bicarbonate."
  ]
},
{
  id: "EM-0561",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Panic-driven hyperventilation — immediate intervention",
  stem: "A 22-year-old man is rushed into the Emergency Department describing recurrent episodes of fearfulness with palpitations, peri-oral tingling and cramping of the hands. Each episode lasts 5–10 minutes. He worries he is having a heart attack. An ECG shows <em>sinus tachycardia</em>. His respiratory rate is <strong>34/min</strong>; he is otherwise haemodynamically stable. What is the SINGLE most appropriate immediate intervention?",
  options: [
    { key: "A", text: "High flow oxygen" },
    { key: "B", text: "Intravenous sedation" },
    { key: "C", text: "Rebreath into a paper bag" },
    { key: "D", text: "Alprazolam" },
    { key: "E", text: "Refer to cardiac team urgently" }
  ],
  correct: "C",
  explanation_plabable: [
    "Hyperventilation is an abnormally increased pulmonary ventilation. Patients with hyperventilation syndrome may feel that they are not able to breathe sufficient air. In reality their oxygenation in the arterial blood is within normal limits. Due to the rapid breathing, carbon dioxide levels fall which results in respiratory alkalosis",
    "",
    "The complaint is usually of a paroxysmal nature rather than continuous. Patient may report breathlessness, followed by paraesthesia and/or tetany in fingers, distal limbs, mouth. Some patients report chest pain. Palpitations, wheezing and sweating are also seen. This may be accompanied by a panic attack. If this becomes more severe, arterial hypocapnia may trigger cerebral vessel vasoconstriction leading to dizziness, faintness, headaches and lose consciousness. After losing consciousness, breathing and blood gases return to normal which restores cerebral blood flow. The patient would shortly recover after that.",
    "",
    "Management includes rebreathing into the paper bag to terminate the attack. Other methods include deliberately slowing down the breathing rate.",
    "",
    "Medications can also be used. Benzodiazepines can be used in the acute situation if severe. Use only occasionally, as there is the potential for sedation and dependence. Propranolol may be of value if asthma has been excluded.",
    "",
    "Further reading:",
    "http://www.gpnotebook.co.uk/simplepage.cfm?ID=798621724&linkID=18810&cook=yes",
    "https://patient.info/doctor/hyperventilation"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The presentation is classic for <em>hyperventilation syndrome</em> during a panic attack: tachypnoea, paraesthesiae and carpopedal spasm from respiratory alkalosis. The quickest way to terminate the episode in exam settings is to <strong>rebreath into a paper bag</strong> (or coach slow breathing), increasing inspired CO₂ and reversing alkalosis.",
    "<strong>Why the other options are wrong:</strong> A) High‑flow oxygen does not treat alkalosis and may worsen symptoms by lowering drive to slow breathing. B) IV sedation is unnecessary and potentially harmful in a stable patient. D) Alprazolam is not first‑line for an acute episode in ED due to dependence and sedation risks. E) Urgent cardiology referral is inappropriate with a normal ECG (sinus tachycardia) and a clear functional diagnosis.",
    "<strong>Management/algorithm:</strong> <ul><li>Reassure, coach slow diaphragmatic breathing (e.g., 4–6 breaths/min) or brief paper‑bag rebreathing if appropriate.</li><li>Exclude red flags: hypoxia, asthma attack, PE, metabolic causes; check sats and consider ABG if unclear.</li><li>If severe/distressing and not settling, consider a short‑acting benzodiazepine in the acute setting.</li><li>Arrange follow‑up for anxiety management (CBT, SSRIs) and trigger avoidance/education.</li></ul>",
    "<strong>Exam takeaway:</strong> Hyperventilation with tingling and carpopedal spasm from respiratory alkalosis → <strong>rebreath into a paper bag / coached slow breathing</strong> as the immediate step once serious causes are excluded."
  ]
},
{
  id: "EN-0653",
  topic: "Emergency Medicine",
  difficulty: "Easy",
  vignetteTitle: "Unconscious hypoglycaemia — no IV access",
  stem: "A 47-year-old man with type 2 diabetes is found <strong>unconscious</strong> on the floor by his partner. Paramedics report capillary blood glucose <strong>1.2 mmol/L</strong>. He takes insulin, metformin and linagliptin; no other medical problems are known. He is profusely sweating and then develops a <strong>generalised seizure</strong>. He currently has <strong>no intravenous access</strong>. What is the SINGLE most appropriate management?",
  options: [
    { key: "A", text: "Administer intramuscular glucagon 1 mg" },
    { key: "B", text: "Administer 4 g of oral glucose gel" },
    { key: "C", text: "Administer 75 mL of 20% glucose intravenously" },
    { key: "D", text: "Administer Actrapid 10 units subcutaneously" },
    { key: "E", text: "Administer subcutaneous 0.9% normal saline" }
  ],
  correct: "A",
  explanation_plabable: [
    "He is hypoglycaemic. As he is unconscious, either IM glucagon or obtaining intravenous access to deliver intravenous glucose is an option. In this particular case, it is less appropriate to insert an intravenous line since he is having a seizure which would make it difficult.",
    "",
    "A side note: Even if the patient is not experiencing seizures, we (Plabable) recommend picking intramuscular glucagon for any hypoglycaemic unconscious patient who does not have intravenous access.",
    "",
    "The dose to give for intramuscular glucagon is 1 mg.",
    "",
    "Oral glucose gel should never be used in the unconscious patient."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This patient has severe hypoglycaemia with loss of consciousness and seizure activity. Without IV access, the fastest, safest reversal is <strong>IM glucagon 1 mg</strong>, which promotes hepatic glycogenolysis and gluconeogenesis. IV dextrose is first‑line when a cannula is in situ, but attempting cannulation during a seizure risks delay and injury.",
    "<strong>Why the other options are wrong:</strong> B) Oral glucose gel is <em>contraindicated</em> in an unconscious patient due to aspiration risk. C) IV 20% glucose would be appropriate if IV access were available; it is not feasible immediately here. D) Insulin would worsen hypoglycaemia. E) Subcutaneous saline has no role in treating hypoglycaemia.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE; secure airway during seizure; check capillary glucose.</li><li>If conscious and able to swallow: give 15–20 g rapid‑acting carbohydrate orally; recheck glucose in 10–15 min.</li><li>If <strong>unconscious/no IV access</strong>: give <strong>IM glucagon 1 mg</strong> (child dose weight‑adjusted); once alert, give long‑acting carbohydrate snack/meal.</li><li>If <strong>IV access</strong>: give <strong>IV dextrose</strong> (e.g., 10% 150 mL or 20% 75 mL) and repeat as needed; consider continuous 10% dextrose infusion for sulfonylurea‑related or recurrent episodes with octreotide where indicated.</li><li>Identify the cause (missed meal, excess insulin, renal impairment, alcohol) and observe with repeat glucose checks; safety‑net prior to discharge.</li></ul>",
    "<strong>Exam takeaway:</strong> Unconscious hypoglycaemia <strong>without IV access</strong> → give <strong>IM glucagon 1 mg</strong>; do not give oral glucose to an unconscious patient; switch to IV dextrose once access is obtained."
  ]
},
{
  id: "EM-3111",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Road traffic accident — first ABC step",
  stem: "A 34-year-old man was involved in a road traffic accident. He was the driver and reportedly wore a seatbelt. At the scene he was initially alert and oriented but complained of chest pain. On arrival to the Emergency Department he has a Glasgow Coma Scale (GCS) of <strong>14</strong> (E4, V5, M5). Over the next 25 minutes his GCS deteriorates to <strong>10</strong> (E3, V3, M4). His respiratory rate increases from <strong>23</strong> to <strong>35/min</strong>. On examination there is superficial bruising across the chest, likely from the seatbelt, with no obvious deformities. He appears anxious and is using accessory muscles. <br/><br/><strong>Observations:</strong> HR <strong>110 bpm</strong>, BP <strong>110/80 mmHg</strong>. His oxygen saturation drops from <strong>95%</strong> to <strong>88%</strong>. Which is the most important immediate action?",
  options: [
    { key: "A", text: "Assess for spinal cord injury" },
    { key: "B", text: "Perform a needle thoracocentesis" },
    { key: "C", text: "Administer 100% oxygen" },
    { key: "D", text: "Request a portable X-ray" },
    { key: "E", text: "Administer intravenous analgesia" }
  ],
  correct: "C",
  explanation_plabable: [
    "Administering 100% oxygen would help combat the hypoxia. In the initial management of trauma patients, the basic ABCs (Airway, Breathing, Circulation) are followed.",
    "",
    "There are several differential diagnoses that can explain his symptoms. Traumatic brain injury, pulmonary contusion, pneumothorax, hypovolemic shock, and fat embolism are some potential differentials. In any case, oxygen should be administered first.",
    "",
    "One would not do a needle thoracocentesis unless there were clinical features of a tension pneumothorax like a deviated trachea."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This trauma patient is acutely hypoxic (SpO₂ falling to 88%) and tachypnoeic with deteriorating consciousness. Following <strong>ABC</strong>, the immediate intervention is to improve oxygenation with <strong>high‑concentration oxygen</strong> (e.g., non‑rebreathe mask). Treating hypoxia prevents secondary brain injury and buys time to identify causes (lung injury, pneumothorax, aspiration, shock).",
    "<strong>Why the other options are wrong:</strong> A) A focused spinal assessment is important but does not treat life‑threatening hypoxia. B) Needle thoracocentesis is indicated when there are signs of <em>tension</em> pneumothorax (e.g., tracheal deviation, severe respiratory distress with hypotension) — not simply hypoxia without those signs. D) A portable X‑ray helps identify injuries but must not delay immediate oxygenation. E) Analgesia is supportive but not the priority in a decompensating, hypoxic patient.",
    "<strong>Management/algorithm:</strong> <ul><li>Deliver 15 L oxygen via non‑rebreathe mask while maintaining C‑spine precautions.</li><li>Reassess ABCs; obtain IV access, send bloods, and begin trauma evaluation (eFAST/CXR) once the patient is oxygenated.</li><li>If clinical features of tension pneumothorax appear, perform immediate decompression followed by chest drain.</li><li>Continue monitoring; treat underlying causes (e.g., pulmonary contusion, haemothorax, pneumothorax, shock) and escalate to trauma/critical care.</li></ul>",
    "<strong>Exam takeaway:</strong> In trauma with new hypoxia, follow <strong>ABC</strong> — give <strong>100% oxygen first</strong>; imaging and procedures come after stabilising airway and breathing."
  ]
},
{
  id: "CG-0010",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Found outdoors in winter — next step",
  stem: "A 78-year-old man is brought to the Emergency Department after being found unresponsive in his garden during a cold winter evening. Paramedics report he was lying in the snow; the ambient temperature was around <strong>−5°C</strong>. On arrival his <strong>core temperature is 30°C</strong>. He is stuporous, barely responsive to stimuli, and shivering. Breathing is slow and the pulse is weak but regular. Initial measures have included airway protection, removal of wet clothing, passive external rewarming, and intravenous access. What is the most appropriate next step in management?",
  options: [
    { key: "A", text: "Administer heated intravenous fluids" },
    { key: "B", text: "Continue passive external rewarming only" },
    { key: "C", text: "Start broad-spectrum antibiotics" },
    { key: "D", text: "Transfer to a general ward for observation" },
    { key: "E", text: "Administer intramuscular corticosteroids" }
  ],
  correct: "A",
  explanation_plabable: [
    "This patient requires aggressive treatment. Heated intravenous fluids will help raise the core temperature from the inside, which is essential in treating severe hypothermia."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> A core temperature of <strong>30°C</strong> with reduced consciousness indicates at least moderate hypothermia requiring <em>active internal rewarming</em>. Warmed IV crystalloid (e.g., 0.9% saline warmed to 38–42°C) augments core temperature, treats cold‑induced hypovolaemia, and supports perfusion. Passive measures alone are insufficient at this temperature and physiology.",
    "<strong>Why the other options are wrong:</strong> B) Passive external rewarming alone (blankets, warm environment) is inadequate for core temp 28–32°C with depressed mental status. C) Antibiotics may be needed if sepsis is suspected but will not correct hypothermia and are not the immediate step. D) He requires resuscitation bay/ICU‑level monitoring and active rewarming, not routine ward observation. E) Corticosteroids have no role in primary hypothermia management.",
    "<strong>Management/algorithm:</strong> <ul><li>Handle gently; continuous ECG and core temperature monitoring; avoid unnecessary movement (risk of arrhythmias/afterdrop).</li><li>Active internal rewarming: <strong>warmed IV fluids</strong> 38–42°C; warmed humidified oxygen; consider bladder, gastric, or peritoneal lavage if refractory/severe.</li><li>Active external rewarming: forced‑air warming device after wet clothes removed.</li><li>Defibrillation and drugs may be less effective at &lt;30°C; focus on rewarming. Treat hypoglycaemia and electrolyte disturbances.</li><li>Search for precipitating causes (exposure, intoxication, infection) once stabilised.</li></ul>",
    "<strong>Exam takeaway:</strong> Core temp ~30°C with reduced responsiveness = escalate from passive to <strong>active internal rewarming</strong> — start <strong>warmed IV fluids</strong> (and other warming measures) urgently."
  ]
},
{
  id: "CS-1505",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Agitation, rhinorrhoea and mydriasis — withdrawal cause",
  stem: "A 34-year-old man presents to the Emergency Department with agitation, severe muscle cramps and intense anxiety. He reports <strong>insomnia for the past 24 hours</strong>. He has persistent <strong>rhinorrhoea</strong> and <strong>lacrimation</strong>, is <strong>diaphoretic</strong> and has <strong>dilated pupils</strong>. <br/><br/><strong>Observations:</strong> HR <strong>112 bpm</strong>, BP <strong>138/86 mmHg</strong>, RR <strong>22/min</strong>, Temp <strong>37.3°C</strong>, SpO₂ <strong>98%</strong> on air. The team suspects these symptoms are due to drug withdrawal. Which drug withdrawal is the most likely cause of his symptoms?",
  options: [
    { key: "A", text: "Alcohol" },
    { key: "B", text: "Benzodiazepines" },
    { key: "C", text: "Codeine" },
    { key: "D", text: "Heroin" },
    { key: "E", text: "Cannabis" }
  ],
  correct: "D",
  explanation_plabable: [
    "Heroin withdrawal is the most likely cause of the patient's symptoms. Heroin is a short-acting opioid, and when a person abruptly stops using it, withdrawal symptoms can appear within 6-12 hours after the last dose, peaking at around 1-3 days. Typical signs of heroin withdrawal include agitation, anxiety, muscle cramps, sweating, dilated pupils (mydriasis), insomnia, rhinorrhoea and lacrimation, all of which match the presentation in this case.",
    "",
    "The tip here is to look for rhinorrhoea and lacrimation. These two features in the exam are highly suggestive of heroin withdrawal.",
    "",
    "The other options are incorrect:",
    "",
    "Benzodiazepine, codeine, and alcohol withdrawal are not typically associated with pupillary dilatation as a prominent feature."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The triad of <strong>rhinorrhoea</strong>, <strong>lacrimation</strong> and <strong>mydriasis</strong> with diaphoresis, anxiety and cramps strongly indicates <strong>opioid withdrawal</strong>. With onset around 6–12 hours and intense symptoms, the most likely culprit is short‑acting heroin. Other classic signs include yawning, piloerection, abdominal cramps, vomiting and diarrhoea.",
    "<strong>Why the other options are wrong:</strong> A) Alcohol withdrawal usually presents 6–24 h after last drink with tremor, agitation, autonomic hyperactivity and, later, seizures or delirium tremens—rhinorrhoea/lacrimation with marked mydriasis are not typical. B) Benzodiazepine withdrawal causes anxiety, insomnia and tremor, sometimes seizures, but not the autonomic features seen here. C) Codeine is an opioid, but dependence on short‑acting heroin classically produces the abrupt, severe syndrome described; codeine withdrawal is typically milder and less likely in exam settings. E) Cannabis withdrawal is generally mild (irritability, insomnia, reduced appetite) without pronounced autonomic features or mydriasis.",
    "<strong>Management/algorithm:</strong> <ul><li>Assess ABC; exclude alternative causes (sepsis, thyrotoxicosis, stimulant intoxication).</li><li>Symptomatic relief: antiemetics, antidiarrhoeals, NSAIDs; consider <strong>clonidine/lofexidine</strong> for autonomic symptoms.</li><li>Initiate <strong>opioid substitution therapy</strong> (e.g., <em>buprenorphine</em> induction guided by the Clinical Opiate Withdrawal Scale; methadone alternative) and refer to addiction services.</li><li>Provide psychosocial support, harm‑reduction advice (take‑home naloxone for overdose prevention), and arrange follow‑up.</li></ul>",
    "<strong>Exam takeaway:</strong> Acute agitation with <strong>rhinorrhoea + lacrimation + mydriasis</strong> after cessation of an opioid → think <strong>heroin withdrawal</strong> (short‑acting opioid; onset 6–12 h, peaks 1–3 days)."
  ]
},
{
  id: "EM-4200",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Head injury on warfarin — first action",
  stem: "A 65-year-old man is brought to the Emergency Department after a fall with a head injury. He was found <strong>unconscious</strong> at home and brought in by family. He takes <strong>warfarin</strong> for atrial fibrillation. On arrival he is confused with a <strong>GCS of 13</strong>. His oxygen saturation is <strong>82% on room air</strong>. Which of the following is the most appropriate next action?",
  options: [
    { key: "A", text: "Administer intravenous fluid" },
    { key: "B", text: "Administer prothrombin complex concentrate (PCC)" },
    { key: "C", text: "Administer oxygen" },
    { key: "D", text: "Neck immobilisation" },
    { key: "E", text: "Surgical evacuation of the haematoma" }
  ],
  correct: "C",
  explanation_plabable: [
    "This patient is hypoxic. Going back to your basics (ABCDE), you would like to be sure that he is on oxygen. Providing supplemental oxygen helps increase oxygen saturation and improves tissue perfusion, thereby reducing the risk of further brain injury (if there is a haematoma and oedema) and promoting optimal recovery. It is used as part of the overall management strategy, but of course, he would need to undergo a CT scan of his head to look for any intracranial bleeding and have further management after.",
    "",
    "The other options are incorrect.",
    "",
    "PCC is a blood product that contains clotting factors. It can be given in major bleeds in patients taking warfarin; however, there is no evidence of a major bleed. He may or may not have an intracranial bleed, but this has yet to be confirmed.",
    "",
    "There is no concern about a cervical spine injury, so there is no need to immobilise the neck.",
    "",
    "Intravenous fluids may be necessary for resuscitation to maintain his blood pressure, but his blood pressure is not mentioned.",
    "",
    "Surgical evacuation of the haematoma may be required in cases of significant intracranial bleeding causing mass effect or neurological deterioration, but it is not the initial intervention for hypoxia."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The patient is profoundly hypoxic (SpO₂ 82% on air). Following <strong>ABCDE</strong>, the immediate life‑saving action is to restore oxygenation with high‑concentration oxygen (e.g., non‑rebreathe mask) while assessing airway and breathing. Early oxygenation reduces secondary brain injury risk in head trauma, especially in anticoagulated patients who may have intracranial bleeding.",
    "<strong>Why the other options are wrong:</strong> A) IV fluids are for shock; hypotension is not stated and does not address hypoxia. B) PCC reverses warfarin in major/life‑threatening bleeding or before urgent neurosurgery; bleeding is not yet confirmed and oxygenation takes priority. D) No signs of cervical spine injury are given; immobilisation must not delay oxygenation. E) Surgical evacuation is considered once a space‑occupying haematoma is confirmed and after initial resuscitation; it is not the first step for hypoxia.",
    "<strong>Management/algorithm:</strong> <ul><li>Give 15 L oxygen via non‑rebreathe mask; reassess airway, breathing and circulation.</li><li>Urgent CT head/neck per NICE head injury guidance; reverse anticoagulation if ICH confirmed or strongly suspected with clinical deterioration.</li><li>Maintain normotension and normoglycaemia; avoid hypoxia/hypotension (both worsen outcomes).</li><li>Early neurosurgical discussion if ICH or mass effect; monitor GCS and vital signs closely.</li></ul>",
    "<strong>Exam takeaway:</strong> In head‑injured, hypoxic patients — <strong>oxygen first</strong> (ABC before specific interventions like PCC or surgery)."
  ]
},
{
  id: "CB-2788",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Sharp chest pain with SOB — ECG diagnosis",
  stem: "A 34-year-old man presents to the Emergency Department with sudden-onset shortness of breath and central chest pain that began 3 hours ago. The chest pain is sharp. His breathlessness has gradually worsened over the last hour. On examination he is uncomfortable but alert and oriented. <br/><br/><strong>Observations:</strong> RR <strong>24/min</strong>, SpO₂ <strong>98%</strong> on air, HR <strong>110 bpm</strong>, BP <strong>126/84 mmHg</strong>. An ECG is performed and shown below.",
  image: "/pericarditis_widespread_st_elevation.jpg",
  options: [
    { key: "A", text: "Pleurisy" },
    { key: "B", text: "Myocardial infarction" },
    { key: "C", text: "Pericarditis" },
    { key: "D", text: "Pulmonary embolism" },
    { key: "E", text: "Pneumothorax" }
  ],
  correct: "C",
  explanation_plabable: [
    "The ECG findings of widespread ST-segment elevation are characteristic of acute pericarditis, distinguishing it from acute coronary syndrome or pulmonary embolism.",
    "",
    "Reference:",
    "Image by:",
    "By James Heilman, MD - Own work, CC BY-SA 4.0,",
    "https://commons.wikimedia.org/w/index.php?curid=49061305"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The ECG shows <strong>widespread concave ST-segment elevation</strong> (diffuse across limb and precordial leads) with possible PR-segment depression — the classic pattern of <em>acute pericarditis</em>. Unlike STEMI, there is no territorial pattern or reciprocal ST-depression (except possibly in aVR/V1). The sharp pleuritic pain with tachycardia also fits.",
    "<strong>Why the other options are wrong:</strong> A) Isolated pleurisy would not cause diffuse ST elevation. B) Acute myocardial infarction produces regional ST elevation with reciprocal depression corresponding to a single coronary territory, not diffuse changes. D) Pulmonary embolism shows sinus tachycardia, right heart strain (S1Q3T3), or T-wave inversion in V1–V3 rather than global ST elevation. E) Pneumothorax causes pleuritic pain and dyspnoea but ECG changes are non‑specific and not diffuse ST elevation.",
    "<strong>Management/algorithm:</strong> <ul><li>Pain control: <strong>NSAID (e.g., ibuprofen)</strong> plus <strong>colchicine</strong> for 3 months if idiopathic/viral.</li><li>Investigations: troponin (to assess myopericarditis), inflammatory markers, echocardiography for effusion, CXR; screen for secondary causes (infection, autoimmune, uraemia).</li><li>Red flags needing admission/urgent echo: fever >38°C, large effusion/tamponade, immunosuppression, trauma, raised troponin/arrhythmias, anticoagulation, or failure to respond to NSAIDs in 1 week.</li><li>Advise rest and avoid anticoagulation unless otherwise indicated.</li></ul>",
    "<strong>Exam takeaway:</strong> Diffuse concave ST elevation ± PR depression on ECG with pleuritic chest pain → <strong>acute pericarditis</strong>, not STEMI or PE."
  ]
},
{
  id: "HC-0025",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Severe hyperkalaemia with ECG changes — next step",
  stem: "A 48-year-old man being evaluated for hypertensive retinopathy in the eye clinic is referred to the Emergency Department for insidious, progressive onset of nausea, drowsiness and palpitations. Apart from hypertension, he has no other significant past medical history. An ECG shows <strong>tall tented T waves</strong>, <strong>flattened P waves</strong> and <strong>widened QRS</strong>. <br/><br/><strong>Investigations:</strong><br/>Sodium: <strong>142 mmol/L</strong> (135–145)<br/>Potassium: <strong>7.1 mmol/L</strong> (3.5–5.5)<br/>Blood glucose: <strong>5.2 mmol/L</strong><br/><br/>IV calcium chloride has been given. Senior help is on the way. What is the SINGLE most appropriate <em>next</em> step in his management?",
  options: [
    { key: "A", text: "IV Actrapid insulin 10 units with 50 mL of 50% dextrose" },
    { key: "B", text: "IV Actrapid insulin 10 units with 50 mL of 5% dextrose" },
    { key: "C", text: "IV Actrapid insulin 50 units with 50 mL of 50% dextrose" },
    { key: "D", text: "IV Actrapid insulin 50 units with 50 mL of 5% dextrose" },
    { key: "E", text: "IV Actrapid insulin 10 units with 50 mL of 0.9% sodium chloride" }
  ],
  correct: "A",
  explanation_plabable: [
    "This patient who is likely on potentially long term antihypertensive therapy has now presented with severe hyperkalaemia (plasma K > 6.5 mmol/L and/or ECG changes). The initial urgent management includes IV calcium gluconate 10% to protect against myocardial excitability. If this is not available as in this case, then IV calcium chloride is a suitable alternative.",
    "The next step in severe hyperkalaemia should aim at immediately relocating the potassium from the blood into the cells through the administration of IV short-acting insulin and dextrose according to bedside glucose levels.",
    "Blood glucose in normal range (as in this question):",
    "• 10 units of soluble, short-acting (Actrapid) insulin with 50 ml dextrose 50% given over 5 to 15 minutes",
    "• Followed by 500 ml dextrose 10% over 12 hours",
    "Blood glucose HIGH (more than 11.1 mmol/L in non-diabetics)",
    "• 10 units of soluble, short-acting (Actrapid) insulin with 50 ml sodium chloride 0.9% given over 5 to 15 minutes",
    "• Only once glucose levels normalise, give 500 ml dextrose 10% over 12 hours",
    "Serum potassium is to be checked after each insulin infusion is completed until levels return to normal.",
    "In the exam, they may give the options of different insulin brand names so it is worth familiarising yourself with this and remembering that Actrapid (soluble, short-acting insulin) is used for the treatment of hyperkalaemia.",
    "Further reading:",
    "https://bnf.nice.org.uk/treatment-summary/fluids-and-electrolytes.html",
    "https://patient.info/doctor/hyperkalaemia-in-adults#nav-5"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The patient has <strong>severe hyperkalaemia</strong> (K⁺ 7.1 mmol/L) with ECG changes. After membrane stabilisation with IV calcium, the next priority is to <em>shift K⁺ intracellularly</em>. With a <strong>normal bedside glucose (5.2 mmol/L)</strong>, give <strong>10 units IV Actrapid with 50 mL of 50% dextrose</strong> over 5–15 minutes, then start 10% dextrose infusion to avoid hypoglycaemia. This rapidly lowers serum potassium by driving K⁺ into cells via insulin‑stimulated Na⁺/K⁺‑ATPase.",
    "<strong>Why the other options are wrong:</strong> B) 5% dextrose contains too little glucose to protect against insulin‑induced hypoglycaemia and is not the recommended bolus. C/D) 50 units is a dangerous overdose. E) Insulin with 0.9% saline is used when the blood glucose is already high (e.g., >11.1 mmol/L), not when it is normal as in this case.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE and cardiac monitoring; stop potassium‑raising drugs.</li><li>Stabilise myocardium: IV calcium gluconate 10% (or calcium chloride) — already given.</li><li>Shift K⁺ into cells: <strong>10 U Actrapid + 50 mL 50% dextrose</strong> over 5–15 min (if glucose normal/low) <em>or</em> Actrapid in 0.9% saline if glucose high; consider nebulised salbutamol and IV sodium bicarbonate if severe acidaemia.</li><li>Remove K⁺: potassium binders, loop diuretics, and <strong>urgent dialysis</strong> if refractory/renal failure.</li><li>Recheck K⁺ and glucose at 1 hour; continue monitoring to ensure sustained correction.</li></ul>",
    "<strong>Exam takeaway:</strong> Severe hyperkalaemia after IV calcium → <strong>insulin + dextrose regimen</strong> tailored to bedside glucose (normal/low → 50 mL of 50% dextrose; high → 0.9% saline)."
  ]
},
{
  id: "PY-1013",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Paracetamol overdose with uncertain timing — next step",
  stem: "An 18-year-old girl attends the Emergency Department following ingestion of more than several paracetamol tablets <strong>the day before</strong>. She cannot remember the exact time she took the tablets. She is extremely anxious but otherwise asymptomatic. She has no relevant past medical history. Weight <strong>55 kg</strong>. <br/><br/><strong>Observations:</strong> BP <strong>120/75 mmHg</strong>, HR <strong>105 bpm</strong>, SpO₂ <strong>99% on air</strong>. What is the SINGLE most appropriate next step?",
  options: [
    { key: "A", text: "Activated charcoal" },
    { key: "B", text: "Gastric lavage" },
    { key: "C", text: "N-acetylcysteine infusion" },
    { key: "D", text: "Discharge home" },
    { key: "E", text: "Psychiatric review" }
  ],
  correct: "C",
  explanation_plabable: [
    "N-acetylcysteine infusion should be started if there is doubt over the time of paracetamol ingestion, regardless of the plasma paracetamol concentration.",
    "A common mistake seen is marking psychiatric review as an answer. One must remember, that paracetamol overdoses have to be medically cleared by the A&E doctor before the psych team would come to review them. Until she is given the correct treatment and her blood results have come back in addition to the medical team or the A&E team reviewing her and giving her the “all clear” can the psych team be involved.",
    "The other options are incorrect:",
    "Activated charcoal → should be considered if the overdose has been taken within 1 hour",
    "Gastric lavage → Would always be the wrong answer when dealing with paracetamol poisoning. The British Poisons Centres only recommend the use of gastric lavage cases where medications have been ingested that activated charcoal would absorb poorly (eg iron, lithium) and for sustained-release formulations or enteric-coated tablets.",
    "Discharge home → Only if ingestion of paracetamol is < 150mg/kg in a child/adult with no hepatic risk factors",
    "Urgent liver function tests + clotting screen → often no change in these values acutely.",
    "Psychiatric review → would be needed eventually but much later in the management"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> When the time of ingestion is unknown or presentation is >8 hours after ingestion, start <strong>N‑acetylcysteine (NAC)</strong> immediately rather than waiting for a level. NAC prevents and limits hepatic injury regardless of the measured concentration and is safe. Levels drawn at unknown times cannot be interpreted on the Rumack–Matthew nomogram.",
    "<strong>Why the other options are wrong:</strong> A) Activated charcoal is only useful within ~1 hour of ingestion (longer for modified‑release or massive doses with expert advice). B) Gastric lavage is not recommended for paracetamol poisoning and carries aspiration risk. D) Discharge is unsafe without medical assessment/treatment and timed levels; unknown amount could exceed 150 mg/kg. E) Psychiatric review is essential <em>after</em> medical stabilisation and treatment, not before.",
    "<strong>Management/algorithm:</strong> <ul><li>Start <strong>NAC infusion now</strong>; obtain paracetamol level, LFTs, U&E, INR and repeat as per protocol.</li><li>If timing later becomes clear and below treatment line with normal tests, NAC can be stopped per local policy.</li><li>Consider activated charcoal only if ingestion ≤1 hour and airway protected.</li><li>Monitor for nausea/anaphylactoid reactions to NAC; treat symptomatically and continue if possible.</li><li>Once medically stable, arrange <strong>liaison psychiatry</strong> assessment prior to discharge.</li></ul>",
    "<strong>Exam takeaway:</strong> Paracetamol overdose with <strong>unknown timing</strong> → <strong>start NAC immediately</strong>; psychiatric review follows after medical clearance."
  ]
},
{
  id: "EM-1152",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Road traffic accident with paradoxical respiration — first action",
  stem: "A 20-year-old man presents to A&E after severe injuries from a road traffic accident. He is breathless and has severe chest pain. <em>Paradoxical respiration</em> with shortness of breath is observed. <br/><br/><strong>Observations:</strong> SBP <strong>85 mmHg</strong>, RR <strong>25/min</strong>, SpO₂ <strong>88%</strong> on room air, HR <strong>110/min</strong>. What is the SINGLE most appropriate initial action?",
  options: [
    { key: "A", text: "Chest X-ray" },
    { key: "B", text: "Analgesia" },
    { key: "C", text: "High flow oxygen" },
    { key: "D", text: "Secure venous access" },
    { key: "E", text: "Refer to surgeon" }
  ],
  correct: "C",
  explanation_plabable: [
    "In this question, the examiners want you to know the basics of life-threatening emergencies. ABC - airway, breathing, circulation should always be addressed first.",
    "",
    "In reality, oxygen by mask, securing venous access and analgesia would all be done simultaneously. But for the purpose of this exam, we should know the steps according to NHS guidelines and British references. Thus, securing airways and giving oxygen would come before anything else.",
    "",
    "Remember ABC!"
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This polytrauma patient is hypoxic (SpO₂ 88%) with respiratory compromise (paradoxical breathing suggests flail chest). Following <strong>ABCDE</strong>, the first life‑saving action is to improve oxygenation with <strong>high‑flow oxygen</strong> (e.g., non‑rebreathe mask at 15 L/min) while you reassess airway and breathing. Early correction of hypoxia prevents secondary organ injury and buys time for definitive diagnosis/interventions.",
    "<strong>Why the other options are wrong:</strong> A) Chest X‑ray helps identify rib fractures/haemothorax/pneumothorax but must not delay immediate oxygenation. B) Analgesia is important for ventilation but comes after stabilising airway/breathing. D) IV access is part of initial resuscitation but oxygenation/airway take priority when hypoxic. E) Surgical referral is appropriate after initial stabilisation and imaging; it is not the <em>first</em> step in a decompensating patient.",
    "<strong>Management/algorithm:</strong> <ul><li>Deliver high‑flow oxygen and apply monitoring; maintain cervical spine precautions.</li><li>Assess for life‑threatening thoracic injuries (tension pneumothorax, open pneumothorax, massive haemothorax, flail chest) and treat immediately as indicated.</li><li>Establish IV access and begin fluid resuscitation if shocked; obtain ABG and trauma labs.</li><li>Analgesia (e.g., IV opioids); consider regional blocks if flail chest. Imaging (eFAST/CXR/CT) once stable.</li><li>Early senior/trauma team involvement; consider chest drain, non‑invasive ventilation or intubation if ventilation inadequate.</li></ul>",
    "<strong>Exam takeaway:</strong> In trauma with hypoxia, follow <strong>ABC</strong>: oxygenation first — investigations and referrals follow once the patient is stabilised."
  ]
},
{
  id: "EM-1895",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Sudden sharp chest pain with inter-arm BP difference",
  stem: "A 66-year-old man is brought to the Emergency Department complaining of severe substernal chest pain which started suddenly a few hours ago. The pain is described as <strong>sharp</strong>. There is no associated trauma. Past history: <strong>hypertension</strong>. His ECG shows <strong>ST elevation in two contiguous leads</strong>.<br/><br/><strong>Blood tests:</strong><br/>Troponin T: <strong>350 ng/L</strong> (&lt;12)<br/>D-dimer: <strong>1620 ng/mL</strong> (&lt;500)<br/><br/><strong>Examination:</strong> HR <strong>120 bpm</strong>; BP <strong>110/65 mmHg</strong> in the left arm and <strong>169/80 mmHg</strong> in the right arm; breath sounds normal bilaterally. What is the SINGLE most likely diagnosis?",
  options: [
    { key: "A", text: "Myocardial infarction" },
    { key: "B", text: "Thoracic aortic dissection" },
    { key: "C", text: "Pulmonary embolism" },
    { key: "D", text: "Myocardial ischaemia" },
    { key: "E", text: "Disseminated intravascular coagulation (DIC)" }
  ],
  correct: "B",
  explanation_plabable: [
    "The two top differentials, in this case, are acute aortic dissection and acute myocardial infarction. The chest pain from acute dissections is abrupt and is at its maximum from the time of onset. In comparison, the pain with acute myocardial infarctions occurs more slowly and gains intensity with time (usually a few hours). The pain from aortic dissection is typically described as a sharp or sometimes tearing or ripping is used. In contrast, the pain from a myocardial infarction is typically dull and crushing. Of course, clinically it is very difficult to differentiate the two purely based on the type of pain that the patient describes.",
    "Troponins can be raised in aortic dissections and the fear with this fact is that junior doctors may be misled into thinking of the diagnosis of myocardial infarction only. Myocardial infarctions may develop due to an aortic aneurysm.",
    "Aortic dissections can also raise a d-dimer level. D-dimers have low specificity so many conditions can raise it (e.g. malignancy, aortic dissections, sepsis, pregnancy, DVT, pulmonary embolism, etc).",
    "There can also be a difference in blood pressure in limbs on the right side of the body compared with the left when a dissection occurs.",
    "Hypertension is a risk factor for both aortic dissection and myocardial infarction, however, hypertension is probably the most common risk factor found in aortic dissection.",
    "In a nutshell, an aortic dissection has all of the features in the stem and can result in a myocardial infarction. A myocardial infarction, on the other hand, has some of the features in the stem but CANNOT result in an aortic dissection."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Sudden severe <em>sharp/tearing</em> chest pain, an inter‑arm blood pressure difference, and elevated D‑dimer strongly suggest <strong>thoracic aortic dissection</strong>. ST‑segment elevation and raised troponin may occur if the dissection involves the coronary ostia (classically right coronary → inferior changes), so a STEMI pattern does not exclude dissection. Treating as MI with thrombolysis/anticoagulation would be catastrophic.",
    "<strong>Why the other options are wrong:</strong> A/D) Myocardial infarction/ischaemia usually presents with crushing pain and does not cause large inter‑arm BP differences; STEMI alone cannot explain the D‑dimer and pulse/BP asymmetry. C) Pulmonary embolism causes pleuritic pain, tachycardia and hypoxia; inter‑arm BP difference is atypical. E) DIC is a systemic coagulopathy with bleeding/consumption features, not isolated chest pain with asymmetric BPs.",
    "<strong>Management/algorithm:</strong> <ul><li><strong>Do not anticoagulate</strong> until dissection is excluded.</li><li>Resuscitate with <strong>ABCDE</strong>; urgent <strong>CT aortography</strong> if stable (or bedside TTE/TOE if unstable).</li><li>Control pain and <strong>reduce shear stress</strong>: IV <em>labetalol</em> (or esmolol) to HR 60–80 bpm and SBP 100–120 mmHg; add vasodilator (e.g., GTN) after β‑blockade if further BP reduction needed.</li><li><strong>Type A</strong> (ascending) → emergency cardiothoracic surgery; <strong>Type B</strong> (descending) → medical management unless complications (malperfusion, rupture, refractory pain/HTN).</li><li>Monitor for complications (AR murmur, tamponade, stroke, AKI).</li></ul>",
    "<strong>Exam takeaway:</strong> Inter‑arm BP difference + abrupt sharp/tearing pain ± diffuse ST changes or raised troponin → think <strong>aortic dissection</strong>; stabilise with BP/HR control and obtain urgent CT aortogram."
  ]
},
{
  id: "EM-1990",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Chest trauma with dull percussion",
  stem: "A 21-year-old man is brought to the Emergency Department after a road traffic accident. He was stationary in his car when he was hit from the front by another car travelling at 70 miles/hour. He has chest pain and feels breathless. <br/><br/><strong>Observations:</strong> BP <strong>100/60 mmHg</strong>, HR <strong>110 beats/min</strong>, RR <strong>30/min</strong>, SpO₂ <strong>91%</strong> on air. On examination he is tender over the <strong>5th–7th left anterior ribs</strong>, has <strong>decreased breath sounds</strong> on the left, and <strong>dullness to percussion</strong> over the left chest. What is the SINGLE most likely diagnosis?",
  options: [
    { key: "A", text: "Haemothorax" },
    { key: "B", text: "Pulmonary oedema" },
    { key: "C", text: "Simple pneumothorax" },
    { key: "D", text: "Tension pneumothorax" },
    { key: "E", text: "Flail chest" }
  ],
  correct: "A",
  explanation_plabable: [
    "The presentation seen in haemothorax greatly resembles ones of traumatic pneumothorax with the exception of dullness on percussion over the affected lung (sometimes described as stony dullness).",
    "An erect X-ray would show blunting of the hemidiaphragm similar to that of a pleural effusion.",
    "Flail chest is incorrect. There would not be any dullness on percussion in the presentation of a flail chest. Commonly the flail segment moves in the opposite direction of the rest of the chest wall (paradoxical respiration)."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Rib trauma with pleuritic pain, tachypnoea, <strong>reduced breath sounds</strong> and <strong>dull percussion</strong> classically indicates blood in the pleural space — a <strong>haemothorax</strong>. Pneumothorax causes <em>hyper‑resonance</em> rather than dullness. The localised rib tenderness (5th–7th left ribs) supports underlying pleural bleeding from rib fractures/intercostal vessels.",
    "<strong>Why the other options are wrong:</strong> B) Pulmonary oedema presents with bilateral crackles and is not associated with unilateral dullness after trauma. C) Simple pneumothorax gives <em>hyper‑</em>resonant percussion with absent breath sounds; not dull. D) Tension pneumothorax also has hyper‑resonance with severe respiratory distress, hypotension and tracheal deviation. E) Flail chest produces paradoxical chest wall movement; percussion is typically normal, not dull.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE trauma approach with high‑flow O₂ and analgesia; IV access and bloods (group & save/cross‑match).</li><li>Confirm with <strong>eFAST/CXR</strong>. If significant/large haemothorax or respiratory compromise, perform <strong>tube thoracostomy</strong> (large‑bore chest drain).</li><li>Consider massive transfusion if shock; monitor output. <em>Thoracotomy</em> if immediate drain output &gt;1,500 mL or ongoing &gt;200 mL/hour for 2–4 hours.</li><li>Treat associated rib fractures; admit for observation and repeat imaging.</li></ul>",
    "<strong>Exam takeaway:</strong> After blunt chest trauma, <strong>unilateral dullness + reduced breath sounds</strong> = think <strong>haemothorax</strong>; pneumothorax is hyper‑resonant. Manage with ABCDE, CXR/eFAST and chest drain if large/compromising."
  ]
},
{
  id: "EM-1151",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Parents asking about infant CPR — most appropriate advice",
  stem: "Parents of an 11‑month‑old baby want to know the steps for CPR for their child as they have recently attended a funeral of their neighbours' child who died very suddenly after an episode of apnoea. They want to know what they can do if an event like this occurs. What is the SINGLE most appropriate advice in regards to CPR for their child?",
  options: [
    { key: "A", text: "Index and middle finger compression" },
    { key: "B", text: "Compression with heel of one hand" },
    { key: "C", text: "Compression with heel of two hands with fingers interlocked" },
    { key: "D", text: "Compression with rescue breaths 30:2" },
    { key: "E", text: "Give 2 rescue breaths before starting compression" }
  ],
  correct: "A",
  explanation_plabable: [
    "This is a rare scenario in the exam that you may encounter where both the answers are correct. Both A and D are appropriate advice to give to the parents of the child. The exam questions may have written them prior to publishing new guidelines and this may be overlooked by the organizers. When this occurs, the organizers for the exam will award marks for both answers when evaluating the papers. This is a very rare event but may still occur. Thus, do not spend too much time trying to decide which is the right or wrong option between the two.",
    "",
    "We have included this question to mimic how exams may be written and the process by which it will be marked.",
    "",
    "There are two options for chest compression for infants. Either index and middle finger of one hand or grip the chest in both hands in such a way that two thumbs can press on the lower third of the sternum.",
    "",
    "For health care provider and layperson",
    "CPR should be started with the C:V ratio that is familiar and for most, this will be 30:2. The paediatric modifications to adult CPR should be taught to those who care for children but are unlikely to have to resuscitate them. The specific paediatric sequence incorporating the 15:2 ratio is primarily intended for those who have the potential to resuscitate children as part of their role.",
    "",
    "In the case above, the parents are unlikely to need to resuscitate their child and a CPR C:V ratio that is familiar which is 30:2 is appropriate.",
    "",
    "Note: that if you were a paediatrician you should be doing a C:V ratio of 15:2 as you potentially need to resuscitate children as part of your role."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> For infants (<1 year), a single rescuer can perform chest compressions with the <strong>index and middle fingers</strong> on the lower half of the sternum, depth about one‑third of the chest (≈4 cm) at 100–120/min. For laypeople, UK guidance allows a familiar <strong>30:2</strong> compression‑to‑ventilation ratio; healthcare providers who routinely resuscitate children use <strong>15:2</strong>. Thus, both the technique (A) and the 30:2 ratio (D) are acceptable advice for parents, but the compressions technique is the most direct answer to the stem.",
    "<strong>Why the other options are wrong:</strong> B/C) Heel‑of‑hand techniques are adult/child (>1 year) methods and risk injury in infants. E) Paediatric BLS recommends <strong>5 initial rescue breaths</strong>, not 2, before starting compressions when a child is unresponsive and not breathing normally.",
    "<strong>Management/algorithm:</strong> <ul><li>Check responsiveness, open airway, look–listen–feel; call for help.</li><li>Give <strong>5 rescue breaths</strong>; if no signs of life, start compressions at <strong>30:2</strong> for a lone rescuer (15:2 for healthcare professionals with two rescuers).</li><li>Compression technique: two fingers (lone rescuer) or two‑thumb encircling hands technique if two rescuers available; depth one‑third of chest, allow full recoil.</li><li>Continue CPR for ~1 minute before leaving to call EMS if alone.</li></ul>",
    "<strong>Exam takeaway:</strong> Infant CPR: compress with <strong>two fingers</strong> (lone rescuer) and use a familiar <strong>30:2</strong> ratio for laypeople; professionals commonly use <strong>15:2</strong>."
  ]
},
{
  id: "EM-1450",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "High-speed RTA with RUQ pain — best investigation",
  stem: "A 65-year-old man is involved in a high-speed road traffic accident and is brought to the ED resuscitation room by paramedics. He complains of severe right upper quadrant pain. On examination, there are no visible external injuries or external bleeding. He has normal breath sounds. The right upper quadrant is tender with some bruising. <br/><br/><strong>Observations:</strong> Temp <strong>36.7°C</strong>, HR <strong>110 beats/min</strong>, BP <strong>120/75 mmHg</strong>, RR <strong>25/min</strong>, SpO₂ <strong>97%</strong> on air. What is the SINGLE most appropriate investigation?",
  options: [
    { key: "A", text: "X-ray chest" },
    { key: "B", text: "X-ray abdomen" },
    { key: "C", text: "CT scan of the abdomen" },
    { key: "D", text: "Ultrasound of the abdomen" },
    { key: "E", text: "Ultrasound of the chest, abdomen and pelvis" }
  ],
  correct: "C",
  explanation_plabable: [
    "A CT scan plays a vital role in road traffic accidents involving blunt trauma to the abdomen in haemodynamically stable patients. It has a high specificity and sensitivity for liver injuries.",
    "",
    "An ultrasound in this situation would refer to a FAST (Focused Assessment with Sonography for Trauma) scan which would be done in a haemodynamically unstable patient. The purpose of this scan is to assess for hemopericardium and hemoperitoneum."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This patient is <strong>haemodynamically stable</strong> after blunt abdominal trauma with focal RUQ tenderness and bruising, raising concern for <em>solid organ injury</em> (e.g., liver laceration). The investigation of choice is a <strong>contrast-enhanced CT abdomen</strong> (often as part of a trauma CT C/A/P), which accurately detects solid organ injury, active bleeding, and associated injuries, and guides operative vs non‑operative management.",
    "<strong>Why the other options are wrong:</strong> A/B) Chest or abdominal X‑rays have low yield for solid organ injury and would not change immediate management in a stable patient. D) Single‑organ abdominal ultrasound is operator‑dependent and far less sensitive for grading hepatic injury. E) An ultrasound of chest/abdomen/pelvis is effectively an <strong>eFAST</strong> and is primarily indicated for <strong>unstable</strong> patients to rapidly identify free fluid or tamponade; in stable patients CT is preferred.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE with analgesia and monitoring.</li><li>Stable after blunt abdominal trauma → <strong>CT abdomen (± chest/pelvis) with IV contrast</strong>.</li><li>Unstable with suspected intra‑abdominal bleed → <strong>eFAST</strong>; if positive, proceed to emergency intervention (e.g., laparotomy/angioembolisation) while resuscitating.</li><li>Non‑operative management for low‑grade liver/splenic injuries with observation and repeat imaging as needed; involve trauma surgery/interventional radiology early.</li></ul>",
    "<strong>Exam takeaway:</strong> Blunt abdominal trauma + haemodynamic <strong>stability</strong> → choose <strong>contrast CT abdomen</strong>, not FAST ultrasound, for diagnosing solid organ injury (e.g., liver)."
  ]
},
{
  id: "CT-4731",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Agitated, sweating, hypertensive — which drug?",
  stem: "A 28-year-old man presents to the Emergency Department with a history of recreational drug use. He is agitated and sweating profusely. <br/><br/><strong>Observations:</strong> Temp <strong>39.6°C</strong>, BP <strong>172/90 mmHg</strong>, HR <strong>110 bpm</strong>, pupils <strong>dilated</strong>, SpO₂ <strong>—</strong>. Which substance overdose is most consistent with this clinical picture?",
  options: [
    { key: "A", text: "Lysergic acid diethylamide (LSD)" },
    { key: "B", text: "Heroin" },
    { key: "C", text: "Ketamine" },
    { key: "D", text: "Cocaine" },
    { key: "E", text: "Cannabis" }
  ],
  correct: "D",
  explanation_plabable: [
    "The clinical presentation in this patient, including hyperthermia, hypertension, tachycardia, and diaphoresis is highly suggestive of cocaine intoxication. Cocaine is a potent sympathomimetic drug that acts by blocking the reuptake of norepinephrine, dopamine, and serotonin in the central nervous system. This leads to increased sympathetic outflow, resulting in hypertension, tachycardia, and hyperthermia. With cocaine overdose, pupils typically dilate since it stimulates the sympathetic nervous system.",
    "",
    "LSD overdose can also result in tachycardia, hyperthermia, hypertension and seizures. Differentiating between cocaine overdose and LSD overdose can be challenging due to the overlapping symptoms of central nervous system stimulation. However, there are some characteristic features that may help in distinguishing the two:",
    "• Cocaine overdose often leads to a more significant increase in blood pressure and heart rate",
    "• Cocaine overdose is associated more with hyperthermia than LSD",
    "• LSD overdose primarily presents with intense hallucinations, altered perception, and disorganised thoughts → it is the profound visual, auditory, and sensory hallucinations which are characteristic",
    "",
    "Heroin is a potent central nervous system depressant, leading to sedation, drowsiness, and a profound sense of relaxation. Overdose typically causes respiratory depression (even respiratory arrest). Another characteristic sign of heroin overdose is the presence of constricted pupils (miosis).",
    "",
    "Ketamine overdose can result in impaired coordination, muscle weakness, and difficulty with movements. Ketamine has analgesic properties and can provide pain relief even at sub-anaesthetic doses. It is taken illicitly as a sniffed powder. Small amounts can result in a state of profound dissociation and disconnectedness. Larger amounts can result in similar effects to LSD, with hallucinations associated with nausea.",
    "",
    "Cannabis is a psychoactive substance that primarily acts as a central nervous system depressant, leading to relaxation and sedation. Cannabis overdose is relatively rare, and the adverse effects are typically milder compared to other substances. The effects are mostly related to relaxation and impaired cognitive functioning and memory."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Sympathomimetic toxidrome — <strong>hyperthermia</strong>, <strong>hypertension</strong>, <strong>tachycardia</strong>, agitation, and <strong>mydriasis</strong> — is classic for <strong>cocaine</strong> overdose. Cocaine blocks re‑uptake of noradrenaline, dopamine and serotonin, driving adrenergic excess. LSD and ketamine are more hallucinogenic/dissociative; opioids (heroin) cause miosis and respiratory depression; cannabis causes mild sedation and impaired cognition, not severe hyperadrenergia.",
    "<strong>Why the other options are wrong:</strong> A) LSD may cause tachycardia and hyperthermia but typically features prominent hallucinations and altered perception rather than marked hypertension. B) Heroin overdose → pinpoint pupils, bradypnoea, coma. C) Ketamine → dissociation, ataxia; severe hypertension/hyperthermia less typical. E) Cannabis rarely causes life‑threatening hyperadrenergic states.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE and cooling (active external cooling if T ≥ 39°C); check glucose.</li><li><strong>Benzodiazepines</strong> (e.g., diazepam/lorazepam) are first‑line for agitation, hypertension and tachycardia by reducing sympathetic outflow.</li><li>Treat hypertension/tachycardia refractory to benzos with <strong>IV nitrates</strong> or <strong>phentolamine</strong>. Avoid <em>β‑blocker monotherapy</em> (risk of unopposed α‑stimulation).</li><li>Fluids; evaluate for complications: hyperthermia, rhabdomyolysis (CK), AKI, MI (ECG/troponin), arrhythmias, seizures.</li><li>If chest pain/ACS features, use aspirin and nitrates; avoid thrombolysis until aortic dissection excluded.</li></ul>",
    "<strong>Exam takeaway:</strong> Agitated, diaphoretic patient with <strong>HTN + tachycardia + hyperthermia + dilated pupils</strong> → think <strong>cocaine</strong>; treat with benzodiazepines, cooling and supportive care; avoid β‑blocker monotherapy."
  ]
},
{
  id: "EM-2450",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Toddler with sudden cough and breathlessness — best next investigation",
  stem: "A 3-year-old child presents to the Emergency Department with his mother. He was playing with small toys when he suddenly became breathless and started to cough. He remained conscious throughout and has continued to vocalise. He has been previously well. <br/><br/><strong>Observations:</strong> Afebrile; HR <strong>90/min</strong>; RR <strong>24/min</strong>; BP <strong>120/70 mmHg</strong>; SpO₂ <strong>96%</strong> on air. On examination there is a <strong>wheeze over the right chest</strong> with <strong>no stridor</strong> and <strong>no cyanosis</strong>. What is the SINGLE next most appropriate investigation?",
  options: [
    { key: "A", text: "Chest X-ray" },
    { key: "B", text: "Lateral X-ray of neck" },
    { key: "C", text: "Fluoroscopy" },
    { key: "D", text: "Nasendoscopy" },
    { key: "E", text: "CT scan of neck and chest" }
  ],
  correct: "A",
  explanation_plabable: [
    "This is a suspected case of lodged foreign body. A foreign body in a child can be aspirated or ingested.",
    "",
    "In case the foreign body has entered the respiratory system, the child can present with sudden onset of cough, breathlessness, stridor, wheezing or choking. Whereas, in cases of ingested foreign bodies which may enter the oesophagus or stomach, the child is usually asymptomatic.",
    "",
    "In this scenario, the child presented with a cough and breathlessness. The cough is effective, and the child is conscious. The child is also able to vocalise well, and a wheeze was heard over the right side of the chest. Hence, the child is suspected to have aspirated the foreign body. The child will be monitored, made comfortable, investigations will be done and the ENT team will be informed.",
    "",
    "Ideally, chest X-rays (which in a toddler would also include imaging of the neck) are the most important investigations in every patient suspected of having a foreign body aspiration.",
    "",
    "A nasendoscopy is a test which helps to examine the nasal passage, pharynx and larynx using an endoscope passed through the nose to the nasopharynx and oropharynx. The need for a nasendoscopy will be decided by the ENT team based on clinical findings and radiological investigations; however, a nasendoscopy would unlikely be of any benefit since the object is probably obstructing the right main bronchus (given the history of right-sided wheeze). A bronchoscopy would be a better option.",
    "",
    "There are a portion of objects which are radiolucent and would not be picked up on X-rays or CT scans. In those cases, if it is suspected to be in the bronchus, then a bronchoscopy would be done."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Sudden cough and unilateral wheeze after playing with small objects strongly suggests <strong>foreign body aspiration</strong>. In a stable child, the first-line investigation is a <strong>chest X-ray</strong> (AP ± lateral; inspiratory/expiratory or decubitus views if possible) to look for air trapping (hyperinflation), atelectasis, or a radiopaque object; neck views are often included in toddlers.",
    "<strong>Why the other options are wrong:</strong> B) Lateral neck X-ray is more useful for suspected <em>ingested</em> or upper airway objects; signs and exam localise to the right chest/bronchus. C) Fluoroscopy is not first-line in ED. D) Nasendoscopy visualises nasal/oropharyngeal–laryngeal structures and rarely helps when the foreign body is bronchial; rigid bronchoscopy is definitive. E) CT has higher radiation and is generally reserved when X-ray is non-diagnostic and suspicion persists—bronchoscopy is preferred for diagnosis and removal.",
    "<strong>Management/algorithm:</strong> <ul><li>Assess <strong>ABC</strong>. If complete obstruction and child is conscious → age-appropriate back blows/chest thrusts; if unconscious → start CPR and attempt visualised removal.</li><li>If stable with suspected aspiration → <strong>CXR</strong> (± neck imaging). Avoid blind finger sweeps.</li><li>Persistent suspicion or abnormal imaging → <strong>rigid bronchoscopy</strong> for removal; involve ENT/paediatric respiratory.</li><li>Post-removal observation for airway oedema, infection; provide prevention advice to carers.</li></ul>",
    "<strong>Exam takeaway:</strong> Stable child with suspected foreign body aspiration and unilateral wheeze → <strong>Chest X-ray first</strong>; bronchoscopy is definitive if suspicion remains or imaging is positive."
  ]
},
{
  id: "CS-1501",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Agitated, diaphoretic young woman — which substance?",
  stem: "A 21-year-old woman presents to the Emergency Department appearing dishevelled and in distress. She requests analgesia for severe abdominal pain. She appears undernourished, agitated, constantly moving in her seat, and avoids sustained eye contact. She is <strong>diaphoretic</strong> with visible sweat despite a cool room, <strong>shivering</strong>, and complains of diffuse joint pain. <br/><br/><strong>Observations:</strong> BP <strong>150/90 mmHg</strong>, HR <strong>110 bpm</strong>, Temp <strong>37.8°C</strong>, RR <strong>22/min</strong>. What is the SINGLE most likely substance misuse indicated by her presentation?",
  options: [
    { key: "A", text: "Alcohol" },
    { key: "B", text: "Heroin" },
    { key: "C", text: "Cocaine" },
    { key: "D", text: "LSD" },
    { key: "E", text: "Ecstasy" }
  ],
  correct: "B",
  explanation_plabable: [
    "Agitation, abdominal cramp, sweating, shivering, and arthralgia are all features of heroin withdrawal. Heroin, an opioid, when misused, leads to physical dependence, and withdrawal symptoms can be severe and include many of the symptoms described.",
    "",
    "Cocaine misuse typically presents with increased alertness, euphoria, dilated pupils, and increased heart rate and blood pressure. While agitation and increased blood pressure could fit, the absence of euphoria, along with the presence of shivering and joint pain, makes cocaine less likely.",
    "",
    "The term “misuse” can manifest through two primary physiological states: intoxication and withdrawal. This makes this question even harder to answer as one has to think if it is an intoxication question or a withdrawal question.",
    "",
    "Heroin can be administered through various methods, with smoking being among the most common. However, its versatility allows for consumption in several other ways, including oral intake, snorting, and parenteral routes. Parenteral administration can be further divided into intravenous, intramuscular, and subcutaneous injections."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> The cluster of <em>autonomic</em> and <em>musculoskeletal</em> symptoms — agitation, diaphoresis, shivering, abdominal cramps and generalised aches — strongly suggests <strong>opioid withdrawal</strong>. Heroin (short‑acting) withdrawal typically begins 6–12 hours after last use, peaking at 1–3 days, with mydriasis, yawning, rhinorrhoea/lacrimation, piloerection, abdominal cramps, vomiting/diarrhoea, insomnia, tachycardia and mild hypertension. These match the vignette more than stimulant intoxication.",
    "<strong>Why the other options are wrong:</strong> A) Alcohol withdrawal features tremor, anxiety, sweating and hypertension, but prominent abdominal cramping and shivering with opioid‑type aches are less typical; severe forms include seizures/DTs. C) Cocaine intoxication causes euphoria, severe agitation, hyperthermia, hypertension, chest pain and mydriasis rather than shivering/arthralgia from withdrawal. D) LSD (hallucinogen) → perceptual disturbances/hallucinations with variable vitals; not this picture. E) Ecstasy (MDMA) → empathogenic effects, bruxism, hyponatraemia risk, hyperthermia; again not classic for this case.",
    "<strong>Management/algorithm:</strong> <ul><li>Assess ABC; exclude sepsis, pregnancy complications, or surgical abdomen if pain severe.</li><li>Symptomatic relief: antiemetics, antidiarrhoeals, NSAIDs; fluids and reassurance.</li><li>Consider <strong>clonidine/lofexidine</strong> for autonomic symptoms.</li><li>Initiate <strong>opioid substitution therapy</strong> when in moderate withdrawal (e.g., COWS ≥ 8–12): <em>buprenorphine</em> (first‑line) or methadone per local protocol; involve addiction services.</li><li>Harm reduction and safeguarding: screen for BBV, offer take‑home naloxone, arrange follow‑up/support.</li></ul>",
    "<strong>Exam takeaway:</strong> Agitated, sweaty patient with crampy abdominal pain, shivering and diffuse aches → think <strong>heroin withdrawal</strong> rather than stimulant intoxication; manage supportively and start opioid substitution when appropriate."
  ]
},
{
  id: "CT-1218",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Penetrating chest trauma with tracheal deviation — next step",
  stem: "A 22-year-old man attends the Emergency Department with a stab wound to the chest. He has left-sided pleuritic chest pain and dyspnoea. There is a single stab wound to the left chest just below the clavicle. His <strong>trachea deviates to the right</strong>. On auscultation, there are <strong>absent breath sounds on the left</strong>. <br/><br/><strong>Observations:</strong> HR <strong>122 bpm</strong>, BP <strong>95/55 mmHg</strong>, SpO₂ <strong>—</strong> (now on high‑flow oxygen). What is the most appropriate next step in his management?",
  options: [
    { key: "A", text: "Needle thoracocentesis" },
    { key: "B", text: "Chest drain" },
    { key: "C", text: "Intubate and ventilate" },
    { key: "D", text: "Tracheostomy" },
    { key: "E", text: "Pericardiocentesis" }
  ],
  correct: "A",
  explanation_plabable: [
    "In the exam, whenever you see the trachea being deviated in a certain direction, immediately consider pneumothorax. If the deviation is in the opposite direction of the trauma, consider tension pneumothorax.",
    "",
    "The diagnosis and management of tension pneumothorax are the same. Insertion of a large-bore needle into the 5th intercostal space near the mid-axillary line. If you hear an audible hiss it confirms the diagnosis and the patient will have relief of their symptoms. This procedure has converted the tension pneumothorax to a simple pneumothorax which will then need to be treated with chest drainage. This procedure is called “needle thoracocentesis”. Synonyms include “needle decompression”.",
    "",
    "Our PLABABLE team actually prefer the term “needle decompression” rather than “needle thoracocentesis” when used in tension pneumothorax.",
    "",
    "The previous method was to insert it in the 2nd intercostal space at the midclavicular line, however, the new ATLS guidelines (10th edition) show evidence that it is easier to reach the thoracic cavity when the 5th intercostal space is used.",
    "",
    "Tension pneumothorax is by necessity a clinical diagnosis. It is a life-threatening emergency and as such, there is no time for diagnostic investigations such as X-ray and arterial blood gases.",
    "",
    "The stab wound, in this case, created an opening with a flap (similar to a one-way valve) which allowed the one-way entry of air into the left pleural space. This build-up of air and subsequent pressure pushes the lung into the mediastinum and reduces venous return to the heart. This is the cause of neck vein distention (not present in this stem), hypotension, tachycardia etc.",
    "",
    "Traumatic chest injuries are a significant cause of mortality. The majority of chest injuries can be handled with simple procedures such as intubation, chest tubes, and pain control."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Tracheal deviation away from the injured side, unilateral absent breath sounds and hypotension after penetrating chest trauma = <strong>tension pneumothorax</strong>. This is a clinical diagnosis requiring <strong>immediate needle decompression</strong> (large‑bore cannula in the 5th intercostal space, anterior to the mid‑axillary line) to relieve mediastinal shift and restore venous return; do not delay for imaging.",
    "<strong>Why the other options are wrong:</strong> B) A chest drain is required <em>after</em> decompression to treat the resulting simple pneumothorax but is not the first, life‑saving step. C) Intubation and ventilation do not treat the obstructive shock and can worsen it if done before decompression. D) Tracheostomy is not indicated. E) Pericardiocentesis treats tamponade, not pneumothorax with tracheal deviation/hypotension.",
    "<strong>Management/algorithm:</strong> <ul><li>High‑flow O₂ and <strong>needle decompression</strong> at 5th ICS AAL/MAL on the affected side; listen for hiss and clinical improvement.</li><li>Insert <strong>definitive intercostal chest drain</strong> (safe triangle) thereafter.</li><li>Continue ABC, analgesia, and monitor; obtain CXR post‑drain if stable.</li><li>Consider causes of traumatic arrest (HOT/LS: hypovolaemia, oxygenation, tension pneumothorax, tamponade).</li></ul>",
    "<strong>Exam takeaway:</strong> Tension pneumothorax is a <strong>clinical</strong> diagnosis — treat first with <strong>needle decompression (5th ICS mid‑axillary line)</strong>, then insert a chest drain; do not wait for X‑ray/ABG."
  ]
},
{
  id: "EN-0659",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Collapsed with low GCS and severe hypoglycaemia — next step",
  stem: "A 59-year-old man is found not fully conscious on the street and brought to A&E by paramedics. Bystanders report he was walking when he suddenly collapsed. On arrival he is confused but breathing. His Glasgow Coma Scale (GCS) is <strong>11/15</strong> with no signs of trauma. Capillary blood glucose is <strong>1.6 mmol/L</strong>. What is the most appropriate next step in management?",
  options: [
    { key: "A", text: "Buccal glucose gel" },
    { key: "B", text: "IM Glucagon" },
    { key: "C", text: "IV glucose" },
    { key: "D", text: "Oral glucose solution" },
    { key: "E", text: "Subcutaneous insulin" }
  ],
  correct: "C",
  explanation_plabable: [
    "The scenario does not explicitly mention an IV line has been inserted or not. This is crucial in deciding between IV or IM treatment and so this is a typical subpar question. You can expect questions of this nature in the exam where they do not represent real life.",
    "",
    "IM glucagon is the correct choice for a patient with impaired consciousness when IV access is not yet established or not readily available.",
    "",
    "IV glucose is the correct choice for a patient with impaired consciousness when IV access has been established.",
    "",
    "It is really up for debate if there is no mention of an IV line being inserted or quickly accessible. Paramedics are more than equipped to insert an intravenous line and so are A&E doctors. That said, the question lacks clarity, making it difficult to choose between IM glucagon and IV glucose without further details. Our Plabable recommendation is to select IV glucose, as it can reasonably be assumed that the patient in A&E would have an established IV line. IV glucose is preferred due to its rapid effectiveness in treating severe hypoglycaemia. We welcome and encourage any constructive debate on this topic in the comment section.",
    "",
    "Buccal or oral glucose is never a good option in patients with impaired consciousness as it requires the patient to be conscious and able to swallow safely. While buccal glucose is absorbed through the mucous membranes, it still requires the patient to have some level of cooperation and reflexes to prevent aspiration or choking. In a confused patient, there is a risk that the gel could obstruct the airway or trigger aspiration if it moves to the back of the throat.",
    "",
    "There is no specific, universally agreed GCS threshold in clinical guidelines for when buccal glucose gel should or should not be administered. Nonetheless, our Plabable team believe that for exam purposes, if the GCS is ≤ 12, oral or buccal glucose gel is unsafe."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> Severe hypoglycaemia with impaired consciousness should be treated immediately. If <strong>IV access is available</strong>, give <strong>IV dextrose</strong> (e.g., 10% 150 mL or 20% 75 mL) to rapidly restore plasma glucose. This acts faster and more reliably than IM glucagon and avoids delays in establishing airway/ventilation and neurological recovery.",
    "<strong>Why the other options are wrong:</strong> B) <em>IM glucagon</em> is appropriate when IV access is unavailable; it relies on hepatic glycogen and may be ineffective in malnutrition, liver disease or alcohol excess. A/D) <em>Buccal/oral glucose</em> require a protected airway and cooperative swallowing—unsafe at GCS 11 with aspiration risk. E) <em>Insulin</em> would worsen hypoglycaemia and is contraindicated.",
    "<strong>Management/algorithm:</strong> <ul><li>ABCDE; check capillary glucose in any altered mental state.</li><li>If IV access present: <strong>IV dextrose</strong> (10% 150 mL or 20% 75 mL). If no IV access: <strong>IM glucagon 1 mg</strong>; establish IV access as soon as possible.</li><li>Once awake and able to swallow: give <strong>long‑acting carbohydrate</strong> (e.g., meal/snack) and monitor for recurrence.</li><li>Identify and treat cause: medication dosing errors, missed meals, renal impairment, alcohol, sepsis; review diabetes regimen.</li><li>Document and safety‑net; consider observation if long‑acting insulin/sulfonylurea involved (octreotide for sulfonylurea‑induced hypoglycaemia).</li></ul>",
    "<strong>Exam takeaway:</strong> Altered GCS + hypoglycaemia → <strong>IV dextrose if you have IV access</strong>; otherwise give <strong>IM glucagon</strong>. Avoid oral/buccal glucose in patients who are not fully conscious."
  ]
},
{
  id: "EM-1035",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "Post-op pleuritic chest pain — best investigation",
  stem: "A 64-year-old woman presents to the Emergency Department with sudden-onset pleuritic chest pain and shortness of breath. The symptoms began a few hours ago while she was sitting at home. Past history includes hypertension; she underwent a <strong>total hip replacement two weeks ago</strong>. <br/><br/><strong>Observations:</strong> RR <strong>24/min</strong>, SpO₂ <strong>92% on air</strong>, HR <strong>108 bpm</strong>, BP <strong>128/78 mmHg</strong>. Examination of the legs reveals <strong>mild swelling of the right calf</strong>. Which is the most appropriate investigation?",
  options: [
    { key: "A", text: "Chest X-ray" },
    { key: "B", text: "CT pulmonary angiography" },
    { key: "C", text: "D-dimer" },
    { key: "D", text: "ECG" },
    { key: "E", text: "Ventilation-perfusion scan" }
  ],
  correct: "B",
  explanation_plabable: [
    "The most appropriate investigation is CT pulmonary angiography (CTPA), as it is the gold standard imaging modality for diagnosing pulmonary embolism (PE) in haemodynamically stable patients. This woman has a recent history of surgery, tachycardia, and pleuritic chest pain, which are highly suggestive of PE.",
    "",
    "While a D-dimer test can be useful in low-risk cases, it is not appropriate in this situation due to the high clinical suspicion.",
    "",
    "A chest X-ray may be performed to rule out other causes but is not diagnostic for PE.",
    "",
    "An ECG can show changes such as sinus tachycardia or S1Q3T3 pattern but is not definitive.",
    "",
    "A ventilation-perfusion (V/Q) scan is an alternative in cases where CTPA is contraindicated, such as in those with severe renal impairment or contrast allergy."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> She is haemodynamically stable with multiple PE risk factors (recent hip arthroplasty, tachycardia, unilateral calf swelling) and pleuritic chest pain/hypoxaemia. For a <strong>moderate–high pre‑test probability</strong>, the investigation of choice is <strong>CT pulmonary angiography (CTPA)</strong>, which directly visualises filling defects in the pulmonary arteries and helps assess alternative diagnoses.",
    "<strong>Why the other options are wrong:</strong> A) CXR can exclude other causes (e.g., pneumothorax, pneumonia) but is not diagnostic for PE. C) D‑dimer is useful only to <em>rule out</em> PE in low‑probability patients; after recent major surgery it is frequently positive and should not delay definitive imaging. D) ECG may show sinus tachycardia or S1Q3T3 but lacks sensitivity/specificity. E) V/Q scan is reserved when <strong>CTPA is contraindicated</strong> (e.g., severe renal failure, iodinated contrast allergy, or pregnancy with normal CXR) or when CT is unavailable.",
    "<strong>Management/algorithm:</strong> <ul><li>Assess Wells/clinical probability; if high and no contraindication, <strong>start anticoagulation</strong> while arranging urgent CTPA.</li><li>If CTPA positive → continue anticoagulation (e.g., DOAC) and evaluate for provoking factors/length of therapy (typically ≥3 months).</li><li>If massive PE with haemodynamic instability → consider thrombolysis or embolectomy.</li><li>If CTPA contraindicated and CXR normal → consider V/Q scan; if both unavailable, manage per local pathways.</li></ul>",
    "<strong>Exam takeaway:</strong> Stable patient with high suspicion for PE after recent surgery → <strong>CTPA</strong> is the next best investigation; D‑dimer is for low‑risk rule‑out only."
  ]
},
{
  id: "EM-3954",
  topic: "Emergency Medicine",
  difficulty: "Medium",
  vignetteTitle: "COPD patient with sudden pleuritic pain — next step",
  stem: "A 50-year-old man presents to the Emergency Department with sudden-onset breathlessness and pleuritic chest pain that developed a few hours ago at rest. He has COPD with multiple admissions over the past year and denies trauma. He appears mildly distressed and uses accessory muscles. <br/><br/><strong>Observations:</strong> RR <strong>28/min</strong>, SpO₂ <strong>89% on air</strong>, HR <strong>104 bpm</strong>, BP <strong>120/66 mmHg</strong>. On auscultation there are <strong>reduced breath sounds</strong> and <strong>hyperresonance</strong> to percussion on the right. A chest X‑ray is shown.",
  image: "/right_large_secondary_pneumothorax.png",
  options: [
    { key: "A", text: "CT chest" },
    { key: "B", text: "Chest drain insertion" },
    { key: "C", text: "Needle aspiration" },
    { key: "D", text: "Non-invasive ventilation" },
    { key: "E", text: "Needle decompression" }
  ],
  correct: "B",
  explanation_plabable: [
    "The patient in this scenario has a secondary pneumothorax, which is pneumothorax occurring in someone with an underlying lung condition, such as chronic obstructive pulmonary disease (COPD).",
    "The visceral pleural edge (sharp white line) can be seen on the right lung and there are no lung markings peripherally to this line. There is no mediastinal shift away from the left lung. This chest X-ray shows a right pneumothorax of more than 50% (approximately 2cm distance from lung margin and chest wall, at the level of the hilum). This would require a chest drain.",
    "Plabable tip! it is hard to know if it is more than a 2cm distance from lung margin and chest wall, at the level of the hilum based on the image given in the MCQ. One quick way to estimate how much is 2 cm is looking at the distance between the posterior ribs. The average distance between the posterior ribs on a chest X-ray is approximately 2-3 cm. You can use this spacing as a rough guide."
  ],
  explanation_detail: [
    "<strong>Why the answer is correct:</strong> This is a <strong>secondary pneumothorax</strong> (underlying COPD). In adults with secondary pneumothorax, a visible rim >2 cm at the hilum level or significant breathlessness warrants <strong>intercostal chest drain insertion</strong> rather than simple aspiration. The film and symptoms indicate a large right pneumothorax without tension; a drain is the appropriate definitive treatment.",
    "<strong>Why the other options are wrong:</strong> A) CT is not first‑line in a clear pneumothorax on CXR needing intervention. C) Needle aspiration is mainly for small primary pneumothoraces or selected 1–2 cm secondary cases; large secondary pneumothorax needs a drain. D) Non‑invasive ventilation is <em>contraindicated</em> in untreated pneumothorax due to risk of tension. E) Needle decompression is reserved for <strong>tension pneumothorax</strong> with haemodynamic compromise/tracheal deviation, which is not described here.",
    "<strong>Management/algorithm:</strong> <ul><li>High‑flow oxygen, analgesia and monitoring.</li><li>Insert intercostal chest drain in the safe triangle; obtain post‑procedure CXR.</li><li>Address underlying COPD; consider admission, oxygen weaning and respiratory review.</li><li>If persistent air leak or failure of lung re‑expansion, involve thoracic surgery for VATS/pleurodesis.</li></ul>",
    "<strong>Exam takeaway:</strong> In <strong>secondary</strong> pneumothorax (e.g., COPD) with a large rim or marked breathlessness → <strong>chest drain</strong> rather than needle aspiration; NIV is contraindicated until resolved."
  ]
},
{
id: "EM-1254",
topic: "Emergency Medicine",
difficulty: "Easy",
vignetteTitle: "Clinical Vignette",
stem: "A 7-year-old girl becomes acutely unwell while visiting a friend's house. The friend's mother has been cooking a dessert containing mixed nuts. She is brought to the Emergency Department. On arrival she is conscious but anxious with inspiratory stridor, widespread erythematous urticaria, and periorbital swelling. Vitals: HR 132 bpm, BP 98/62 mmHg, RR 30/min with accessory muscle use, SpO₂ 95% on high-flow oxygen via non-rebreather, Temp 36.9°C. Intravenous access has not yet been obtained. What is the SINGLE most immediate management step?",
options: [
{ key: "A", text: "Check airway patency and prepare for intubation" },
{ key: "B", text: "Administer 0.3 mL 1 in 1,000 epinephrine (adrenaline) intramuscularly" },
{ key: "C", text: "Administer 10 mg chlorpheniramine intramuscularly" },
{ key: "D", text: "Administer 50 mg hydrocortisone intramuscularly" },
{ key: "E", text: "Secure intravenous access" }
],
correct: "B",
explanation_plabable: [
"This is a classic case of anaphylaxis. Administer 0.3 ml in 100U epinephrine intramuscularly would be the most immediate action as she is aged 6 to 12 years old. From the stem, we can see that she has already been assessed which means the emergency team has already gone through the assessments for Airways, Breathing and Circulation. As she is fully conscious, it is likely that her airway is patent and she does not need intubation."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> She meets criteria for anaphylaxis (sudden exposure to likely allergen + airway/respiratory compromise with stridor and widespread urticaria). The <em>first-line, time-critical</em> treatment in the UK is <strong>IM adrenaline (epinephrine) into the anterolateral thigh</strong>. For children aged 6–12 years the recommended dose is <strong>0.3 mg = 0.3 mL of 1 mg/mL (1:1,000)</strong>, repeat every 5 minutes if there is no improvement. Adrenaline rapidly reverses upper-airway oedema, bronchospasm and distributive shock by α1 (vasoconstriction ↓oedema), β1 (inotropy/chronotropy) and β2 (bronchodilation, mast-cell stabilisation) effects. Early IM adrenaline reduces the risk of cardiac arrest and biphasic reactions—<em>it should not be delayed for IV access, antihistamines or steroids</em>.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>A Prepare for intubation:</em> Always consider airway risk, but immediate IM adrenaline often rapidly improves laryngeal oedema and may avert intubation; intubation attempts before adrenaline can precipitate deterioration.</li><li><em>C Chlorpheniramine IM:</em> Antihistamines help cutaneous symptoms only; they are <strong>not life-saving</strong> and must never precede adrenaline.</li><li><em>D Hydrocortisone IM:</em> Contemporary UK guidance advises <strong>against routine corticosteroids</strong> in the acute phase; consider only for refractory reactions or ongoing asthma/shock after adrenaline.</li><li><em>E Secure IV access:</em> Important for fluids/second-line therapies but must <strong>not delay</strong> immediate IM adrenaline.</li></ul>",
"<strong>Management/algorithm (NHS/UK practice – Resuscitation Council UK/NICE aligned):</strong> <ul><li><strong>0. Call for help & monitor:</strong> Activate emergency call, attach monitoring (ECG, SpO₂, NIBP), obtain focused ABCDE history.</li><li><strong>1. Immediate therapy:</strong> Give <strong>IM adrenaline</strong> into the mid anterolateral thigh (0.3 mg for 6–12 years; 0.15 mg for 6 months–6 years; 0.1 mg for <6 months; 0.5 mg for ≥12 years/≥50 kg). <em>Repeat every 5 minutes</em> if inadequate response.</li><li><strong>2. Position & oxygen:</strong> Lie flat with legs elevated (or sitting if severe dyspnoea), give high-flow oxygen 15 L/min via non-rebreather, remove allergen if present.</li><li><strong>3. IV access & fluids:</strong> After first adrenaline dose, obtain IV/IO access. If signs of shock (weak pulse, hypotension, delayed CRT), give <strong>20 mL/kg</strong> isotonic crystalloid bolus; reassess and repeat as needed.</li><li><strong>4. Adjuncts (after adrenaline):</strong> Consider <em>nebulised bronchodilator</em> for bronchospasm; <em>chlorphenamine</em> for itch/urticaria; <em>corticosteroid not routine</em>—consider only for refractory reactions or ongoing asthma/shock after senior review. If on β-blockers with poor response, consider <strong>glucagon</strong> IV under senior guidance.</li><li><strong>5. Refractory anaphylaxis:</strong> If poor response after two IM doses, seek senior/anaesthetic/ICU help; commence <strong>adrenaline infusion</strong> via pump with critical-care support; continue fluids and consider vasopressors per protocol.</li><li><strong>6. Investigations:</strong> If safe, send <strong>acute serum tryptase</strong> as soon as possible (ideally within 2 hours) and a convalescent sample (24 hours–7 days).</li><li><strong>7. Observation:</strong> Minimum <strong>6–12 hours</strong> observation depending on severity/risk factors (severe presentation, need for repeated adrenaline, asthma, remote location, late-night presentation → consider 12–24 hours) to monitor for biphasic reactions.</li><li><strong>8. Discharge & prevention:</strong> Provide two <strong>adrenaline auto-injectors</strong> with training, a written <strong>emergency action plan</strong>, education on trigger avoidance, and arrange <strong>urgent allergy clinic referral</strong> for specialist assessment and testing.</li></ul>",
"<strong>Pathophysiology (high-yield):</strong> IgE-mediated type I hypersensitivity: allergen cross-links IgE on mast cells/basophils → rapid release of histamine, tryptase, leukotrienes and prostaglandins. <em>α1</em> vasodilation and capillary leak cause distributive shock and airway oedema; <em>β2</em> effects of adrenaline counteract bronchospasm and inhibit further mediator release. Biphasic reactions are due to late-phase mediator synthesis hours later, underscoring the need for observation.",
"<strong>Exam takeaway:</strong> Anaphylaxis = suspected allergen + airway/respiratory and/or circulatory compromise. <strong>Give IM adrenaline in the thigh immediately and repeat every 5 minutes if needed.</strong> Antihistamines and steroids are <em>adjuncts</em> and must never delay adrenaline; observe, provide auto-injectors, and ensure allergy follow-up."
]
},
{
id: "EM-4911",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 33-year-old woman with homozygous sickle cell disease (HbSS) presents to the Emergency Department with severe lower back and limb pain typical of previous vaso-occlusive crises. She rates the pain 9/10. She was given <strong>oral morphine 30 mg</strong> two hours ago by ambulance crew with minimal relief. Vitals: Temp 37.8°C, BP 130/85 mmHg, HR 98 bpm, RR 18/min, SpO₂ 98% on air. She is afebrile to low-grade febrile, appears distressed, and intravenous access is available. What is the most appropriate <strong>next step</strong> in the management of her pain?",
options: [
{ key: "A", text: "Intramuscular diclofenac" },
{ key: "B", text: "Intravenous morphine" },
{ key: "C", text: "Intramuscular pethidine" },
{ key: "D", text: "Intravenous ketamine" },
{ key: "E", text: "Oral ibuprofen" }
],
correct: "B",
explanation_plabable: [
"Intravenous morphine is considered the most appropriate next step in managing severe pain in a sickle cell crisis when oral morphine has not provided sufficient relief. IV administration allows for rapid onset of action and more effective plasma concentration levels, providing more immediate and effective pain relief compared to oral routes. This is critical in managing severe pain in sickle cell crises.",
"Pethidine should be avoided in sickle cell crises due to its metabolites (e.g., norpethidine), which can cause seizures and central nervous system toxicity.",
"Ketamine could be used as an adjunct for pain relief in severe cases or when opioid response is inadequate; however, it is not generally the first line of treatment due to its psychotropic side effects.",
"Nonsteroidal anti-inflammatory drugs (NSAIDs) like ibuprofen or diclofenac are typically more effective for mild to moderate pain, but in sickle cell crisis, the pain is usually severe."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> She has a typical vaso-occlusive crisis with severe pain despite adequate-dose <em>oral</em> morphine. UK practice prioritises <strong>rapid, titratable IV opioid analgesia</strong> to achieve pain relief within 30 minutes of arrival. <strong>IV morphine</strong> (e.g., 0.05–0.1 mg/kg slow IV boluses every 5 minutes to effect, then transition to PCA) provides faster onset and more reliable plasma levels than oral routes. IM routes are avoided in sickle cell disease because absorption is unpredictable and injections are painful. Early, effective analgesia reduces anxiety, catecholamine surge, and risk of complications (e.g., acute chest syndrome).",
"<strong>Why the other options are wrong:</strong> <ul><li><em>A Intramuscular diclofenac:</em> NSAIDs can be useful adjuncts if renal function is normal, but they are inadequate as sole therapy for severe crisis pain and the <em>IM route is discouraged</em>.</li><li><em>C Intramuscular pethidine:</em> Avoid due to toxic metabolite <strong>norpethidine</strong> (seizures, CNS toxicity) and poor efficacy.</li><li><em>D Intravenous ketamine:</em> Consider only as <em>adjunct or rescue</em> when opioids are inadequate and with senior oversight; not first line.</li><li><em>E Oral ibuprofen:</em> Onset is slow and analgesia insufficient for severe crisis; use as an adjunct later if no contraindication.</li></ul>",
"<strong>Management/algorithm (NHS—NICE/RCEM aligned):</strong> <ul><li><strong>Arrival & triage:</strong> High-acuity triage. Aim to give effective analgesia <strong>within 30 minutes</strong>. ABCDE, continuous observations, IV access, pain score.</li><li><strong>Analgesia (first line):</strong> <strong>IV morphine</strong> titrated in small boluses to effect; start <strong>PCA morphine</strong> early once pain is controlled. Prescribe antiemetic (e.g., ondansetron) and <strong>laxative</strong> for constipation prevention.</li><li><strong>Adjuncts:</strong> Paracetamol and an NSAID (e.g., diclofenac or ibuprofen) if renal function is stable and no contraindications. If opioid response inadequate, consider <em>low-dose ketamine</em> infusion/bolus with senior input. <strong>Avoid pethidine.</strong></li><li><strong>Oxygen & fluids:</strong> Give oxygen <em>only if hypoxic</em> (target SpO₂ 94–98%). Encourage oral fluids; use IV isotonic fluids if dehydrated, avoiding overhydration (risk of acute chest syndrome).</li><li><strong>Investigations:</strong> FBC, reticulocytes, U&E, LFTs, CRP; blood cultures if febrile; urinalysis; pregnancy test if applicable; group & save/crossmatch. Consider CXR if chest pain, fever, hypoxia or respiratory signs.</li><li><strong>Identify & treat triggers/complications:</strong> Assess for infection, acute chest syndrome, stroke, priapism. Start empiric antibiotics if sepsis suspected per local policy. Discuss early with Haematology.</li><li><strong>Supportive care:</strong> VTE risk assessment and prophylaxis if admitted; keep warm; early mobilisation as tolerated.</li><li><strong>Disposition:</strong> Admit if ongoing IV analgesia needed, inadequate pain control, hypoxia/fever, suspicion of acute chest syndrome or other complications, social concerns. Provide safety-netting and follow-up with the haematology team.</li></ul>",
"<strong>Pathophysiology (high yield):</strong> Deoxygenated HbS polymerises → rigid sickled erythrocytes → microvascular <em>vaso-occlusion</em> and tissue ischaemia. Inflammatory mediators (e.g., endothelin, prostaglandins) amplify nociception. Effective analgesia and hydration reduce sympathetic drive and secondary sickling. <strong>Pethidine</strong> metabolised to <em>norpethidine</em> (neurotoxic, pro-convulsant), hence avoidance. <strong>Morphine</strong> provides potent μ-agonism with predictable titration IV; PCA enables steady analgesia with fewer peaks/troughs.",
"<strong>Exam takeaway:</strong> In vaso-occlusive crisis with severe pain despite oral opioids, give <strong>IV morphine titrated rapidly</strong>, avoid IM injections and pethidine, add paracetamol/NSAID if safe, hydrate cautiously, and screen early for acute chest syndrome and infection."
]
},
{
id: "EM-3556",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 65-year-old man presents to A&E with worsening breathlessness and fatigue over the past few days. He reports ankle swelling and difficulty lying flat at night. Examination finds bilateral basal crackles and pitting oedema to the mid-shins. Vitals: BP <strong>98/60 mmHg</strong>, HR 98 bpm, RR 24/min, SpO₂ <strong>92% on air</strong>, Temp 37.0°C. A chest X-ray shows cardiomegaly with diffuse perihilar alveolar shadowing. What is the most appropriate initial management to relieve his symptoms?",
image: "/em3556_chest_xray_pulmonary_oedema.png",
options: [
{ key: "A", text: "Lisinopril" },
{ key: "B", text: "Metoprolol" },
{ key: "C", text: "Furosemide" },
{ key: "D", text: "Intravenous fluids" },
{ key: "E", text: "Spironolactone" }
],
correct: "C",
explanation_plabable: [
"The chest X-ray demonstrates cardiomegaly and alveolar shadowing in the lung fields which is consistent with pulmonary oedema.",
"This patient presents with signs of acute decompensated heart failure, evidenced by symptoms like breathlessness, fatigue, orthopnoea, and peripheral oedema. In such cases, the priority is to reduce fluid overload to alleviate symptoms and improve oxygenation.",
"Furosemide, a loop diuretic, is indicated as the first-line treatment for acute pulmonary oedema in heart failure because it rapidly reduces fluid retention and improves symptoms by promoting diuresis. Given his low blood pressure (98/60 mmHg), careful dosing of furosemide can help avoid worsening hypotension while effectively reducing fluid overload.",
"Administration of intravenous fluids would be contraindicated in this case, as this patient already has fluid overload (evidenced by pulmonary and peripheral oedema). Giving additional fluids would worsen pulmonary oedema and exacerbate symptoms of heart failure.",
"As a general guide:",
"<ul><li>Systolic BP ≥90 mmHg: Furosemide is typically safe but monitored closely.</li><li>Systolic BP <90 mmHg or symptomatic hypotension: Furosemide is used with caution or withheld until stabilisation of blood pressure, as it could worsen perfusion and shock. In cases where blood pressure is critically low, the primary treatment focus shifts to stabilising haemodynamics with fluids, inotropes, or vasopressors before addressing fluid overload with diuretics.</li></ul>"
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The presentation (orthopnoea, peripheral oedema, basal crackles) with CXR showing cardiomegaly and perihilar shadowing is acute pulmonary oedema due to decompensated heart failure. The priority is rapid symptom relief by reducing preload and pulmonary congestion. <strong>IV furosemide</strong> (e.g., 40–80 mg slow IV; titrate to response) produces prompt diuresis and venodilation, improving dyspnoea and oxygenation. His BP is borderline low; nitrates and aggressive vasodilators are avoided, but cautious loop diuresis with close monitoring remains first-line.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>A Lisinopril:</em> ACE inhibitors are disease-modifying but not for immediate symptom relief in acute decompensation; start or uptitrate once haemodynamically stable and euvolaemic.</li><li><em>B Metoprolol:</em> β-blockers can worsen acute decompensation if initiated or uptitrated; hold in the acute phase if hypotensive or bradycardic, and resume when stable.</li><li><em>D Intravenous fluids:</em> Contraindicated in pulmonary oedema unless there is clear hypovolaemia (which is not suggested here); would exacerbate congestion.</li><li><em>E Spironolactone:</em> Mineralocorticoid receptor antagonist for chronic HFrEF; onset is slow and not appropriate for acute relief.</li></ul>",
"<strong>Management/algorithm (NHS/NICE/RCEM aligned):</strong> <ul><li><strong>Position & oxygen:</strong> Sit upright; give oxygen to maintain target saturations 94–98% (88–92% if at risk of hypercapnic respiratory failure). Start continuous monitoring.</li><li><strong>Diurese:</strong> Give <strong>IV furosemide 40–80 mg</strong> (or higher if on chronic loop diuretics) as a slow bolus; reassess urine output, symptoms, and BP. Consider infusion if poor response.</li><li><strong>Vasodilators:</strong> If hypertensive pulmonary oedema (SBP >140 mmHg), consider IV nitrates; avoid if SBP <100 mmHg or hypotensive (as in this case).</li><li><strong>Ventilatory support:</strong> If persistent hypoxia or increased work of breathing, consider <strong>CPAP</strong>; escalate early and involve critical care if failing.</li><li><strong>Fluids:</strong> Avoid routine IV fluids; assess volume status with JVP, lungs, oedema, and ultrasound if available.</li><li><strong>Investigations:</strong> ECG, CXR, FBC, U&E (watch K⁺/Cr), LFTs, BNP (not for acute diagnosis), troponin if ACS suspected, ABG if hypoxic or hypercapnic. Treat precipitants (e.g., ACS, arrhythmia, infection, non-adherence).</li><li><strong>Monitoring:</strong> Strict input/output, consider urinary catheter, daily weight, repeat U&E after diuresis.</li><li><strong>After stabilisation:</strong> Optimise GDMT (ACE-i/ARB/ARNI, β-blocker, MRA, SGLT2 inhibitor), fluid/salt advice, HF nurse follow-up, and echo if not recent.</li></ul>",
"<strong>Pathophysiology:</strong> In decompensated HF, elevated left ventricular end-diastolic pressure increases left atrial pressure, transmitting back to pulmonary veins and capillaries. Hydrostatic pressure exceeds oncotic pressure → transudation of fluid into interstitium/alveoli → impaired gas exchange and reduced lung compliance. Loop diuretics inhibit NKCC2 in the thick ascending limb, causing natriuresis/diuresis and early venodilation, lowering preload and pulmonary capillary wedge pressure.",
"<strong>Exam takeaway:</strong> Acute pulmonary oedema with borderline BP → <strong>IV furosemide first</strong>, upright position, oxygen to target, avoid fluids and routine nitrates if hypotensive; investigate and treat triggers; consider CPAP if refractory."
]
},
{
id: "EM-1907",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 32-year-old woman with type 1 diabetes mellitus presents to the Emergency Department with abdominal pain since this morning. The pain is non-radiating in the epigastrium and she has vomited three times. She missed her usual insulin dose yesterday. She feels extremely tired and very thirsty. On examination she appears dehydrated with dry mucous membranes and prolonged capillary refill. Vitals: BP 96/70 mmHg, HR 120 bpm, RR 28/min with deep sighing breaths, SpO₂ 98% on room air, Temp 37.2°C. There is a fruity odour to her breath. Point-of-care tests: capillary blood glucose <strong>28 mmol/L</strong>; urine ketones <strong>3+</strong>. What is the most appropriate initial fluid to administer?",
options: [
{ key: "A", text: "Hartmann's solution" },
{ key: "B", text: "0.9% normal saline" },
{ key: "C", text: "0.9% normal saline with KCl in the first bag" },
{ key: "D", text: "Hartmann's solution with KCl in the first bag" },
{ key: "E", text: "0.9% normal saline with sodium bicarbonate" }
],
correct: "B",
explanation_plabable: [
"The patient's presentation, along with hyperglycaemia and ketonuria on a background of type 1 diabetes implies that the patient is in diabetic ketoacidosis.",
"Always suspect diabetic ketoacidosis in a diabetic patient who presents with abdominal pain and is grossly unwell bearing.",
"Patients are dehydrated and have a fluid deficit of about 100 mL/kg. 0.9% normal saline is the replacement fluid of choice in diabetic ketoacidosis.",
"KCL is not added to the first bag of saline. Instead, potassium replacement is based on the venous blood gas reports and can be added from the second bag onwards.",
"While the patient may be in metabolic acidosis, sodium bicarbonate may lead to the development of cerebral oedema and is not recommended.",
"Insulin is administered as an infusion pump. 50 units of soluble insulin made up to 50 ml with 0.9% saline and given at the rate of 0.1unit/kg/hour. In order to prevent hypoglycaemia, 10% glucose is given at a rate of 125ml/hr when the blood glucose is < 14 mmol/L."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> This is classic adult DKA (missed insulin, vomiting, dehydration, hyperglycaemia 28 mmol/L, ketonuria 3+, Kussmaul breathing, fruity breath). The <em>first</em> priority after ABC is <strong>volume resuscitation with 0.9% sodium chloride (normal saline)</strong>. Intravascular depletion drives poor renal perfusion and worsening acidosis; isotonic saline restores circulating volume, improves renal clearance of ketones, and lowers glucose via dilution and improved insulin sensitivity. Per UK adult DKA protocols, give <strong>1 L 0.9% NaCl over 1 hour</strong> (faster if shocked), <em>without potassium in the first bag</em>.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>A Hartmann's solution:</em> Balanced crystalloids contain potassium and lactate; routine first bag in DKA remains 0.9% saline in most UK pathways.</li><li><em>C/D Add KCl to the first bag:</em> Dangerous before a potassium result and urine flow are confirmed; initial serum K⁺ is often normal/high due to acidaemia despite total-body deficit. Potassium replacement is guided by VBG/UEC and typically begins from the <strong>second</strong> litre.</li><li><em>E Add sodium bicarbonate:</em> Not recommended in routine DKA due to risk of paradoxical CNS acidosis and cerebral oedema; reserve only for extreme acidaemia with shock and senior oversight.</li></ul>",
"<strong>Management/algorithm (NHS—JBDS/NICE aligned):</strong> <ul><li><strong>Fluids:</strong> 0.9% NaCl 1 L over 1 h; then 1 L over 2 h; 1 L over 4 h; 1 L over 4–6 h (adjust for age/comorbidity/heart failure). If shocked, give additional rapid bolus and involve seniors.</li><li><strong>Insulin:</strong> Start fixed-rate IV insulin infusion <strong>0.1 units/kg/h</strong> <em>after</em> the first litre of fluid and potassium status is known.</li><li><strong>Potassium:</strong> Replace according to VBG/U&E and urine output: K⁺ >5.5 → none; 3.5–5.5 → add 40 mmol KCl per litre; <3.5 → senior review, replace urgently and consider delaying insulin.</li><li><strong>Glucose:</strong> When capillary glucose falls to <strong>< 14 mmol/L</strong>, add <strong>10% dextrose at 125 mL/h</strong> alongside saline to continue ketone clearance.</li><li><strong>Monitoring targets:</strong> Ketones fall ≥0.5 mmol/L/h, bicarbonate rises ≥3 mmol/L/h, glucose falls 3 mmol/L/h; hourly CBG/ketones, 2–4 hourly VBG & U&E; strict fluid balance and catheter if needed.</li><li><strong>Identify precipitant:</strong> Infection, insulin omission, MI, stroke, drugs; send cultures if febrile, do ECG, chest X-ray if indicated.</li><li><strong>Pitfalls:</strong> Avoid bicarbonate, avoid insulin bolus, do not add potassium to the first bag, and watch for cerebral oedema (headache, reduced GCS) especially in younger patients.</li></ul>",
"<strong>Exam takeaway:</strong> Adult DKA: first litre = <strong>0.9% saline without potassium</strong>; start fixed-rate IV insulin, replace potassium based on VBG, and add 10% dextrose when glucose < 14 mmol/L."
]
},
{
id: "EM-1700",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 34-year-old man is brought to the Emergency Department after a high‑speed motorcycle collision. He is disorientated and restless with pronounced bruising and swelling around the left orbit. There is a strong smell of alcohol on his breath. Primary survey is completed: airway patent with cervical spine immobilised, equal air entry, BP 132/78 mmHg, HR 106 bpm, RR 20/min, SpO₂ 97% on air. His Glasgow Coma Scale (GCS) is initially <strong>14</strong> (E4 V4 M6). About 90 minutes later, despite analgesia and observation, his <strong>GCS deteriorates to 9</strong>. What is the SINGLE most important initial investigation?",
options: [
{ key: "A", text: "MRI head" },
{ key: "B", text: "Non-contrast head CT" },
{ key: "C", text: "Cervical spine X-ray" },
{ key: "D", text: "Contrast head CT" },
{ key: "E", text: "Blood alcohol concentration (BAC) measurement" }
],
correct: "B",
explanation_plabable: [
"Given the patient's deteriorating level of consciousness and the mechanism of injury (high-speed motorcycle collision), a non-contrast head CT is of utmost importance to quickly assess for any intracranial injuries, such as bleeding.",
"The periorbital ecchymosis is a sign of basal skull fracture and is another worrying sign associated with intracranial injuries."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> In head injury, <strong>worsening GCS</strong> (drop ≥1 point) or GCS &lt;13 at any time mandates <strong>urgent CT head within 1 hour</strong> per NICE head injury guidance. The mechanism (high-speed RTC) and periorbital ecchymosis raise concern for skull base fracture and expanding intracranial haemorrhage (e.g., extradural/subdural). <strong>Non-contrast</strong> CT rapidly identifies acute blood, mass effect and fractures; it is available, fast and compatible with unstable patients.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>A MRI head:</em> Excellent for diffuse axonal injury but slow, less available and unsuitable for acutely deteriorating trauma patients; not first-line.</li><li><em>C Cervical spine X‑ray:</em> Cervical spine imaging is important, but current priority is the deteriorating consciousness needing immediate CT head. C-spine CT can be obtained concurrently or subsequently per local trauma protocol.</li><li><em>D Contrast head CT:</em> Iodinated contrast is <strong>not</strong> required to detect acute haemorrhage and may obscure hyperdensities; non-contrast CT is the standard initial scan.</li><li><em>E BAC measurement:</em> Alcohol may confound assessment but must <strong>not delay</strong> time‑critical neuroimaging.</li></ul>",
"<strong>Management/algorithm (UK trauma—NICE/RCEM aligned):</strong> <ul><li><strong>ABCDE with C‑spine protection.</strong> High‑flow oxygen if needed, IV access, analgesia, point‑of‑care glucose, maintain SBP &gt;110 mmHg.</li><li><strong>Immediate imaging:</strong> Arrange <strong>CT head within 1 hour</strong> for GCS &lt;13 or any deterioration; add <strong>CT C‑spine</strong> if high‑risk mechanism or signs, often as part of a trauma CT (head/neck/chest/abdomen/pelvis) if stable to travel.</li><li><strong>Neurosurgical contact early</strong> if CT shows mass lesion, midline shift or if GCS remains ≤8 after resuscitation.</li><li><strong>Raised ICP precautions:</strong> Elevate head 30°, keep neck midline, avoid hypotension and hypoxia; target PaCO₂ 4.5–5.0 kPa; consider <em>hyperosmolar therapy</em> (e.g., hypertonic saline) if impending herniation while arranging definitive care.</li><li><strong>Observation:</strong> Hourly neuro‑obs, repeat CT if clinical deterioration, treat seizures, correct coagulopathy (vitamin K/ PCC if on warfarin; withhold DOACs and seek reversal where appropriate).</li><li><strong>Documentation & safeguarding:</strong> Record GCS components, pupils, focal deficits, mechanism, and timings; alcohol level can be checked once immediate threats are addressed.</li></ul>",
"<strong>Exam takeaway:</strong> Head injury + drop in GCS = <strong>non‑contrast CT head within 1 hour</strong>. Alcohol intoxication never excludes intracranial haemorrhage and must not delay imaging or neurosurgical referral."
]
},
{
id: "EM-3888",
topic: "Emergency Medicine",
difficulty: "Easy",
vignetteTitle: "Clinical Vignette",
stem: "A 4-year-old boy is brought to the Emergency Department by his mother. He has been drowsy and febrile for 2 days. While in triage he suddenly becomes unresponsive. He is not breathing normally. You deliver <strong>5 rescue breaths</strong>. No brachial or carotid pulse is palpable after 10 seconds. An Ambu-bag is not immediately available. What is the SINGLE most appropriate <strong>compression-to-ventilation ratio</strong> to use during cardiopulmonary resuscitation for this patient?",
options: [
{ key: "A", text: "Ratio of 5 compressions to 1 breath" },
{ key: "B", text: "Ratio of 5 compressions to 2 breaths" },
{ key: "C", text: "Ratio of 15 compressions to 2 breaths with nose pinched" },
{ key: "D", text: "Ratio of 15 compressions to 2 breaths without nose pinched" },
{ key: "E", text: "Ratio of 30 compressions to 2 breaths" }
],
correct: "C",
explanation_plabable: [
"15 compressions to 2 breaths with nose pinched is the answer. For a child over 1 year old, pinch the soft part of his nose closed with the index finger and thumb of your hand on his forehead when giving rescue breaths."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> In paediatric cardiac arrest (≥1 year), healthcare providers use a <strong>15:2</strong> compression-to-ventilation ratio. After initial <strong>5 rescue breaths</strong> (as paediatric arrests are often asphyxial), commence chest compressions at <strong>100–120/min</strong>, depth <strong>one-third of the chest</strong> (~5 cm in a 4-year-old), allowing full recoil. Because no bag-valve mask is immediately available, give <strong>mouth-to-mouth ventilations while pinching the nose</strong> to prevent air leak and ensure chest rise.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>5:1</em> and <em>5:2</em> ratios are outdated and not recommended.</li><li><em>15:2 without pinching the nose</em> will cause inadequate tidal volumes due to nasal air leak in children >1 year (for infants <1 year, cover mouth <em>and</em> nose).</li><li><em>30:2</em> is the adult/lay-rescuer default and not the recommended ratio for healthcare professionals performing paediatric CPR.</li></ul>",
"<strong>Management/algorithm (UK Resuscitation Council – high yield):</strong> <ul><li>Confirm unresponsiveness, shout for help, open airway (head-tilt/chin-lift; jaw thrust if trauma), remove visible obstruction.</li><li>Give <strong>5 rescue breaths</strong>, watching for chest rise. If no signs of life and no pulse within 10 s → start CPR <strong>15:2</strong>.</li><li>Compressions: lower half of sternum, one or two hands depending on size; rate 100–120/min; depth one-third AP diameter; minimise pauses.</li><li>As equipment arrives: attach monitoring and defibrillator/automated external defibrillator; deliver oxygen with BVM using two-person technique; obtain IV/IO access.</li><li>Shockable rhythm (VF/pVT): defibrillate 4 J/kg; adrenaline 10 micrograms/kg (0.1 mL/kg of 1:10,000) after the <em>third</em> shock and every alternate loop; amiodarone 5 mg/kg after the third shock.</li><li>Non-shockable rhythm (PEA/asystole): give <strong>adrenaline immediately</strong> (10 micrograms/kg) then every 4 minutes.</li><li>Treat reversible causes (4 Hs/4 Ts): hypoxia, hypovolaemia, hypo/hyperkalaemia & metabolic, hypothermia; tension pneumothorax, tamponade, toxins, thrombosis.</li><li>Post-ROSC: airway/ventilation, normoxia, normocapnia, normothermia, glucose control, treat cause, PICU involvement.</li></ul>",
"<strong>Exam takeaway:</strong> Child ≥1 year in arrest: after 5 rescue breaths, perform CPR at <strong>15:2</strong>; pinch the nose for mouth-to-mouth ventilations to ensure chest rise."
]
},
{
id: "EM-0180",
topic: "Emergency Medicine",
difficulty: "Easy",
vignetteTitle: "Clinical Vignette",
stem: "A 29-year-old man is brought to A&E after being punched in the face during a fight. He complains of periorbital swelling, double vision on looking up, and numbness of the cheek and upper lip on the affected side. Examination reveals periorbital ecchymosis, enophthalmos, and restriction of upward gaze of the left eye. Visual acuity is normal and pupils are equal and reactive. What is the most likely fractured bone?",
options: [
{ key: "A", text: "Maxilla" },
{ key: "B", text: "Frontal" },
{ key: "C", text: "Ethmoid" },
{ key: "D", text: "Mastoid" },
{ key: "E", text: "Sphenoid" }
],
correct: "A",
explanation_plabable: [
"This is an orbital blowout fracture.",
"The most common bone affected is the maxilla (orbital floor) followed by the ethmoid (medial wall). The diplopia on upward gaze is caused by impingement of the inferior rectus muscle."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> A blow to the orbit often fractures the <strong>orbital floor</strong> (maxilla) as it is the thinnest part and borders the maxillary sinus. Classical features include periorbital ecchymosis, <em>enophthalmos</em>, infraorbital numbness (V2), and <strong>vertical diplopia on up-gaze</strong> due to entrapment/impingement of the inferior rectus or inferior orbital tissues. Hence, the maxilla (orbital floor) is the most likely fractured bone.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>Frontal:</em> Involves the superior orbital rim and sinus; usually from high-energy frontal impacts and causes forehead/scalp injuries rather than enophthalmos/up-gaze diplopia.</li><li><em>Ethmoid:</em> Medial wall can fracture (lamina papyracea) but classically causes subcutaneous emphysema/epistaxis and diplopia on <em>lateral</em> gaze; floor fractures are more common.</li><li><em>Mastoid:</em> Part of temporal bone; not part of the orbit.</li><li><em>Sphenoid:</em> Deep skull base bone; fractures are uncommon in isolated orbital trauma and usually present with severe cranial nerve deficits.</li></ul>",
"<strong>Management/algorithm (ED, UK practice):</strong> <ul><li><strong>Assess ABCDE</strong>; check visual acuity, pupils (RAPD), ocular motility, globe integrity; exclude open globe (Seidel test if suspected) before manipulating.</li><li><strong>Avoid nose blowing</strong>; give <strong>oral antibiotics</strong> covering sinus flora (e.g., co-amoxiclav) if there is a communication with the maxillary sinus or fracture into a sinus; consider tetanus update.</li><li><strong>Imaging:</strong> Urgent <strong>CT orbits/facial bones</strong> to define floor/medial wall defects and muscle entrapment.</li><li><strong>Specialist referral:</strong> Early <strong>ophthalmology/OMFS</strong> input. <em>Urgent</em> surgery is indicated for: oculocardiac reflex/bradycardia with entrapment, ‘trapdoor’ fractures (especially children), persistent diplopia with positive forced-duction test, large floor defects (>50% or >2 cm²), or cosmetically significant enophthalmos (>2 mm).</li><li><strong>Supportive care:</strong> Ice packs, head elevation, analgesia, nasal decongestant for short course if needed. Most uncomplicated fractures are repaired electively within 1–2 weeks after oedema settles.</li></ul>",
"<strong>Pathophysiology:</strong> A blunt force increases intraorbital pressure causing the thin <strong>orbital floor</strong> to ‘blow out’ into the maxillary sinus. Herniation/entrapment of periorbital fat and/or the <strong>inferior rectus muscle</strong> produces impaired up-gaze and diplopia; disruption of the infraorbital nerve causes cheek/upper-lip paraesthesia; loss of orbital volume leads to enophthalmos.",
"<strong>Exam takeaway:</strong> Orbital trauma + enophthalmos and diplopia on up-gaze → think <strong>orbital floor (maxillary) blowout fracture</strong>; confirm with CT and involve ophthalmology/OMFS."
]
},
{
id: "EM-3560",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 42-year-old man presents to the Emergency Department after a motor vehicle accident. His right foot was trapped under a heavy lorry for an extended period before rescue. On arrival he is in severe pain, far out of proportion to visible injuries, and the foot is tense and markedly swollen with pale skin. Passive toe extension elicits significant pain. Dorsalis pedis pulse is <strong>absent</strong> and capillary refill is delayed. Vitals: BP 128/78 mmHg, HR 108 bpm, RR 22/min, SpO₂ 98% on air, Temp 37.1°C. What is the most likely diagnosis?",
options: [
{ key: "A", text: "Compartment syndrome" },
{ key: "B", text: "Rhabdomyolysis" },
{ key: "C", text: "Cellulitis" },
{ key: "D", text: "Stress fracture of the metatarsal" },
{ key: "E", text: "Fracture of the tibia and fibula" }
],
correct: "A",
explanation_plabable: [
"The diagnosis here is clearly compartment syndrome, given the history of prolonged limb compression. This compression leads to reduced blood flow to the muscles and tissues within the affected compartment. As a result, the muscles and nerves in the compartment can become deprived of oxygen and nutrients, causing severe pain that is often out of proportion to the visible injury. The reason the dorsalis pedis pulse is not felt is because arterial blood inflow is reduced when pressure exceeds systolic blood pressure.",
"While rhabdomyolysis can lead to muscle pain and weakness, it does not result in absent pulses or the pronounced swelling and pallor as seen in compartment syndrome."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> Prolonged crush injury with severe, escalating pain out of proportion, tense swollen compartment, pain on passive stretch and an <em>absent distal pulse</em> is classic for <strong>acute compartment syndrome</strong>. Rising intracompartmental pressure exceeds capillary perfusion pressure, leading to ischaemia and risk of irreversible neuro-muscular damage within hours. This is a <strong>surgical emergency</strong>; diagnosis is primarily clinical—do not delay treatment for imaging.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>Rhabdomyolysis:</em> May result from crush injury (↑CK, myoglobinuria) but does not itself cause a tense compartment or vascular compromise with absent pulses.</li><li><em>Cellulitis:</em> Typically erythematous, warm, tender skin with systemic features; pain is not classically out of proportion and compartments are not tense.</li><li><em>Stress fracture:</em> Insidious onset with activity-related pain, not acute crush trauma with neurovascular compromise.</li><li><em>Tibia/fibula fracture:</em> Could coexist, but the hallmark features (disproportionate pain, pain on passive stretch, tense swelling, pulse deficit) point to compartment syndrome requiring fasciotomy.</li></ul>",
"<strong>Management/algorithm (UK ED/orthopaedics):</strong> <ul><li><strong>Immediate actions:</strong> Call orthopaedics urgently; remove all constrictive dressings/splints, cut casts to skin, and place limb at <strong>heart level</strong> (avoid elevation which reduces perfusion; avoid dependency which increases oedema).</li><li><strong>Analgesia & resus:</strong> High-flow oxygen if needed, IV opioids, establish IV access; start IV fluids especially if crush injury/rhabdomyolysis risk.</li><li><strong>Assessment:</strong> Repeated neurovascular checks (pain, paraesthesia, pallor, paralysis, pulses—late sign). If diagnosis uncertain and expertise available, measure intracompartmental pressure; threshold commonly used is <em>ΔP</em> (diastolic BP − compartment pressure) ≤30 mmHg. <em>Do not</em> delay theatre if clinical suspicion is high.</li><li><strong>Definitive treatment:</strong> <strong>Urgent decompressive fasciotomy</strong> (all involved compartments) ideally within 1–2 hours of recognition.</li><li><strong>Peri-/post-op care:</strong> Aggressive IV fluids to prevent kidney injury from myoglobin; monitor U&E, CK; urine output target >1 mL/kg/h; consider alkalinisation if significant rhabdomyolysis; tetanus prophylaxis and antibiotics if open wounds.</li><li><strong>Complications to anticipate:</strong> Nerve/muscle necrosis, contractures, infection, renal failure from rhabdomyolysis, and chronic pain.</li></ul>",
"<strong>Pathophysiology (high-yield):</strong> Trauma/crush → bleeding/oedema within a non-compliant fascial compartment → exponential rise in tissue pressure → collapse of venous outflow then arteriolar inflow → ischaemia → pain out of proportion and pain on passive stretch; prolonged ischaemia (>6 hours) leads to irreversible necrosis and neuropathy. Pulses are a <em>late</em> sign; their absence indicates critical arterial compromise.",
"<strong>Exam takeaway:</strong> Crush injury + severe pain out of proportion + tense compartment + pain on passive stretch = <strong>acute compartment syndrome</strong>. Call orthopaedics and proceed to <strong>emergency fasciotomy</strong>; do not delay for imaging."
]
},
{
id: "EM-4420",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 45-year-old man is admitted following a generalised tonic–clonic seizure. He has alcohol dependence and is undergoing alcohol withdrawal on the ward with regular <strong>lorazepam</strong>. On day 2 he is found drowsy with shallow breathing. Vitals: BP 118/70 mmHg, HR 86 bpm, RR <strong>8/min</strong>, SpO₂ <strong>90% on air</strong>, Temp 36.7°C. He is unresponsive to voice but withdraws to pain; pupils are equal and reactive; capillary glucose is 6.0 mmol/L. There is no evidence of head injury or opioid medication charted. What is the most appropriate next step in management?",
options: [
{ key: "A", text: "Atropine" },
{ key: "B", text: "Adrenaline" },
{ key: "C", text: "Flumazenil" },
{ key: "D", text: "Naloxone" },
{ key: "E", text: "Thiamine" }
],
correct: "C",
explanation_plabable: [
"Flumazenil is a benzodiazepine antagonist used to reverse the effects of benzodiazepines, such as lorazepam, in cases of overdose or excessive sedation. It is particularly indicated when there is evidence of respiratory depression or reduced consciousness; as in this case."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The patient has reduced consciousness with <strong>respiratory depression</strong> and a clear iatrogenic trigger (regular lorazepam). After basic airway support and oxygen, <strong>IV flumazenil</strong> is the specific antidote for benzodiazepine-induced sedation: give 200 micrograms IV over 15 seconds, then 100 micrograms every minute to a usual maximum of 1 mg until the airway and ventilation improve. Onset is within 1–2 minutes. Because flumazenil’s half-life is shorter than most benzodiazepines, monitor for <em>re-sedation</em> and repeat small doses if needed.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>Atropine:</em> Used for symptomatic bradycardia; does not reverse sedative respiratory depression.</li><li><em>Adrenaline:</em> For anaphylaxis/cardiac arrest; inappropriate here.</li><li><em>Naloxone:</em> Antidote for opioid toxicity; there is no opioid exposure and pupils are not pinpoint.</li><li><em>Thiamine:</em> Important in alcohol misuse to prevent Wernicke’s, but will not reverse acute benzodiazepine-induced hypoventilation.</li></ul>",
"<strong>Management/algorithm (NHS/UK practice):</strong> <ul><li><strong>Immediate ABCDE:</strong> Jaw thrust, airway adjunct if needed, high-flow oxygen to target SpO₂ 94–98%, call for help, continuous monitoring (ECG, SpO₂, NIBP, capnography if available).</li><li><strong>Check reversible causes:</strong> Capillary glucose (already normal), review drug chart and PRNs, consider venous blood gas.</li><li><strong>Antidote:</strong> If strong evidence of benzodiazepine toxicity without contraindications, titrate <strong>flumazenil</strong> as above. <em>Use with caution</em> if there is a history of chronic benzodiazepine use, seizure disorder, or suspected mixed overdose (especially tricyclics) due to seizure risk.</li><li><strong>Supportive care:</strong> If inadequate response, provide assisted ventilation with bag–valve–mask and escalate to anaesthetics for possible intubation/critical care admission.</li><li><strong>Observation:</strong> Monitor for re-sedation for several hours; repeat small flumazenil boluses if necessary; document neurological status and respiratory rate.</li><li><strong>Alcohol care:</strong> Continue thiamine prophylaxis and manage alcohol withdrawal once the airway is safe.</li></ul>",
"<strong>Pathophysiology (high yield):</strong> Benzodiazepines enhance <em>GABA<sub>A</sub></em> receptor activity → CNS depression with reduced arousal and hypoventilation at high doses. <strong>Flumazenil</strong> is a competitive antagonist at the benzodiazepine binding site, rapidly reversing sedation but potentially unmasking seizures in dependent patients or mixed overdoses.",
"<strong>Exam takeaway:</strong> Suspected benzodiazepine-induced respiratory depression → support airway/oxygen, then <strong>titrate IV flumazenil</strong> if no contraindications; monitor closely for re-sedation and seizures."
]
},
{
id: "EM-1256",
topic: "Emergency Medicine",
difficulty: "Easy",
vignetteTitle: "Clinical Vignette",
stem: "A 38-year-old man develops hoarse voice, stridor and wheeze minutes after eating a nut-containing dessert in a restaurant. Paramedics arrive to find him anxious and flushed with generalised urticaria. Vitals: HR <strong>120 bpm</strong>, BP <strong>80/60 mmHg</strong>, RR 28/min, SpO₂ 93% on air. He is struggling to breathe and has cool peripheries. Anaphylaxis is suspected. What is the SINGLE most appropriate route of administration of adrenaline in this case?",
options: [
{ key: "A", text: "Orally" },
{ key: "B", text: "Intravenously" },
{ key: "C", text: "Subcutaneously" },
{ key: "D", text: "Intraosseously" },
{ key: "E", text: "Intramuscularly" }
],
correct: "E",
explanation_plabable: [
"In cases of anaphylaxis, adrenaline is given intramuscularly as it is seen superior to the subcutaneous route.",
"Intravenous adrenaline can be dangerous and should only be used in certain specialist settings with someone very skilled and experienced its used.",
"Further reading:",
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> This patient meets criteria for anaphylaxis (sudden exposure to likely allergen + airway/respiratory compromise and hypotension). UK practice is to give <strong>IM adrenaline 1 mg/mL (1:1000)</strong> into the mid anterolateral thigh as first-line because it has rapid, reliable absorption and a better safety profile than IV. Adult dose is <strong>0.5 mg (0.5 mL)</strong>, repeat every <strong>5 minutes</strong> if no improvement. Adrenaline reverses laryngeal oedema (α1), bronchospasm (β2) and supports circulation (α1/β1).",
"<strong>Why the other options are wrong:</strong> <ul><li><em>Oral:</em> Ineffective; adrenaline is not absorbed predictably and is rapidly metabolised.</li><li><em>Intravenous:</em> Risk of arrhythmias and hypertensive crisis if bolused; reserved for <strong>refractory anaphylaxis</strong> as a controlled infusion with critical care/anaesthetic support.</li><li><em>Subcutaneous:</em> Slower, less reliable uptake in shock due to cutaneous vasoconstriction; inferior to IM thigh.</li><li><em>Intraosseous:</em> A vascular access route (used in arrest) not the recommended route for adrenaline in anaphylaxis; treatment remains IM first.</li></ul>",
"<strong>Management/algorithm (NHS/Resuscitation Council UK aligned):</strong> <ul><li>Call for help; <strong>IM adrenaline 0.5 mg</strong> (anterolateral thigh) immediately; repeat every 5 min if needed.</li><li>Position: lie flat with legs elevated (or sitting if severe dyspnoea). High-flow oxygen; remove allergen if present.</li><li>Establish IV access; give rapid <strong>crystalloid 500–1000 mL</strong> if hypotensive; monitor ECG, SpO₂, BP.</li><li>Adjuncts after adrenaline: nebulised bronchodilator for bronchospasm; <em>antihistamines for skin symptoms only</em>; <em>steroids not routine</em>—consider only in refractory reactions after senior review.</li><li>Poor response after 2 IM doses → senior/critical care review for <strong>adrenaline infusion</strong>; consider glucagon if on β-blockers.</li><li>Send acute serum tryptase if feasible; observe at least <strong>6–12 hours</strong> (longer if severe/recurrent doses needed).</li><li>On discharge: provide <strong>two adrenaline auto-injectors</strong>, written emergency plan, trigger avoidance advice, and urgent allergy clinic referral.</li></ul>",
"<strong>Exam takeaway:</strong> Suspected anaphylaxis → <strong>IM adrenaline in the thigh immediately</strong>; never delay for IV access or antihistamines. IV adrenaline is specialist-only for refractory cases."
]
},
{
id: "EM-4311",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 49-year-old woman presents to the Emergency Department with 3 days of productive cough of green sputum, pleuritic chest pain and fever. She looks unwell and clammy. Exam: bronchial breathing at the right base. Vitals: RR <strong>27/min</strong>, SpO₂ <strong>90% on air</strong>, HR <strong>130 bpm</strong>, BP <strong>85/40 mmHg</strong>, Temp 38.6°C. What is the SINGLE next most appropriate action?",
options: [
{ key: "A", text: "Intravenous fluids" },
{ key: "B", text: "Oral antibiotics" },
{ key: "C", text: "Chest X-ray" },
{ key: "D", text: "Intramuscular adrenaline" },
{ key: "E", text: "Sputum culture" }
],
correct: "A",
explanation_plabable: [
"Her observations are extremely alarming and would raise red flags. She is clearly septic from a pneumonia.",
"Sepsis six would need to be performed urgently within the hour. Among the sepsis six is to give intravenous fluids.Oral antibiotics would be inappropriate.",
"We need a broad spectrum antibiotic in the bloodstream as soon as possible thus it needs to be given intravenously,Chest X-ray would need to be perform but can be done after performing the sepsis six and stabilising the patient."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> She has septic shock physiology (hypotension 85/40 mmHg, tachycardia, tachypnoea, hypoxia) with a likely source of pneumonia. The immediate priority is <strong>resuscitation with IV isotonic crystalloid</strong> to restore perfusion while initiating the rest of the Sepsis Six. A 500 mL bolus of 0.9% saline (or balanced crystalloid) should be given rapidly and repeated to response, while monitoring for fluid overload.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>Oral antibiotics:</em> Too slow and unreliable absorption in shock; give <strong>IV broad-spectrum antibiotics within 1 hour</strong> after cultures.</li><li><em>Chest X-ray:</em> Useful to confirm pneumonia but must not delay immediate resuscitation (fluids/antibiotics/oxygen).</li><li><em>IM adrenaline:</em> Indicated for anaphylaxis, not sepsis.</li><li><em>Sputum culture:</em> Lower priority than blood cultures and haemodynamic stabilisation; can be obtained after initial resuscitation.</li></ul>",
"<strong>Management/algorithm (UK Sepsis Six/NICE aligned):</strong> <ul><li><strong>Within 1 hour:</strong> 1) Give <strong>high-flow oxygen</strong> to target SpO₂ 94–98% (88–92% if risk of hypercapnic failure). 2) <strong>Take blood cultures</strong> (before antibiotics if no delay). 3) <strong>Give IV broad-spectrum antibiotics</strong> per local policy (e.g., piperacillin–tazobactam or co-amoxiclav + macrolide if severe CAP). 4) <strong>Give IV fluids</strong> – 500 mL bolus crystalloids; reassess BP, pulse, mentation, urine output; repeat as needed. 5) <strong>Measure serum lactate</strong> and VBG. 6) <strong>Monitor urine output</strong> (consider catheterisation).</li><li>If hypotension persists after adequate fluids or lactate ≥4 mmol/L → <strong>urgent senior/ICU review</strong> for vasopressors (norepinephrine) to maintain MAP ≥65 mmHg.</li><li>Once stabilised: obtain <strong>chest X-ray</strong>, sputum cultures, and other source-specific tests; start VTE prophylaxis and review antimicrobials with results/clinical course.</li></ul>",
"<strong>Exam takeaway:</strong> Septic patient with hypotension and likely pneumonia → <strong>start Sepsis Six now</strong>. First act is IV crystalloid resuscitation while arranging IV antibiotics, cultures, lactate and monitoring—do not delay for imaging."
]
},
{
id: "EM-1750",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 56-year-old man is brought to A&E after falling down a flight of stairs at home. He landed on his back and now complains of severe midline neck pain and paraesthesia in both hands. He is conscious but appears distressed. Primary survey shows airway patent, equal chest rise and clear breath sounds, RR 24/min, SpO₂ 92% on air, HR 104 bpm, BP 138/82 mmHg. On examination there is marked midline cervical spine tenderness. No other life-threatening injuries are evident. What is the most appropriate initial management?",
options: [
{ key: "A", text: "Cervical spine immobilisation" },
{ key: "B", text: "High-flow oxygen" },
{ key: "C", text: "Immediate CT scan of the cervical spine" },
{ key: "D", text: "Intravenous fluids" },
{ key: "E", text: "Urgent referral to neurosurgery" }
],
correct: "A",
explanation_plabable: [
"The most appropriate initial management for a patient with suspected cervical spine injury, especially with signs such as cervical spine tenderness and paraesthesia, is cervical spine immobilisation. The main goal is to prevent any further spinal cord injury until more definitive imaging and evaluation can be performed. This involves immobilising the cervical spine using a hard collar and other methods, such as head blocks or manual stabilisation, if necessary, to keep the neck stable.",
"High-flow oxygen is not the first priority here. His oxygen saturation is 92% on room air which indicate mild hypoxaemia.",
"In trauma management, the principles of ABC (Airway, Breathing, Circulation) are indeed prioritised. However, in the case of suspected cervical spine injury, immobilisation is a crucial consideration that occurs simultaneously with airway and breathing management to prevent secondary spinal cord injury. If a patient has signs of hypoxaemia (e.g., oxygen saturation of 92%), providing supplemental oxygen is necessary as part of managing breathing. However, cervical spine immobilisation should be initiated at the same time to ensure that any potential spinal cord damage is minimised. In this particular case, given he only has mild hypoxaemia, the priority goes towards cervical spine immobilisation.",
"In practice, immobilisation is part of the trauma care protocol and is initiated as soon as possible, often even before transport to the hospital."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> Significant mechanism (fall down stairs) + <strong>midline cervical tenderness</strong> and <strong>neurological symptoms</strong> (paraesthesia) = suspected cervical spine injury. The time-critical priority is to <strong>prevent secondary spinal cord damage</strong> by <em>immediate in-line immobilisation</em> (manual stabilisation → hard collar + head blocks and tape). Imaging and definitive decisions come <em>after</em> stabilisation. His oxygen saturation is only mildly low and can be addressed concurrently once the neck is stabilised.",
"<strong>Why the other options are wrong:</strong> <ul><li><em>High-flow oxygen:</em> Oxygenation is important but must be delivered with the neck maintained in neutral alignment; it does not by itself protect the cord from movement-related injury.</li><li><em>Immediate CT cervical spine:</em> Needed soon, but scanning should follow initial immobilisation and ABC measures; do not move an unstable neck for imaging before it is secured.</li><li><em>Intravenous fluids:</em> Not indicated without shock; unnecessary fluids risk haemodilution and do not address the immediate risk of cord injury.</li><li><em>Urgent neurosurgery referral:</em> Consult will be required if imaging shows instability/cord compression, but <strong>first</strong> protect the cord with immobilisation.</li></ul>",
"<strong>Management/algorithm (UK trauma—NICE/RCEM aligned):</strong> <ul><li><strong>At scene/arrival:</strong> Manual in-line stabilisation → hard collar + head blocks/tape; keep the neck in neutral. Avoid repeated log-rolling.</li><li><strong>Primary survey (ABCDE) with spine precautions:</strong> Airway with jaw thrust, oxygen to target SpO₂ 94–98% while maintaining immobilisation; treat life-threats.</li><li><strong>Neurological assessment:</strong> GCS, pupils, motor/sensory exam in limbs; document deficits.</li><li><strong>Decision to image:</strong> Use Canadian C-Spine Rule/NICE criteria. Indications for CT within 1 hour include: any focal neurology, dangerous mechanism, age ≥65, midline tenderness, or inability to actively rotate neck 45°.</li><li><strong>During imaging/transfer:</strong> Maintain immobilisation and minimise movement; consider analgesia and antiemetics.</li><li><strong>After CT:</strong> If normal and low clinical suspicion → consider collar removal after senior review. If fracture/instability/cord compression → keep immobilised, involve spinal/neurosurgical team urgently.</li></ul>",
"<strong>Exam takeaway:</strong> Suspected cervical spine injury = <strong>immobilise first</strong> (manual in-line, collar, blocks and tape). Imaging and referrals follow once the neck is secured and ABC is underway."
]
},
{
id: "EM-1017",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 26 year old man presents to the Emergency Department with the complaint of a 24 hour history of epigastric pain and haematemesis. He had ingested an unknown drug four days ago, but he cannot remember the name of the drug or the amount of the drug that he took at the time because he had been drunk. He has no past medical history of note and takes no chronic medication. He indulges in social drinking occasionally. Blood tests were done, and the results are as follows:<br/><br/>Creatinine <strong>230 µmol/L (70-150 µmol/L)</strong><br/>Bilirubin <strong>20 µmol/L (3-17 µmol/L)</strong><br/>Alanine transaminase (ALT) <strong>1880 U/L (5-35 U/L)</strong><br/>Aspartate transaminase (AST) <strong>3510 U/L (5-35 U/L)</strong><br/>Alkaline phosphatase (ALP) <strong>215 U/L (30-150 U/L)</strong><br/>Gamma glutamyl transferase (GGT) <strong>80 U/L (8-60 U/L)</strong><br/>Prothrombin time (PT) <strong>20 seconds (10-14 seconds)</strong><br/><br/>He has a pulse rate of 128 beats/minute, blood pressure of 100/60 mmHg, respiratory rate of 25 breaths/minute and a temperature of 37.1°C. What SINGLE most likely drug did this patient ingest?",
options: [
{ key: "A", text: "Amitriptyline" },
{ key: "B", text: "Aspirin" },
{ key: "C", text: "Paracetamol" },
{ key: "D", text: "Venlafaxine" },
{ key: "E", text: "Organophosphates" }
],
correct: "C",
explanation_plabable: [
"The raised level of serum creatinine, bilirubin, liver enzymes as well as the increased prothrombin time indicates that this patient has taken an overdose of paracetamol. Paracetamol is an antipyretic and analgesic. Patients are usually asymptomatic for the first 24 hours but later nonspecific abdominal symptoms. Hepatic necrosis begins to develop after 24 hours and can progress to acute liver failure. The liver damage is usually not detectable by routine liver function test until at least 18 hours after ingestion of paracetamol. Alanine transferase (ALT), prothrombin time usually peak 72 to 96 hours after ingestion. In the United Kingdom, paracetamol can be purchased over the counter; however, it is government legislation that it is not to be sold in excess of 16 tablets at a time. For an average person, 24 tablets usually constitute an overdose.",
"The other answers are less likely.",
"Amitriptyline is a tricyclic antidepressant. TCA’s taken in large amounts can cause excessive sedation, sympathomimetic effects (tachycardia, sweating, dilated pupils).",
"Aspirin is a potent antiplatelet agent as well as an antipyretic, analgesic and anti-inflammatory agent. An overdose of aspirin causes ringing in the ears, nausea, abdominal pain, and tachypnoea.",
"Venlafaxine is a type of antidepressant of the selective serotonin-norepinephrine reuptake inhibitors (SNRI) class often used to treat depression, anxiety and panic attacks. Most patients overdosing with venlafaxine develop only mild symptoms of feeling tired, palpitations and vomiting. They rarely cause death.",
"Organophosphates are usually the active ingredient in insecticides. Symptoms include increased saliva and tear production, diarrhoea, vomiting, small pupils, sweating, muscle tremors, and confusion."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The laboratory results show severe hepatocellular injury: markedly elevated ALT (1880 U/L) and AST (3510 U/L), prolonged prothrombin time (20s), and rising creatinine suggesting multi-organ involvement (hepatorenal syndrome). This pattern is characteristic of <strong>paracetamol toxicity</strong>. Paracetamol overdose depletes hepatic glutathione, allowing toxic NAPQI accumulation, causing centrilobular necrosis. Clinical course is typically: asymptomatic for 24h, followed by abdominal pain and deranged LFTs, then acute liver failure within 72–96h.",
"<strong>Pathophysiology:</strong> Paracetamol is metabolised in the liver. In overdose, glucuronidation/sulfation pathways saturate, forcing metabolism via cytochrome P450 to toxic NAPQI. Normally detoxified by glutathione, but depletion results in hepatocellular necrosis. Renal injury and metabolic acidosis may also ensue.",
"<strong>Differential diagnoses:</strong> <ul><li>Amitriptyline overdose — presents with anticholinergic features (dilated pupils, tachycardia, seizures, arrhythmias), not isolated hepatotoxicity.</li><li>Aspirin toxicity — causes tinnitus, metabolic acidosis/respiratory alkalosis, GI upset, hyperthermia, not massive transaminitis.</li><li>Venlafaxine — can cause CNS/serotonergic symptoms, arrhythmias, seizures, but not hepatotoxicity.</li><li>Organophosphates — cause cholinergic crisis (salivation, diarrhoea, miosis, bronchorrhoea), not isolated liver injury.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li>Amitriptyline: no arrhythmia or CNS depression described.</li><li>Aspirin: no tinnitus, acid-base disturbance, or hyperventilation explained by aspirin poisoning.</li><li>Venlafaxine: would not explain severe LFT derangement.</li><li>Organophosphates: classic cholinergic toxidrome absent here.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li>Immediate: check timing/amount of ingestion, obtain plasma paracetamol level (nomogram if within 24h).</li><li>Start <strong>N-acetylcysteine (NAC)</strong> immediately if >8h since ingestion or if level above treatment line. NAC replenishes glutathione, preventing further hepatic injury.</li><li>Supportive care: IV fluids, correct hypoglycaemia, monitor INR, renal function, acid-base status.</li><li>Refer early to liver unit if INR > 6.5, creatinine elevated, encephalopathy develops, or acidosis persists.</li></ul>",
"<strong>Guideline cues:</strong> According to Resuscitation Council UK and TOXBASE guidance, NAC is indicated if plasma level is above treatment threshold or if ingestion time uncertain and patient symptomatic with deranged LFTs.",
"<strong>Common pitfalls:</strong> <ul><li>Relying on normal early LFTs — hepatotoxicity often delayed until 18–24h.</li><li>Delaying NAC while waiting for levels — give empirically if >8h post-ingestion.</li><li>Assuming OTC paracetamol is benign — 24 tablets can be lethal.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Severe transaminitis + prolonged PT after overdose strongly indicates paracetamol toxicity; NAC is life-saving if given promptly.</em>"
]
},
{
id: "EM-0500",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 48 year old man has been having diarrhoea, vomiting and mild abdominal pain for the past 4 days. He was brought to the Emergency Department by his wife as he was disoriented in the morning. His blood pressure is 110/75 mmHg and his heart rate is 89 beats/minute. His temperature is 37.9°C. His blood test show the following:<br/><br/>Haemoglobin <strong>144 g/l (130-180)</strong><br/>White cell count <strong>18 x 10^9/L (4-11)</strong><br/>Platelets <strong>325 x 10^9/L (150-400)</strong><br/>Serum urea <strong>11.5 mmol/L (2.0-7.0)</strong><br/>Serum creatinine <strong>185 µmol/L (70-150)</strong><br/>Serum calcium <strong>2.51 mmol/l (2.1-2.6)</strong><br/>eGFR <strong>60 ml/min</strong><br/>Sodium <strong>124 mmol/L (135-145)</strong><br/>Potassium <strong>3.6 mmol/L (3.5-5.0)</strong><br/>Glucose (fasting) <strong>3.6 mmol/L (3.5-5.5)</strong><br/><br/>What is the SINGLE most appropriate solution to be administered intravenously?",
options: [
{ key: "A", text: "0.45% sodium chloride" },
{ key: "B", text: "0.9% sodium chloride" },
{ key: "C", text: "3% sodium chloride" },
{ key: "D", text: "0.45% sodium chloride and 0.15% potassium chloride" },
{ key: "E", text: "Mannitol" }
],
correct: "B",
explanation_plabable: [
"This man likely has an episode of gastroenteritis. His sodium levels have decreased likely because he over replaced fluid by drinking water.",
"Patients who present with hyponatraemia due to acute vomiting and diarrhoea can be given intravenous normal saline (0.9% sodium chloride). Care should be taken to correct serum sodium levels slowly to avoid cerebral oedema. In general, the more acute the change of hyponatraemia, the quicker one can correct it. If there is chronic hyponatraemia or if the time of developing this hyponatraemia is unclear, then it is best to correct it slowly.",
"Hypertonic saline is rarely used. There are situations where one would use hypertonic saline to raise the sodium rapidly such as patients who are seizing or in a coma. This is usually senior led and would not be expected at your level."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The presentation (4 days of vomiting/diarrhoea, mild fever, tachypnoea absent, normal glucose) with <strong>Na 124 mmol/L</strong>, elevated urea/creatinine and clinical disorientation is most consistent with <em>hypovolaemic hyponatraemia</em> from GI losses and excess free-water intake. The definitive initial treatment is <strong>0.9% sodium chloride</strong> to restore intravascular volume, suppress non-osmotic ADH and safely raise serum sodium.",
"<strong>Core pathophysiology/mechanism:</strong> GI fluid loss depletes sodium and water → reduced effective circulating volume → baroreceptor-driven ADH secretion → renal free-water retention and dilutional hyponatraemia. Isotonic saline corrects ECV; as volume restores, ADH falls and kidneys excrete excess free water, normalising sodium gradually.",
"<strong>Differential diagnoses:</strong> <ul><li><strong>SIADH (euvolaemic)</strong>: would have low urea/creatinine and no overt volume loss; often due to drugs/CNS/pulmonary disease.</li><li><strong>Hyperglycaemia-induced dilution</strong>: glucose is normal (3.6 mmol/L), so not the cause.</li><li><strong>Oedematous states</strong> (HF/cirrhosis/nephrotic): peripheral oedema/ascites history absent.</li><li><strong>Primary polydipsia</strong>: usually psychiatric/excess water without marked urea rise.</li><li><strong>Adrenal insufficiency</strong>: often hyperkalaemia/hypotension/tan; potassium is normal.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>A. 0.45% sodium chloride</strong> is hypotonic and can worsen hyponatraemia and cerebral oedema.</li><li><strong>C. 3% sodium chloride</strong> is reserved for <em>severe symptomatic</em> hyponatraemia (e.g., seizures, coma) aiming for an initial 4–6 mmol/L rise; not indicated here.</li><li><strong>D. 0.45% NaCl + 0.15% KCl</strong> remains hypotonic; adding K⁺ risks rapid shifts and arrhythmia without indication.</li><li><strong>E. Mannitol</strong> is an osmotic diuretic used for raised ICP; it would aggravate volume depletion and sodium derangement.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li>Place on monitors; assess volume status. If shocked, give <strong>0.9% saline 500 mL</strong> bolus over 10–15 min; repeat as needed while reassessing.</li><li>If not shocked but hypovolaemic, start <strong>0.9% saline 1 L</strong> over 1–2 h, then continue as guided by vitals, urine output and sodium trend.</li><li>Aim sodium correction <strong>≤10 mmol/L in 24 h</strong> (prefer 6–8) and <strong>≤18 mmol/L in 48 h</strong> to avoid osmotic demyelination.</li><li>Check serum/urine osmolality and urine sodium if aetiology uncertain; monitor U&E and sodium <strong>every 4–6 h</strong> initially.</li><li>Treat cause: antiemetics, oral rehydration when able; avoid hypotonic fluids.</li><li>If severe neurologic symptoms develop, give <strong>3% hypertonic saline 150 mL</strong> over 15–20 min, repeat up to 2–3 times under senior supervision to achieve a 4–6 mmol/L rise, then resume isotonic therapy.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> A–E assessment, oxygen if SpO₂ < 94%, cardiac monitoring, IV access ×2, bedside glucose.</li><li><strong>1–3 min:</strong> If hypotensive or shocked, give <strong>0.9% NaCl 500 mL</strong> stat; send bloods (FBC, U&E, osmolality, LFTs, CRP), venous gas (lactate), urine dip.</li><li><strong>3–10 min:</strong> Start maintenance/deficit replacement with <strong>0.9% NaCl</strong>; strict input–output and urine output target >0.5 mL/kg/h.</li><li><strong>10–30 min:</strong> Recheck vitals; review labs. If sodium rising >1–2 mmol/L/h, slow infusion. Address nausea with ondansetron 4 mg IV.</li><li><strong>30–60 min:</strong> Repeat sodium at 4–6 h. Consider admission for ongoing IV fluids and monitoring; escalate to senior if confusion worsens or seizures occur (then use 3% saline bolus as above).</li><li><strong>Disposition:</strong> Admit under acute medicine; discharge only when euvolaemic, sodium stable, symptoms resolved and clear oral plan given.</li></ul>",
"<strong>Guideline cues:</strong> UK/European guidance (RCEM/ESE) recommends <strong>isotonic saline</strong> for hypovolaemic hyponatraemia, cautious correction limits (≤10 mmol/L in 24 h), and hypertonic saline only for severe neurologic symptoms under senior oversight.",
"<strong>Common pitfalls:</strong> <ul><li>Using hypotonic fluids (0.45% NaCl) in hypovolaemic hyponatraemia.</li><li>Correcting sodium too quickly — risk of <em>osmotic demyelination</em>.</li><li>Forgetting to treat the underlying GI fluid loss and to monitor sodium frequently.</li></ul>",
"<strong>Exam takeaway:</strong> Vomiting/diarrhoea + low Na⁺ = <em>hypovolaemic hyponatraemia</em> → resuscitate with <strong>0.9% sodium chloride</strong>; correct slowly and monitor closely."
]
},
{
id: "EM-0505",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 32 year old man is brought to A&E by his wife with symptoms of chest pain, abdominal pain, palpitations, tinnitus, nausea and altered mental status. His wife says that she found a bottle of empty medication on the toilet floor and it is likely that he consumed the whole bottle. He has a respiratory rate of 34 breaths/minute. His arterial blood gas shows the following:<br/><br/>pH <strong>7.31 (7.35–7.45)</strong><br/>PaO₂ <strong>13 kPa (10–14 kPa)</strong><br/>PaCO₂ <strong>3.0 kPa (4.7–6.0)</strong><br/>Bicarbonate <strong>18 mmol/L (22–26)</strong><br/><br/>His blood results show the following:<br/><br/>Haemoglobin <strong>133 g/L (130–180)</strong><br/>White cell count <strong>8 × 10⁹/L (4–11)</strong><br/>Platelets <strong>350 × 10⁹/L (150–400)</strong><br/>Sodium <strong>137 mmol/L (135–145)</strong><br/>Potassium <strong>4.1 mmol/L (3.5–5.0)</strong><br/>Creatinine <strong>80 µmol/L (70–150)</strong><br/>eGFR <strong>>90 mL/min</strong><br/><br/>His ECG shows sinus rhythm with a rate of 95 beats/minute. What is the SINGLE most likely medication that he could have taken?",
options: [
{ key: "A", text: "Paracetamol" },
{ key: "B", text: "Aspirin" },
{ key: "C", text: "Propranolol" },
{ key: "D", text: "Enalapril" },
{ key: "E", text: "Diazepam" }
],
correct: "B",
explanation_plabable: [
"Remember:<br/>• If bicarbonates are low → Think metabolic acidosis (or renal compensation for a respiratory alkalosis).<br/>• If PaCO₂ is low → Think respiratory alkalosis (or respiratory compensation for a metabolic acidosis).",
"This is likely from aspirin poisoning. With aspirin overdose, they initially hyperventilate leading to respiratory alkalosis. The initial phase could last up to 12 hours. Following that, progressive metabolic acidosis occurs. This usually occurs around the 24 hour mark after ingestion for adults.",
"A mixed respiratory alkalosis and metabolic acidosis is a common acid–base finding in patients with aspirin overdose.",
"One of the main features of aspirin overdose which you do not see commonly with the other medications is tinnitus (seen in the stem). This feature should prompt you to pick aspirin over the other options.",
"Paracetamol overdose may also cause metabolic acidosis but toxicity does not cause tinnitus. Furthermore, aspirin overdose is a more recognised cause of metabolic acidosis compared to paracetamol.",
"Propranolol overdose does not cause tinnitus. Tachycardia (seen in the stem) is also not typical of a β-blocker overdose. One would expect either bradycardia or a heart block.",
"Overdose of ACE inhibitors like enalapril can cause metabolic acidosis but one of the main features of ACE inhibitor overdose is hyperkalaemia which is not seen in this stem. Tinnitus is also not a recognised feature of ACE inhibitor overdose.",
"Overdose of benzodiazepines would cause respiratory depression and respiratory acidosis.",
"If suspecting metabolic acidosis do a blood gas. A metabolic acidosis picture with an increased anion gap can be due to several drugs. Common ones are listed here: Metformin, Alcohol, Isoniazid."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The patient’s symptoms of tinnitus, abdominal pain, hyperventilation, altered mental status, plus ABG showing <strong>low PaCO₂ (respiratory alkalosis)</strong> and <strong>low bicarbonate (metabolic acidosis)</strong> indicates a mixed respiratory alkalosis + metabolic acidosis — classic for <strong>salicylate (aspirin) overdose</strong>. The GI upset and confusion support this diagnosis.",
"<strong>Core pathophysiology/mechanism:</strong> Salicylates stimulate the medullary respiratory centre → hyperventilation → respiratory alkalosis. They also uncouple oxidative phosphorylation → lactic acidosis and ketoacidosis → metabolic acidosis. This dual process explains the mixed ABG picture.",
"<strong>Differential diagnoses:</strong> <ul><li><em>Paracetamol overdose</em>: hepatotoxicity with deranged LFTs, not tinnitus or hyperventilation.</li><li><em>Propranolol overdose</em>: bradycardia, hypotension, hypoglycaemia, not tachypnoea or tinnitus.</li><li><em>Enalapril overdose</em>: hyperkalaemia, hypotension, renal impairment, not tinnitus or mixed ABG.</li><li><em>Diazepam overdose</em>: CNS depression, hypoventilation (respiratory acidosis), not alkalosis.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li>Paracetamol: metabolic acidosis late, but no tinnitus or respiratory alkalosis.</li><li>Propranolol: expect bradycardia, not tachycardia.</li><li>Enalapril: would show hyperkalaemia, absent here.</li><li>Diazepam: depresses respiration, not stimulates hyperventilation.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li>Immediate: A–E assessment, cardiac monitoring, IV access, oxygen, check paracetamol/salicylate levels urgently.</li><li><strong>Activated charcoal</strong> if ingestion within 1 hour (50 g orally/NG).</li><li><strong>IV sodium bicarbonate</strong> infusion (e.g., 1.26% or 8.4% boluses followed by infusion) to alkalinise urine and plasma, enhancing salicylate excretion.</li><li>Monitor pH, potassium, glucose, salicylate levels 2–4 hourly.</li><li>Correct hypoglycaemia aggressively with IV dextrose.</li><li><strong>Haemodialysis</strong> if severe poisoning: salicylate level > 700 mg/L, renal failure, pulmonary oedema, severe acidosis, or altered mental status refractory to therapy.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Primary survey (A–E), high-flow oxygen, continuous monitoring, IV access ×2, bedside glucose.</li><li><strong>1–3 min:</strong> Take bloods (U&E, LFTs, coag, glucose, ABG, salicylate & paracetamol levels), insert NG tube if safe.</li><li><strong>3–10 min:</strong> Administer activated charcoal if within 1 h of ingestion. Give IV fluids; start sodium bicarbonate bolus if symptomatic/metabolic acidosis present.</li><li><strong>10–30 min:</strong> Recheck ABG; titrate sodium bicarbonate infusion to maintain urine pH 7.5–8.0. Correct potassium to keep >3.5 mmol/L (as hypokalaemia reduces bicarbonate efficacy).</li><li><strong>30–60 min:</strong> Monitor neurological status, repeat salicylate levels, prepare for possible dialysis if deterioration or high levels.</li><li><strong>Disposition:</strong> Admit to HDU/ICU; liaise with toxicology/renal for dialysis if indicated. Do not discharge until asymptomatic, salicylate levels falling and safe follow-up ensured.</li></ul>",
"<strong>Guideline cues:</strong> TOXBASE/RCEM guidance emphasises early bicarbonate therapy, potassium correction, and low threshold for dialysis in severe salicylate poisoning.",
"<strong>Common pitfalls:</strong> <ul><li>Missing the classic mixed alkalosis + acidosis picture.</li><li>Forgetting to check paracetamol level (patients often co-ingest).</li><li>Correcting sodium but neglecting potassium during bicarbonate therapy.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Aspirin overdose = tinnitus + mixed respiratory alkalosis and metabolic acidosis. First-line is IV sodium bicarbonate; escalate to dialysis if severe.</em>"
]
},
{
id: "EM-1561",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 12 year old boy fell from a bicycle and hit his head on the pavement. He has difficulty remembering the events that unfolded right before he injured his head. The accident was witnessed by his mother. He did not lose consciousness. He has had three discrete episodes of vomiting since the injury. There is a small swelling on his forehead with no visible lacerations or bleeding. He has a Glasgow Coma Scale of 15/15. His neurological examination was unremarkable. What is the SINGLE most appropriate management?",
options: [
{ key: "A", text: "CT scan of the head within 1 hour" },
{ key: "B", text: "CT scan of the head within 8 hours" },
{ key: "C", text: "Observe for a minimum of 4 hours post head injury" },
{ key: "D", text: "Observe for a minimum of 24 hours post head injury" },
{ key: "E", text: "Prescribe pain relief and discharge" }
],
correct: "A",
explanation_plabable: [
"The main point to look at in this stem is vomiting and amnesia. Any head injuries in children presenting to A&E with more than ONE risk factor from the injury would require a CT scan within 1 hour.",
"Amnesia more than 5 minutes is one risk factor. 3 or more discrete episodes of vomiting is the other risk factor.",
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> According to NICE CG176, children with head injury require urgent CT (<strong>within 1 hour</strong>) if they present with ≥2 risk factors. This boy has both <strong>amnesia >5 minutes</strong> and <strong>≥3 episodes of vomiting</strong>. Although his GCS is 15 and neuro exam is normal, the combination of risk factors indicates high likelihood of clinically important intracranial injury, necessitating immediate CT brain.",
"<strong>Core pathophysiology/mechanism:</strong> Traumatic brain injury may lead to intracranial haemorrhage (extradural, subdural, intracerebral) or cerebral oedema. Amnesia reflects cortical/hippocampal dysfunction from concussion or contusion. Repeated vomiting suggests raised ICP or ongoing brain irritation from bleeding. Early CT allows identification before deterioration.",
"<strong>Differential diagnoses:</strong> <ul><li>Simple concussion: transient amnesia/confusion but usually ≤1 risk factor, not multiple.</li><li>Isolated scalp haematoma: causes swelling but no vomiting or amnesia.</li><li>Viral gastroenteritis: vomiting present, but no head injury/amnesia link.</li><li>Post-traumatic seizure: not described here; GCS remains 15.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>B. CT within 8 hours:</strong> Correct for a single risk factor only. This child has ≥2 risk factors, so 1-hour imaging is required.</li><li><strong>C/D. Observation alone:</strong> Inadequate because urgent imaging is indicated when multiple risk factors are present.</li><li><strong>E. Discharge with analgesia:</strong> Unsafe; risk of intracranial bleed not excluded.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Immediate:</strong> Perform A–E, stabilise airway/breathing/circulation, cervical spine precautions.</li><li><strong>Neuro checks:</strong> GCS, pupils, limb power, vitals every 30 min while awaiting CT.</li><li><strong>CT head within 1 hour</strong> as per NICE criteria.</li><li>If CT shows bleed: discuss with neurosurgery, admit under paediatrics/neurosurgery as appropriate.</li><li>If CT normal but symptomatic: admit for observation (usually 12–24 h).</li><li>Provide parental advice leaflet (‘head injury discharge advice’) if discharged.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Primary survey, high-flow O₂ if hypoxic, IV access, monitor HR/SpO₂/BP.</li><li><strong>1–3 min:</strong> Neurological assessment: GCS, pupils, cranial nerves, motor/sensory.</li><li><strong>3–10 min:</strong> Explain need for urgent CT brain, obtain consent from parents, liaise with radiology for immediate slot.</li><li><strong>10–30 min:</strong> Transfer to scanner with monitoring; continue neuro obs.</li><li><strong>30–60 min:</strong> Review CT results. If abnormal, escalate to neurosurgery; if normal but risk factors present, admit for observation.</li><li><strong>Disposition:</strong> Admit or discharge with written head injury advice depending on findings.</li></ul>",
"<strong>Guideline cues:</strong> NICE CG176: Children with ≥1 risk factor = CT within 1 h; isolated single risk factor = CT within 8 h; no risk factors = observe/discharge with advice.",
"<strong>Common pitfalls:</strong> <ul><li>Underestimating significance of repeated vomiting.</li><li>Discharging because GCS is 15 — risk factors override normal GCS.</li><li>Delaying CT and missing early intracranial haemorrhage.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Child with head injury + ≥2 risk factors (e.g., amnesia >5 min + ≥3 vomiting episodes) → urgent CT head within 1 hour.</em>"
]
},
{
id: "EM-3250",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 4 year old child playing with toys unattended suddenly develops breathlessness and stridor and is rushed into the hospital by his father. The child is drooling and unable to swallow. What is the SINGLE best investigation likely to lead to a diagnosis?",
options: [
{ key: "A", text: "Laryngoscopy" },
{ key: "B", text: "Chest X-ray" },
{ key: "C", text: "Peak flow meter" },
{ key: "D", text: "Arterial blood gas" },
{ key: "E", text: "Pulse oximeter" }
],
correct: "A",
explanation_plabable: [
"Breathlessness and stridor in a child playing with toys is most likely due to aspiration of a foreign body (e.g. a part of the toy) for which indirect laryngoscopy and/or fibre-optic examination of the pharynx would provide a diagnosis.",
"Remember, the ingestion of foreign bodies is most commonly a problem in young children aged 6 months to 5 years.",
"Reference: http://patient.info/doctor/swallowed-foreign-bodies"
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> Sudden onset of stridor, drooling, inability to swallow, and acute respiratory distress in a previously well child strongly suggests <strong>upper airway obstruction from foreign body aspiration</strong>. The most definitive way to establish diagnosis is <strong>direct or fibre-optic laryngoscopy</strong>, allowing visualisation of the larynx/pharynx and removal if required. Chest X-ray can sometimes show radio-opaque objects but cannot exclude airway obstruction, and ABG/pulse oximetry provide supportive but not diagnostic information.",
"<strong>Core pathophysiology/mechanism:</strong> Foreign bodies can lodge in the supraglottic/glottic area → turbulent airflow (stridor), impaired swallowing (drooling), and impending complete obstruction. Inflammatory oedema can worsen obstruction. Children have narrower airways, so even partial obstruction is life-threatening.",
"<strong>Differential diagnoses:</strong> <ul><li><em>Epiglottitis</em>: also causes stridor and drooling, but usually associated with fever, toxicity, and preceding illness. Now rare with Hib vaccine.</li><li><em>Croup</em>: viral prodrome, barking cough, not sudden onset.</li><li><em>Allergic reaction/angioedema</em>: stridor with urticaria/swelling, often medication or food trigger.</li><li><em>Retropharyngeal abscess</em>: fever, toxic child, neck stiffness, not sudden choking onset.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>B. Chest X-ray:</strong> May show foreign body if radio-opaque, or indirect signs (air-trapping, collapse), but cannot reliably diagnose or exclude aspiration.</li><li><strong>C. Peak flow meter:</strong> Not feasible in a distressed child, and not diagnostic of obstruction site.</li><li><strong>D. ABG:</strong> May show hypoxia/hypercapnia but only late; doesn’t confirm cause.</li><li><strong>E. Pulse oximeter:</strong> Detects hypoxia but not the underlying pathology.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Immediate:</strong> A–E assessment, high-flow O₂ if tolerated, keep child upright on parent’s lap, avoid upsetting child (crying worsens obstruction).</li><li><strong>Airway team:</strong> Call anaesthetics/ENT urgently.</li><li><strong>Laryngoscopy</strong> in theatre with skilled anaesthetist and ENT surgeon, with equipment for rigid bronchoscopy and emergency tracheostomy.</li><li>If complete obstruction develops: choking algorithm (back blows, chest thrusts for infants, abdominal thrusts for older children).</li><li>Do not attempt blind finger sweeps as they risk pushing object deeper.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Rapid A–E, identify stridor/drooling, sit child upright, call senior help (anaesthetics/ENT).</li><li><strong>1–3 min:</strong> Administer O₂, keep child calm, prepare airway equipment.</li><li><strong>3–10 min:</strong> Transfer urgently to theatre; anaesthetist maintains airway while ENT performs <strong>laryngoscopy</strong> and removes foreign body.</li><li><strong>10–30 min:</strong> Post-removal: monitor in recovery/HDU, check for laryngeal trauma, give steroids if oedema risk.</li><li><strong>30–60 min:</strong> Educate parents on choking hazards, advise follow-up if airway injury suspected.</li></ul>",
"<strong>Guideline cues:</strong> RCEM and RCPCH guidelines: any suspected inhaled foreign body with stridor/drooling = ENT referral and diagnostic laryngoscopy. Do not delay with unnecessary investigations like chest X-ray if suspicion is high.",
"<strong>Common pitfalls:</strong> <ul><li>Ordering chest X-ray first and delaying definitive airway assessment.</li><li>Upsetting child by repeated IV attempts before airway secure.</li><li>Misdiagnosing as croup when onset is sudden with choking episode.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Child with sudden stridor, drooling, and choking after playing with toys = foreign body aspiration → definitive diagnosis via laryngoscopy.</em>"
]
},
{
id: "EM-0306",
topic: "Emergency Medicine",
difficulty: "Easy",
vignetteTitle: "Clinical Vignette",
stem: "A 23 year old single male was brought to emergency department by his father exhausted and frightened. His father tells you that his son, who was previously healthy, had, for no apparent reason, a sudden attack of fear, dizziness, sweating, palpitations and the feeling that his heart is going to stop beating. The symptoms started to decrease gradually after about 10 minutes. Which is the SINGLE most likely diagnosis?",
options: [
{ key: "A", text: "Panic attack" },
{ key: "B", text: "Delirious state" },
{ key: "C", text: "Alcohol withdrawal" },
{ key: "D", text: "Drug overdose" },
{ key: "E", text: "Phaeochromocytoma" }
],
correct: "A",
explanation_plabable: [
"Panic attacks usually have a fast onset and resolve quickly as well. They usually take about 10 minutes to peak and then followed by resolution over the next 20 minutes.",
"Some attacks may be situational such as in specific scenarios where attacks have occurred previously whilst other attacks may be spontaneous and described as 'out of the blue' which is seen in this stem."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The sudden onset of fear, palpitations, dizziness, sweating, and the feeling of impending death with rapid resolution within 20–30 minutes is classic for a <strong>panic attack</strong>. These episodes are discrete, reach peak intensity in about 10 minutes, and resolve spontaneously. The lack of chronic illness, drug/alcohol history, or ongoing confusion further supports panic attack.",
"<strong>Core pathophysiology/mechanism:</strong> Panic attacks are thought to involve dysregulation of the amygdala and limbic system with excessive sympathetic discharge. This results in acute catecholamine-driven symptoms such as tachycardia, diaphoresis, hyperventilation, and chest tightness. Hyperventilation may also cause dizziness and paraesthesia due to respiratory alkalosis.",
"<strong>Differential diagnoses:</strong> <ul><li><strong>Phaeochromocytoma:</strong> causes paroxysms of sweating, palpitations, hypertension but typically recurrent and linked with high BP spikes, not a single 10-minute event.</li><li><strong>Alcohol withdrawal:</strong> occurs 6–24 h after cessation in dependent patients with tremor, agitation, hallucinations; history absent here.</li><li><strong>Drug overdose:</strong> tends to cause prolonged or progressive toxicity, not sudden-onset brief panic-like symptoms.</li><li><strong>Delirium:</strong> develops subacutely with fluctuating consciousness, attention deficits, and confusion; not an acute isolated event.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>B. Delirious state:</strong> Requires prolonged disturbance in consciousness/attention, not episodic symptoms.</li><li><strong>C. Alcohol withdrawal:</strong> No history of alcohol dependence or recent cessation.</li><li><strong>D. Drug overdose:</strong> Would produce ongoing toxic features, not self-limited resolution.</li><li><strong>E. Phaeochromocytoma:</strong> Recurrent hypertension/episodes over time, not a one-off presentation.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Acute:</strong> Reassure, calm environment, encourage slow breathing to correct hyperventilation.</li><li>Exclude organic mimics: ECG, glucose, vitals to rule out arrhythmia, hypoglycaemia, thyrotoxicosis.</li><li><strong>If recurrent:</strong> Refer to GP/psychiatry. First-line treatment: <strong>Cognitive Behavioural Therapy (CBT)</strong>.</li><li>SSRIs (e.g., sertraline) if persistent/panic disorder; benzodiazepines may be used short-term but not long-term due to dependence risk.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Assess ABCs, monitor vitals, check capillary glucose.</li><li><strong>1–3 min:</strong> Brief targeted exam to exclude organic causes (arrhythmia, asthma attack, seizure).</li><li><strong>3–10 min:</strong> Provide reassurance, guide patient through breathing techniques.</li><li><strong>10–30 min:</strong> Observe until full resolution; offer explanation to patient/family.</li><li><strong>Disposition:</strong> If single isolated panic attack and no red flags, discharge with GP follow-up and advice on stress reduction. If recurrent/severe, refer for mental health input.</li></ul>",
"<strong>Guideline cues:</strong> NICE guidance recommends <strong>CBT as first-line</strong> for panic disorder; SSRIs are pharmacological first-line if needed. Rule out organic causes before diagnosing panic attack in ED.",
"<strong>Common pitfalls:</strong> <ul><li>Misdiagnosing cardiac/respiratory causes as panic attack.</li><li>Over-investigation without clinical suspicion.</li><li>Discharging without explanation or follow-up plan, leading to patient anxiety and reattendance.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Sudden self-limiting episode of palpitations, fear, dizziness, and sweating resolving in 20–30 minutes in a healthy young adult = Panic attack.</em>"
]
},
{
id: "EM-0307",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 33 year old woman has recurring tightness in her chest accompanied by palpitations and sweating. These episodes occur several times a week and are associated with increased respiratory rate and tingling and numbness around the mouth and fingers. What is the SINGLE most likely diagnosis?",
options: [
{ key: "A", text: "Hypercalcaemia" },
{ key: "B", text: "Stable angina" },
{ key: "C", text: "Panic attack" },
{ key: "D", text: "Gastro-oesophageal reflux disease" },
{ key: "E", text: "Prinzmetal's angina" }
],
correct: "C",
explanation_plabable: [
"In panic attacks, perioral paraesthesia, tingling and numbness in the hands can occur due to hyperventilation and CO₂ washout leading to low ionic calcium. The description of tightening with palpitations fits with panic attacks."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> The recurrent episodes of chest tightness, palpitations, sweating, and hyperventilation with perioral paraesthesia and distal tingling are classical for <strong>panic attacks</strong>. The neurological symptoms are due to respiratory alkalosis from hyperventilation, which lowers ionised calcium, causing tingling and numbness. The recurrent, self-limiting nature without exertional trigger rules out cardiac pathology.",
"<strong>Core pathophysiology/mechanism:</strong> Panic disorder is characterised by sudden surges of intense fear or discomfort, associated with sympathetic overdrive (palpitations, sweating, tremors) and hyperventilation. Hypocapnia from hyperventilation causes cerebral vasoconstriction (dizziness, confusion) and reduced ionised calcium (perioral and digital paraesthesia).",
"<strong>Differential diagnoses:</strong> <ul><li><strong>Hypercalcaemia:</strong> Causes constipation, polyuria, confusion, abdominal pain—not episodic panic-like features.</li><li><strong>Stable angina:</strong> Predictable exertional chest pain, relieved by rest/nitrates; not associated with tingling or panic-like autonomic symptoms.</li><li><strong>GORD:</strong> Retrosternal burning post-prandially, worse lying flat; not associated with paraesthesia.</li><li><strong>Prinzmetal's angina:</strong> Chest pain at rest due to coronary spasm; ECG shows transient ST elevation, no paraesthesia.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li>A. Hypercalcaemia causes chronic systemic symptoms, not recurrent acute episodes with panic-like features.</li><li>B. Stable angina is exertional and predictable, not sudden-onset with hyperventilation.</li><li>D. GORD causes heartburn/regurgitation, no neurological signs.</li><li>E. Prinzmetal's angina would present with ischaemic ECG changes, not tingling or numbness.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Acute episode:</strong> Calm reassurance, quiet environment, encourage slow rebreathing to reduce hypocapnia.</li><li>Exclude acute organic pathology (ECG, glucose, electrolytes, thyroid if indicated).</li><li><strong>First-line long-term:</strong> Cognitive Behavioural Therapy (CBT).</li><li><strong>Pharmacological:</strong> SSRIs (sertraline, citalopram) if persistent/severe; short-term benzodiazepines only if disabling and refractory.</li><li>Address lifestyle: sleep hygiene, caffeine/alcohol reduction, stress management.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Primary survey, vitals, ECG to rule out ACS.</li><li><strong>1–3 min:</strong> Observe hyperventilation; bedside reassurance, encourage controlled breathing.</li><li><strong>3–10 min:</strong> Explain likely panic attack to patient and family, normal investigations.</li><li><strong>10–30 min:</strong> Observe until symptoms resolve; safety-net for recurrence.</li><li><strong>Disposition:</strong> Discharge with GP follow-up for CBT referral, consider SSRI initiation if recurrent.</li></ul>",
"<strong>Guideline cues:</strong> NICE recommends <strong>CBT as first-line</strong> for panic disorder, SSRIs if pharmacological therapy needed. Always exclude cardiac, endocrine, and metabolic causes on first presentation.",
"<strong>Common pitfalls:</strong> <ul><li>Attributing chest pain to panic without excluding ACS on first presentation.</li><li>Over-investigating recurrent attacks once diagnosis is clear.</li><li>Using benzodiazepines long-term, leading to dependence.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Recurrent chest tightness with hyperventilation-induced tingling and perioral paraesthesia = panic attacks, not cardiac or metabolic disease.</em>"
]
},
{
id: "EM-1009",
topic: "Emergency Medicine",
difficulty: "Hard",
vignetteTitle: "Clinical Vignette",
stem: "An 18 year old female was brought into the ED after ingestion of 28 paracetamol tablets after breaking up with her boyfriend. She came in confused and unwell. She was admitted in the medical ward and N-Acetylcysteine was given. 24 hours later, her laboratory results show a normal FBC, an arterial pH of <strong>7.1</strong>, Prothrombin time of <strong>17 seconds</strong> and creatinine of <strong>255µmol/L</strong>. She is still confused and lethargic. What is the SINGLE most appropriate management?<br/><br/>Normal Lab values:<br/>Creatinine: <strong>70–150 µmol/L</strong><br/>pH: <strong>7.35–7.45</strong><br/>Prothrombin time (PT): <strong>11–14 sec</strong>",
options: [
{ key: "A", text: "Observe for another 24 hours" },
{ key: "B", text: "Admit to psychiatric ward" },
{ key: "C", text: "Intravenous fluids" },
{ key: "D", text: "Administer charcoal" },
{ key: "E", text: "Liver transplantation" }
],
correct: "E",
explanation_plabable: [
"Her arterial pH is 7.1 which is an indication for liver transplantation.",
"King’s College Hospital criteria for liver transplantation (paracetamol liver failure):<br/>• arterial pH < 7.3, 24 hours after ingestion OR all of the following:<br/>– prothrombin time > 100 seconds<br/>– creatinine > 300 µmol/L<br/>– grade III or IV encephalopathy",
"Generally, if one takes more than 24 tablets (12 g), we admit. Paracetamol poisoning is always dealt in the medical ward (not psychiatry ward). Only once treated and stable can they move to a psychiatric ward for evaluation.",
"In reality, grafts are not readily available and much research is being conducted to try and maintain the patient in a stable condition until a suitable graft is available or spontaneous regeneration occurs and the patient recovers without transplantation."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> This patient ingested a potentially lethal dose of paracetamol and now, 24 hours later, fulfils <strong>King’s College criteria</strong> for urgent liver transplantation: arterial pH <7.3, creatinine >300 µmol/L (close at 255 µmol/L), prolonged PT, and clinical encephalopathy (confusion, lethargy). NAC has already been given but severe hepatic failure has developed. The only life-saving option is <strong>liver transplantation</strong>.",
"<strong>Core pathophysiology/mechanism:</strong> In overdose, paracetamol saturates glucuronidation/sulfation pathways, shunting metabolism to cytochrome P450 → toxic metabolite NAPQI. With glutathione depletion, NAPQI accumulates, causing centrilobular hepatic necrosis and multiorgan failure. Severe acidosis (pH <7.3) indicates overwhelming metabolic failure and is a poor prognostic marker.",
"<strong>Differential diagnoses:</strong> <ul><li><strong>Alcoholic hepatitis:</strong> Requires alcohol history, not acute overdose.</li><li><strong>Viral hepatitis:</strong> More gradual onset, no NAC use, not associated with acute acidosis.</li><li><strong>Sepsis with lactic acidosis:</strong> Possible but here clear paracetamol history with NAC given.</li><li><strong>Other overdoses:</strong> Aspirin can cause acidosis but no tinnitus or mixed alkalosis/acidosis picture here.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>A. Observe another 24 h:</strong> Unsafe, patient already meets poor prognostic criteria.</li><li><strong>B. Psychiatric admission:</strong> Appropriate <em>after</em> stabilisation; not while in fulminant hepatic failure.</li><li><strong>C. IV fluids:</strong> Supportive but not definitive; does not reverse fulminant liver failure.</li><li><strong>D. Activated charcoal:</strong> Ineffective at 24 h post-ingestion, benefit only within 1 h of ingestion.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Immediate:</strong> Supportive care in ICU, NAC already given, monitor vitals, electrolytes, glucose, clotting.</li><li><strong>Urgent referral to transplant centre</strong> as per King’s criteria.</li><li>Continue NAC until definitive decision made (supports antioxidant capacity even late).</li><li>Correct hypoglycaemia with IV 10–20% dextrose infusion; monitor hourly glucose.</li><li>Treat coagulopathy with vitamin K and FFP if bleeding.</li><li>Monitor for cerebral oedema; consider mannitol or hypertonic saline if signs of raised ICP.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> ABC stabilisation, oxygen, IV access, continuous monitoring, bedside glucose.</li><li><strong>1–3 min:</strong> Review labs (pH 7.1, raised creatinine, prolonged PT) confirming King’s criteria.</li><li><strong>3–10 min:</strong> Call national liver transplant centre, arrange urgent transfer.</li><li><strong>10–30 min:</strong> Continue NAC infusion, start IV dextrose, correct electrolytes.</li><li><strong>30–60 min:</strong> Admit to ICU for airway/ventilation support, monitor for cerebral oedema, liaise with transplant surgeons.</li><li><strong>Disposition:</strong> Transfer to transplant unit for definitive management.</li></ul>",
"<strong>Guideline cues:</strong> King’s College criteria (for paracetamol liver failure): arterial pH <7.3 at 24 h OR all three of: PT >100s, creatinine >300 µmol/L, and grade III/IV encephalopathy. This patient already fulfils these criteria.",
"<strong>Common pitfalls:</strong> <ul><li>Delaying transplant referral until multi-organ failure is advanced.</li><li>Stopping NAC once liver failure established — it should be continued until transplant.</li><li>Admitting to psychiatry before medical stabilisation.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Paracetamol overdose with pH <7.3 after 24 h = King’s College criteria → urgent liver transplantation referral.</em>"
]
},
{
id: "SS-0046",
topic: "Emergency Medicine",
difficulty: "Medium",
vignetteTitle: "Clinical Vignette",
stem: "A 24 year old male presents to A&E with 40% partial thickness burns after having been in a house fire. His pulse rate is 115 bpm and respiratory rate is 29 breaths per minute. His systolic blood pressure is 80 mmHg. What is the SINGLE most appropriate management?",
options: [
{ key: "A", text: "IV fluids calculated from the time of hospital arrival" },
{ key: "B", text: "IV fluids calculated from the time of burn" },
{ key: "C", text: "Oral rehydration" },
{ key: "D", text: "IV dextrose stat" },
{ key: "E", text: "IV morphine" }
],
correct: "B",
explanation_plabable: [
"These are the steps that you need to know for the treatment of burns for the exam. Note the order:",
"1. Large-calibre intravenous lines must be established immediately in a peripheral vein. Any adult with burns affecting more than 15% of the total body surface area burned or a child with more than 10% of the total body surface area burned requires fluid replacement calculated from the time of the burn.",
"2. Ensure adequate analgesia: strong opiates should be used.",
"3. Prevent hypothermia."
],
explanation_detail: [
"<strong>Why the answer is correct:</strong> Adults with burns covering >15% TBSA require IV fluid resuscitation. In this case, the patient has 40% TBSA burns and is already hypotensive (SBP 80 mmHg). The Parkland formula is used to guide resuscitation: <strong>4 mL × body weight (kg) × %TBSA</strong> = total fluids in 24 h, with half given in the first 8 h <em>from the time of burn</em>, not hospital arrival. Delaying resuscitation risks worsening hypovolaemia and burn shock.",
"<strong>Core pathophysiology/mechanism:</strong> Severe burns cause capillary leak, plasma loss, and third spacing → intravascular volume depletion → hypovolaemic shock. Prompt fluid replacement prevents organ hypoperfusion, metabolic acidosis, and death. Early resuscitation also reduces risk of acute kidney injury and improves outcomes.",
"<strong>Differential diagnoses:</strong> <ul><li><em>Smoke inhalation injury:</em> common in house fires, but airway compromise is managed alongside fluid resuscitation, not instead of it.</li><li><em>Septic shock:</em> unlikely at presentation, occurs later.</li><li><em>Cardiogenic shock:</em> not consistent with history of major burns and tachycardia with hypotension.</li></ul>",
"<strong>Why the other options are wrong:</strong> <ul><li><strong>A. IV fluids from time of hospital arrival:</strong> Incorrect—calculation starts at burn time; otherwise, under-resuscitation occurs.</li><li><strong>C. Oral rehydration:</strong> Inadequate in major burns with hypovolaemic shock.</li><li><strong>D. IV dextrose stat:</strong> Does not replace fluid losses; risk of hyperglycaemia.</li><li><strong>E. IV morphine:</strong> Analgesia is important, but resuscitation takes priority in unstable patients.</li></ul>",
"<strong>Management/algorithm:</strong> <ul><li><strong>Immediate:</strong> A–E assessment, airway protection (look for smoke inhalation, carbon monoxide), high-flow oxygen, 2 large-bore IV cannulae.</li><li>Calculate fluid requirement using Parkland formula: <strong>4 mL × weight (kg) × %TBSA</strong>.</li><li>Give half within 8 h from burn onset; remaining half over next 16 h.</li><li>Fluid of choice: <strong>Ringer’s lactate</strong> (Hartmann’s). Aim urine output 0.5–1 mL/kg/h.</li><li>Provide IV opioids for analgesia once circulation secured.</li><li>Cover burns with cling film/sterile sheets; prevent hypothermia.</li><li>Tetanus prophylaxis as indicated.</li></ul>",
"<strong>Step-by-step realistic ED scenario:</strong> <ul><li><strong>0–1 min:</strong> Primary survey, high-flow O₂, remove burnt clothing, estimate %TBSA using Wallace rule of nines.</li><li><strong>1–3 min:</strong> Insert 2 large-bore IVs, take bloods (FBC, U&E, ABG, COHb).</li><li><strong>3–10 min:</strong> Begin fluid resuscitation per Parkland formula, calculating from burn time; start Hartmann’s.</li><li><strong>10–30 min:</strong> Insert urinary catheter; monitor urine output hourly. Provide IV morphine for analgesia.</li><li><strong>30–60 min:</strong> Ongoing reassessment: vitals, fluid balance, repeat ABG. Cover burns with sterile sheets; prevent hypothermia.</li><li><strong>Disposition:</strong> Admit to burns unit/ICU, arrange transfer if needed.</li></ul>",
"<strong>Guideline cues:</strong> Advanced Trauma Life Support (ATLS) and British Burn Association recommend immediate IV resuscitation for adults >15% TBSA burns, calculated from burn time, with Hartmann’s as preferred fluid.",
"<strong>Common pitfalls:</strong> <ul><li>Calculating fluids from hospital arrival rather than time of burn.</li><li>Failing to monitor urine output, leading to over/under-resuscitation.</li><li>Delaying airway assessment in smoke inhalation cases.</li></ul>",
"<strong>Exam takeaway:</strong> <em>Burns >15% TBSA in adults → IV fluids calculated from burn time using Parkland formula; airway and analgesia follow immediately after.</em>"
]
}





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
  const replaced = expr.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, "Math.pow($1,$2)");
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${replaced || 0});`)();
}

/* --------------------------- Modal ---------------------------- */
function Modal({ open, onClose, title, children, maxW = "max-w-2xl", overlayClass = "bg-black/30" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className={`absolute inset-0 ${overlayClass}`} onClick={onClose} />
      <div className="absolute inset-0 overflow-auto">
        <div className={`mx-auto ${maxW} p-4`}>
          <div className="relative rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <button onClick={onClose} className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100">✕</button>
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
      <p className="text-xs text-slate-500 mt-3">Ranges vary by lab and context; this is for quick revision.</p>
    </div>
  );
}

/* ------------------------ Calculator ------------------------ */
function Calculator() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("");
  const keys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+","^"];
  const press = (t) => setExpr((e) => e + t);
  const doEval = () => { try { setOut(String(evalMath(expr))); } catch { setOut("Error"); } };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
               value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="e.g. (12.5*3)/4" />
        <button onClick={() => { setExpr(""); setOut(""); }} className="rounded-lg border px-3">Clear</button>
        <button onClick={doEval} className="rounded-lg bg-purple-600 text-white px-4">=</button>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {keys.map((k) => (
          <button key={k} onClick={() => press(k)} className="rounded-lg border py-2 hover:bg-slate-50">{k}</button>
        ))}
      </div>
      <div className="text-sm text-slate-600">Result: <span className="font-semibold text-slate-900">{out}</span></div>
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
      title="Start Acute & Emergency"
      maxW="max-w-lg"
      overlayClass="bg-white" // solid white so nothing shows behind
    >
      <p className="text-slate-600 mb-4">How would you like to order the questions?</p>
      <div className="grid gap-3">
        <button
          onClick={() => onPick("random")}
          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-left"
        >
          <p className="font-semibold text-slate-900">Randomised</p>
          <p className="text-sm text-slate-600">Shuffle questions for exam-style practice.</p>
        </button>
        <button
          onClick={() => onPick("number")}
          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-left"
        >
          <p className="font-semibold text-slate-900">By question number</p>
          <p className="text-sm text-slate-600">Go in sequence (Q1, Q2, Q3 …).</p>
        </button>
      </div>
    </Modal>
  );
}

/* --------------------------- Page --------------------------- */
export default function PlabableAcuteEmergency() {
  const nav = useNavigate();

  // session/order state
  const [order, setOrder] = useState(QUESTIONS.map((_, i) => i));
  const [started, setStarted] = useState(false);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0); // index into order[]
  const [answers, setAnswers] = useState({});      // {questionId: "A"|"B"|...}
  const [revealed, setRevealed] = useState({});    // {questionId: true}
  const [showLabs, setShowLabs] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // highlight mode (auto-highlight on selection)
  const [highlightMode, setHighlightMode] = useState(false);
  const highlightRef = useRef(null);

  const q = QUESTIONS[order[currentIdx]];
  const total = QUESTIONS.length;
  const progress = ((currentIdx + 1) / Math.max(total, 1)) * 100;

  /* highlighting */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // sidebar status
  const status = useMemo(() => {
    const s = {};
    order.forEach((qi, i) => {
      const id = QUESTIONS[qi].id;
      const a = answers[id];
      if (!a) s[i] = "unanswered";
      else s[i] = a === QUESTIONS[qi].correct ? "correct" : "incorrect";
    });
    return s;
  }, [answers, order]);

  // start overlay pick
  const handlePickMode = (mode) => {
    const newOrder = mode === "random" ? shuffle(QUESTIONS.map((_, i) => i)) : QUESTIONS.map((_, i) => i);
    setOrder(newOrder);
    setCurrentIdx(0);
    setAnswers({});
    setRevealed({});
    setStarted(true);
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && currentIdx < total - 1) setCurrentIdx((i) => i + 1);
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
          <Link to="/" className="text-2xl font-extrabold text-purple-700">Mediwise</Link>

          <div className="flex items-center gap-4 w-[320px]">
            <span className="text-sm text-slate-600 whitespace-nowrap">
              Question {Math.min(currentIdx + 1, total)} of {total}
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button
            onClick={() => nav("/plabable")}
            className="rounded-xl px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Floating sidebar toggle (fixed) */}
      <button
        onClick={() => setSidebarOpen((s) => !s)}
        className="fixed z-50 top-[120px] h-9 w-9 rounded-xl shadow-sm border bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
        style={{ left: sidebarOpen ? 316 : 12 }} // 300px sidebar + 16px gutter when open
        title={sidebarOpen ? "Hide questions" : "Show questions"}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>

      {/* Content Row */}
      <div className="mx-auto max-w-[1100px] px-2 md:px-4 py-4">
        <div className="relative">
          {/* Slide-out Sidebar */}
          <aside
            className={[
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
                  <span className="flex items-center gap-1 text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Correct</span>
                  <span className="flex items-center gap-1 text-rose-700"><span className="h-2 w-2 rounded-full bg-rose-500" /> Incorrect</span>
                  <span className="flex items-center gap-1 text-slate-500"><span className="h-2 w-2 rounded-full bg-slate-300" /> Unanswered</span>
                </div>
              </div>

              <ol className="p-3 space-y-3">
                {order.map((qi, i) => {
                  const qq = QUESTIONS[qi];
                  const a = answers[qq.id];
                  const st = !a ? "unanswered" : a === qq.correct ? "correct" : "incorrect";
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
                          <p className="text-sm text-slate-600 truncate">{qq.stem}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">{qq.topic}</span>
                            <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">{qq.difficulty}</span>
                          </div>
                        </div>
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            st === "correct" ? "bg-emerald-500" : st === "incorrect" ? "bg-rose-500" : "bg-slate-300"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </ol>

              <div className="px-4 pb-4 flex gap-2">
                <button onClick={() => setShowLabs(true)} className="flex-1 rounded-xl border px-3 py-2 hover:bg-slate-50">Lab values</button>
                <button onClick={() => setShowCalc(true)} className="flex-1 rounded-xl border px-3 py-2 hover:bg-slate-50">Calculator</button>
              </div>
            </div>
          </aside>

          {/* Main column (adds left padding when sidebar is open) */}
          <div className={`transition-all ${sidebarOpen ? "md:pl-[320px]" : "ml-12 md:ml-0"}`}>
            <div className="mx-auto md:pr-[56px]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Vignette header */}
                <div className="p-5 border-b border-slate-200 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">Clinical Vignette</p>
                    <div className="mt-2">
                      <span className="mr-2 text-xs rounded-full bg-purple-100 text-purple-700 px-2 py-0.5">{q.topic}</span>
                      <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">{q.difficulty}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">ID: {q.id}</div>
                </div>

                {/* Stem + (optional) ECG image + options */}
                <div className="p-6 space-y-5" ref={highlightRef}>
                  <div
  className="text-[15px] leading-relaxed"
  dangerouslySetInnerHTML={{ __html: q.stem }}
/>
                  

                  {q.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img src={q.image} alt="ECG" className="w-full block" />
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
                            <span className="font-medium">{opt.key}.</span> {opt.text}
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
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: undefined }))}
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
                        <button onClick={prev} disabled={currentIdx === 0} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
                          ← Previous
                        </button>
                      </>
                    )}
                  </div>

                  {/* Explanation (two sections) */}
                  {revealed[q.id] && (
                    <div className="mt-2 space-y-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900 mb-2">Plabable Explanation</p>
                        <div className="space-y-2 text-slate-800">
                          {q.explanation_plabable?.map((para, i) => (
  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900 mb-2">Detailed Explanation</p>
                        <div className="space-y-2 text-slate-800">
                          {q.explanation_detail?.map((para, i) => (
  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right tool rail */}
              <div className="fixed right-4 top-[140px] flex flex-col gap-3">
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
                    highlightMode ? "border-purple-400 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-700"
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
      <Modal open={showLabs} onClose={() => setShowLabs(false)} title="Common Lab Values">
        <LabValues />
      </Modal>
      <Modal open={showCalc} onClose={() => setShowCalc(false)} title="Calculator">
        <Calculator />
      </Modal>

      {/* Start choice (solid white overlay) */}
      <StartOverlay open={!started} onPick={handlePickMode} />
    </div>
  );
}
