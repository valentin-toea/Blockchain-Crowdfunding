import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollArea from "../components/common/ScrollArea";
import Logo from "../components/Logo";
import { notificationActions } from "../slices/notificationsSlice";
import { selectUserProfile } from "../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { darkTheme, theme } from "../theme";
import Header from "./Header/Header";
import { AppBody, Content, ContentWrapper } from "./Layout.style";
import Snackbar from "./Snackbar/Snackbar";

const Layout: React.FC = ({ children }) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const scrollListener = (event: any) => {
    const { scrollTop } = event.target;
    const scrollPosition = scrollTop;
    setIsTransparent((currState) => {
      if (scrollPosition > 20 && !currState) return true;
      if (scrollPosition < 20 && currState) return false;
      return currState;
    });
  };

  return (
    <AppBody className={isDarkTheme ? darkTheme : theme}>
      <ScrollArea
        height={"100vh"}
        maxHeight={"100vh"}
        zIndex={100}
        type="auto"
        onScroll={scrollListener}
      >
        <Header shadow={isTransparent} transparent={isTransparent} />
        <ContentWrapper>
          <Content>{children}</Content>
        </ContentWrapper>

        <div
          style={{
            width: "100%",
            height: 300,
            background: theme.colors.violet100.toString(),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Link
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
            to="/"
          >
            <Logo />
            <h3>Blockchain Funding</h3>
          </Link>
        </div>
      </ScrollArea>
      <Snackbar />
    </AppBody>
  );
};

export default Layout;
