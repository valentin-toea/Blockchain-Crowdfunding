import { ThemeIcon } from "@mantine/core";
import React from "react";
import { Vk } from "@styled-icons/boxicons-logos/Vk";

const Logo = ({ white = false }) => {
  return (
    <div style={{ width: 50, display: "flex", justifyContent: "center" }}>
      <ThemeIcon
        radius="md"
        size={45}
        color="dark"
        style={{ ...(white && { backgroundColor: "white" }) }}
      >
        <Vk size="14px" style={{ color: !white ? "white" : "black" }} />
      </ThemeIcon>
    </div>
  );
};

export default Logo;
