import SystemTemplate from "./SystemTemplate";
export default function Respiratory() {
  return (
    <SystemTemplate
      title="Respiratory"
      intro="Asthma, COPD, pneumonia, ILD, PE."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Wheeze, cough, SOB",
            "Pleuritic chest pain",
            "Hypoxemia",
            "Hemoptysis",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Silent chest",
            "Severe hypoxia",
            "Massive hemoptysis",
            "Tension pneumothorax",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "CXR",
            "Pulse ox/ABG",
            "Peak flow/spirometry",
            "D-dimer/CTPA if PE",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "O2/bronchodilators/steroids",
            "Abx per severity",
            "Anticoagulation for PE",
          ],
        },
      ]}
    />
  );
}
