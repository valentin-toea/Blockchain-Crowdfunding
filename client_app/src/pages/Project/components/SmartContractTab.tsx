import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import { getProjectInstance } from "../../../lib/constants";
import { selectProject } from "../../../slices/projectSlice";
import { useAppSelector } from "../../../store/hooks";

const SmartContractTab = () => {
  const projectData = useAppSelector(selectProject).data;
  const [data, setData] = useState<any>({});

  useEffect(() => {
    (async () => {
      if (projectData) {
        const projectIns = getProjectInstance(projectData.contractRef);
        const details = await projectIns.getDetails();
        console.log(details);
        setData({
          ...details,
          requestsCount: parseInt(details.requestsCount),
        });
      }
    })();
  }, [projectData]);

  return (
    <Card css={{ "&>p": { margin: "10px 0" } }}>
      <p>Title: {data.projectTitle}</p>
      <p>Description: {data.projectDesc}</p>
      <p>Early Fund Requests: {data.requestsCount}</p>
      <p>
        State:
        {data.currentState === 0
          ? "On-Going"
          : data.currentState === 1
          ? "Expired"
          : "Successful"}{" "}
      </p>
      <p>Backers: {projectData?.backers}</p>
    </Card>
  );
};

export default SmartContractTab;
