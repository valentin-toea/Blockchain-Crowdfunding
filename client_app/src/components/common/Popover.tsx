import React, { ReactElement, useState } from "react";
import { styled } from "@stitches/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { theme } from "../../theme";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-toward-subtle.css";

type TippyProps = React.ComponentProps<typeof Tippy>;

interface PopoverProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  trigger: ReactElement;
  closeButton?: true | false;
  title?: string;
  modal?: boolean;
  show?: boolean;
  onShowChange?: (event: boolean) => void;
  placement?: TippyProps["placement"];
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  title,
  css,
  closeButton = false,
  modal = true,
  show,
  onShowChange,
  placement,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Tippy
      interactive={true}
      appendTo={() => document.body}
      arrow
      animation="shift-toward-subtle"
      placement={placement || "bottom"}
      visible={show !== undefined ? show : visible}
      onClickOutside={() => onShowChange?.(false) || setVisible(false)}
      onShow={() => {
        if (modal) {
          document.body.style.pointerEvents = "none";
        }
      }}
      onHide={() => {
        if (modal) {
          document.body.style.pointerEvents = "";
        }
      }}
      content={
        <PopoverContent css={{ ...css }} {...props}>
          {title && <Title>{title}</Title>}
          {children}
          {closeButton && (
            <PopoverClose aria-label="Close">
              <Cross2Icon />
            </PopoverClose>
          )}
        </PopoverContent>
      }
    >
      {React.cloneElement(trigger as ReactElement, {
        onClick: () => onShowChange?.(true) || setVisible(true),
      })}
    </Tippy>
  );
};

const StyledContent = styled("div", {
  pointerEvents: "auto",
  borderRadius: 6,
  padding: "15px 15px",
  minWidth: 260,
  backgroundColor: "white",
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
});

const StyledClose = styled("div", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.violet500,
  position: "absolute",
  top: 10,
  right: 5,
  cursor: "pointer",

  "&:hover": { backgroundColor: theme.colors.violet100 },
});

const Title = styled("div", {
  color: theme.colors.dark600,
  fontSize: 16,
  lineHeight: "19px",
  marginBottom: 10,
});

const PopoverContent = StyledContent;
const PopoverClose = StyledClose;
