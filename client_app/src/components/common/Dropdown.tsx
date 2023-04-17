import React, { MouseEvent, ReactElement, useState } from "react";
import { styled } from "@stitches/react";
import * as Stitches from "@stitches/react";
import { theme } from "../../theme";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { Placement } from "tippy.js";

interface DropdownProps {
  trigger: ReactElement;
  align?: Placement;
  css?: object;
  modal?: boolean;
}

export const Dropdown: React.FC<
  DropdownProps & Stitches.VariantProps<typeof DropdownMenuContent>
> = ({ trigger, align = "bottom-start", modal = true, children }) => {
  const [visible, setVisible] = useState(false);

  const onTriggerClick = () => {
    setVisible(true);
  };

  const handleItemClick = () => setVisible(false);

  return (
    <Tippy
      interactive={true}
      appendTo={() => document.body}
      arrow
      animation="shift-toward-subtle"
      placement={align}
      visible={visible}
      onClickOutside={() => setVisible(false)}
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
        <DropdownMenuContent>
          {React.Children.map(children, (child) =>
            React.cloneElement(child as ReactElement, {
              ...((child as ReactElement).type === DropdownItem && {
                closeDropdown: handleItemClick,
              }),
            })
          )}
        </DropdownMenuContent>
      }
    >
      {React.cloneElement(trigger as ReactElement, { onClick: onTriggerClick })}
    </Tippy>
  );
};

interface DropdownItemProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuItem> {
  leftSlot?: ReactElement;
  rightSlot?: ReactElement;
  closeDropdown?: () => {};
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    { children, leftSlot, rightSlot, css, onClick, closeDropdown, ...props },
    ref
  ) => {
    const handleOnClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      closeDropdown?.();
    };

    return (
      <DropdownMenuItem
        ref={ref}
        css={{ ...css }}
        {...props}
        onClick={handleOnClick}
      >
        {leftSlot && <LeftSlot>{leftSlot}</LeftSlot>}
        <div style={{ marginTop: 3, width: "100%", height: 22 }}>
          {children}
        </div>
        {rightSlot && <RightSlot>{rightSlot}</RightSlot>}
      </DropdownMenuItem>
    );
  }
);

const StyledContent = styled("div", {
  minWidth: "auto",
  backgroundColor: "white",
  borderRadius: 6,
  padding: "10px 10px",
  fontWeight: 500,
  pointerEvents: "auto",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const DropdownMenuContent = StyledContent;

const itemStyles = {
  fontSize: 14,
  lineHeight: 1,
  color: theme.colors.neutral400,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 30,
  padding: "0 5px",
  paddingLeft: 15,
  paddingRight: 15,
  cursor: "pointer",
  userSelect: "none",
  outline: "none",
  transition: "100ms",

  "&:hover": {
    backgroundColor: theme.colors.violet300,
    color: "white",
  },

  variants: {
    alignContent: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
    },
  },
};

const StyledItem = styled("div", { ...itemStyles });

const DropdownMenuItem = StyledItem;

const RightSlot = styled("div", {
  paddingLeft: 10,
  color: "inherit",

  "[data-disabled] &": { color: theme.colors.neutral500 },
  "& > *": {
    minWidth: 18,
    maxWidth: 20,
  },
});

const LeftSlot = styled("div", {
  paddingRight: 10,
  color: "inherit",
  "[data-disabled] &": { color: theme.colors.neutral500 },
  "& > *": {
    minWidth: 18,
    maxWidth: 20,
  },
});
