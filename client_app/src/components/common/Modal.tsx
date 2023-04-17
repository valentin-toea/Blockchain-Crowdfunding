import React, { Component, ReactNode } from "react";
import { styled, keyframes } from "@stitches/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { theme } from "../../theme";

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: "rgba(0,0,0,0.44)",
  position: "fixed",
  inset: 0,
  zIndex: 100,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: "white",
  borderRadius: 6,
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  padding: 25,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&:focus": { outline: "none" },
  zIndex: 101,

  variants: {
    large: {
      true: {
        maxWidth: "1000px",
      },
    },
    fullScreen: {
      true: {
        height: "100%",
        width: "100%",
        maxWidth: "none",
      },
    },
  },
});

const Content: React.FC<{ large?: boolean; fullScreen?: boolean }> = ({
  children,
  large,
  fullScreen,
}) => {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent large={large} fullScreen={fullScreen}>
        {children}
      </StyledContent>
    </DialogPrimitive.Portal>
  );
};

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  fontWeight: 500,
  color: theme.colors.dark400,
  fontSize: 17,
});

const StyledDescription = styled(DialogPrimitive.Description, {
  margin: "10px 0 20px",
  color: theme.colors.neutral400,
  fontSize: 15,
  lineHeight: 1.5,
});

// Exports
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogContent = Content;
const DialogClose = DialogPrimitive.Close;

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.violet400,
  cursor: "pointer",

  "&:hover": { backgroundColor: theme.colors.violet100 },
});

const Modal: React.FC<{
  title?: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => any;
  large?: boolean;
  fullScreen?: boolean;
  noCloseButton?: boolean;
}> = ({
  children,
  title,
  description,
  open,
  onOpenChange,
  large,
  fullScreen,
  noCloseButton,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent large={large} fullScreen={fullScreen}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <StyledTitle>{title}</StyledTitle>
        {!noCloseButton && (
          <DialogClose asChild>
            <IconButton>
              <Cross2Icon />
            </IconButton>
          </DialogClose>
        )}
      </div>
      <StyledDescription>{description}</StyledDescription>
      {children}
    </DialogContent>
  </Dialog>
);

export default Modal;
