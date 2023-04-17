import React from "react";
import { styled } from "@stitches/react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { theme } from "../../theme";
import Label from "./Label";

interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => any;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, checked, onChange }, ref) => {
    return (
      <SwitchWrapper hasLabel={!!label}>
        <Label>{label}</Label>
        <StyledSwitch
          defaultChecked
          id="s1"
          ref={ref}
          checked={checked}
          onCheckedChange={onChange}
        >
          <StyledThumb />
        </StyledSwitch>
      </SwitchWrapper>
    );
  }
);

export default Switch;

const SwitchWrapper = styled("div", {
  display: "flex",
  alignItems: " center",

  variants: {
    hasLabel: {
      true: {
        gap: 10,
      },
    },
  },
});

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: "unset",
  cursor: "pointer",
  width: 42,
  height: 25,
  backgroundColor: theme.colors.neutral100,
  borderRadius: "9999px",
  position: "relative",
  boxShadow: `0 2px 10px ${theme.shadows.boxShadowColor1}`,
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  "&:focus": { boxShadow: `0 0 0 2px rgba(0,0,0,0.5)` },
  '&[data-state="checked"]': { backgroundColor: "#3FE6C5" },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: "block",
  width: 21,
  height: 21,
  backgroundColor: "white",
  borderRadius: "9999px",
  boxShadow: `0 2px 2px ${theme.shadows.boxShadowColor1}`,
  transition: "transform 100ms",
  transform: "translateX(2px)",
  willChange: "transform",
  '&[data-state="checked"]': { transform: "translateX(19px)" },
});
