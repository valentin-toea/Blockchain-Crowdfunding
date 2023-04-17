import { Breadcrumbs } from "@mantine/core";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const Account = () => {
  const location = useLocation();
  return (
    <>
      <h2 style={{ marginBottom: 20 }}>
        {location.pathname
          .split("/")[2]
          .split("")
          .map((l, index) => (index === 0 ? l.toUpperCase() : l))
          .join("")}
      </h2>
      <Outlet />
    </>
  );
};

export default Account;
