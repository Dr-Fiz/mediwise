import SystemTemplate from "./SystemTemplate";
export default function Toxicology() {
  return (
    <SystemTemplate
      title="Toxicology"
      intro="Overdoses, antidotes, toxidromes."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Altered mental status",
            "Brady/tachy syndromes",
            "Miosis/mydriasis",
            "Metabolic acidosis",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Airway compromise",
            "Refractory seizures",
            "Cardiotoxicity",
            "Serotonin syndrome/NMS",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "ECG (QRS/QT)",
            "Paracetamol/salicylate levels",
            "VBG/ABG + lactate",
            "Osmolar gap",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Activated charcoal criteria",
            "Specific antidotes",
            "Enhanced elimination",
          ],
        },
      ]}
    />
  );
}
