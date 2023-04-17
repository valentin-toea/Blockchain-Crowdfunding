import { styled } from "@stitches/react";
import React from "react";
import { theme } from "../../theme";

const StyledIconButton = styled("button", {
  padding: 0,
  background: "transparent",
  borderRadius: "50%",
  outline: "none",

  variants: {
    ring: {
      true: {
        "&:hover": {
          boxShadow: ` 0 0 0 3px ${theme.colors.green300}`,
        },

        "&:active": {
          boxShadow: ` 0 0 0 3px ${theme.colors.green300}`,
        },

        '&[aria-expanded="true"]': {
          boxShadow: ` 0 0 0 3px ${theme.colors.green300}`,
        },
      },
      false: {},
    },
  },
});

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof StyledIconButton>
>(({ children, ring, ...props }, ref) => (
  <StyledIconButton ref={ref} ring={ring} {...props}>
    {children}
  </StyledIconButton>
));

export default IconButton;
