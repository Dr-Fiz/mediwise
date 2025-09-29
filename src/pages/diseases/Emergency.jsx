import SystemTemplate from "./SystemTemplate";
export default function Emergency() {
  return (
    <SystemTemplate
      title="Emergency Medicine"
      intro="Resuscitation, trauma, ACS, sepsis, toxidromes."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "ABC instability",
            "Major trauma",
            "Poisoning",
            "Acute chest pain",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Airway threat",
            "Uncontrolled hemorrhage",
            "Septic shock",
            "Compartment syndrome",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: ["VBG/ABG", "ECG", "Fast US (eFAST)", "Point-of-care tests"],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "ATLS/ACLS pathways",
            "Massive transfusion protocol",
            "Time-critical transfers",
          ],
        },
      ]}
    />
  );
}
