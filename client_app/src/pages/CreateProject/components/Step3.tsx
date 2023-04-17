import { styled } from "@stitches/react";
import Label from "../../../components/common/Label";
import ImageUpload from "../../../components/ImageUpload";
import { selectNewProject, setField } from "../../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

interface Step3Props {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  mainImageIndex: number;
  setMainImageIndex: React.Dispatch<React.SetStateAction<number>>;
  editMode?: boolean;
}

const Step3 = ({
  images,
  setImages,
  mainImageIndex,
  setMainImageIndex,
  editMode,
}: Step3Props) => {
  /* const dispatch = useAppDispatch();
  const fields = useAppSelector(selectNewProject);

  const updateField = (fieldName: string, value: string) =>
    dispatch(setField({ fieldName, value })); */

  return (
    <Wrapper>
      <Column>
        <Label>Upload Images</Label>
        <ImageUpload
          value={images}
          selected={mainImageIndex}
          onChange={(newImages) => setImages(newImages)}
          onSelect={(selected) => setMainImageIndex(selected || 0)}
        />
      </Column>
    </Wrapper>
  );
};

export default Step3;

const Wrapper = styled("div", {
  display: "flex",
  gap: 30,
  width: "100%",
});

const Column = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  width: "100%",
});
