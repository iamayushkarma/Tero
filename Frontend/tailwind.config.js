export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        // Light mode backgrounds
        'bg-blue-1': 'var(--color-bg-blue-1)',
        'bg-blue-2': 'var(--color-bg-blue-2)',
        'bg-gray-1': 'var(--color-bg-gray-1)',
        'bg-gray-2': 'var(--color-bg-gray-2)',
        
        // Light mode interactive
        'blue-3': 'var(--color-blue-3)',
        'blue-4': 'var(--color-blue-4)',
        'blue-5': 'var(--color-blue-5)',
        'gray-3': 'var(--color-gray-3)',
        'gray-4': 'var(--color-gray-4)',
        'gray-5': 'var(--color-gray-5)',
        
        // Light mode borders
        'blue-6': 'var(--color-blue-6)',
        'blue-7': 'var(--color-blue-7)',
        'blue-8': 'var(--color-blue-8)',
        'gray-6': 'var(--color-gray-6)',
        'gray-7': 'var(--color-gray-7)',
        'gray-8': 'var(--color-gray-8)',
        
        // Light mode solid
        'blue-9': 'var(--color-blue-9)',
        'blue-10': 'var(--color-blue-10)',
        'gray-9': 'var(--color-gray-9)',
        'gray-10': 'var(--color-gray-10)',
        
        // Light mode text
        'blue-11': 'var(--color-blue-11)',
        'blue-12': 'var(--color-blue-12)',
        'gray-11': 'var(--color-gray-11)',
        'gray-12': 'var(--color-gray-12)',
        
        // Dark mode backgrounds
        'dark-bg-blue-1': 'var(--color-dark-bg-blue-1)',
        'dark-bg-blue-2': 'var(--color-dark-bg-blue-2)',
        'dark-bg-gray-1': 'var(--color-dark-bg-gray-1)',
        'dark-bg-gray-2': 'var(--color-dark-bg-gray-2)',
        
        // Dark mode interactive
        'dark-blue-3': 'var(--color-dark-blue-3)',
        'dark-blue-4': 'var(--color-dark-blue-4)',
        'dark-blue-5': 'var(--color-dark-blue-5)',
        'dark-gray-3': 'var(--color-dark-gray-3)',
        'dark-gray-4': 'var(--color-dark-gray-4)',
        'dark-gray-5': 'var(--color-dark-gray-5)',
        
        // Dark mode borders
        'dark-blue-6': 'var(--color-dark-blue-6)',
        'dark-blue-7': 'var(--color-dark-blue-7)',
        'dark-blue-8': 'var(--color-dark-blue-8)',
        'dark-gray-6': 'var(--color-dark-gray-6)',
        'dark-gray-7': 'var(--color-dark-gray-7)',
        'dark-gray-8': 'var(--color-dark-gray-8)',
        
        // Dark mode solid
        'dark-blue-9': 'var(--color-dark-blue-9)',
        'dark-blue-10': 'var(--color-dark-blue-10)',
        'dark-gray-9': 'var(--color-dark-gray-9)',
        'dark-gray-10': 'var(--color-dark-gray-10)',
        
        // Dark mode text
        'dark-blue-11': 'var(--color-dark-blue-11)',
        'dark-blue-12': 'var(--color-dark-blue-12)',
        'dark-gray-11': 'var(--color-dark-gray-11)',
        'dark-gray-12': 'var(--color-dark-gray-12)',
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
