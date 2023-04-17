import { styled } from "@stitches/react";
import React, { PropsWithoutRef } from "react";
import { theme } from "../theme";

interface CardProps
  extends PropsWithoutRef<React.HTMLAttributes<HTMLDivElement>> {
  css?: object;
}

const Card: React.FC<CardProps> = ({ children, css, ...props }) => {
  return (
    <StyledCard css={{ ...css }} {...props}>
      {children}
    </StyledCard>
  );
};

export default Card;

const StyledCard = styled("div", {
  background: theme.colors.white,
  borderRadius: theme.radii.xl2,
  boxShadow: theme.shadows.boxShadow3,
  padding: 20,
});
