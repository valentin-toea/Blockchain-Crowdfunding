import React from "react";
import Button from "../../components/common/Button";
import { LeftArrowAlt as ArrowIcon } from "@styled-icons/boxicons-regular/LeftArrowAlt";
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar/UserButton";
import NotificationTray from "../../layout/NotificationTray/NotificationTray";

const HeaderContent = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <Link style={{ textDecoration: "none" }} to="/creator-dashboard">
          <b>CREATOR DASHBOARD</b>
        </Link>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <Button
          style={{
            background: "none",
            maxWidth: "max-content",
            color: "black",
          }}
          onClick={() => navigate("/")}
        >
          <ArrowIcon size={20} />
          Back to application
        </Button>
        <NotificationTray />
        <UserAvatar />
      </div>
    </div>
  );
};

export default HeaderContent;
