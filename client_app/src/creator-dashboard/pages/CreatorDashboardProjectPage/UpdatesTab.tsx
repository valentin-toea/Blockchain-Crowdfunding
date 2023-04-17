import React, { useCallback, useEffect, useState } from "react";
import Card from "../../../components/Card";
import { supabase } from "../../../supabaseClient";
import { Accordion, Loader, Text } from "@mantine/core";
import Button from "../../../components/common/Button";

import { Plus as PlusIcon } from "@styled-icons/boxicons-regular/Plus";
import { theme } from "../../../theme";
import Modal from "../../../components/common/Modal";
import RichTextEditor from "@mantine/rte";
import Label from "../../../components/common/Label";
import TextField from "../../../components/common/TextField";
import { toast } from "react-toastify";

const UpdateLabel = ({ num = "1", title = "Label" }) => {
  return (
    <div>
      <div>
        <Text size="sm" color="dimmed">
          Update #{num}
        </Text>
        <Text>{title}</Text>
      </div>
    </div>
  );
};

const UpdatesTab = ({ projectId }: { projectId: string | undefined }) => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("<p><br></p>");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUpdates = useCallback(async () => {
    if (projectId) {
      setLoading(true);
      const { data, error } = await supabase
        .from("updates")
        .select("*")
        .eq("projectId", projectId);

      if (data)
        setUpdates(
          data
            .map((update, index) => ({ ...update, index: index + 1 }))
            .reverse()
        );
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const handleAddUpdate = async () => {
    if (!title || description === "<p><br></p>") return;

    const { data, error } = await supabase
      .from("updates")
      .insert({
        projectId,
        content: description,
        title,
      })
      .single();

    if (error) toast.error(error.message || error);
    if (!error && data) {
      toast.success("Update added successfully");
      fetchUpdates();
    }

    setOpenModal(false);
    setDescription("<p><br></p>");
    setTitle("");
  };

  return (
    <Card>
      <div>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Updates</h3>
          <Button
            style={{
              background: theme.colors.green500.toString(),
              gap: 5,
              display: "flex",
              alignItems: "center",
              color: "white",
              maxWidth: "fit-content",
              borderRadius: theme.radii.full.toString(),
            }}
            onClick={() => setOpenModal(true)}
          >
            <PlusIcon size={30} />
            <b style={{ fontSize: 18, lineHeight: 1 }}>NEW</b>
          </Button>
        </div>
        <Accordion multiple initialItem={0}>
          {!loading &&
            updates.map((update, index) => (
              <Accordion.Item
                key={index}
                label={<UpdateLabel num={update.index} title={update.title} />}
              >
                <RichTextEditor
                  style={{
                    border: "none",
                    boxShadow: theme.shadows.boxShadow1.toString(),
                    borderRadius: theme.radii.xl2.toString(),
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                  readOnly
                  value={update.content}
                  onChange={() => null}
                />
              </Accordion.Item>
            ))}
        </Accordion>
        {!loading && !updates.length && <h2>No updates yet</h2>}
        {loading && <Loader color="violet" />}
      </div>
      <Modal
        large
        title="New Update"
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);
          setDescription("<p><br></p>");
          setTitle("");
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <TextField
            label="Update Title"
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="Project Ongoing..."
          />
          <div>
            <Label>Update Content</Label>
            <RichTextEditor
              style={{
                minHeight: 280,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "text",
              }}
              value={description}
              onChange={(value: string) => {
                setDescription(value);
              }}
            />
          </div>
          <Button color="green400" onClick={handleAddUpdate}>
            Save
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default UpdatesTab;
