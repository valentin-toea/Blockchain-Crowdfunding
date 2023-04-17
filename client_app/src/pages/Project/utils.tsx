import { ethers } from "ethers";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";

let eth = typeof window !== undefined ? (window as any).ethereum : null;

const getEthereumContract = () => {
  /*  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract; */
};

export const sendTransaction = async (
  userId: string,
  projectId: string,
  connectedAccount: string,
  addressTo: string,
  amount: string,
  setLoading: React.Dispatch<React.SetStateAction<any>>,
  setLoadingMsg: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    setLoading(true);
    const metamask = eth;
    console.log(connectedAccount, addressTo, amount);
    if (!connectedAccount && !addressTo && !amount) return;

    if (!metamask) return alert("Please install metamask!");

    setLoadingMsg("Creating smart contract...");
    const transactionContract = getEthereumContract();

    const parsedAmount = ethers.utils.parseEther(amount);

    setLoadingMsg("Sending transaction...");
    await metamask.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedAccount,
          to: addressTo,
          gas: "0x7EF40",
          value: parsedAmount._hex,
        },
      ],
    });

    setLoadingMsg("Publishing transaction through smart contract...");
    /*  const transactionHash = await transactionContract.publishTransaction(
      addressTo,
      parsedAmount,
      `Transferring ETH ${parsedAmount} to ${addressTo}`,
      "TRANSFER"
    );

    setLoadingMsg("Retrieving transaction hash...");
    await transactionHash.wait();

    setLoadingMsg("Saving transaction...");
    await supabase.from("transactions").insert({
      userId,
      projectId,
      transactionHash: transactionHash.hash,
      amount,
      fromAddress: connectedAccount,
      toAddress: addressTo,
    });

    await supabase.rpc("project_add_amount", {
      amount,
      project_id: projectId,
    });
 */
    toast.success("Transaction has been successfully executed.");
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};
