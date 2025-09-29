import SystemTemplate from "./SystemTemplate";
export default function Msk() {
  return (
    <SystemTemplate
      title="MSK/Rheumatology"
      intro="OA/RA, SLE, vasculitides, gout."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Inflammatory vs mechanical pain",
            "Morning stiffness",
            "Rash/ulcers",
            "Back pain red flags",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Septic joint",
            "Cauda equina",
            "Limb ischemia",
            "Rapidly progressive weakness",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "CRP/ESR",
            "RF/anti-CCP/ANA",
            "Joint aspiration",
            "X-ray targeted joints",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "RA DMARD ladder",
            "Gout flare + urate lowering",
            "SLE steroids + immunosuppression",
          ],
        },
      ]}
    />
  );
}
