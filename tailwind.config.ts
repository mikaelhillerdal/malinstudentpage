import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg, #22d3ee 0%, #a855f7 50%, #ef4444 100%)",
        "login-run": "linear-gradient(90deg, #facc15 0%, #22c55e 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
