import { styled } from "@stitches/react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { theme } from "../../theme";

const StyledToolbar = styled(ToolbarPrimitive.Root, {
  display: "flex",
  flexDirection: "column",
  padding: "25px 10px",
  width: "50px",
  maxWidth: "50px",
  height: "100%",
  maxHeight: "60vh",
  minWidth: "max-content",
  borderRadius: 10,
  backgroundColor: theme.colors.primary,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",

  position: "sticky",
  top: "calc(85px + 1rem)",
});

const itemStyles = {
  all: "unset",
  flex: "0 0 auto",
  color: "#1dc071",
  height: 32,
  padding: "0 5px",
  borderRadius: 7,
  display: "inline-flex",
  fontSize: 13,
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { backgroundColor: "#d2f2e3", color: "#1dc071" },
  "&:focus": { position: "relative", boxShadow: "0 0 0 2px #77d9aa" },
};

const StyledButton = styled(
  ToolbarPrimitive.Button,
  {
    ...itemStyles,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white",
    backgroundColor: "#77d9aa",
  },
  { "&:hover": { color: "white", backgroundColor: "#77d9aa" } }
);

const StyledLink = styled(
  ToolbarPrimitive.Link,
  {
    ...itemStyles,
    backgroundColor: "transparent",
    color: "#1dc071",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  { "&:hover": { backgroundColor: "transparent", cursor: "pointer" } }
);

const StyledSeparator = styled(ToolbarPrimitive.Separator, {
  width: 1,
  backgroundColor: "#77d9aa",
  margin: "0 10px",
});

const StyledToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
  display: "inline-flex",
  flexDirection: "column",
  borderRadius: 4,
});

const StyledToggleItem = styled(ToolbarPrimitive.ToggleItem, {
  ...itemStyles,
  boxShadow: 0,
  backgroundColor: "white",
  cursor: "pointer",
  marginBottom: 12,
  "&:last-child": { marginBottom: 0 },
  "&[data-state=on]": { backgroundColor: "#a5e6c6", color: "#1dc071" },
});

// Exports
export const Toolbar = StyledToolbar;
export const ToolbarButton = StyledButton;
export const ToolbarSeparator = StyledSeparator;
export const ToolbarLink = StyledLink;
export const ToolbarToggleGroup = StyledToggleGroup;
export const ToolbarToggleItem = StyledToggleItem;
