import React from "react";
import { styled } from "@stitches/react";
import { theme } from "../../theme";
import type * as Stitches from "@stitches/react";
import { getValueFromTheme } from "../../utils";

const StyledButton = styled("button", {
  color: theme.colors.textColor,
  padding: `${theme.space["2h"]} ${theme.space["4"]}`,
  background: theme.colors.dark100,
  borderRadius: theme.radii.md,
  fontWeight: "600",
  transition: "150ms",
  width: "100%",

  "&:hover": {
    boxShadow: "inset 0 0 0 10em rgb(0 0 0 / 15%)",
  },

  "&:active": {
    transform: "translateY(2px)",
  },

  variants: {
    isDisabled: {
      true: {
        background: "gray",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          transform: "none",
        },
      },
    },
  },
});

type StyledButtonProps = Stitches.VariantProps<typeof StyledButton> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    rounded?: string;
    color?: string;
    css?: object;
  };

const Button = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ children, rounded, color, css, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        {...props}
        isDisabled={props.disabled}
        css={{
          ...(rounded && { borderRadius: getValueFromTheme("radii", rounded) }),
          ...(color && { backgroundColor: getValueFromTheme("colors", color) }),
          ...css,
        }}
      >
        {children}
      </StyledButton>
    );
  }
);

export default Button;
