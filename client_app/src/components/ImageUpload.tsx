import { styled } from "@stitches/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { theme } from "../theme";
import { HomeCheckmark as CheckIcon } from "@styled-icons/fluentui-system-filled/HomeCheckmark";

interface ImageUploadProps {
  value?: File[];
  selected?: number;
  onChange?: (newImages: File[]) => any;
  onSelect?: (x: number | undefined) => any;
}

const ImageUpload = ({
  value,
  selected,
  onChange,
  onSelect,
}: ImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (onChange && value) {
        onChange([...value, ...acceptedFiles]);
        return;
      }
    },
  });

  useEffect(() => {
    setPreviews((prevPreviews) => {
      prevPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      return (value || []).map((image) => URL.createObjectURL(image));
    });
  }, [value]);

  //unmounting component -> revoke previews
  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [previews]);

  const removeImage = (removeIndex: number) => {
    if (onChange && value) {
      onChange(value.filter((_, index) => index !== removeIndex));
      if (selected !== undefined && removeIndex <= selected)
        onSelect?.(selected - 1);
      return;
    }
  };

  const thumbs = (value || []).map((_, index) => (
    <Thumb
      key={index}
      selected={selected === index}
      onClick={() => {
        if (onSelect) onSelect(index);
      }}
    >
      {selected === index && (
        <SelectedIcon>
          <CheckIcon size={20} />
        </SelectedIcon>
      )}
      <ImgWrapper>
        <Img src={previews[index]} alt="" />
      </ImgWrapper>
      <RemoveButton
        onClick={(e) => {
          e.stopPropagation();
          removeImage(index);
        }}
      >
        Remove
      </RemoveButton>
    </Thumb>
  ));

  return (
    <Section>
      <Root
        {...getRootProps({ className: "dropzone" })}
        huge={!(value || []).length}
      >
        <input {...getInputProps()} />
        <p style={{ color: "gray" }}>
          Drag 'n' drop some files here, or click to select files
        </p>
      </Root>
      <aside style={{ marginTop: 20 }}>
        <ThumbList>{thumbs}</ThumbList>
      </aside>
    </Section>
  );
};

export default ImageUpload;

const Section = styled("section", {});

const Root = styled("div", {
  border: "1px dotted black",
  fontSize: 16,
  padding: 30,
  height: 100,
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgb(246, 247, 247)",
  cursor: "pointer",
  variants: {
    huge: {
      true: {
        height: 500,
      },
    },
  },
});

const ThumbList = styled("ul", {
  display: " grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 250px))",
  gap: 15,
});

const Thumb = styled("div", {
  position: "relative",
  display: "inline-flex",
  borderRadius: 15,
  border: "2px solid #eaeaea",
  height: 200,
  padding: 8,
  boxSizing: "border-box",
  flexDirection: "column",
  maxWidth: 300,

  variants: {
    selected: {
      true: {
        borderColor: theme.colors.violet500,
        borderWidth: 2,
      },
    },
  },
});

const ImgWrapper = styled("div", {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  justifyContent: "center",
  width: "100%",
  flex: 1,
});

const Img = styled("img", {
  display: "block",
  width: "auto",
  height: "100%",
});

const RemoveButton = styled("button", {
  background: theme.colors.red,
  fontSize: 16,
  color: theme.colors.white,
  borderRadius: 20,
  marginTop: 10,
});

const SelectedIcon = styled("span", {
  position: "absolute",
  top: -10,
  right: -10,
  borderRadius: "50%",
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#7A70C1",
  color: theme.colors.white,
});
