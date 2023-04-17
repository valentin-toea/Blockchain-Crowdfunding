import React, { useState } from "react";
import Card from "../../../components/Card";
import TextField from "../../../components/common/TextField";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";
import { theme } from "../../../theme";
import Button from "../../../components/common/Button";
import LoadingBlock from "../../../components/LoadingBlock";
import { useAppSelector } from "../../../store/hooks";
import { selectUserProfile } from "../../../slices/userSlice";
import { selectProject } from "../../../slices/projectSlice";
import { ethers } from "ethers";
import { projectAbi } from "../../../lib/constants";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import { addNotification } from "./notification";

const PledgeCard = () => {
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("10");

  const userData = useAppSelector(selectUserProfile);
  const projectData = useAppSelector(selectProject).data;

  const processTransaction = async () => {
    if (!amount) return;
    if (!projectData?.contractRef) return;

    setLoading(true);

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

      const tx = await projectIns.contribute({
        value: ethers.utils.parseEther(amount),
      });

      await tx.wait();

      await supabase.from("transactions").insert({
        userId: userData?.id,
        projectId: projectData.id,
        transactionHash: tx.hash,
        amount,
      });

      await supabase.rpc("project_add_amount", {
        amount,
        project_id: projectData.id,
      });

      const { count, error } = await supabase
        .from("backedCampaigns")
        .select("*", { count: "exact" })
        .eq("userId", userData.id)
        .eq("projectId", projectData.id);

      if (!count) {
        await supabase
          .from("backedCampaigns")
          .upsert({ userId: userData.id, projectId: projectData.id });

        await supabase
          .from("projects")
          .update({ backers: (projectData.backers ?? 0) + 1 });
      }

      //@todo: string to float
      if (
        parseFloat(amount) + parseFloat(projectData.raisedAmount) >=
        parseFloat(projectData.goal)
      ) {
        addNotification(projectData.id || "-1");
      }

      toast.success("Your transaction has been successfully processed.");
    } catch (error) {
      console.log(error);
      toast.error(
        "Error: " + (error as any).message ?? (error as any).toString()
      );
    }
    setLoading(false);
    setAmount("10");
    setSelected(false);
  };

  return (
    <Card
      style={{ display: "flex", flexDirection: "column", gap: 15 }}
      onClick={() => setSelected(true)}
    >
      <p style={{ fontSize: 18 }}>Pledge without a reward</p>
      <LoadingBlock
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
        loading={loading}
      >
        <TextField
          type="number"
          min={0}
          icon={<EthereumIcon size={20} />}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <div
          style={{
            padding: 20,
            maxWidth: 310,
            borderRadius: 10,
            background:
              "linear-gradient(0deg, rgba(92,164,170,0.21922272326899506) 6%, rgba(121,9,119,0.23602944595807074) 55%)",
          }}
        >
          <h4>Back it because you believe in it</h4>
          <span>
            Support the project for no reward, just because it speaks to you.
          </span>
        </div>
        {selected && (
          <Button color="green400" onClick={processTransaction}>
            CONTINUE
          </Button>
        )}
      </LoadingBlock>
    </Card>
  );
};

export default PledgeCard;
