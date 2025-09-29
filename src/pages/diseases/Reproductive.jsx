import SystemTemplate from "./SystemTemplate";
export default function Reproductive() {
  return (
    <SystemTemplate
      title="Reproductive (Ob/Gyn)"
      intro="Obstetrics, contraception, infertility, STIs."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "PV bleeding",
            "Pelvic pain",
            "Amenorrhea",
            "Pregnancy complaints",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Ectopic pregnancy",
            "PPH",
            "Pre-eclampsia/eclampsia",
            "Sepsis",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "β-hCG",
            "Pelvic US",
            "STI NAAT",
            "Hb/group & save if bleeding",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "Ectopic algorithms",
            "Hypertensive disorders of pregnancy",
            "Contraception counselling",
          ],
        },
      ]}
    />
  );
}
