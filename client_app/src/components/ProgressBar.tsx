import React from "react";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { styled } from "@stitches/react";
import { theme } from "../theme";

const StyledProgress = styled(ProgressPrimitive.Root, {
  position: "relative",
  overflow: "hidden",
  background: "#EEF0F4",
  borderRadius: "99999px",
  height: 15,
  width: "100%",
});

const StyledIndicator = styled(ProgressPrimitive.Indicator, {
  backgroundColor: theme.colors.green500,
  width: "100%",
  height: "100%",
  transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
});

const Wrapper = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const Labels = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",

  variants: {
    noStartLabel: {
      true: {
        justifyContent: "flex-end",
      },
    },
  },
});

const ProgressBarWrapper = styled("div", {
  display: "flex",
  gap: 10,
  alignItems: "center",
});

// Exports
const Progress = StyledProgress;
const ProgressIndicator = StyledIndicator;

interface ProgressBarProps {
  value: number;
  maxValue: number;
  startLabel?: string | number;
  endLabel?: string | number;
  showPercentage?: boolean;
  style?: object;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
  startLabel,
  endLabel,
  showPercentage,
  style,
}) => {
  const [currentProgress, setCurrentProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setCurrentProgress((100 * value) / maxValue),
      500
    );
    return () => clearTimeout(timer);
  }, [value, maxValue]);

  return (
    <ProgressBarWrapper style={style}>
      {showPercentage && (
        <span style={{ height: 21 }}>
          <b>{currentProgress.toFixed(1)}%</b>
        </span>
      )}
      <Wrapper>
        {(startLabel || endLabel) && (
          <Labels noStartLabel={!startLabel}>
            {startLabel && <span>{startLabel}</span>}
            {endLabel && <span>{endLabel}</span>}
          </Labels>
        )}
        <Progress value={currentProgress > 100 ? 100 : currentProgress}>
          <ProgressIndicator
            style={{
              transform: `translateX(-${
                100 - (currentProgress > 100 ? 100 : currentProgress)
              }%)`,
            }}
          />
        </Progress>
      </Wrapper>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
