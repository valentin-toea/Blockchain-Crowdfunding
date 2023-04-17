import React, { ReactNode } from "react";
import { styled } from "@stitches/react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { theme } from "../../theme";

const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "100%",
  backgroundColor: "black",

  variants: {
    large: {
      true: {
        width: 50,
        height: 50,
        minWidth: 50,
      },
    },
  },
});

const StyledImage = styled(AvatarPrimitive.Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const StyledFallback = styled(AvatarPrimitive.Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.violet300,
  color: "white",
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  variants: {
    bg: {
      default: {},
      green: { backgroundColor: theme.colors.green400 },
      violet: { backgroundColor: theme.colors.violet300 },
      yellow: { backgroundColor: "#FFC54D" },
      pink: { backgroundColor: "#9EB23B" },
      orange: { backgroundColor: "#EC994B" },
      grey: { backgroundColor: "#DFDFDE" },
    },
  },
});

const COLORS: ("green" | "violet" | "yellow" | "pink" | "orange" | "grey")[] = [
  "green",
  "violet",
  "yellow",
  "pink",
  "orange",
  "grey",
];

interface AvatarProps {
  src?: string;
  fallbackText?: string;
  fallbackIcon?: ReactNode;
  size?: number;
  large?: boolean;
  style?: object;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  fallbackText,
  fallbackIcon,
  size,
  large,
  style,
}) => {
  const bg = fallbackText
    ? COLORS[
        Math.floor(
          (fallbackText.charCodeAt(0) + (fallbackText?.charCodeAt(1) || 0)) % 6
        )
      ]
    : "violet";

  return (
    <StyledAvatar style={{ width: size, height: size, ...style }} large={large}>
      <StyledImage src={src} alt="Avatar Picture" />
      <StyledFallback delayMs={0} bg={bg}>
        {fallbackIcon ?? fallbackText}
      </StyledFallback>
    </StyledAvatar>
  );
};

export default Avatar;
