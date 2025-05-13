import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import IconButton from "../../../components/common/IconButton";
import Table from "../../../components/common/Table";
import { supabase } from "../../../supabaseClient";
import { theme } from "../../../theme";

const TransactionsTab = ({ projectId }: { projectId: string | undefined }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      (async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("projectId", projectId)
          .order("createdAt", { ascending: false });

        if (data) {
          setTransactions(data.map((item, index) => ({ ...item, index })));
          setPageNumber(
            data.length / 5 > Math.floor(data.length / 5)
              ? Math.floor(data.length / 5) + 1
              : Math.floor(data.length / 5)
          );
        }
      })();
    }
  }, [projectId]);

  return (
    <Card>
      <h2 style={{ marginBottom: 20 }}>Donations</h2>
      <Table
        css={{
          width: "100%",
          boxShadow: "none",
          table: {
            width: "100%",
          },

          "table tbody tr td": {
            display: "flex",
            alignItems: "center",
          },
        }}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              Transactions: {transactions.length} / Total Pages: {pageNumber}
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <IconButton
                onClick={() => {
                  setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
                }}
              >
                {"<"}
              </IconButton>
              <div>{currentPage + 1}</div>
              <IconButton
                onClick={() => {
                  setCurrentPage((prev) =>
                    prev < pageNumber - 1 ? prev + 1 : prev
                  );
                }}
              >
                {">"}
              </IconButton>
            </div>
          </div>
        }
        columns={columns}
        data={transactions.slice(5 * currentPage, 5 * currentPage + 5)}
      />
    </Card>
  );
};

export default TransactionsTab;

const columns = [
  {
    Header: "No.",
    accessor: "title",
    maxWidth: 50,
    Cell: ({ cell }: { cell: any }) => <div>{cell.row.original.index}</div>,
  },
  {
    Header: "Date",
    accessor: "createdAt",
    maxWidth: 100,
    Cell: ({ cell }: { cell: any }) => (
      <div>
        {cell.row.original["createdAt"].split("T")[0] +
          " " +
          cell.row.original["createdAt"].split("T")[1].split(".")[0]}
      </div>
    ),
  },
  {
    Header: "From",
    accessor: "fromAddress",
    Cell: ({ cell }: { cell: any }) => (
      <div>
        0x
        {cell.row.original.fromAddress
          ? (
              cell.row.original.fromAddress.substring(2, 5) +
              "..." +
              cell.row.original.fromAddress.substring(
                cell.row.original.fromAddress.length - 4,
                cell.row.original.fromAddress.length
              )
            ).toUpperCase()
          : "Not Saved"}
      </div>
    ),
  },
  {
    Header: "Amount",
    accessor: "amount",
    maxWidth: 100,
    Cell: ({ cell }: { cell: any }) => (
      <div>{cell.row.original.amount + " ETH"}</div>
    ),
  },
  {
    Header: "Selected Prize",
    accessor: "selectedPrize",
  },

  {
    Header: "Deliv. Address",
    accessor: "deliveryInfo",
  },
];
