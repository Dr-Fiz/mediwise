import SystemTemplate from "./SystemTemplate";
export default function Hematology() {
  return (
    <SystemTemplate
      title="Hematology"
      intro="Anemias, hemoglobinopathies, coagulopathies."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Fatigue/pallor",
            "Bleeding/bruising",
            "Thrombosis",
            "Infections in neutropenia",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "DIC",
            "Massive bleed",
            "TTP features",
            "Febrile neutropenia",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "FBC/film",
            "Iron/B12/folate",
            "PT/APTT/fibrinogen",
            "LDH/haptoglobin",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Transfusion thresholds",
            "Iron therapy",
            "Anticoagulation/ reversal",
            "Neutropenic sepsis protocol",
          ],
        },
      ]}
    />
  );
}
