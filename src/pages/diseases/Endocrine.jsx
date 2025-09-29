import SystemTemplate from "./SystemTemplate";
export default function Endocrine() {
  return (
    <SystemTemplate
      title="Endocrine"
      intro="Diabetes, thyroid, adrenal, pituitary."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Weight change",
            "Heat/cold intolerance",
            "Polyuria/polydipsia",
            "Hypoglycemia",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "DKA/HHS",
            "Adrenal crisis",
            "Thyroid storm",
            "Myxedema coma",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "HbA1c/ketones",
            "TSH/FT4",
            "8am cortisol ± ACTH",
            "Electrolytes",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "DKA protocol",
            "Hypo/Hyperthyroid algorithms",
            "Stress-dose steroids",
          ],
        },
      ]}
    />
  );
}
