import RichTextEditor from "@mantine/rte";
import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Label from "../../../components/common/Label";
import {
  editProjectActions,
  selectEditProject,
} from "../../../slices/editProjectSlice";
import {
  newProjectActions,
  selectNewProject,
  setField,
} from "../../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { supabase } from "../../../supabaseClient";
import { theme } from "../../../theme";
import { v4 as uuid } from "uuid";
import { STORAGE_URL } from "../../../utils";

const handleImageUpload = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("image", file);

    supabase.storage
      .from("projectPictures")
      .upload(`public/${uuid()}.png`, file)
      .then(
        ({ data, error }) =>
          data && resolve(STORAGE_URL + "/storage/v1/object/public/" + data.Key)
      )
      .catch(() => reject(new Error("Upload failed")));
  });

const StoryStep = ({ editMode = false }) => {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  );

  const [error, setError] = useState("");

  const updateField = (fieldName: string, value: string | number) =>
    !editMode
      ? dispatch(setField({ fieldName, value }))
      : dispatch(editProjectActions.setField({ fieldName, value }));

  useEffect(() => {
    if (!editMode) {
      if (fields.description !== "<p><br></p>") {
        dispatch(newProjectActions.removeInvalidFields(["step4"]));
      } else dispatch(newProjectActions.setInvalidField(["step4"]));
    } else {
      if (fields.description !== "<p><br></p>") {
        dispatch(editProjectActions.removeInvalidFields(["step4"]));
      } else dispatch(editProjectActions.setInvalidField(["step4"]));
    }
  }, [dispatch, fields.description, editMode]);

  return (
    <Card>
      <Label style={{ fontSize: 16 }}>
        Unfold the story behind your project
      </Label>
      <RichTextEditor
        style={{
          minHeight: 280,
          ...(error && { borderColor: theme.colors.red.toString() }),
          borderRadius: 10,
          overflow: "hidden",
          cursor: "text",
        }}
        onImageUpload={handleImageUpload}
        value={fields.description}
        onChange={(value: string) => {
          if (value === "<p><br></p>") setError("Field should not be empty!");
          else setError("");
          updateField("description", value);
        }}
      />
      {!!error.length && (
        <Label style={{ color: theme.colors.red.toString() }}>{error}</Label>
      )}
    </Card>
  );
};

export default StoryStep;
