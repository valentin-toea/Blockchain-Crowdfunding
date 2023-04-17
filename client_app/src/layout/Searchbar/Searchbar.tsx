import React, { useEffect, useState } from "react";
import { Search } from "@styled-icons/evaicons-solid/Search";
import {
  CloseButton,
  Overlay,
  PopoverContent,
  PopoverContentHeader,
  PopoverWrapper,
  SearchButton,
  SearchInput,
  SearchInputWrapper,
} from "./Searchbar.style";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import RelatedSearchesList from "./RelatedSearchesList";
import SearchResults from "./SearchResults";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const relatedSearches = [
  "education fund",
  "scholarship fund",
  "education and schools fund",
];

const Searchbar = () => {
  const [open, _setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);
  const [isInitial, setIsInitial] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (text) {
      const timeout: ReturnType<typeof setTimeout> = setTimeout(async () => {
        let { data, error } = await supabase
          .from<Project>("projects")
          .select("*, user: profiles!userId(*)")
          .ilike("title", `%${text}%`)
          .limit(9);

        if (data) {
          setResults(data);
          setIsInitial(false);
        }
      }, 600);

      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setIsInitial(true);
    }
  }, [text]);

  const setOpen = (value: boolean) => {
    //document.body.style.pointerEvents = value ? "none" : "";
    _setOpen(value);
  };

  return (
    <>
      {open && <Overlay onClick={() => setOpen(false)} />}

      <PopoverWrapper>
        <SearchInputWrapper id="search" onClick={() => setOpen(true)}>
          <SearchInput
            type="text"
            placeholder="Do fundrise now"
            autoFocus
            value={text}
            onChange={(event) => setText(event.currentTarget.value)}
          />
          <SearchButton
            onClick={(event) => {
              event.stopPropagation();

              _setOpen(false);
              navigate(`/campaigns?search=${text}`);
            }}
          >
            <Search size="20px" />
          </SearchButton>
        </SearchInputWrapper>

        {open && (
          <PopoverContent
            data-state="open"
            data-side="bottom"
            data-text={!!text}
          >
            <PopoverContentHeader>
              <Link
                to={`/campaigns?search=${text}`}
                onClick={() => setOpen(false)}
              >
                {text ? "See all projects" : "Go to search page"}
              </Link>
              <CloseButton onClick={() => setOpen(false)}>
                <CloseOutline size={24} />
              </CloseButton>
            </PopoverContentHeader>
            {results.length === 0 && !isInitial && <h2>No results.</h2>}
            {isInitial && (
              <h2>
                <Search size="40px" />
                Type a name...
              </h2>
            )}
            <SearchResults
              hide={!text}
              results={results}
              closePopover={() => setOpen(false)}
            />
          </PopoverContent>
        )}
      </PopoverWrapper>
    </>
  );
};

export default Searchbar;
