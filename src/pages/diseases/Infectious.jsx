import SystemTemplate from "./SystemTemplate";
export default function Infectious() {
  return (
    <SystemTemplate
      title="Infectious Diseases"
      intro="Sepsis, TB, HIV, tropical, antimicrobial strategy."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Fever source unknown",
            "Respiratory/urinary infections",
            "Rashes",
            "Travel history",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Septic shock",
            "Meningitis",
            "Necrotizing fasciitis",
            "Severe malaria",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "FBC/CRP",
            "Cultures before abx",
            "CXR/urinalysis",
            "Rapid tests (malaria, flu)",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Sepsis 1-hour bundle",
            "Empiric → targeted abx",
            "Infection control & isolation",
          ],
        },
      ]}
    />
  );
}
