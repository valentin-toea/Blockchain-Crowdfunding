import { Checkbox, CheckboxGroup, Loader } from "@mantine/core";
import { styled } from "@stitches/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CampaignCard from "../../components/CampaignCard";
import Card from "../../components/Card";
import Button from "../../components/common/Button";
import { projectActions } from "../../slices/projectSlice";
import {
  searchPageActions,
  selectSearchPageState,
} from "../../slices/searchPageSlice";
import { useAppSelector } from "../../store/hooks";
import { supabase } from "../../supabaseClient";
import { CATEGORIES, STORAGE_URL } from "../../utils";

/* const CATEGORIES = [
  "Supply Chain",
  "Security",
  "Sales",
  "Education",
  "Media",
  "Others",
]; */

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchPageProjects = useAppSelector(selectSearchPageState).projects;
  const loading = useAppSelector(selectSearchPageState).loading;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [containsAllCategories, setContainsAllCategories] = useState(false);
  const [status, setStatus] = useState("");

  const categories = useMemo(
    () =>
      location.hash.split("&")[0].split("#categories=")[1]?.split(",") || [],
    [location.hash]
  );

  console.log(categories);

  const containsAll = useMemo(
    () => (location.hash.split("all=")[1] ? true : false),
    [location.hash]
  );
  console.log(containsAll);

  const _status = useMemo(
    () => location.hash.split("status=")[1] || "",
    [location.hash]
  );

  useEffect(() => {
    if (categories) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }

    if (containsAll) setContainsAllCategories(true);
    else setContainsAllCategories(false);

    if (_status) setStatus(_status);
    else setStatus("");

    (async () => {
      let req = supabase.from("projects").select("*, user: profiles!userId(*)");

      if (_status) {
        if (_status === "Ongoing")
          req = supabase
            .rpc("filter_ongoing_projects")
            .select("*, user: profiles!userId(*)");
        if (_status === "Done")
          req = supabase
            .rpc("filter_done_projects")
            .select("*, user: profiles!userId(*)");
      }

      if (location.search)
        req = req.ilike("title", `%${location.search.split("?search=")[1]}%`);
      if (categories?.length && !containsAll)
        req = req.overlaps("categories", categories);
      if (categories?.length && containsAll)
        req = req.contains("categories", categories);

      const { data, error } = await req;
      dispatch(searchPageActions.setProjects(data || []));
    })();
  }, [categories, containsAll, location.search, dispatch, _status]);

  const handleFilterSearch = async () => {
    navigate(
      location.pathname +
        location.search +
        (selectedCategories.length
          ? `#categories=` +
            selectedCategories.reduce(
              (prev, curr, index) => prev + (index !== 0 ? "," : "") + curr,
              ""
            )
          : "") +
        (selectedCategories.length && containsAllCategories
          ? "&all=true"
          : "") +
        (status
          ? `${selectedCategories.length ? "&" : "#"}status=${status}`
          : "")
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <div style={{ width: "100%" }}>
        <h2>
          {location.search
            ? `Results from: ${location.search.split("?search=")[1]}`
            : "Search for Campaigns"}
        </h2>
      </div>
      <div style={{ display: "flex", gap: 50 }}>
        <Card
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 30,
            height: "max-content",
            maxWidth: 300,
          }}
        >
          <h2>Filters </h2>
          <div>
            <h4>Status </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Checkbox
                color="violet"
                label="Ongoing"
                checked={status === "Ongoing"}
                onChange={(event) =>
                  event.currentTarget.checked && setStatus("Ongoing")
                }
              />
              <Checkbox
                color="violet"
                label="Done"
                checked={status === "Done"}
                onChange={(event) =>
                  event.currentTarget.checked && setStatus("Done")
                }
              />
            </div>
          </div>
          <div>
            <h4>Categories </h4>
            <div style={{ display: "flex", gap: 20 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <CheckboxGroup
                  color="violet"
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                >
                  {CATEGORIES.map((category) => (
                    <Checkbox
                      key={category}
                      style={{ width: "45%" }}
                      value={category}
                      label={category}
                    />
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          </div>
          <div>
            <h4>Contains All Selected Categories </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Checkbox
                color="violet"
                label="Yes"
                checked={containsAllCategories}
                onChange={(event) =>
                  setContainsAllCategories(event.currentTarget.checked)
                }
              />
            </div>
          </div>

          <Button color="green400" onClick={handleFilterSearch}>
            SEARCH
          </Button>
        </Card>
        <div style={{ width: "100%", paddingTop: 10 }}>
          {!searchPageProjects.length && <h3>No results.</h3>}
          {loading && (
            <div style={{ marginBottom: 20 }}>
              <Loader color="violet" size={100} />
              <span style={{ fontSize: 20 }}>Looking for Projects...</span>
            </div>
          )}
          <ProjectsGrid>
            {searchPageProjects.map((project: Project) => (
              <CampaignCard
                key={project.id}
                onClick={() => {
                  dispatch(projectActions.loadProject(project));
                  navigate(`/project/${project.id?.toString()}`);
                }}
                title={project.title}
                description={project.shortDescription}
                progress={project.raisedAmount}
                goal={project.goal}
                endDate={project.endDate}
                backersNum={project.backers}
                imageSrc={
                  project.mainImage
                    ? STORAGE_URL + project.mainImage
                    : undefined
                }
                authorName={
                  !project.user?.hasCompany
                    ? project.user?.firstName + " " + project.user?.lastName
                    : project.user.companyName
                }
                authorId={project.user?.id}
                categories={project.categories}
              />
            ))}
          </ProjectsGrid>
        </div>
      </div>
    </div>
  );
};

export default Projects;

const ProjectsGrid = styled("div", {
  width: "100%",
  display: " grid",
  gridTemplateColumns: "repeat(auto-fill, 270px)",
  gap: 15,
});
