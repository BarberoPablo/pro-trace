/* import { ReactSketchCanvas } from "react-sketch-canvas";

export default function DrawingCanvas({ image }: { image: string }) {
  return (
    <div>
      <h1>Draw here!</h1>
      <ReactSketchCanvas width="100%" height="100%" canvasColor="transparent" strokeColor="#a855f7" backgroundImage={image} />
    </div>
  );
}
 */

// src/components/DrawingCanvas.tsx
import { Box } from "@mui/material";
import React from "react";

export default function DrawingCanvas({ imageUrl }: { imageUrl: string }) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setDimensions({ width: image.width, height: image.height });
    };
  }, [imageUrl]);

  React.useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        ctx?.drawImage(image, 0, 0, image.width, image.height);
      };
    }
  }, [dimensions, imageUrl]);

  return (
    <Box>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} style={{ border: "2px solid black" }} />
    </Box>
  );
}
