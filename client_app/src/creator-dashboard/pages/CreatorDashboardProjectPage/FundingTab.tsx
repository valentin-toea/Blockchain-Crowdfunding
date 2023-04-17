import React from "react";
import FundRequestsBlock from "../FundRequestsBlock";

const FundingTab = ({
  contractRef = "",
  backersCount = 0,
  projectId = "-1",
}) => {
  return (
    <FundRequestsBlock
      address={contractRef}
      backersCount={backersCount}
      projectId={projectId}
    />
  );
};

export default FundingTab;
