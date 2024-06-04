import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import { Accept, FileWithPath, useDropzone } from "react-dropzone";

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
    <IconButton
      color="primary"
      {...getRootProps()}
      sx={{
        width: 200,
        //border: "1px dashed white",
        borderRadius: 5,
      }}
    >
      <input {...getInputProps()} />
      <InsertDriveFileOutlinedIcon /> <Typography>Seleccionar imagen</Typography>
    </IconButton>
  );
}
