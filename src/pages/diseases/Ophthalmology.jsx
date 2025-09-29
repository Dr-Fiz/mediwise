import SystemTemplate from "./SystemTemplate";
export default function Ophthalmology() {
  return (
    <SystemTemplate
      title="Ophthalmology"
      intro="Red eye, glaucoma, cataract, retinal disease."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Painful red eye",
            "Sudden painless vision loss",
            "Flashes/floaters",
            "Eye trauma",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Acute angle-closure glaucoma",
            "Central retinal artery occlusion",
            "Open globe injury",
            "Endophthalmitis",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Visual acuity",
            "Fluorescein stain",
            "TONO (if trained)",
            "Fundoscopy",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Urgent ophthalmology referral thresholds",
            "Topical vs systemic therapy basics",
          ],
        },
      ]}
    />
  );
}
