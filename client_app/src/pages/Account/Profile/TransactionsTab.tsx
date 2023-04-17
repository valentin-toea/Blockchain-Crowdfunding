import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";

const TransactionsTab = ({ transactions = [] }) => {
  const columns = getColumns();
  const loading = false;

  return (
    <Card style={{ padding: 25 }}>
      <Table
        css={{ width: "100%", boxShadow: "none", table: { width: "100%" } }}
        columns={columns}
        data={transactions}
        footer={<div>Total Transactions: {transactions.length}</div>}
        loading={loading}
      />
    </Card>
  );
};

export default TransactionsTab;

const dimAddress = (value: string) =>
  value?.length > 6
    ? value.substring(2, 5) +
      "..." +
      value.substring(value.length - 4, value.length)
    : "Not Available";

const getColumns = () => [
  {
    Header: "Project",
    accessor: "project",
    Cell: ({ cell }: { cell: any }) => (
      <Link to={`/project/${cell.row.original.projectId}`}>
        {cell.row.original.projectData.title}
      </Link>
    ),
  },
  {
    Header: "Amount (ETH)",
    accessor: "amount",
  },
  {
    Header: "Hash",
    accessor: "transactionHash",
    Cell: ({ cell }: { cell: any }) => (
      <div>{"0x" + dimAddress(cell.row.original.transactionHash)}</div>
    ),
  },
  {
    Header: "Wallet",
    accessor: "fromAddress",
    Cell: ({ cell }: { cell: any }) => (
      <div>{"0x" + dimAddress(cell.row.original.fromAddress)}</div>
    ),
  },
];
