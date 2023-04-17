import { Badge } from "@mantine/core";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { styled } from "@stitches/react";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/common/Button";
import Tabs, { TabsContent } from "../../components/common/Tabs";
import { getProjectInstance } from "../../lib/constants";
import { editProjectActions } from "../../slices/editProjectSlice";
import { useAppDispatch } from "../../store/hooks";
import { supabase } from "../../supabaseClient";
import { theme } from "../../theme";
import { STORAGE_URL } from "../../utils";
import FundingTab from "./CreatorDashboardProjectPage/FundingTab";
import StatsTab from "./CreatorDashboardProjectPage/StatsTab";
import TransactionsTab from "./CreatorDashboardProjectPage/TransactionsTab";
import UpdatesTab from "./CreatorDashboardProjectPage/UpdatesTab";
import FundRequestsBlock from "./FundRequestsBlock";

const CreatorDashboardProjectPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [data, setData] = useState<Project>();
  const [backersCount, setBackersCount] = useState(0);
  const [sumOfRequests, setSumOfRequests] = useState(0);

  useEffect(() => {
    (async () => {
      let { data, error } = await supabase
        .from<Project>("projects")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) toast.error(error);
      else if (data) setData(data);
    })();

    (async () => {
      const { count, error } = await supabase
        .from("backedCampaigns")
        .select("*", { count: "exact" })
        .eq("projectId", params.id);

      if (!error && count) setBackersCount(count);
    })();

    (async () => {
      if (!data?.contractRef) return;

      const projectIns = getProjectInstance(data.contractRef);
      const details = await projectIns.getDetails();
      const count = details.requestsCount;

      const req = await Promise.all(
        Array(parseInt(count))
          .fill(null)
          .map((_, index) => {
            return projectIns.requests(index);
          })
      );

      let _sumOfRequests = 0;
      req.forEach((data, index) => {
        if (data.complete)
          _sumOfRequests += parseFloat(ethers.utils.formatEther(data.value));
      });

      setSumOfRequests(_sumOfRequests);
    })();
  }, [params.id, data?.contractRef]);

  if (!data) return <div></div>;

  return (
    <div style={{ padding: "20px 20px" }}>
      <Title>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              height: 150,
              width: 300,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: 5,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <AspectRatio.Root ratio={16 / 9}>
              <img
                src={STORAGE_URL + data.mainImage}
                alt="campaign"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </AspectRatio.Root>
          </div>
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              {data.title}
              {data.raisedAmount >= data.goal && (
                <>
                  <span style={{ marginLeft: 10, marginRight: 10 }}> -</span>
                  <span style={{ color: theme.colors.green400.toString() }}>
                    COMPLETED
                  </span>
                </>
              )}
            </h2>
            <p>{data.shortDescription}</p>
            <div style={{ marginTop: 15 }}>
              {data.categories.map((item, index) => (
                <Badge
                  key={index}
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
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to={`/creator-dashboard/edit-project/${data.id}/${data.title}`}>
            <Button
              style={{ background: "none", color: "black", fontSize: 16 }}
            >
              EDIT
            </Button>
          </Link>
          <Link to={`/project/${data.id}`}>
            <Button
              style={{
                background: "none",
                color: "black",
                minWidth: "max-content",
                fontSize: 16,
              }}
            >
              VIEW CAMPAIGN PAGE
            </Button>
          </Link>
        </div>
      </Title>
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          maxWidth: 1200,
          flexWrap: "wrap",
        }}
      >
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20 }}>Days Left:</p>
          <h2>
            {datediff(new Date(), parseDate(data.endDate)) < 0
              ? "0"
              : datediff(new Date(), parseDate(data.endDate))}
          </h2>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20 }}>Completion:</p>
          <h2>
            {((100 * data.raisedAmount) / parseFloat(data.goal)).toFixed(1)} %
          </h2>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20 }}>Goal:</p>
          <h2>{data.goal} ETH</h2>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20 }}>Raised Amount:</p>
          <h2>{data.raisedAmount} ETH</h2>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20 }}>Backers:</p>
          <h2>{backersCount} </h2>
        </Card>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 300,
            justifyContent: "center",
          }}
        >
          <p style={{ fontSize: 20, textAlign: "center" }}>
            Final sum without early fundings:
          </p>
          <h2>
            {(
              (data.raisedAmount >= data.goal
                ? parseFloat(data.raisedAmount)
                : parseFloat(data.goal)) - sumOfRequests
            ).toFixed(4)}{" "}
            ETH
          </h2>
        </Card>
      </div>
      <div style={{ marginTop: 50 }}>
        <Tabs tabList={["Stats", "Donations", "Early Funding", "Updates"]}>
          <TabsContent value="Stats">
            <StatsTab
              projectId={data.id}
              startDate={data.startDate}
              projectData={data}
            />
          </TabsContent>
          <TabsContent value="Donations">
            <TransactionsTab projectId={data.id} />
          </TabsContent>
          <TabsContent value="Early Funding">
            <FundingTab
              contractRef={data.contractRef}
              backersCount={backersCount}
              projectId={data.id}
            />
          </TabsContent>
          <TabsContent value="Updates">
            <UpdatesTab projectId={data.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDashboardProjectPage;

const Title = styled("div", {
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
});

const parseDate = (str: string) => {
  const mdy = str.split("T")[0].split("-");
  return new Date(parseInt(mdy[0]), parseInt(mdy[1]) - 1, parseInt(mdy[2]));
};

const datediff = (first: Date, second: Date) => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  );
};
