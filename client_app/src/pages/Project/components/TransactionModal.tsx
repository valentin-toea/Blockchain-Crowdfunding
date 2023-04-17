import { Loader } from "@mantine/core";
import { ethers } from "ethers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import TextField from "../../../components/common/TextField";
import { getProjectInstance, projectAbi } from "../../../lib/constants";
import { selectProject } from "../../../slices/projectSlice";
import { selectUserProfile } from "../../../slices/userSlice";
import { useAppSelector } from "../../../store/hooks";
import { supabase } from "../../../supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Navigation, Pagination, Thumbs } from "swiper";
import RewardCard from "../../../components/RewardCard";
import { Ethereum as EthereumIcon } from "@styled-icons/fa-brands/Ethereum";

import "swiper/css/pagination";
import "swiper/css";
import Label from "../../../components/common/Label";
import ScrollArea from "../../../components/common/ScrollArea";
import { addNotification } from "./notification";

const TransactionModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => any;
  refetchData: () => any;
}> = ({ open, onOpenChange, refetchData }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [amount, setAmount] = useState("10");

  const userData = useAppSelector(selectUserProfile);
  const projectData = useAppSelector(selectProject).data;

  const [selectedRewardCard, setSelectedRewardCard] = useState<number>(-1);

  const processTransaction = async () => {
    if (!amount) return;
    if (!projectData?.contractRef) return;

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
          .update({ backers: (projectData.backers ?? 0) + 1 })
          .eq("id", projectData.id);
      }

      toast.success("Your transaction has been successfully processed.");

      if (
        parseFloat(amount) + parseFloat(projectData.raisedAmount) >=
        parseFloat(projectData.goal)
      ) {
        addNotification(projectData.id || "-1");
      }

      refetchData();
    } catch (error) {
      console.log(error);
      toast.error(
        "Error: " + (error as any).message ?? (error as any).toString()
      );
    }
    setLoading(false);
    onOpenChange(false);
  };

  const handleRewardDonate = async (
    index: number,
    title: string,
    amount: string,
    setAltLoading: (value: boolean) => any
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
      setAltLoading(true);

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
        selectedPrize: `Name: ${title}, Prize Id: ${index}`,
        deliveryInfo: `Name: ${
          userData.firstName + " " + userData.lastName
        } / Country:${userData.address?.country} / Residence: ${
          userData.address?.residence
        }`,
        fromAddress: userData.wallet,
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
          .update({ backers: (projectData.backers ?? 0) + 1 })
          .eq("id", projectData.id);
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
      refetchData();
    } catch (error) {
      console.log(error);
      toast.error(
        "Error: " + (error as any).message ?? (error as any).toString()
      );
    }
    setAltLoading(false);
    onOpenChange(false);
  };

  return (
    <Modal title="Donate" large open={open} onOpenChange={onOpenChange}>
      {loading && <div>Transaction is being processed.{loadingMsg}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <Label style={{ fontSize: 18 }}>Pledge without a reward</Label>
          <div style={{ minWidth: 200, width: "fit-content" }}>
            <TextField
              type="number"
              icon={<EthereumIcon size={20} />}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <Button
            color="violet400"
            css={{
              marginTop: 10,
              display: "flex",
              minWidth: 230,
              width: "fit-content",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "end",
              fontSize: 16,
            }}
            disabled={!amount || loading}
            onClick={processTransaction}
          >
            DONATE {amount}
            {amount ? " ETH" : ""}
            {loading && <Loader color="white" style={{ marginLeft: 10 }} />}
          </Button>
        </div>
        <div>
          <Label style={{ fontSize: 18 }}>Choose a reward</Label>
          <Swiper
            slidesPerView={2.5}
            spaceBetween={30}
            modules={[Navigation, Pagination, Mousewheel]}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            mousewheel={true}
            className="transactionModalSwiper"
          >
            {projectData?.rewards.map((reward, index) => (
              <SwiperSlide key={index}>
                <RewardCard
                  {...{
                    ...reward,
                    index,
                    donatorView: true,
                    isEditable: false,
                  }}
                  key={index}
                  selected={index === selectedRewardCard}
                  setSelected={() => setSelectedRewardCard(index)}
                  onContinue={handleRewardDonate}
                  displaySelectScreen={index !== selectedRewardCard}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
