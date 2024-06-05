import { UploadFile } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { Accept, FileWithPath, useDropzone } from "react-dropzone";
import ButtonTooltip from "../DrawingCanvas/components/ButtonTooltip";

export default function ImageLoader({ setImage }: { setImage: (image: string) => void }) {
  const handleDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  return <DropZone onDrop={handleDrop} />;
}

function DropZone({ onDrop }: { onDrop: (acceptedFiles: FileWithPath[]) => void }) {
  const accept: Accept = {
    "image/*": [],
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept });

  return (
    <ButtonTooltip title="Subir Imagen">
      <IconButton {...getRootProps()} sx={{ width: 54, height: 54 }}>
        <input {...getInputProps()} />
        <UploadFile sx={{ color: "white" }} />
      </IconButton>
    </ButtonTooltip>
  );
}
