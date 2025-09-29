import SystemTemplate from "./SystemTemplate";
export default function AllergyImmunology() {
  return (
    <SystemTemplate
      title="Allergy & Immunology"
      intro="Anaphylaxis, urticaria, immunodeficiency, vaccines."
      sections={[
        {
          id: "presentations",
          title: "Typical Presentations",
          content: [
            "Urticaria/angioedema",
            "Recurrent infections",
            "Atopy/asthma",
            "Contact reactions",
          ],
        },
        {
          id: "red-flags",
          title: "Red Flags",
          content: [
            "Airway compromise",
            "Hypotension",
            "Severe drug reaction (SJS/TEN)",
          ],
        },
        {
          id: "first-tests",
          title: "First-Line Tests",
          content: [
            "Tryptase (anaphylaxis)",
            "Ig levels",
            "Skin-prick/specific IgE",
            "CBC diff",
          ],
        },
        {
          id: "management",
          title: "Management Skeleton",
          content: [
            "IM adrenaline",
            "Adjuncts (antihistamines, steroids)",
            "Epi auto-injector education",
          ],
        },
      ]}
    />
  );
}
