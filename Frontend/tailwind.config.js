export default {
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Display / Hero
        "display-2xl": ["4rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-xl": ["3.25rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["2.5rem", { lineHeight: "1.15", fontWeight: "700" }],

        // Headings
        h1: ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.35", fontWeight: "600" }],

        // Body
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.45", fontWeight: "400" }],
        "body-xs": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],

        // Labels / UI text
        label: ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
        "label-sm": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],

        // Overline / Helper / Metadata
        overline: ["0.7rem", { letterSpacing: "0.08em", fontWeight: "600" }],
      },
    },
  },
};
