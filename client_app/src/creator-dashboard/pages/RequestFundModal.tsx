import { Loader } from "@mantine/core";
import { styled } from "@stitches/react";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import MultilineTextField from "../../components/common/MultilineTextField";
import TextField from "../../components/common/TextField";
import { getProjectInstance } from "../../lib/constants";
import { supabase } from "../../supabaseClient";

const RequestFundModal: React.FC<{
  contractRef: string;
  closeModal: () => any;
  resetTable: () => any;
  projectId: string;
}> = ({ contractRef, closeModal, resetTable, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({ description: "", amount: "" });
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const addNotification = useCallback(async () => {
    const { data: backers, error: errorBig } = await supabase
      .from("backedCampaigns")
      .select("userId")
      .eq("projectId", projectId);

    const { data: projectData, error: error2 } = await supabase
      .from("projects")
      .select("title")
      .eq("id", projectId)
      .single();

    const { data: notif, error: error3 } = await supabase
      .from("notifications")
      .insert({
        message: `Campaign ${projectData.title} has made an early funding request of ${amount} ETH`,
        userId: backers?.map((backer) => backer.userId),
        projectId,
      })
      .eq("projectId", projectId);
  }, [projectId, amount]);

  const handleMakeRequest = async () => {
    try {
      if (!description) {
        setValidation((prev) => ({
          ...prev,
          description: "Description must not be empty.",
        }));
      }

      if (!amount) {
        setValidation((prev) => ({
          ...prev,
          amount: "Amount must not be empty.",
        }));
      }

      if (!amount || !description) return;

      setLoading(true);

      const projectIns = getProjectInstance(contractRef);

      await projectIns.createRequest(
        description,
        ethers.utils.parseEther(amount)
      );

      setLoading(false);
      await addNotification();
      toast.success(
        `Your request for${amount} ETH has been successfully added to the blockchain.`
      );
      closeModal();
      resetTable();
    } catch (error) {
      toast.error((error as any)?.data?.message);
    }
  };

  return (
    <Form disabled={loading}>
      <MultilineTextField
        label="Request Description"
        placeholder="We would like some early funds for..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        error={!!validation.description}
        errorLabel={validation.description}
      />
      <TextField
        label="Requested Amount"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        error={!!validation.amount}
        errorLabel={validation.amount}
      />
      <Button color="violet400" onClick={handleMakeRequest}>
        {loading ? <Loader color="white" /> : "MAKE REQUEST"}
      </Button>
      <p>
        * You will receive the requested amount from the accumulated amount,
        earlier, once at least 50% of all donnors have voted and out of all the
        votes half are positive
      </p>
    </Form>
  );
};

export default RequestFundModal;

const Form = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: " 100%",
  gap: 20,

  variants: {
    disabled: {
      true: {
        pointerEvents: "none",
      },
    },
  },
});
