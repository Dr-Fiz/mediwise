import SystemTemplate from "./SystemTemplate";
export default function Oncology() {
  return (
    <SystemTemplate
      title="Oncology"
      intro="Solid tumours, staging principles, systemic therapy basics."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Unintentional weight loss",
            "Painless mass",
            "Obstructive symptoms",
            "Paraneoplastic syndromes",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Spinal cord compression",
            "SVC syndrome",
            "Tumour lysis",
            "Neutropenic sepsis",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "CT staging",
            "Biopsy/histology",
            "Tumour markers (selected)",
            "Performance status",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Surgery/radiation/systemic triad",
            "Palliative vs curative intent",
            "Toxicity monitoring",
          ],
        },
      ]}
    />
  );
}
