import SystemTemplate from "./SystemTemplate";
export default function Renal() {
  return (
    <SystemTemplate
      title="Renal/Genitourinary"
      intro="AKI vs CKD, nephritic vs nephrotic, stones, UTIs."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Oliguria/edema",
            "Flank pain",
            "Dysuria/frequency",
            "Foamy urine",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Anuria",
            "Septic pyelonephritis",
            "Obstruction with AKI",
            "Hyperkalemia ECG changes",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "U&E/eGFR",
            "Urinalysis + ACR",
            "Renal US",
            "CT KUB for stones",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "AKI pre/renal/post approach",
            "Relieve obstruction",
            "UTI abx per local guide",
          ],
        },
      ]}
    />
  );
}
