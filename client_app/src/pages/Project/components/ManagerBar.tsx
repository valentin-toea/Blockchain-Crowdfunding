import { styled } from "@stitches/react";
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "../../../components/common/Separator";
import { theme } from "../../../theme";

interface ManagerBarProps {
  projectId?: string | number;
  projectTitle?: string;
}

const ManagerBar = ({ projectId, projectTitle }: ManagerBarProps) => {
  return (
    <Wrapper>
      <Side>
        <b>This is your project</b>
      </Side>
      <Side>
        <StyledLink
          to={`/creator-dashboard/edit-project/${projectId}/${projectTitle}`}
        >
          Edit
        </StyledLink>
        <Separator orientation="vertical" style={{ background: "white" }} />
        <StyledLink to={`/creator-dashboard/projects/${projectId}`}>
          Go to dashboard
        </StyledLink>
      </Side>
    </Wrapper>
  );
};

export default ManagerBar;

const Wrapper = styled("div", {
  marginBottom: "2rem",
  padding: "0.75rem",
  background: theme.colors.violet300,
  borderRadius: 10,

  "&, & *": {
    color: "white",
  },

  display: "flex",
  justifyContent: "space-between",
});

const Side = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: 10,
});

const StyledLink = styled(Link, {
  textDecoration: "none",
  fontWeight: "bold",
});
