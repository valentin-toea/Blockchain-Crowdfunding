import { styled } from "@stitches/react";
import { theme } from "../../theme";

export const NotificationTrayBody = styled("div", {
  minWidth: 340,
});

export const NotifcationTrayTitle = styled("span", {
  marginLeft: 10,
  fontSize: 18,
});

export const NotificationItem = styled("div", {
  minHeight: 45,
  minWidth: "100%",
  maxWidth: "100%",
  background: "white",
  transition: "100ms",
  padding: "5px 10px",
  display: "flex",
  gap: 10,
  alignItems: "center",
  paddingRight: 20,
  color: theme.colors.dark200,
  borderRadius: 4,

  /* "&::after": {
    content: " ",
    display: "block",
    borderBottom: "1px solid black",
    width: "90%",
    margin: "auto",
    bottom: "0",
    left: 0,
    position: " absolute",
  }, */

  "&:last-of-type": {},

  "&:hover": {
    background: theme.colors.violet100,
  },
});

export const NotificationDismissButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  minHeight: 25,
  minWidth: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.colors.violet500,
  cursor: "pointer",

  "&:hover": { backgroundColor: theme.colors.white },
});

export const Badge = styled("span", {
  minWidth: 15,
  position: "absolute",
  left: "50%",
  top: 5,
  fontSize: 11,
  background: "white",
  borderRadius: 6,
  lineHeight: 1,
  padding: 2,
  fontWeight: "bold",
  filter: theme.shadows.lgFilterShadow,
});
