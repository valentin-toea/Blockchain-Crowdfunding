import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/common/Button";
import { Separator } from "../../../components/common/Separator";
import Table from "../../../components/common/Table";

const FollowingTab = ({ savedCampaigns = [] }) => {
  const userColumns = getColumns();
  return (
    <Card>
      <div style={{ display: "flex", gap: 50 }}>
        <div style={{ width: "100%" }}>
          <h3>Campaigns</h3>
          <br />
          <Table
            css={{ width: "100%", boxShadow: "none", table: { width: "100%" } }}
            columns={userColumns}
            data={savedCampaigns}
            footer={<div>Campaigns: {savedCampaigns.length}</div>}
          />
        </div>
      </div>
    </Card>
  );
};

export default FollowingTab;

const getColumns = () => [
  {
    Header: "Campaign",
    accessor: "projectData.title",
    minWidth: 200,
    Cell: ({ cell }: { cell: any }) => (
      <Link to={`/project/${cell.row.original.projectId}`}>
        {cell.row.original.projectData.title}
      </Link>
    ),
  },
  {
    Header: "Days Left",
    accessor: "projectData.endDate",
    Cell: ({ cell }: { cell: any }) => (
      <div>
        {datediff(
          new Date(),
          parseDate(cell.row.original.projectData.endDate)
        ) < 0
          ? "0"
          : datediff(
              new Date(),
              parseDate(cell.row.original.projectData.endDate)
            )}
      </div>
    ),
  },
  {
    Header: "Raised",
    accessor: "projectData.raisedAmount",
  },
  {
    Header: "Goal",
    accessor: "projectData.goal",
    maxWidth: 100,
  },
];

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
