import SystemTemplate from "./SystemTemplate";
export default function Psychiatry() {
  return (
    <SystemTemplate
      title="Psychiatry"
      intro="Mood, anxiety, psychosis, substance use."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Low mood/anhedonia",
            "Panic",
            "Hallucinations/delusions",
            "Withdrawal states",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: ["Suicidality", "Homicidality", "Catatonia", "Delirium"],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Risk assessment",
            "TFTs/B12 (reversible causes)",
            "Urine tox screen",
            "Collateral history",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Safety plan",
            "CBT/medication",
            "Inpatient criteria",
            "Substance use pathways",
          ],
        },
      ]}
    />
  );
}
