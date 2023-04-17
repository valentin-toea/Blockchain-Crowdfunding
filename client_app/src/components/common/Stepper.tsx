import { styled } from "@stitches/react";
import React, { ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { theme } from "../../theme";

interface StepperProps {
  options?: Array<{ name: string; icon: ReactElement }>;
  step?: number;
  onChange?: (index: number) => any;
  style?: object;
  css?: object;
  canGoNext: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  options = [],
  step = 0,
  onChange,
  style,
  css,
  canGoNext = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let nextStep = step;
    if (step < 0) nextStep = 0;
    if (step >= options.length) nextStep = options.length - 1;

    setCurrentStep(nextStep);
  }, [step, options.length]);

  return (
    <Wrapper style={{ ...style }} css={{ ...css }}>
      {options.map((option, index) => (
        <IconButton
          key={index}
          selected={index === currentStep}
          onClick={() => {
            if (canGoNext) {
              setCurrentStep(index);
              onChange && onChange(index);
            } else if (!canGoNext && index < currentStep) {
              setCurrentStep(index);
              onChange && onChange(index);
            } else {
              toast.warning("Current step is not complete.");
            }
          }}
        >
          <IconWrapper>
            {option.icon &&
              React.cloneElement(option.icon, {
                style: { height: 25, width: 25 },
              })}
          </IconWrapper>
          <span>{option.name}</span>
        </IconButton>
      ))}
    </Wrapper>
  );
};

export default Stepper;

const Wrapper = styled("div", {
  height: "100%",
  padding: theme.space["2h"],
  borderRadius: theme.radii.xl2,
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows.boxShadow2,
  background: theme.colors.white,
});

const IconWrapper = styled("div", {
  padding: theme.space["1h"],
  borderRadius: "50%",
  transition: "150ms",
});

const IconButton = styled("button", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.space[2],
  transition: "150ms",

  "&:hover": {
    "& > span": {
      color: "blue",
    },
    [`& ${IconWrapper}`]: {
      background: theme.colors.neutral100,
    },
  },

  variants: {
    selected: {
      true: {
        "& > span": {
          color: "blue",
        },
        [`& ${IconWrapper}`]: {
          background: theme.colors.neutral100,
        },
      },
    },
  },
});
