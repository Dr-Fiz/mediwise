import SystemTemplate from "./SystemTemplate";
export default function Ent() {
  return (
    <SystemTemplate
      title="ENT (Otolaryngology)"
      intro="Otitis, sinusitis, epistaxis, head & neck masses."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Otalgia/otorrhea",
            "Sore throat",
            "Nasal obstruction/bleed",
            "Neck lump",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Airway compromise",
            "Peritonsillar abscess",
            "Ludwig angina",
            "Severe epistaxis",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Otoscopy",
            "Rapid strep (selected)",
            "Flexible nasendoscopy (ENT)",
            "US neck",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Epistaxis packing",
            "Antibiotic criteria",
            "Steroids for severe edema",
          ],
        },
      ]}
    />
  );
}
