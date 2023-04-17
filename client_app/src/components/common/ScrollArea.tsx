import React, { useEffect, useRef } from "react";
import { styled } from "@stitches/react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

const SCROLLBAR_SIZE = 10;

const StyledScrollArea = styled(ScrollAreaPrimitive.Root, {
  overflow: "hidden",
  borderRadius: 4,
});

const StyledViewport = styled(ScrollAreaPrimitive.Viewport, {
  width: "100%",
  height: "100%",
  borderRadius: "inherit",

  "& > div": {
    tableLayout: "fixed",
    maxWidth: "100%",
    width: "100%",
  },
});

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: "none",
  padding: 2,
  borderRadius: 4,
  background: "hsla(0, 0%, 0%, 0.114)",
  transition: "background 160ms ease-out",
  "&:hover": { background: "hsla(0, 0%, 0%, 0.220)" },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
    height: SCROLLBAR_SIZE,
  },
});

const StyledThumb = styled(ScrollAreaPrimitive.Thumb, {
  flex: 1,
  background: "hsl(253, 3.5%, 53.5%)",
  borderRadius: SCROLLBAR_SIZE,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 30,
    minHeight: 44,
  },
});

const StyledCorner = styled(ScrollAreaPrimitive.Corner, {
  background: "hsla(0, 0%, 0%, 0.220)",
});

const ScrollAreaRoot = StyledScrollArea;
const ScrollAreaViewport = StyledViewport;
const ScrollAreaScrollbar = StyledScrollbar;
const ScrollAreaThumb = StyledThumb;
const ScrollAreaCorner = StyledCorner;

interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaRoot> {
  height?: number | string;
  maxHeight?: number | string;
  zIndex?: number | string;
  rounded?: boolean;
  onScroll?: (event: any) => any;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  height,
  maxHeight,
  zIndex,
  rounded,
  onScroll,
  ...props
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (onScroll) {
      const handleOnScroll = (event: any) => {
        onScroll(event);
      };

      const refCurrent = ref.current;

      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleOnScroll);
        refCurrent.addEventListener("scroll", handleOnScroll);
      }
      return () => refCurrent.removeEventListener("scroll", handleOnScroll);
    }
  }, [ref, onScroll]);

  return (
    <ScrollAreaRoot {...props} css={{ ...(!rounded && { borderRadius: 0 }) }}>
      <ScrollAreaViewport
        css={{ maxHeight, height }}
        ref={ref}
        className="ScrollAreaViewport"
        id="ScrollAreaViewport"
      >
        {children}
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical" style={{ zIndex }}>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  );
};

export default ScrollArea;
