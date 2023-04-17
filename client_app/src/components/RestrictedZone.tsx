import { styled } from "@stitches/react";
import React, { ReactNode } from "react";

interface RestrictedZoneProps {
  restricted: boolean;
  restrictionContent?: ReactNode;
}

const RestrictedZone: React.FC<RestrictedZoneProps> = ({
  children,
  restricted,
  restrictionContent,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {restricted && (
        <RestrictionContent>
          {!restrictionContent ? "Restricted Zone" : restrictionContent}
        </RestrictionContent>
      )}
      <BlurredZone restricted={restricted}>{children}</BlurredZone>
    </div>
  );
};

export default RestrictedZone;

const BlurredZone = styled("div", {
  variants: {
    restricted: {
      true: {
        filter: "blur(7px)",
        pointerEvents: "none",
        userSelect: "none",
      },
      false: {},
    },
  },
});

const RestrictionContent = styled("div", {
  position: "absolute",
  top: "30%",
  zIndex: "5",
  left: "50%",
  transform: "translate(-50%, 0)",
});
