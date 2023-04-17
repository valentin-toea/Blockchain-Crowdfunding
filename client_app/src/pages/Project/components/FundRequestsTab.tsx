import { styled } from "@stitches/react";
import { ethers } from "ethers";
import React, { useMemo } from "react";
import { toast } from "react-toastify";
import Card from "../../../components/Card";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import LoadingBlock from "../../../components/LoadingBlock";
import RestrictedZone from "../../../components/RestrictedZone";
import { getProjectInstance, projectAbi } from "../../../lib/constants";
import { theme } from "../../../theme";
import { ShieldFillExclamation as ShieldIcon } from "@styled-icons/bootstrap/ShieldFillExclamation";
import { CheckDouble as CheckIcon } from "@styled-icons/boxicons-regular/CheckDouble";

const FundRequestsTab = ({
  requests = [],
  contractRef = "",
  loading = false,
  canUserVote = true,
  backersCount = 0,
  remainingSumToVote = "",
  refetchData,
}: {
  requests: any[];
  contractRef: string;
  loading: boolean;
  canUserVote: boolean;
  backersCount: number;
  remainingSumToVote: string;
  refetchData: () => any;
}) => {
  const handleApprove = async (requestIndex: number, value: boolean) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();

      const projectIns = new ethers.Contract(contractRef, projectAbi, signer);

      //const projectIns = getProjectInstance(contractRef);

      await projectIns.approveRequest(requestIndex, value);
      toast.success("Your vote has been succesfully registered");
      refetchData();
    } catch (error) {
      toast.error("Error: " + (error as any).toString());
    }
  };
  const columns = createColumns(backersCount, handleApprove);

  return (
    <Card>
      <h3 style={{ marginBottom: 20 }}>Early Funding Requests - Voting</h3>
      <RestrictedZone
        restricted={!canUserVote}
        restrictionContent={
          <div
            style={{
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <ShieldIcon size={50} />
            <p>
              <b>This zone is available only to contributors</b>
              <br />
              <b>
                You need to donate extra, at least {remainingSumToVote} ETH to
                be able to vote
              </b>
            </p>
          </div>
        }
      >
        <LoadingBlock loading={loading}>
          <Table
            css={{
              boxShadow: "none",
              width: "100%",
              maxWidth: 1000,
              table: { width: "100%" },
            }}
            footer={<div>Total Requests: {requests.length}</div>}
            columns={columns}
            data={requests}
          />
        </LoadingBlock>
      </RestrictedZone>
    </Card>
  );
};

export default FundRequestsTab;

const createColumns = (
  backersCount: number,
  handleApprove: (requestIndex: number, value: boolean) => any
) => [
  {
    Header: "Description",
    accessor: "description",
    minWidth: 300,
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Approvals",
    accessor: "approvalCount",
  },
  {
    Header: "Votes Needed",
    accessor: "approvalCount1",
    Cell: ({ cell }: { cell: any }) => {
      return (
        <div>
          {!cell.row.original.complete ? Math.ceil(backersCount / 2) : "-"}
        </div>
      );
    },
  },
  {
    Header: "",
    accessor: "approve",
    Cell: ({ cell }: { cell: any }) => {
      return (
        <>
          {!cell.row.original.complete ? (
            !cell.row.original.hasUserVoted ? (
              <Button
                color="green400"
                onClick={() => handleApprove(cell.row.original.index, true)}
              >
                Approve
              </Button>
            ) : (
              <div>
                <CheckIcon
                  size={35}
                  style={{ color: theme.colors.green400.toString() }}
                />
                Voted
              </div>
            )
          ) : (
            <div>
              <CheckIcon
                size={35}
                style={{ color: theme.colors.green400.toString() }}
              />
              Complete
            </div>
          )}
        </>
      );
    },
  },
];
