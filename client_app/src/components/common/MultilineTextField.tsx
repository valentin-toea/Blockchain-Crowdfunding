import { styled } from "@stitches/react";
import React, { HTMLInputTypeAttribute, PropsWithRef } from "react";
import { theme } from "../../theme";

interface MultilineTextFieldProps {
  label?: string | null | undefined;
  error?: boolean;
  errorLabel?: string;
  bold?: boolean;
}

const MultilineTextField = React.forwardRef<
  HTMLTextAreaElement,
  PropsWithRef<
    MultilineTextFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
  >
>(({ label, error, errorLabel, bold, ...props }, ref) => {
  return (
    <Wrapper style={{ ...props.style }}>
      {label && <Label>{label}</Label>}
      <StyledInput ref={ref} error={!!error} bold={bold} {...props} />
      {error && <ErrorMessage>{errorLabel}</ErrorMessage>}
    </Wrapper>
  );
});

export default MultilineTextField;

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 0,
});

const Label = styled("label", {
  fontSize: 14,
  fontWeight: 500,
  color: theme.colors.neutral500,
});

const StyledInput = styled("textarea", {
  fontSize: 16,
  fontWeight: 400,
  color: theme.colors.neutral500,
  background: "#F6F7F7",
  borderRadius: theme.radii.lg,
  padding: 10,
  border: "none",

  "&:focus": {
    outline: `1px solid ${theme.colors.neutral200}`,
  },

  variants: {
    error: {
      true: {
        outline: `1px solid ${theme.colors.red}`,
        "&:focus": {
          outline: `1px solid ${theme.colors.red}`,
        },
      },
    },
    bold: {
      true: {
        fontWeight: 500,
      },
    },
  },
});

const ErrorMessage = styled("label", {
  marginTop: 2,
  color: theme.colors.red,
  fontSize: 14,
  marginLeft: 5,
});
