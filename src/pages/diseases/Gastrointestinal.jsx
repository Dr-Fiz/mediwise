import SystemTemplate from "./SystemTemplate";
export default function Gastrointestinal() {
  return (
    <SystemTemplate
      title="Gastrointestinal & Hepatology"
      intro="Ulcers, IBD, pancreatitis, biliary disease, cirrhosis."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "RUQ pain ± jaundice",
            "Epigastric pain to back",
            "Bloody diarrhea",
            "Ascites",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Peritonitis",
            "GI bleeding/shock",
            "Ascending cholangitis",
            "Acute liver failure",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: ["FBC/CRP", "LFTs/lipase", "US/CT abdomen", "Stool studies"],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "UGIB resus + PPI + scope",
            "Pancreatitis fluids/analgesia",
            "IBD flare steroids/biologics",
          ],
        },
      ]}
    />
  );
}
