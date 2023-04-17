import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { getCrowdfundingInstance } from "../../../lib/constants";
import {
  newProjectActions,
  selectNewProject,
  uploadProject,
} from "../../../slices/newProjectSlice";
import { projectActions } from "../../../slices/projectSlice";
import { useAppSelector } from "../../../store/hooks";
import { theme } from "../../../theme";
import Project from "../../Project/Project";
import { CheckCircle as CheckIcon } from "@styled-icons/boxicons-regular/CheckCircle";
import { Link } from "react-router-dom";
import { selectUserProfile } from "../../../slices/userSlice";
import { toast } from "react-toastify";
import {
  editProjectActions,
  selectEditProject,
} from "../../../slices/editProjectSlice";

interface LastStepProps {
  images: File[];
  mainImageIndex: number;
  setLoading: any;
  editMode?: boolean;
}

const LastStep = ({
  images,
  mainImageIndex,
  setLoading,
  editMode = false,
}: LastStepProps) => {
  const dispatch = useDispatch();
  const projectData = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  );
  const userData = useAppSelector(selectUserProfile);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(
      projectActions.loadProject({
        ...projectData,
        raisedAmount: 0,
        user: userData,
        endDate: projectData.endDate.split("/").reverse().join("-"),
      })
    );
  }, [dispatch, projectData, userData]);

  const handleFinish = async () => {
    setLoading(true);
    const crowdfundingIns = getCrowdfundingInstance();

    if (projectData.goal) {
      const days = datediff(new Date(), parseDate(projectData.endDate));

      if (days < 0) {
        toast.warning("Selected End Date is wrong!");
        return;
      }

      let tx = await crowdfundingIns.functions.startProject(
        projectData.title,
        projectData.shortDescription,
        10,
        ethers.utils.parseEther(projectData.goal.toString()),
        ethers.utils.parseEther(projectData.minimumContribution.toString())
      );

      const rc = await tx.wait();

      const projectContractRef = rc.events[0].args.contractAddress;

      console.log(projectContractRef);

      dispatch(newProjectActions.setContractRef(projectContractRef));

      dispatch(uploadProject({ mainImageIndex, images: images }));
    }

    setLoading(false);
    setOpenModal(true);
  };

  const handleUpdate = () => {
    dispatch(
      editProjectActions.uploadChanges({
        mainImageIndex,
        images: images,
        projectId: projectData.id || "-1",
      })
    );

    setLoading(false);
    setOpenModal(true);
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button
          css={{
            background: theme.colors.green500,
            fontSize: 22,
            maxWidth: 300,
          }}
          onClick={!editMode ? handleFinish : handleUpdate}
        >
          {!editMode ? "Create Campaign" : "Submit Changes"}
        </Button>
      </div>
      <h3>Preview: </h3>
      <div style={{ marginTop: 30 }}>
        <Project
          preview={true}
          previewImages={[
            images[mainImageIndex],
            ...images.filter((_, index) => index !== mainImageIndex),
          ]}
        />
      </div>
      <Modal
        fullScreen
        noCloseButton
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <CheckIcon
              size={150}
              style={{ color: theme.colors.violet300.toString() }}
            />
            <h1 style={{ fontSize: 40 }}>
              {!editMode
                ? "Project created successfully."
                : "Project edited successfully."}
            </h1>
          </div>
          <div
            style={{
              fontSize: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <p>Go to:</p>
            <p>
              <Link to={`/project/${projectData.id}`}>Project Page</Link>
            </p>
            <p>
              <Link to={`/creator-dashboard/projects/${projectData.id}`}>
                Project Admin Page
              </Link>
            </p>
            <p>
              <Link to="/">Application Home</Link>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LastStep;

const parseDate = (str: string) => {
  const mdy = str.split("/");
  return new Date(parseInt(mdy[2]), parseInt(mdy[1]) - 1, parseInt(mdy[0]));
};

const datediff = (first: Date, second: Date) => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  );
};
