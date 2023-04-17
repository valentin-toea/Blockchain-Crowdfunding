import { ethers } from "ethers";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../../components/Card";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import { projectAbi } from "../../../lib/constants";

const BackedProjectsTab = ({ projects = [], transactions = [] }) => {
  const bestProjects = useMemo(
    () =>
      projects.map((project: any) => {
        project.projectData.donatedSum = transactions
          .filter(
            (transaction: any) => transaction.projectId === project.projectId
          )
          .map((item: any) => item.amount)
          .reduce((partialSum, a) => partialSum + a, 0);
        return project;
      }),
    [projects, transactions]
  );

  const getRefund = async (projectData: Project) => {
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
      //toast.error("Error: " + (error as any).toString());
      toast.error((error as any)?.data?.data?.message);
    }
  };

  const columns = getColumns(getRefund);
  const loading = false;

  return (
    <Card style={{ padding: 25 }}>
      <Table
        css={{ width: "100%", boxShadow: "none", table: { width: "100%" } }}
        columns={columns}
        data={bestProjects}
        footer={<div>Total Campaigns: {projects.length}</div>}
        loading={loading}
      />
    </Card>
  );
};

export default BackedProjectsTab;

const getColumns = (getRefund: (projectData: Project) => any) => [
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
    Header: "Donated (ETH)",
    accessor: "projectData.donatedSum",
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
  {
    Header: "",
    accessor: "refund",
    maxWidth: 120,
    Cell: ({ cell }: { cell: any }) => (
      <>
        {datediff(
          new Date(),
          parseDate(cell.row.original.projectData.endDate)
        ) < 0 ? (
          <Button
            color="red"
            onClick={() => getRefund(cell.row.original.projectData)}
          >
            Get Refund
          </Button>
        ) : (
          <Button disabled color="green40">
            On Going
          </Button>
        )}
      </>
    ),
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
