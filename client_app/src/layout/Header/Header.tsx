import React, { useEffect, useState } from "react";
import Logo from "../../components/Logo";
import Searchbar from "../Searchbar/Searchbar";
import UserButton from "../../components/UserAvatar/UserButton";
import { HeaderWrapper, LeftSide, RightSide } from "./Header.style";
import Button from "../../components/common/Button";
import { theme } from "../../theme";
import TopNavigationMenu from "../TopNavigationMenu/TopNavigationMenu";
import NotificationTray from "../NotificationTray/NotificationTray";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../slices/userSlice";
import { User as UserIcon } from "@styled-icons/boxicons-regular/User";

interface HeaderProps {
  shadow?: boolean | false;
  transparent?: boolean | false;
}

const Header = ({ shadow, transparent }: HeaderProps) => {
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  return (
    <HeaderWrapper shadow={shadow} transparent={transparent}>
      <LeftSide>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Logo />
        </div>
        <Searchbar />
      </LeftSide>
      <RightSide>
        <TopNavigationMenu />
        <Button
          rounded="lg"
          color="violet400"
          onClick={() => navigate("/create-project")}
        >
          Start a campaign
        </Button>
        {user && (
          <>
            <NotificationTray />
            <UserButton />
          </>
        )}
        {!user && (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                color="green400"
                css={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <UserIcon size={20} />
                <span style={{ color: "white" }}>Login/Signup</span>
              </Button>
            </Link>
          </>
        )}
      </RightSide>
    </HeaderWrapper>
  );
};

export default Header;
