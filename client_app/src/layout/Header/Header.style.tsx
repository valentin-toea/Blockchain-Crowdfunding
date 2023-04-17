import { styled } from "@stitches/react";
import { Button } from "@radix-ui/react-toolbar";
import { theme } from "../../theme";

export const HeaderWrapper = styled("header", {
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  alignItems: " center",
  padding: "0 2rem",
  paddingTop: "1.5rem",
  paddingBottom: "1rem",
  background: theme.colors.appBackground,

  variants: {
    shadow: {
      true: {
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 5%)",
      },
      false: {
        boxShadow: "none",
      },
    },
    transparent: {
      true: {
        background: "rgba(250,250,250,0.8)",
        backdropFilter: "blur(4px)",
      },
    },
  },
});

const Side = {
  display: "flex",
  alignItems: "center",
};

export const LeftSide = styled("div", {
  ...Side,
  gap: "2.5rem",
  flex: 1,
});

export const RightSide = styled("div", {
  ...Side,
  gap: 20,
});
