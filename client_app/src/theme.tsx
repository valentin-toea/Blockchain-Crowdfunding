import { createStitches } from "@stitches/react";

export const { theme, createTheme } = createStitches({
  theme: {
    colors: {
      appBackground: "#fcfcfd",

      white: "#ffffff",
      primary: "white",

      textColor: "#ffff",
      textSecondary: "#808191",

      green100: "#f1fbf7",
      green200: "#d2f2e3",
      green300: "#a5e6c6",
      green400: "#77d9aa",
      green500: "#4acd8d",
      green600: "#1dc071",

      violet100: "#e2dbff",
      violet200: "#c5b6fe",
      violet300: "#a992fe",
      violet400: "#8c6dfd",
      violet500: "#6f49fd",

      dark100: "#422c32",
      dark200: "#3a3a43",
      dark300: "#24242c",
      dark400: "#22222c",
      dark500: "#1c1c24",
      dark600: "#13131a",

      neutral100: "#b2b3bd",
      neutral200: "#a2a2a8",
      neutral300: "#808191",
      neutral400: "#4b5264",
      neutral500: "#171725",

      whitish100: "#fcfcfd",
      whitish200: "#f1f1f3",
      whitish300: "#fcfcfc",
      whitish400: "#fcfbff",
      whitish500: "#ffffff",

      red: "#eb5757",
      lightRed: "#F9E3E4",
    },
    space: {
      "0h": "0.125rem",
      1: "0.25rem",
      "1h": "0.375rem",
      2: "0.5rem",
      "2h": "0.625rem",
      3: "0.75rem",
      "3h": "0.875rem",
      4: "1rem",
    },
    fontSizes: {
      1: "12px",
      2: "13px",
      3: "15px",
    },
    fonts: {
      untitled: "Untitled Sans, apple-system, sans-serif",
      mono: "Söhne Mono, menlo, monospace",
    },
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      xl2: "1rem",
      full: "9999px",
    },
    shadows: {
      boxShadowColor1: "rgba(0,0,0,0.141)",
      lgFilterShadow:
        "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
      boxShadow1: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      boxShadow2:
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      boxShadow3:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      boxShadow4:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      boxShadow5:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      boxShadow6: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    zIndices: {},
    transitions: {
      defaultTime: "400ms",
    },
  },
});

export const darkTheme = createTheme("dark-theme", {
  colors: {
    primary: "black",
    hiContrast: "hsl(206,2%,93%)",
    loContrast: "hsl(206,8%,8%)",

    gray100: "hsl(206,8%,12%)",
    gray200: "hsl(206,7%,14%)",
    gray300: "hsl(206,7%,15%)",
    gray400: "hsl(206,7%,24%)",
    gray500: "hsl(206,7%,30%)",
    gray600: "hsl(206,5%,53%)",
  },
  space: {},
  fonts: {},
});
