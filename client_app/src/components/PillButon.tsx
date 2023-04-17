import { styled } from "@stitches/react";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "../theme";
import { CheckCircle as CheckIcon } from "@styled-icons/boxicons-regular/CheckCircle";

interface PillButtonProps {
  value?: number | string;
  onChange?: (selected: boolean, value: number | string | undefined) => any;
  selected?: boolean;
}

const PillButon: React.FC<PillButtonProps> = ({
  children,
  value,
  onChange,
  selected,
}) => {
  return (
    <StyledPillButton
      selected={selected}
      onClick={() => onChange?.(!selected, value)}
    >
      <ChildrenWrapper selected={selected}>{children}</ChildrenWrapper>
      {selected && <CheckIcon size={20} />}
    </StyledPillButton>
  );
};

export default PillButon;

const ChildrenWrapper = styled("div", {
  margin: "0 13px",
  variants: {
    selected: {
      true: {
        margin: 0,
      },
    },
  },
});

const StyledPillButton = styled("button", {
  display: "flex",
  gap: 6,
  padding: theme.space[3],
  fontSize: 16,
  color: theme.colors.dark100,
  border: `1px solid ${theme.colors.textSecondary}`,
  borderRadius: theme.radii.full,
  boxShadow: theme.shadows.boxShadow1,
  variants: {
    selected: {
      true: {
        background: theme.colors.violet100,
        color: theme.colors.violet400,
        borderColor: theme.colors.violet100,
      },
    },
  },
});
