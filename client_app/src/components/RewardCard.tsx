import { styled } from "@stitches/react";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "../theme";
import Button from "./common/Button";
import MultilineTextField from "./common/MultilineTextField";
import TextField from "./common/TextField";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";
import { useDetectClickOutside } from "react-detect-click-outside";
import { toast } from "react-toastify";
import LoadingBlock from "./LoadingBlock";

interface RewardCardProps {
  index: number;
  title: string;
  threshold: number;
  description: string;
  isEditable: boolean;
  onSave?: (index: number, reward: ProjectReward) => any;
  onDelete?: (index: number) => any;
  donatorView?: boolean;
  selected?: boolean;
  setSelected?: () => any;
  onContinue?: (
    index: number,
    title: string,
    amount: string,
    setLoading: (value: boolean) => any
  ) => any;
  displaySelectScreen?: boolean;
}

const RewardCard = ({
  index,
  title,
  threshold,
  description,
  isEditable,
  onSave,
  onDelete,
  donatorView = false,
  selected = false,
  setSelected,
  onContinue,
  displaySelectScreen,
}: RewardCardProps) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const nonEditContent = (
    <>
      <RewardInfo>
        <span style={{ fontSize: 20 }}>Pledge {threshold} ETH or more</span>
        <h2>{title}</h2>
        <span>{description}</span>
      </RewardInfo>
    </>
  );

  const editContent = (
    <RewardInfo>
      <TextField
        label="Reward Name"
        placeholder="Product sample"
        value={title}
        onChange={(event) =>
          onSave?.(index, {
            title: event.target.value,
            threshold,
            description,
            isEditable: true,
          })
        }
      />
      <TextField
        label="Minimum value to get"
        type="number"
        placeholder="0.00"
        value={threshold}
        onChange={(event) =>
          onSave?.(index, {
            title,
            threshold: parseFloat(event.target.value),
            description,
            isEditable: true,
          })
        }
      />
      <MultilineTextField
        label="Details"
        placeholder="Details"
        rows={3}
        value={description}
        onChange={(event) =>
          onSave?.(index, {
            title,
            threshold,
            description: event.target.value,
            isEditable: true,
          })
        }
      />
    </RewardInfo>
  );

  const adminButtons = (
    <>
      {isEditable ? (
        <Button
          css={{ background: "#48E7C7" }}
          onClick={() => {
            onSave?.(index, {
              title,
              description,
              threshold,
              isEditable: false,
            });
          }}
        >
          SAVE
        </Button>
      ) : (
        <Button
          css={{ background: "#7D73C3" }}
          onClick={() =>
            onSave?.(index, {
              title,
              description,
              threshold,
              isEditable: true,
            })
          }
        >
          Edit
        </Button>
      )}
      <Button color="red" onClick={() => onDelete?.(index)}>
        Delete
      </Button>
    </>
  );

  return (
    <LoadingBlock loading={loading}>
      <Card
        onClick={() => setSelected?.()}
        displaySelectScreen={displaySelectScreen}
      >
        <div style={{ flex: 1 }}>
          {isEditable && editContent}
          {!isEditable && nonEditContent}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {donatorView && selected && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 10,
                alignItems: "start",
              }}
            >
              <TextField
                type="number"
                min={threshold}
                label="Pledge Amount"
                icon={<EthereumIcon size={20} />}
                defaultValue={threshold}
                ref={amountRef}
              />
              <Button
                color="green400"
                onClick={() => {
                  const changeLoading = (value: boolean) => setLoading(value);

                  if (amountRef.current) {
                    if (parseFloat(amountRef.current.value) > 0)
                      onContinue?.(
                        index,
                        title,
                        amountRef.current.value,
                        changeLoading
                      );
                    else toast.error("Can't donate with a value of 0 or under");
                  }
                }}
              >
                CONTINUE
              </Button>
            </div>
          )}
          {!donatorView && adminButtons}
        </div>
      </Card>
    </LoadingBlock>
  );
};

export default RewardCard;

const Card = styled("div", {
  width: 350,
  background: theme.colors.white,
  borderRadius: theme.radii.xl2,
  boxShadow: theme.shadows.boxShadow3,
  padding: 20,
  minHeight: 370,

  display: "flex",
  flexDirection: "column",
  position: "relative",

  variants: {
    displaySelectScreen: {
      true: {
        cursor: "pointer",
        zIndex: 1,
        "&:hover": {
          "&::before": {
            content: "",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: theme.colors.green500,
            filter: "opacity(0.6)",
            borderRadius: theme.radii.xl2,
          },
          "&::after": {
            content: "SELECT",
            color: "white",
            zIndex: 10,
            fontSize: 40,
            fontWeight: "bold",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 0)",
          },
        },
      },
    },
  },
});

const Inner = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  height: "100%",
});

const RewardInfo = styled("div", {
  flex: 1,
  display: "flex",
  gap: 15,
  flexDirection: "column",
});
