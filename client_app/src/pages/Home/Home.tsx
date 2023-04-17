import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CampaignCard from "../../components/CampaignCard";
import {
  homePageActions,
  selectHomePageState,
} from "../../slices/homePageSlice";
import { projectActions } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { STORAGE_URL } from "../../utils";
import Carousel from "./Carousel";
import WelcomeCard from "./WelcomeCard";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectHomePageState);

  useEffect(() => {
    if (!state.cached) {
      dispatch(homePageActions.getAllProjects());
      dispatch(homePageActions.getOngoingProjects());
      dispatch(homePageActions.getMostPopularProjects());
    }
  }, [dispatch, state.cached]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
      <WelcomeCard />
      {state.loading && <div>Loading...</div>}
      <div>
        <h2>Newest Campaigns</h2>
        <div style={{ marginTop: 10 }}>
          <Carousel
            items={state.projects.map((project: Project) => (
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
          />
        </div>
      </div>
      <div>
        <h2>Still Ongoing</h2>
        <div style={{ marginTop: 20 }}>
          <Carousel
            items={state.ongoingProjects.map((project: Project) => (
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
          />
        </div>
      </div>
      <div>
        <h2>Most Popular</h2>
        <div style={{ marginTop: 20 }}>
          <Carousel
            items={state.mostPopularProjects.map((project: Project) => (
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
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
