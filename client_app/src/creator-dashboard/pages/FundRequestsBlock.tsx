import { styled } from "@stitches/react";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import Table from "../../components/common/Table";
import { theme } from "../../theme";
import { Plus as PlusIcon } from "@styled-icons/boxicons-regular/Plus";
import Card from "../../components/Card";
import {
  getCrowdfundingInstance,
  getProjectInstance,
  projectAbi,
} from "../../lib/constants";
import RequestFundModal from "./RequestFundModal";
import Modal from "../../components/common/Modal";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import LoadingBlock from "../../components/LoadingBlock";
import { CheckDouble as CheckIcon } from "@styled-icons/boxicons-regular/CheckDouble";

const FundRequestsBlock = ({
  address = "",
  backersCount = 0,
  projectId = "-1",
}) => {
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    if (!address) return;

    const projectIns = getProjectInstance(address);
    const details = await projectIns.getDetails();
    const count = details.requestsCount;

    const req = await Promise.all(
      Array(parseInt(count))
        .fill(null)
        .map((_, index) => {
          return projectIns.requests(index);
        })
    );

    const formattedReq = req.map((data, index) => ({
      index,
      complete: data.complete,
      approvalCount: parseInt(data.approvalCount, 16),
      description: data.description,
      disapprovalCount: parseInt(data.disapprovalCount, 16),
      amount: ethers.utils.formatEther(data.value),
    }));

    setLoading(false);
    setRequests(formattedReq);
  }, [address]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!address) return;

      const projectIns = getProjectInstance(address);
      const details = await projectIns.getDetails();
      const count = details.requestsCount;

      const req = await Promise.all(
        Array(parseInt(count))
          .fill(null)
          .map((_, index) => {
            return projectIns.requests(index);
          })
      );

      const formattedReq = req.map((data, index) => ({
        index,
        complete: data.complete,
        approvalCount: parseInt(data.approvalCount, 16),
        description: data.description,
        disapprovalCount: parseInt(data.disapprovalCount, 16),
        amount: ethers.utils.formatEther(data.value),
      }));

      setLoading(false);
      setRequests(formattedReq);
    })();
  }, [address]);

  const getFunds = async (requestIndex: number) => {
    try {
      setTransactionLoading(true);

      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const signer = provider.getSigner();

      const projectIns = new ethers.Contract(address, projectAbi, signer);

      const tx = await projectIns.finalizeRequest(requestIndex);
      await tx.wait();

      toast.success(
        `The request number ${requestIndex + 1} is complete. 
        The sum will be transfered from the contract to your wallet`
      );
    } catch (error) {
      toast.error("Error while proccessing your fund receving request");
      toast.error((error as any)?.data?.data?.message);
    }

    setTransactionLoading(false);
  };

  const columns = getColumns(getFunds, backersCount);

  return (
    <Card>
      <Title>
        <h3>Funds Requests</h3>
        <Button
          style={{
            background: theme.colors.green500.toString(),
            gap: 5,
            display: "flex",
            alignItems: "center",
            color: "white",
            maxWidth: "fit-content",
            borderRadius: theme.radii.full.toString(),
          }}
          onClick={() => setOpenModal(true)}
        >
          <PlusIcon size={30} />
          <b style={{ fontSize: 18, lineHeight: 1 }}>NEW</b>
        </Button>
        <Modal
          title="Request funding"
          open={openModal}
          onOpenChange={setOpenModal}
        >
          <RequestFundModal
            contractRef={address}
            closeModal={() => setOpenModal(false)}
            resetTable={() => fetchRequests()}
            projectId={projectId}
          />
        </Modal>
      </Title>
      <LoadingBlock loading={transactionLoading}>
        <Table
          css={{ width: "100%", boxShadow: "none", table: { width: "100%" } }}
          columns={columns}
          data={requests}
          footer={<div>Total Requests: {requests.length}</div>}
          loading={loading}
        />
      </LoadingBlock>
    </Card>
  );
};

export default FundRequestsBlock;

const Title = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30,
});

const getColumns = (
  getFunds: (requestIndex: number) => any,
  backersCount: number
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
    Header: "Approves",
    accessor: "approvalCount",
    maxWidth: 100,
  },
  {
    Header: "Votes Needed",
    accessor: "approvalCount1",
    maxWidth: 100,
    Cell: ({ cell }: { cell: any }) => {
      return (
        <div>
          {!cell.row.original.complete ? Math.ceil(backersCount / 2) : "-"}
        </div>
      );
    },
  },
  {
    Header: "Complete",
    accessor: "complete",
    maxWidth: 100,
    Cell: ({ cell }: { cell: any }) => (
      <>
        {!cell.row.original.complete ? (
          <Button
            disabled={
              cell.row.original.approvalCount < Math.ceil(backersCount / 2)
            }
            color={
              cell.row.original.approvalCount < Math.ceil(backersCount / 2)
                ? ""
                : "green500"
            }
            onClick={() => getFunds(cell.row.original.index)}
          >
            {cell.row.original.approvalCount < Math.ceil(backersCount / 2)
              ? "Waiting for votes"
              : "Get Funds"}
          </Button>
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
    ),
  },
];
