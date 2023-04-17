import React from "react";
import { styled } from "@stitches/react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { theme } from "../../theme";

const StyledSeparator = styled(SeparatorPrimitive.Root, {
  backgroundColor: theme.colors.neutral200,
  margin: "6px",
  "&[data-orientation=horizontal]": { height: 1, width: "auto" },
  "&[data-orientation=vertical]": { height: "100%", width: 1 },
});

export const Separator: React.FC<
  React.ComponentProps<typeof StyledSeparator>
> = (props) => <StyledSeparator {...props} />;
