export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#131318",
        surface: "#15121c",
        "surface-container-lowest": "#0f0d17",
        "surface-container-low": "#1d1a25",
        "surface-container": "#211e29",
        "surface-container-high": "#2c2834",
        "surface-container-highest": "#37333f",
        "surface-bright": "#3b3743",
        "on-surface": "#e7e0f0",
        "on-surface-variant": "#cbc3d9",
        outline: "#948da2",
        "outline-variant": "#494456",
        primary: "#d2bbff",
        "on-primary": "#38255e",
        "primary-container": "#5d4984",
        "on-primary-container": "#d4bdff",
        secondary: "#cfbdff",
        "secondary-container": "#513697",
        "on-secondary-container": "#c2acff",
        "secondary-fixed": "#e8ddff",
        "secondary-fixed-dim": "#00daf3",
        tertiary: "#ffb59a",
        "tertiary-container": "#963200",
        "on-tertiary-container": "#ffb79d",
        error: "#ffb4ab",
        "on-error": "#690005",
        "gold-accent": "#D4AF37",
        "gold-glow": "#FFD700"
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        headline: ["Sora", "sans-serif"],
        body: ["Hanken Grotesk", "sans-serif"],
        label: ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "display-lg": ["80px", { lineHeight: "88px", letterSpacing: "-0.04em", fontWeight: "800" }],
        "display-lg-mobile": ["48px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "36px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }]
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        gutter: "24px",
        "container-max": "1440px",
        "section-gap": "80px"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      }
    }
  }
};
