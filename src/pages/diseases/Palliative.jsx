import SystemTemplate from "./SystemTemplate";
export default function Palliative() {
  return (
    <SystemTemplate
      title="Palliative Care"
      intro="Symptom control, end-of-life discussions, ethics."
      sections={[
        {
          id: "presentations",
          title: "Common Themes",
          content: ["Pain/dyspnea", "Nausea", "Anxiety/depression", "Delirium"],
        },
        {
          id: "red-flags",
          title: "Urgencies",
          content: [
            "Cord compression",
            "SVC syndrome",
            "Catastrophic bleed",
            "Severe agitation",
          ],
        },
        {
          id: "first-tests",
          title: "Assessment Focus",
          content: [
            "Goals of care",
            "Performance status",
            "Medication review",
            "Non-pharm supports",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "WHO analgesic ladder",
            "Antiemetic ladder",
            "Dyspnea strategies",
            "Advance care planning",
          ],
        },
      ]}
    />
  );
}
