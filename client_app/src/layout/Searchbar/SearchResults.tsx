import { styled } from "@stitches/react";
import React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { theme } from "../../theme";
import { STORAGE_URL } from "../../utils";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { projectActions } from "../../slices/projectSlice";

interface SearchResultProps {
  hide?: boolean;
  results: Project[];
  closePopover: () => any;
}

const SearchResults = ({
  hide = false,
  results = [],
  closePopover,
}: SearchResultProps) => {
  const dispatch = useAppDispatch();

  if (hide) return null;
  return (
    <ResultsBody>
      <List>
        {results.map((item) => (
          <Link
            style={{ textDecoration: "none" }}
            key={item.id}
            to={`/project/${item.id}`}
            onClick={() => {
              dispatch(projectActions.loadProject(item));
              closePopover();
            }}
          >
            <ListItem>
              <div>
                <AspectRatio.Root ratio={16 / 9}>
                  <Img
                    src={item.mainImage ? STORAGE_URL + item.mainImage : ""}
                  />
                </AspectRatio.Root>
              </div>
              <div>
                <Title>{item.title}</Title>
                <Owner>
                  {"by " +
                    (!item.user?.hasCompany
                      ? item.user?.firstName + " " + item.user?.lastName
                      : item.user?.companyName)}
                </Owner>
              </div>
            </ListItem>
          </Link>
        ))}
      </List>
    </ResultsBody>
  );
};

export default SearchResults;

const AspectRatio = AspectRatioPrimitive;

const ResultsBody = styled("div", {
  maxHeight: "fit-content",
  overflowY: "scroll",
});

const List = styled("ul", {
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
});

const ListItem = styled("li", {
  padding: theme.space["1h"],
  display: "flex",
  alignItems: "center",
  gap: theme.space[2],
  borderRadius: theme.radii.lg,
  cursor: "pointer",

  "&:hover": {
    background: theme.colors.whitish200,
  },

  "& > div:first-of-type": {
    maxHeight: "50px",
    width: "80px",

    overflow: "hidden",
  },
});

const Img = styled("img", {
  objectFit: "cover",
  width: "100%",
  height: "100%",
  borderRadius: theme.radii.md,
});

const Title = styled("p", {
  color: theme.colors.neutral500,
  fontSize: "16px",
  fontWeight: "400",
});

const Owner = styled("span", {
  color: theme.colors.neutral300,
  fontSize: "12px",
});
