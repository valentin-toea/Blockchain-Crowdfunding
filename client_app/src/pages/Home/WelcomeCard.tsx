import React from "react";
import Card from "../../components/Card";
import Logo from "../../components/Logo";

const WelcomeCard = () => {
  return (
    <Card
      style={{
        minHeight: 300,
        position: "relative",
        padding: 0,
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          zIndex: 2,
          position: "absolute",
          color: " white",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Logo white />
          <span style={{ textAlign: "center", color: "white" }}>
            Welcome to Blockchain Funding
          </span>
        </div>
      </h1>
      <video
        className="videoTag"
        autoPlay
        loop
        muted
        style={{
          height: "100%",
          width: "100%",
          float: "left",
          top: "0",
          padding: "none",
          position: "absolute",
          objectFit: "cover",
          filter: " hue-rotate(80deg)",
        }}
      >
        <source src="banner.mp4" type="video/mp4" />
      </video>
    </Card>
  );
};

export default WelcomeCard;
