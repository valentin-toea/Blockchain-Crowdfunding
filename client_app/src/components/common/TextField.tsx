import { styled } from "@stitches/react";
import React, {
  HTMLInputTypeAttribute,
  PropsWithRef,
  ReactNode,
  useRef,
} from "react";
import { theme } from "../../theme";
import Label from "./Label";
import { Separator } from "./Separator";

interface TextFieldProps {
  label?: string | null | undefined;
  type?: HTMLInputTypeAttribute;
  error?: boolean;
  errorLabel?: string;
  bold?: boolean;
  icon?: ReactNode;
}

const TextField = React.forwardRef<
  HTMLInputElement,
  PropsWithRef<TextFieldProps & React.InputHTMLAttributes<HTMLInputElement>>
>(({ label, type, error, errorLabel, bold, icon, ...props }, ref) => {
  const unstyledInputRef = useRef<HTMLInputElement>(null);

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      {!icon && (
        <StyledInput
          type={type ?? "text"}
          ref={ref}
          error={!!error}
          bold={bold}
          {...props}
        />
      )}
      {icon && (
        <StyledInputWrapper
          error={!!error}
          bold={bold}
          onClick={() => !ref && unstyledInputRef?.current?.focus()}
        >
          <span style={{ margin: "0 5px" }}>{icon}</span>
          <UnstyledInput
            type={type ?? "text"}
            {...props}
            ref={ref ?? unstyledInputRef}
          />
        </StyledInputWrapper>
      )}
      {error && <ErrorMessage>{errorLabel}</ErrorMessage>}
    </Wrapper>
  );
});

export default TextField;

const Wrapper = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 0,
});

const StyledInput = styled("input", {
  fontSize: 16,
  fontWeight: 400,
  color: theme.colors.neutral500,
  background: "#F6F7F7",
  borderRadius: theme.radii.lg,
  padding: 10,

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

const StyledInputWrapper = styled("div", {
  color: theme.colors.neutral500,
  background: "#F6F7F7",
  borderRadius: theme.radii.lg,
  display: "flex",
  alignItems: "center",
  cursor: "text",

  "&:focus-within": {
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

const UnstyledInput = styled("input", {
  padding: "10px 10px 10px 0px",
  width: "100%",
  outline: "none",
  fontSize: 16,
  fontWeight: 400,
});
