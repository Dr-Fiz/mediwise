import SystemTemplate from "./SystemTemplate";
export default function Dermatology() {
  return (
    <SystemTemplate
      title="Dermatology"
      intro="Eczema, psoriasis, bullous disease, skin cancers."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Pruritic plaques",
            "Silvery scales",
            "Blisters",
            "Changing mole",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "SJS/TEN",
            "Erythroderma",
            "Nec fasc signs",
            "Rapidly growing pigmented lesion",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Derm exam ABCDE",
            "KOH scrape (fungal)",
            "Punch/excisional biopsy",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Topicals vs systemic",
            "Phototherapy",
            "Surgical margins for NMSC",
          ],
        },
      ]}
    />
  );
}
