import { Accordion, Loader, Text } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import React, { useCallback, useEffect, useState } from "react";
import Card from "../../../components/Card";
import { selectProject } from "../../../slices/projectSlice";
import { useAppSelector } from "../../../store/hooks";
import { supabase } from "../../../supabaseClient";
import { theme } from "../../../theme";

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

const UpdatesTab = () => {
  const projectId = useAppSelector(selectProject).data?.id;

  const [updates, setUpdates] = useState<any[]>([]);
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

  return (
    <Card>
      <h3>Updates</h3>
      <div style={{ maxWidth: 800, marginTop: 10 }}>
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
    </Card>
  );
};

export default UpdatesTab;
