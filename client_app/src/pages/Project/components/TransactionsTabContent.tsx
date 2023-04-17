import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

const TransactionsTabContent = ({ projectId = "0" }) => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("projectId", projectId);

      if (!error && data) setTransactions(data);
    })();
  }, [projectId]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {transactions.map((transaction) => (
        <div key={transaction.id} style={{ display: "flex", gap: 20 }}>
          <span>amount: {transaction.amount} ETH</span>
          <span>
            transaction:
            <a
              href={`https://rinkeby.etherscan.io/tx/${transaction.transactionHash}`}
            >
              {transaction.transactionHash}
            </a>
          </span>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTabContent;
