import RichTextEditor from "@mantine/rte";
import { styled } from "@stitches/react";
import { ethers } from "ethers";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampaignCard from "../../components/CampaignCard";
import Card from "../../components/Card";
import Tabs, { TabsContent } from "../../components/common/Tabs";
import ImageCarousel from "../../components/ImageCarousel";
import { getProjectInstance } from "../../lib/constants";
import { projectActions, selectProject } from "../../slices/projectSlice";
import { selectUserProfile } from "../../slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { supabase } from "../../supabaseClient";
import { theme } from "../../theme";
import { STORAGE_URL } from "../../utils";
import CommentsTab from "./components/CommentsTab";
import DetailsPanel from "./components/DetailsPanel";
import FundRequestsTab from "./components/FundRequestsTab";
import ManagerBar from "./components/ManagerBar";
import RewardsColumn from "./components/RewardsColumn";
import SmartContractTab from "./components/SmartContractTab";
import TransactionsTabContent from "./components/TransactionsTabContent";
import UpdatesTab from "./components/UpdatesTab";

const Project = ({
  preview = false,
  previewImages = [],
}: {
  preview?: boolean;
  previewImages?: File[];
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const projectData = useAppSelector(selectProject).data;
  const currentUserData = useAppSelector(selectUserProfile);
  const loading = useAppSelector(selectProject).loading;

  const [fundRequests, setFundRequests] = useState<any[]>([]);
  const [canUserVote, setCanUserVote] = useState(false);
  const [remainingSumToVote, setRemainingSumToVote] = useState("");
  const [fundRequestsLoading, setFundRequestsLoading] = useState(false);
  const [backersCount, setBackersCount] = useState(0);

  const similarProjects = useAppSelector(selectProject).similarResults;

  //Check if project is loaded already (from other sources, eg. homepage)
  //Else fetch from api
  useEffect(() => {
    if (params.id && !preview) {
      const scrollArea = document.getElementById("ScrollAreaViewport");
      (scrollArea as any).scrollTop = 0;

      dispatch(projectActions.subscribeToRaisedAmountChanges(params.id));
      dispatch(projectActions.fetchProject(params.id));

      (async () => {
        const { count, error } = await supabase
          .from("backedCampaigns")
          .select("*", { count: "exact" })
          .eq("projectId", params.id);

        if (!error && count) setBackersCount(count);
      })();
    }
  }, [dispatch, params.id, preview]);

  useEffect(() => {
    if (projectData && params.id) {
      dispatch(projectActions.fetchSimilarProjects(params.id));
    }
  }, [projectData, params.id, dispatch]);

  const fetchRequests = useCallback(async () => {
    if (projectData?.contractRef) {
      setFundRequestsLoading(true);
      const projectIns = getProjectInstance(projectData.contractRef);
      const details = await projectIns.getDetails();

      const count = details.requestsCount;

      const req = await Promise.all(
        Array(parseInt(count))
          .fill(null)
          .map((_, index) => {
            return projectIns.requests(index);
          })
      );

      const hasUserVotedArr = await Promise.all(
        Array(parseInt(count))
          .fill(null)
          .map((_, index) => {
            return projectIns.hasUserVoted(index, currentUserData.wallet);
          })
      );

      const _canUserVote = await projectIns.canUserVote(currentUserData.wallet);

      setCanUserVote(_canUserVote.canVote);
      setRemainingSumToVote(
        ethers.utils.formatEther(_canUserVote.remainingSumToVote)
      );

      const formattedReq = req.map((data, index) => ({
        index,
        approvalCount: parseInt(data.approvalCount, 16),
        description: data.description,
        disapprovalCount: parseInt(data.disapprovalCount, 16),
        amount: ethers.utils.formatEther(data.value),
        complete: data.complete,
        hasUserVoted: hasUserVotedArr[index],
      }));

      setFundRequests(formattedReq);
      setFundRequestsLoading(false);
    } else setFundRequests([]);
  }, [currentUserData.wallet, projectData?.contractRef]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  //Remove current project data when exiting from project page
  useEffect(() => {
    const scrollArea = document.getElementById("ScrollAreaViewport");
    if (scrollArea) (scrollArea as any).scrollTop = 0;
    return () => {
      dispatch(projectActions.reset());
    };
  }, [dispatch]);

  if (loading) return <div>loading...</div>;
  if (!projectData) return <div>No project here!</div>;

  return (
    <Wrapper>
      {!preview && projectData.userId === currentUserData.id && (
        <ManagerBar
          projectId={projectData.id}
          projectTitle={projectData.title}
        />
      )}
      <TopSide>
        <ImageCarousel
          preview={preview}
          previewImages={previewImages}
          images={[projectData.mainImage, ...projectData.images]}
          isFromServer
        />
        <DetailsPanel
          projectData={projectData}
          backersCount={backersCount}
          refetchData={() => fetchRequests()}
        />
      </TopSide>
      <div style={{ marginTop: 30 }}>
        <Tabs
          minHeight={400}
          tabList={[
            "Story",
            "Fund Requests",
            "Updates",
            "Comments",
            "Smart-Contract",
          ]}
        >
          <TabsContent value="Story">
            <Row>
              <Col style={{ flex: 1 }}>
                <RichTextEditor
                  style={{
                    border: "none",
                    boxShadow: theme.shadows.boxShadow1.toString(),
                    borderRadius: theme.radii.xl2.toString(),
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                  readOnly
                  value={projectData.description}
                  onChange={() => null}
                />
              </Col>
              <Col>
                <RewardsColumn rewards={projectData.rewards} />
              </Col>
            </Row>
          </TabsContent>
          <TabsContent value="Transactions">
            <TransactionsTabContent projectId={projectData.id} />
          </TabsContent>
          <TabsContent value="Fund Requests">
            <FundRequestsTab
              requests={fundRequests}
              contractRef={projectData.contractRef}
              loading={fundRequestsLoading}
              canUserVote={canUserVote}
              backersCount={backersCount}
              remainingSumToVote={remainingSumToVote}
              refetchData={() => fetchRequests()}
            />
          </TabsContent>
          <TabsContent value="Updates">
            <UpdatesTab />
          </TabsContent>
          <TabsContent value="Comments">
            <CommentsTab
              canUserVote={canUserVote}
              remainingSumToVote={remainingSumToVote}
            />
          </TabsContent>
          <TabsContent value="Smart-Contract">
            <SmartContractTab />
          </TabsContent>
        </Tabs>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2 style={{ marginBottom: 10 }}>Similar Campaigns</h2>
        {!similarProjects.length && <span>No similar campaigns</span>}
        <div
          style={{
            gap: 20,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 270px)",
          }}
        >
          {similarProjects.map((item) => (
            <CampaignCard
              key={item.id}
              {...{
                ...item,
                description: item.shortDescription,
                imageSrc: STORAGE_URL + item.mainImage,
                onClick: () => {
                  dispatch(projectActions.reset());
                  navigate(`/project/${item.id}`);
                },
                authorName: !item.user?.hasCompany
                  ? item.user?.firstName + " " + item.user?.lastName
                  : item.user.companyName,
                authorId: item.user?.id,
                progress: item.raisedAmount,
                backersNum: item.backers,
              }}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Project;

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  margin: "0 20px",
  marginBottom: 100,
});

const TopSide = styled("div", {
  display: "flex",
  gap: 50,
});

const Row = styled("div", {
  display: "flex",
  gap: 50,
});

const Col = styled("div", {
  display: "flex",
  flexDirection: "column",
});
