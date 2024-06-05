import { NativeMouseEvent } from "@/utils/types";
import { CloudDownload, ColorLens, Delete, Square, RedoRounded, UndoRounded } from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import ImageLoader from "../ImageLoader";
import ButtonTooltip from "./components/ButtonTooltip";

export default function DrawingCanvas(/* { imageUrl }: { imageUrl: string } */) {
  const [imageUrl, setImageUrl] = React.useState("");
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [strokeColor, setStrokeColor] = React.useState("#000");
  const [strokeWidth, setStrokeWidth] = React.useState(2);
  const [annotations, setAnnotations] = React.useState("");
  const [textPosition, setTextPosition] = React.useState({ x: 0, y: 0 });
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  React.useEffect(() => {
    if (imageUrl) {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        setDimensions({ width: image.width, height: image.height + 400 });
        setTextPosition({ x: 100, y: image.height }); //y si sobresale de la pantalla?
      };
    }
  }, [imageUrl]);

  React.useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        ctx?.drawImage(image, 0, 0, image.width, image.height);
        saveState();
      };
      console.log("save");
    }
  }, [dimensions, imageUrl]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas?.toDataURL();

    if (dataURL) {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(dataURL);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
    }
  };

  const startDrawing = ({ nativeEvent }: NativeMouseEvent) => {
    if (nativeEvent.button === 0) {
      //Left click
      const { offsetX, offsetY } = nativeEvent;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineJoin = "round"; // Hace que las intersecciones de líneas sean redondeadas
        ctx.lineCap = "round"; // Hace que el extremo de las líneas sea redondeado
        setIsDrawing(true);
      }
    }
  };

  const draw = ({ nativeEvent }: NativeMouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx?.lineTo(offsetX, offsetY);
      ctx?.stroke();
    }
  };

  const finishDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };
  const handleChangeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(parseInt(event.target.value));
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = new Image();
    image.src = imageUrl;

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Borra todo el contenido del canvas
      image.onload = () => {
        ctx?.drawImage(image, 0, 0, image.width, image.height);
        saveState();
      };
    }
  };

  const handleChangeAnnotations = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnnotations(event.target.value);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (annotations && ctx) {
        const lines = annotations.split("\n");
        const lineHeight = 40; // Altura de línea aproximada

        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        lines.forEach((line, index) => {
          ctx.fillText(line, textPosition.x, textPosition.y + index * lineHeight);
        });

        ctx.fillText(annotations, textPosition.x, textPosition.y);
      }
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleColorButtonClick = () => {
    colorInputRef.current?.click();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      restoreState(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      restoreState(history[historyIndex + 1]);
    }
  };

  const restoreState = (dataURL: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      const image = new Image();
      image.src = dataURL;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  const handleDrawShape = (shape: string) => {
    console.log(shape);
  };

  return (
    <Box>
      <Stack sx={{ alignItems: "center", gap: 2 }}>
        <Container sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Stack
            sx={{ position: "sticky", top: 0, zIndex: 1, flexDirection: "row", gap: 5, px: 10, py: 1, my: 2, backgroundColor: "light", borderRadius: 10 }}
          >
            <ImageLoader setImage={setImageUrl} />

            <ButtonTooltip title="Cambiar color de trazo" handler={handleColorButtonClick} style={{ backgroundColor: strokeColor }} disabled={!imageUrl}>
              <ColorLens />
            </ButtonTooltip>

            <input
              ref={colorInputRef}
              type="color"
              value={strokeColor}
              onChange={handleChangeColor}
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                opacity: 0,
                left: 250,
              }}
            />

            <Stack sx={{ width: 200, alignItems: "center", justifyContent: "center", backgroundColor: "light", borderRadius: 10 }}>
              <Typography sx={{ fontWeight: 600 }}>Grosor de Trazo: {strokeWidth}</Typography>
              <input type="range" min={1} max={50} value={strokeWidth} onChange={handleChangeWidth} />
            </Stack>

            <ButtonTooltip title="Eliminar trazos" handler={handleClearCanvas} disabled={!imageUrl}>
              <Delete />
            </ButtonTooltip>

            <ButtonTooltip title="Eliminar trazos" handler={() => handleDrawShape("square")} disabled={!imageUrl}>
              <Square />
            </ButtonTooltip>

            <ButtonTooltip title="Descargar Imagen" handler={handleExportPNG} disabled={!imageUrl}>
              <CloudDownload />
            </ButtonTooltip>

            <ButtonTooltip title="Deshacer" handler={handleUndo} disabled={!imageUrl || historyIndex === 0}>
              <UndoRounded />
            </ButtonTooltip>

            <ButtonTooltip title="Rehacer" handler={handleRedo} disabled={!imageUrl || historyIndex >= history.length - 1}>
              <RedoRounded />
            </ButtonTooltip>
          </Stack>
          {false && <textarea value={annotations} onChange={handleChangeAnnotations} />}

          {imageUrl && (
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              style={{ border: "2px solid black" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={finishDrawing}
              onMouseOut={finishDrawing}
            />
          )}
        </Container>
      </Stack>
    </Box>
  );
}
