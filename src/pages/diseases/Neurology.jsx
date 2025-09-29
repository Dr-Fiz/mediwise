import SystemTemplate from "./SystemTemplate";
export default function Neurology() {
  return (
    <SystemTemplate
      title="Neurology"
      intro="Stroke, seizures, demyelination, peripheral neuropathies."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Focal deficits",
            "Headache",
            "Seizures",
            "Weakness/sensory loss",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Thunderclap headache",
            "Meningism + fever",
            "Status epilepticus",
            "Cord compression",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "CT/MRI brain",
            "Glucose/electrolytes",
            "ECG (AF?)",
            "LP if safe/indicated",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Stroke thrombolysis/thrombectomy criteria",
            "Seizure abort + maintenance",
            "MS relapse steroids",
          ],
        },
      ]}
    />
  );
}
