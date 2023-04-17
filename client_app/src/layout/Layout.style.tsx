import { styled } from "@stitches/react";
import { theme } from "../theme";

export const AppBody = styled("div", {
  minHeight: "100vh",
  height: "100%",
  backgroundColor: theme.colors.appBackground,
});

export const ContentWrapper = styled("div", {
  width: "100%",
  minHeight: "calc(100vh - 85px - 1rem)",
  display: "flex",
  gap: "2.5rem",
  padding: "0 2rem",
});

export const Content = styled("main", {
  width: "100%",
  marginBottom: 20,
  marginTop: 20,
});
