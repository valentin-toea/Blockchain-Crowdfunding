import { styled } from "@stitches/react";
import React, { PropsWithRef } from "react";
import { theme } from "../../theme";

const Label = React.forwardRef<
  HTMLLabelElement,
  PropsWithRef<React.LabelHTMLAttributes<HTMLLabelElement>>
>(({ children, ...props }, ref) => {
  return (
    <StyledLabel ref={ref} {...props}>
      {children}
    </StyledLabel>
  );
});

export default Label;

const StyledLabel = styled("label", {
  fontSize: 14,
  fontWeight: 500,
  color: theme.colors.neutral500,
});
