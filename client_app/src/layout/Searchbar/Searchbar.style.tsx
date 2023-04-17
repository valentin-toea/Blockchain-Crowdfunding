import { keyframes, styled } from "@stitches/react";
import { theme } from "../../theme";

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const Overlay = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.541)",
  zIndex: 20,
  animation: `${fadeIn} ${theme.transitions.defaultTime} cubic-bezier(0.16, 1, 0.3, 1) forwards`,
});

export const SearchInputWrapper = styled("div", {
  all: "unset",
  width: "auto",
  zIndex: 21,
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  background: theme.colors.white,
  borderRadius: theme.radii.full,
  padding: "0.5rem 0.75rem",
  filter: theme.shadows.lgFilterShadow,
});

export const SearchInput = styled("input", {
  width: "100%",
  background: "transparent",
  outline: "none",
  fontSize: "15px",
});

export const SearchButton = styled("button", {
  background: theme.colors.green500,
  borderRadius: theme.radii.full,
  display: "flex",
  alignItems: "center",
  padding: "0.25rem 1rem",
  color: theme.colors.white,
});

export const PopoverWrapper = styled("div", {
  zIndex: 21,
  position: "relative",

  width: "50%",

  minWidth: 250,
  maxWidth: 400,
});

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(10px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

export const PopoverContent = styled("div", {
  position: "absolute",
  marginTop: 10,
  width: "150%",
  minHeight: "140px",
  maxHeight: "40vh",
  padding: "10px 15px",
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  backgroundColor: "white",
  borderRadius: theme.radii.xl2,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "500ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
    },
  },
  "&:focus": {
    boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px rgba(0,0,0,0.141)`,
  },
});

export const CloseButton = styled("button", {
  borderRadius: theme.radii.lg,
  height: 35,
  width: 55,
  color: theme.colors.red,
  background: theme.colors.lightRed,

  "&:hover": { filter: "brightness(96%)" },
  "&:focus": { boxShadow: `0 0 0 2px ${theme.colors.red}` },
});

export const PopoverContentHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "& > a": {
    textDecoration: "underline",
    fontWeight: "500",
    fontSize: "12px",
  },
});
