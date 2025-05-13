import { ethers } from "ethers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import RewardCard from "../../../components/RewardCard";
import { projectAbi } from "../../../lib/constants";
import { selectProject } from "../../../slices/projectSlice";
import { selectUserProfile } from "../../../slices/userSlice";
import { useAppSelector } from "../../../store/hooks";
import { supabase } from "../../../supabaseClient";
import { addNotification } from "./notification";
import PledgeCard from "./PledgeCard";

const RewardsColumn = ({ rewards = [] }: { rewards: ProjectReward[] }) => {
  const [selected, setSelected] = useState(-1);
  const [displayAll, setDisplayAll] = useState(false);

  const projectData = useAppSelector(selectProject).data;
  const userData = useAppSelector(selectUserProfile);

  const handleRewardDonate = async (
    index: number,
    title: string,
    amount: string,
    setLoading: (value: boolean) => any
  ) => {
    if (projectData === null) return;
    if (
      (!userData.address?.country && !userData.address?.residence) ||
      !userData.address
    ) {
      toast.error(
        "Physical product that needs to be delivered to you. Please go to your account and add an address."
      );
      return;
    }

    try {
      setLoading(true);

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
        fromAddress: userData.wallet,
        selectedPrize: `Name: ${title}, Prize Id: ${index}`,
        deliveryInfo: `Name: ${
          userData.firstName + " " + userData.lastName
        } / Country:${userData.address?.country} / Residence: ${
          userData.address?.residence
        }`,
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

      if (
        parseFloat(amount) + parseFloat(projectData.raisedAmount) >=
        parseFloat(projectData.goal)
      ) {
        addNotification(projectData.id || "-1");
      }

      toast.success(
        "Your transaction for the prize: " +
          title +
          " has been successfully processed."
      );
    } catch (error) {
      console.log(error);
      toast.error(
        "Error: " + (error as any).message ?? (error as any).toString()
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <h2>Support</h2>
        <PledgeCard />
      </div>
      <h2 style={{ marginBottom: 20 }}>Select Rewards</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {(displayAll ? rewards : rewards.slice(0, 2)).map((reward, index) => (
          <RewardCard
            {...{ ...reward, index, donatorView: true }}
            key={index}
            selected={index === selected}
            setSelected={() => setSelected(index)}
            onContinue={handleRewardDonate}
            displaySelectScreen={index !== selected}
            isEditable={false}
          />
        ))}
        {rewards.length > 2 && (
          <Button
            style={{ background: "none", color: "black", fontSize: 18 }}
            onClick={() => setDisplayAll((prev) => !prev)}
          >
            {!displayAll ? "SEE MORE" : "SEE LESS"}
          </Button>
        )}
        {!rewards.length && <h3>No rewards.</h3>}
      </div>
    </div>
  );
};

export default RewardsColumn;
