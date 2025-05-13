import { styled } from "@stitches/react";
import React from "react";
import { theme } from "../theme";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { FolderOutline as FolderIcon } from "@styled-icons/evaicons-outline/FolderOutline";
import Avatar from "./common/Avatar";
import { Link } from "react-router-dom";

const CampaignCard = ({
  imageSrc = "https://i.imgur.com/5Y6aT02.jpeg",
  title = "Card test 1",
  description = "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  progress = 0,
  goal = "1800",
  backersNum = 12,
  authorName = "Marian Andrei",
  authorId = "-2",
  onClick = () => {},
  categories = ["Campaign"],
  endDate = "2029-12-25T123",
}) => {
  return (
    <Card>
      {(progress >= parseFloat(goal) ||
        datediff(new Date(), parseDate(endDate)) < 0) && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            background: theme.colors.violet400.toString(),
            color: "white",
            padding: 5,
            borderRadius: 10,
            fontWeight: "bold",
          }}
        >
          DONE
        </div>
      )}
      <CardPicture>
        <AspectRatio.Root ratio={16 / 9}>
          <img
            src={imageSrc}
            alt="campaign"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </AspectRatio.Root>
      </CardPicture>
      <CardBody>
        <CampaignCategory>
          <FolderIcon size={15} />
          {categories.map((category, index) => (
            <span key={category}>
              {category}
              {index !== categories.length - 1 && ","}
            </span>
          ))}
        </CampaignCategory>
        <TitleWrapper onClick={onClick}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </TitleWrapper>
        <CampaignInfo>
          <InfoItem>
            <span>
              <b style={{ fontSize: 12 }}>ETH</b> {progress}
            </span>
            <span>
              Raised of <b style={{ fontSize: 8 }}>ETH</b> {goal}
            </span>
          </InfoItem>
          <InfoItem>
            <span>{backersNum}</span>
            <span>Total backers</span>
          </InfoItem>
        </CampaignInfo>
        <CampaignAuthor>
          <Avatar
            fallbackText={authorName
              .split(" ")
              .map((word) => word[0])
              .join("")}
            size={30}
            style={{ minWidth: 30 }}
          />
          <div>
            <span>{"by "}</span>
            <span>
              <Link to={`/profile/${authorId}`}>{authorName}</Link>
            </span>
          </div>
        </CampaignAuthor>
      </CardBody>
    </Card>
  );
};

export default CampaignCard;

const CardPicture = styled("div", {
  heigt: 150,
  minHeight: 150,
  maxHeight: 150,
  borderTopLeftRadius: theme.radii.xl2,
  borderTopRightRadius: theme.radii.xl2,
  overflow: "hidden",

  "& > div": {
    transition: "transform 500ms ease",
  },
});

const Card = styled("div", {
  width: 270,
  height: "100%",
  background: theme.colors.white,
  borderRadius: theme.radii.xl2,
  boxShadow: theme.shadows.boxShadow3,
  display: "flex",
  flexDirection: "column",
  position: "relative",

  "&:hover": {
    [`& ${CardPicture} div`]: {
      transform: "scale(1.08)",
    },
  },
});

const CardBody = styled("div", {
  height: "100%",
  padding: theme.space[4],
  display: "flex",
  flexDirection: "column",
});

const CampaignCategory = styled("div", {
  display: "flex",
  gap: 5,
  marginBottom: 10,
  color: theme.colors.textSecondary,
  fontWeight: "500",
  fontSize: 12,
  "& span": {
    color: theme.colors.textSecondary,
  },
});

const CardTitle = styled("h4", {
  fontSize: 18,
});

const TitleWrapper = styled("div", {
  flex: 1,
  cursor: "pointer",
  "&:hover": {
    [`& ${CardTitle}`]: {
      textDecoration: "underline",
    },
  },
});

const CardDescription = styled("div", {
  color: theme.colors.textSecondary,
  fontSize: 14,
  height: 40,
  overflow: "hidden",
});

const CampaignInfo = styled("div", {
  margin: "15px 0px",
  display: "flex",
  gap: 50,
});

const InfoItem = styled("div", {
  display: "flex",
  flexDirection: "column",
  "&>span:first-child": {
    color: theme.colors.neutral400,
    fontWeight: "bold",
  },
  "&>span:not(:first-child)": {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});

const CampaignAuthor = styled("div", {
  display: "flex",
  gap: 10,
  alignItems: "center",
  "& > div > span:nth-child(1)": {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  "& > div > span:nth-child(2)": {
    color: theme.colors.neutral400,
    fontWeight: "bold",
    fontSize: 12,

    "& > a": {
      color: "inherit",
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
});

const parseDate = (str: string) => {
  const mdy = str.split("T")[0].split("-");
  return new Date(parseInt(mdy[0]), parseInt(mdy[1]) - 1, parseInt(mdy[2]));
};

const datediff = (first: Date, second: Date) => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  );
};
