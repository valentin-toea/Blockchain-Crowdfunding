import { styled } from "@stitches/react";
import React from "react";
import { theme } from "../../theme";

const Title = styled("span", {
  color: theme.colors.dark600,
  fontWeight: "600",
  fontSize: "12px",
});

const List = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  fontSize: "12px",
  fontWeight: "100",
});

const ListButton = styled("button", {
  "&:hover": {
    textDecoration: "underline",
  },
});

interface RelatedSearchesListProps {
  emptyQuery: boolean;
  relatedSearches: any[];
}

const RelatedSearchesList = ({
  emptyQuery,
  relatedSearches,
}: RelatedSearchesListProps) => {
  return (
    <div>
      <Title>{emptyQuery ? "Recent searches" : "Related searches"}</Title>
      <List>
        {relatedSearches.map((searchItem) => (
          <ListButton key={searchItem}>{searchItem}</ListButton>
        ))}
      </List>
    </div>
  );
};

export default RelatedSearchesList;
