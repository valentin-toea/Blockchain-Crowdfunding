import React, { useState } from "react";
import Card from "../../../../components/Card";
import Avatar from "../../../../components/common/Avatar";
import Button from "../../../../components/common/Button";
import { Separator } from "../../../../components/common/Separator";
import { theme } from "../../../../theme";
import { ArrowReturnRight as ArrowIcon } from "@styled-icons/bootstrap/ArrowReturnRight";
import MultilineTextField from "../../../../components/common/MultilineTextField";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import { CloseOutline as CloseIcon } from "@styled-icons/evaicons-outline/CloseOutline";
import { supabase } from "../../../../supabaseClient";
import { useAppSelector } from "../../../../store/hooks";
import { selectProject } from "../../../../slices/projectSlice";
import { selectUserProfile } from "../../../../slices/userSlice";
import { toast } from "react-toastify";
import { Loader } from "@mantine/core";

const Comment = ({
  id = "-1",
  username = "Cladiu Razvan",
  date = "25.06.2022",
  message = "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  disableReply = false,
  commentUserId = "-1",
}) => {
  const projectData = useAppSelector(selectProject).data;
  const userData = useAppSelector(selectUserProfile);

  const creator = projectData?.userId === commentUserId;

  const [isInReply, setIsInReply] = useState(false);

  const [replyText, setReplyText] = useState("");

  const [replies, setReplies] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleSendReply = async () => {
    if (!replyText) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        userId: userData.id,
        projectId: projectData?.id,
        message: replyText,
        parentCommentId: id,
      })
      .single();

    if (error) toast.error(error.message || error);
    if (!error && data) {
      await loadReplies();
      toast.success("Reply added successfully.");
      setReplyText("");
      setIsInReply(false);
    }
  };

  const loadReplies = async () => {
    setLoading(true);
    setShowReplies(true);

    const { data, error } = await supabase
      .from("comments")
      .select("*, user: userId(*)")
      .eq("projectId", projectData?.id)
      .eq("parentCommentId", id)
      .order("createdAt", { ascending: true });

    if (!error) setLoading(false);
    if (data && !error) setReplies(data);
  };

  const handleViewReplies = async () => {
    if (!showReplies) {
      loadReplies();
    } else setShowReplies(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            large
            fallbackText={`${
              username.split(" ")[0][0] +
              (username.split(" ").length > 1 ? username.split(" ")[1][0] : "")
            }`}
          />
          <div>
            <p>
              <b>{username}</b>{" "}
              {creator && (
                <b style={{ color: theme.colors.violet400.toString() }}>
                  CREATOR
                </b>
              )}{" "}
              {date.split("T")[0]}
            </p>
            <div>{message}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <Button
            style={{
              background: "transparent",
              maxWidth: "fit-content",
              padding: 0,
              color: "black",
            }}
            onClick={() => {
              if (disableReply) return;
              setIsInReply((prev) => !prev);
              setReplyText("");
            }}
          >
            <ArrowIcon size={12} />
            Reply
          </Button>

          <Button
            style={{
              background: "transparent",
              color: "black",
              width: "fit-content",
              padding: 2,
            }}
            onClick={handleViewReplies}
          >
            {!showReplies ? "View Replies" : "Hide Replies"}
          </Button>
        </div>
      </div>
      <div
        style={{
          marginLeft: 50,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {isInReply && (
          <div style={{ display: "flex", maxWidth: 600, gap: 10 }}>
            <Avatar fallbackText="You" />
            <MultilineTextField
              style={{ width: "100%" }}
              rows={2}
              placeholder="Write a comment..."
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
            />
            <Button
              style={{
                width: "fit-content",
                background: "none",
                color: "black",
              }}
              onClick={handleSendReply}
            >
              <SendIcon
                size={30}
                style={{ color: theme.colors.violet400.toString() }}
              />
              SEND
            </Button>
            <Button
              style={{
                width: "fit-content",
                background: "none",
                color: "black",
              }}
              onClick={() => setIsInReply(false)}
            >
              <CloseIcon
                size={30}
                style={{ color: theme.colors.red.toString() }}
              />
              CANCEL
            </Button>
          </div>
        )}
        {loading && (
          <div>
            <Loader color="violet" />
          </div>
        )}
        {showReplies && replies.length === 0 && (
          <b style={{ marginLeft: 20 }}>No replies</b>
        )}
        {showReplies &&
          replies.map((item: any) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar
                  large
                  fallbackText={`${
                    !item.user.hasCompany
                      ? item.user.firstName[0] + item.user.lastName[0]
                      : item.user.companyName[0]
                  }`}
                />
                <div>
                  <p>
                    <b>
                      {!item.user.hasCompany
                        ? item.user.firstName + " " + item.user.lastName
                        : item.user.companyName}
                    </b>{" "}
                    {item.user.id === projectData?.userId && (
                      <b
                        style={{
                          color: theme.colors.violet400.toString(),
                          marginRight: 2,
                        }}
                      >
                        CREATOR
                      </b>
                    )}{" "}
                    {item["createdAt"].split("T")[0]}
                  </p>
                  <div>{item.message}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Comment;
