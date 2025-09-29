import SystemTemplate from "./SystemTemplate";
export default function Pediatrics() {
  return (
    <SystemTemplate
      title="Pediatrics"
      intro="Congenital conditions, infections, development."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Fever in infant",
            "Rash illnesses",
            "Failure to thrive",
            "Wheeze/bronchiolitis",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Neonatal sepsis",
            "Dehydration",
            "Resp distress",
            "Non-accidental injury",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Age-specific obs",
            "Urine/cultures",
            "CXR if indicated",
            "Developmental screen",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Sepsis bundles",
            "Rehydration protocols",
            "Asthma pediatric pathway",
          ],
        },
      ]}
    />
  );
}
