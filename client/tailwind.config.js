/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        placeholder: "var(--placeholder)",
        "primary-hover": "var(--primary-hover)",
        chart: "var(--chart)",
        "chart-hover": "var(--chart-hover)",
        "chart-soft": "var(--chart-soft)",
        surface: "var(--surface)",
        "surface-border": "var(--surface-border)",
        "text-muted": "var(--text-muted)",
      },
    },
  },
  plugins: [],
};
