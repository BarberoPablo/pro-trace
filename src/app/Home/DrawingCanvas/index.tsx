import radiografia from "@/assets/radiografia.png";
import { Circle, ColorLens, CreateRounded, Delete, Square } from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import * as React from "react";
import ButtonTooltip from "./components/ButtonTooltip";

//import * as fabric from "fabric";

const initialColor = "#CB66F0";

export default function DrawingCanvas(/* recibir la imagen a renderizar */) {
  //const [imageURL, setImageURL] = React.useState<string>(radiografia);
  const { editor, onReady } = useFabricJSEditor();
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const [strokeColor, setStrokeColor] = React.useState(initialColor);
  const [strokeWidth, setStrokeWidth] = React.useState(1);
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);
  const [isCanvasReady, setIsCanvasReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (editor?.canvas) {
      const img = new Image();
      img.src = radiografia;
      img.onload = function () {
        editor.canvas.setWidth(img.width);
        editor.canvas.setHeight(img.height);
        editor.canvas.setBackgroundImage(radiografia, editor.canvas.renderAll.bind(editor.canvas));
        editor.canvas.freeDrawingBrush.color = initialColor;
        setIsCanvasReady(true);
      };
    }
  }, [editor]);

  React.useEffect(() => {
    if (isCanvasReady) {
      if (editor) {
        const initialCanvasState = editor.canvas.toJSON();
        setHistory([initialCanvasState]);
        setHistoryIndex((prevState) => prevState + 1);
      }
    }
  }, [editor, isCanvasReady]);

  const saveHistory = React.useCallback(() => {
    if (editor) {
      const json = editor.canvas.toJSON();
      if (json) {
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, historyIndex + 1);
          newHistory.push(json);
          return newHistory;
        });

        setHistoryIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [editor, historyIndex]);

  const handleUndo = React.useCallback(() => {
    if (historyIndex > 0) {
      editor?.canvas.loadFromJSON(history[historyIndex - 1], () => {
        editor?.canvas.renderAll();
        setHistoryIndex((prevIndex) => prevIndex - 1);
      });
    }
  }, [editor?.canvas, history, historyIndex]);

  const handleRedo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      editor?.canvas.loadFromJSON(history[historyIndex + 1], () => {
        editor?.canvas.renderAll();
        setHistoryIndex((prevIndex) => prevIndex + 1);
      });
    }
  }, [editor?.canvas, history, historyIndex]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
      if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
      if (event.key === "Delete") {
        editor?.deleteSelected();
      }
    };

    const onPathCreated = () => {
      if (editor && editor.canvas.isDrawingMode) {
        saveHistory();
      }
    };

    const handleObjectModified = () => {
      saveHistory();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (editor?.canvas) {
      editor.canvas.on("path:created", onPathCreated);
      editor.canvas.on("object:modified", handleObjectModified);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (editor?.canvas) {
        editor.canvas.off("path:created", onPathCreated);
        editor.canvas.off("object:modified", handleObjectModified);
      }
    };
  }, [editor, saveHistory, handleRedo, handleUndo]);

  const handleAddSquare = () => {
    if (editor) {
      editor.addRectangle();
      editor.canvas.isDrawingMode = false;
    }
  };

  const handleAddCircle = () => {
    if (editor) {
      editor.addCircle();
      editor.canvas.isDrawingMode = false;
      saveHistory();
    }
  };

  const handleColorButtonClick = () => {
    colorInputRef.current?.click();
  };

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setStrokeColor(newColor);

    if (editor) {
      editor.canvas.freeDrawingBrush.color = newColor;
      const selectedObject = editor.canvas.getActiveObject();

      if (selectedObject) {
        if (selectedObject.type === "rect" || selectedObject.type === "circle") {
          selectedObject.set("stroke", newColor);
          //selectedObject.set("fill", newColor);
        } else if (selectedObject.type === "line" || selectedObject.type === "path" || selectedObject.type === "polygon") {
          selectedObject.set("stroke", newColor);
        }
        editor.canvas.renderAll();
      }
    }
  };

  const toggleDraw = () => {
    if (editor) {
      editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    }
  };

  const handleStrokeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strokeW = Number(event.target.value);
    setStrokeWidth(strokeW);
    if (editor) {
      editor.canvas.freeDrawingBrush.width = strokeW;
    }
  };

  return (
    <Box>
      <Stack sx={{ alignItems: "center", gap: 2 }}>
        <Container sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Stack
            sx={{ position: "sticky", top: 0, zIndex: 1, flexDirection: "row", gap: 5, px: 10, py: 1, my: 2, backgroundColor: "light", borderRadius: 10 }}
          >
            <ButtonTooltip title="Cambiar color" handler={handleColorButtonClick} style={{ backgroundColor: strokeColor }}>
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
                left: 150,
              }}
            />

            <ButtonTooltip title="Deshacer" handler={handleUndo}>
              Undo
            </ButtonTooltip>

            <ButtonTooltip title="Rehacer" handler={handleRedo}>
              Redo
            </ButtonTooltip>

            <ButtonTooltip title="Dibujar" handler={toggleDraw}>
              <CreateRounded />
            </ButtonTooltip>

            <Stack>
              <Typography sx={{ color: "text.primary", fontWeight: 600 }}>Grosor de línea: {strokeWidth}</Typography>
              <input type="range" value={strokeWidth} min={1} max={50} onChange={handleStrokeWidth} />
            </Stack>

            <ButtonTooltip title="Acercar" handler={() => editor?.zoomIn()} /* style={{ backgroundColor: strokeColor }} */>
              IN
            </ButtonTooltip>
            <ButtonTooltip title="Alejar" handler={() => editor?.zoomOut()} /* style={{ backgroundColor: strokeColor }} */>
              OUT
            </ButtonTooltip>

            <ButtonTooltip title="Colocar círculo" handler={handleAddCircle} /* style={{ backgroundColor: strokeColor }} */>
              <Circle />
            </ButtonTooltip>

            <ButtonTooltip title="Colocar rectángulo" handler={handleAddSquare} /* style={{ backgroundColor: strokeColor }} */>
              <Square />
            </ButtonTooltip>

            <ButtonTooltip title="Eliminar selección" handler={() => editor?.deleteSelected()}>
              <Delete />
            </ButtonTooltip>
          </Stack>
          <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </Container>
      </Stack>
    </Box>
  );
}
