import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Avatar from "../../../components/common/Avatar";
import MultilineTextField from "../../../components/common/MultilineTextField";
import { Separator } from "../../../components/common/Separator";
import Comment from "./CommentsTabComponents/Comment";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import IconButton from "../../../components/common/IconButton";
import { theme } from "../../../theme";
import Button from "../../../components/common/Button";
import { useAppSelector } from "../../../store/hooks";
import { selectProject } from "../../../slices/projectSlice";
import { selectUserProfile } from "../../../slices/userSlice";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import RestrictedZone from "../../../components/RestrictedZone";
import { ShieldFillExclamation as ShieldIcon } from "@styled-icons/bootstrap/ShieldFillExclamation";

const CommentsTab = ({ canUserVote = true, remainingSumToVote = "" }) => {
  const projectData = useAppSelector(selectProject).data;
  const userData = useAppSelector(selectUserProfile);

  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<any>([]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, user: userId(*)")
      .eq("projectId", projectData?.id)
      .is("parentCommentId", null)
      .order("createdAt", { ascending: false });

    if (data && !error) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSendComment = async () => {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        userId: userData.id,
        projectId: projectData?.id,
        message,
      })
      .single();

    if (error) toast.error(error.message || error);
    if (!error && data) {
      toast.success("Comment added successfully.");
      setMessage("");
      setComments((prevComments: any) => [
        { ...data, replies: [], user: { ...userData } },
        ...prevComments,
      ]);
    }
  };

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h3>{comments.length} Comments</h3>
      <div style={{ position: "relative" }}>
        {userData.id === "-1" && (
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "min(10%, 130px)",
              zIndex: 2,
              fontSize: 16,
              fontWeight: "bold",
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            Login and Donate to this project to be able to add comments and join
            discussions
          </div>
        )}
        <div
          style={{
            display: "flex",
            maxWidth: 800,
            gap: 10,
            ...(userData.id === "-1" && { filter: "blur(5px)" }),
          }}
        >
          <Avatar fallbackText="You" large />
          <RestrictedZone
            restricted={!canUserVote}
            restrictionContent={
              <div
                style={{
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  width: 500,
                }}
              >
                <ShieldIcon size={50} />
                <p>
                  <b>You need to be a contributor to comment.</b>
                  <br />
                  <b>
                    You need to donate extra, at least {remainingSumToVote} ETH
                    to be able to vote.
                  </b>
                </p>
              </div>
            }
          >
            <MultilineTextField
              style={{ width: "100%", minWidth: "600px" }}
              rows={3}
              placeholder="Write a comment..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={userData.id === "-1"}
            />
          </RestrictedZone>
          <Button
            disabled={userData.id === "-1"}
            style={{
              width: "fit-content",
              background: "none",
              color: "black",
            }}
            onClick={handleSendComment}
          >
            <SendIcon
              size={30}
              style={{ color: theme.colors.violet400.toString() }}
            />
            SEND
          </Button>
        </div>
      </div>
      <div
        style={{
          maxWidth: 800,
          padding: 20,
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {comments.map((comment: any) => (
          <Comment
            key={comment.id}
            id={comment.id}
            username={
              !comment.user.hasCompany
                ? comment.user.firstName + " " + comment.user.lastName
                : comment.user.companyName
            }
            date={comment["createdAt"]}
            message={comment.message}
            disableReply={userData.id === "-1"}
            commentUserId={comment.user.id}
          />
        ))}
        {!comments.length && <h2>No comments yet.</h2>}
      </div>
    </Card>
  );
};

export default CommentsTab;
