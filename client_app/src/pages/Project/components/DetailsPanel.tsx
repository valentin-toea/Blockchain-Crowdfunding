import { Badge } from "@mantine/core";
import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../../components/common/Avatar";
import Button from "../../../components/common/Button";
import { Separator } from "../../../components/common/Separator";
import ProgressBar from "../../../components/ProgressBar";
import { theme } from "../../../theme";
import TransactionModal from "./TransactionModal";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";
import { supabase } from "../../../supabaseClient";
import { useAppSelector } from "../../../store/hooks";
import { selectUserProfile } from "../../../slices/userSlice";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { projectAbi } from "../../../lib/constants";

const convertHMS = (value: number) => {
  // const sec = parseInt(value, 10); // convert value to number if it's string
  let sec = value;
  const days = Math.floor(sec / (3600 * 24));
  sec -= days * 3600 * 24;
  const hours = Math.floor(sec / 3600);
  sec -= hours * 3600;
  const minutes = Math.floor(sec / 60);
  sec -= minutes * 60;
  sec = Math.floor(sec);

  return `${days}:${hours < 10 ? "0" + hours.toString() : hours}:${
    minutes < 10 ? "0" + minutes.toString() : minutes
  }:${sec < 10 ? "0" + sec.toString() : sec}`; // Return is HH : MM : SS
};

interface DetailsPanelProps {
  projectData: Project;
  backersCount: number;
  refetchData: () => any;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  projectData,
  backersCount,
  refetchData,
}) => {
  const [timeUntilFundingEnds, setTimeUntilFundingEnds] = useState(-1);
  const [openModal, setOpenModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveNum, setSaveNum] = useState(0);
  const [isCurrUserBacker, setIsCurrUserBacker] = useState(false);

  const userData = useAppSelector(selectUserProfile);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (projectData) {
      if (
        new Date(
          parseInt(projectData.endDate.split("-")[0]),
          parseInt(projectData.endDate.split("-")[1]) - 1,
          parseInt(projectData.endDate.split("-")[2])
        ).getTime() -
          new Date().getTime() >
        0
      ) {
        const seconds =
          (new Date(
            parseInt(projectData.endDate.split("-")[0]),
            parseInt(projectData.endDate.split("-")[1]) - 1,
            parseInt(projectData.endDate.split("-")[2])
          ).getTime() -
            new Date().getTime()) /
          1000;

        setTimeUntilFundingEnds(seconds);

        interval = setInterval(() => {
          setTimeUntilFundingEnds((time) => time - 1);
        }, 1000);
      } else setTimeUntilFundingEnds(0);
    }
    return () => interval && clearInterval(interval);
  }, [projectData]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("savedCampaigns")
        .select("*")
        .eq("projectId", projectData.id)
        .eq("userId", userData.id)
        .single();

      if (data && !error) {
        setIsSaved(true);
      }
    })();

    (async () => {
      const { error, count } = await supabase
        .from("savedCampaigns")
        .select("*", { count: "exact" })
        .eq("projectId", projectData.id);

      if (count && !error) {
        setSaveNum(count);
      }
    })();

    (async () => {
      const { error, count } = await supabase
        .from("backedCampaigns")
        .select("*", { count: "exact" })
        .eq("projectId", projectData.id)
        .eq("userId", userData.id);

      if (count && !error) {
        if (count) setIsCurrUserBacker(true);
      }
    })();
  }, [projectData, userData.id]);

  const saveProject = async () => {
    const { data, error } = await supabase
      .from("savedCampaigns")
      .insert({
        userId: userData.id,
        projectId: projectData.id,
      })
      .single();

    if (data && !error) {
      toast.success("Project saved successfully.");
      setIsSaved(true);
      setSaveNum((prev) => prev + 1);
    } else {
      toast.error(error?.message || error);
    }
  };

  const unsaveProject = async () => {
    const { data, error } = await supabase
      .from("savedCampaigns")
      .delete()
      .eq("projectId", projectData.id)
      .eq("userId", userData.id);

    if (data && !error) {
      toast.success("Project unsaved successfully.");
      setIsSaved(false);
      setSaveNum((prev) => prev - 1);
    } else {
      toast.error(error?.message || error);
    }
  };

  const getRefund = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();

      const projectIns = new ethers.Contract(
        projectData.contractRef,
        projectAbi,
        signer
      );

      //const projectIns = getProjectInstance(contractRef);

      await projectIns.getRefund();
      toast.success(
        "Your refund has been transfered to your wallet successfully"
      );
    } catch (error) {
      toast.error("Error: " + (error as any).toString());
    }
  };

  return (
    <Info>
      <h1>{projectData.title}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {projectData.categories.map((item, index) => (
            <Link
              key={index}
              style={{ textDecoration: "none" }}
              to="/projects?category="
            >
              <Badge
                styles={{
                  root: { cursor: "pointer" },
                  inner: { color: "inherit" },
                }}
                size="lg"
                color={
                  index === 0 ? "indigo" : index === 1 ? "orange" : "green"
                }
              >
                {item}
              </Badge>
            </Link>
          ))}
        </div>
        <span>{projectData.shortDescription}</span>
      </div>
      <ProgressBar
        style={{ maxWidth: 800 }}
        value={projectData.raisedAmount ?? 0}
        maxValue={parseFloat(projectData.goal) ?? 0}
        showPercentage
      />
      <FundingInfo>
        <div
          style={{
            background: "rgb(238, 240, 244)",
            borderRadius: 10,
            padding: "20px 20px",
          }}
        >
          <FundingBlock>
            {projectData.raisedAmount < projectData.goal ? (
              timeUntilFundingEnds ? (
                <>
                  <b>{convertHMS(timeUntilFundingEnds)}</b>
                  <span style={{ textAlign: "center" }}>FUNDING ENDS</span>
                </>
              ) : (
                <>
                  <b style={{ textAlign: "center" }}>FUNDING ENDED</b>
                  <span>Failed</span>
                </>
              )
            ) : (
              <>
                <b style={{ textAlign: "center" }}>FUNDING ENDED</b>
                <span>Success</span>
              </>
            )}
          </FundingBlock>
        </div>
        <Separator orientation="vertical" />
        <FundingBlock>
          <b>{projectData.raisedAmount} ETH</b>
          <span>FUNDED</span>
        </FundingBlock>
        <Separator orientation="vertical" />
        <FundingBlock>
          <b>{projectData.goal} ETH</b>
          <span style={{ textAlign: "center" }}>MAIN GOAL</span>
        </FundingBlock>
        <Separator orientation="vertical" />
        <FundingBlock>
          <b>{backersCount}</b>
          <span>BACKERS</span>
        </FundingBlock>
        <Separator orientation="vertical" />
        <FundingBlock css={{ width: "min-content" }}>
          <b>{projectData.minimumContribution} ETH</b>
          <span style={{ textAlign: "center" }}> To Become Contributor</span>
        </FundingBlock>
      </FundingInfo>
      <CampaignAuthor>
        <div>
          <span>{"by "}</span>
          <span>
            <Avatar
              fallbackText={
                !projectData.user?.hasCompany
                  ? (projectData.user?.firstName || "")[0].toUpperCase() +
                    projectData.user?.lastName[0].toUpperCase()
                  : projectData.user?.companyName[0].toUpperCase()
              }
              size={30}
              style={{ minWidth: 30 }}
            />
            <Link to={`/profile/${projectData.user?.id}`}>
              {projectData.user &&
                (projectData.user.hasCompany
                  ? projectData.user.companyName
                  : projectData.user.firstName +
                    " " +
                    projectData.user.lastName)}
            </Link>
          </span>
        </div>
      </CampaignAuthor>
      <ButtonsWrapper>
        {projectData.raisedAmount <= projectData.goal ? (
          timeUntilFundingEnds ? (
            <FundButton onClick={() => setOpenModal(true)}>
              Fund this project
            </FundButton>
          ) : isCurrUserBacker ? (
            <FundButton
              css={{ background: theme.colors.red }}
              onClick={getRefund}
            >
              Get Refund
            </FundButton>
          ) : (
            <FundButton disabled css={{ background: "" }}>
              Funding done
            </FundButton>
          )
        ) : (
          <FundButton disabled css={{ background: "" }}>
            Funding done
          </FundButton>
        )}
        {!isSaved ? (
          <ShareButton onClick={saveProject}>SAVE</ShareButton>
        ) : (
          <ShareButton onClick={unsaveProject} unsave>
            Unsave
          </ShareButton>
        )}
        <div>
          <span
            style={{
              color: theme.colors.textSecondary.toString(),
              marginRight: 10,
            }}
          >
            {" "}
            &#9679;
          </span>
          <span>{saveNum} users saved this project.</span>
        </div>
      </ButtonsWrapper>
      <div>
        <TransactionModal
          open={openModal}
          onOpenChange={(value) => setOpenModal(value)}
          refetchData={refetchData}
        />
      </div>
    </Info>
  );
};

export default DetailsPanel;

const Info = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

const FundingInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: 20,
});

const FundingBlock = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ButtonsWrapper = styled("div", {
  display: "flex",
  gap: 20,
  alignItems: "center",
});

const FundButton = styled(Button, {
  padding: 15,
  borderRadius: 30,
  background: theme.colors.green500,
  maxWidth: 200,
});

const ShareButton = styled(Button, {
  padding: 15,
  borderRadius: 30,
  background: "transparent",
  maxWidth: 200,
  border: `2px solid ${theme.colors.neutral300}`,
  color: theme.colors.neutral300,

  variants: {
    unsave: {
      true: {
        background: theme.colors.red,
        color: "white",
      },
    },
  },
});

const CampaignAuthor = styled("div", {
  display: "flex",
  gap: 10,
  alignItems: "center",
  "& > div": {
    display: "flex",
    gap: 5,
    alignItems: "center",
  },
  "& > div > span:nth-child(1)": {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  "& > div > span:nth-child(2)": {
    color: theme.colors.neutral400,
    fontWeight: "bold",
    fontSize: 14,
    display: "flex",
    gap: 5,
    alignItems: "center",

    "& > a": {
      color: "inherit",
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
});
