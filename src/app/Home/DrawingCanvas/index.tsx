import radiografia from "@/assets/radiografia.png";
import { modes, themePallet } from "@/utils/constants";
import {
  Circle,
  CircleOutlined,
  ColorLens,
  CreateRounded,
  CropDinRounded,
  Delete,
  FormatColorFillRounded,
  Interests,
  RedoRounded,
  SquareRounded,
  UndoRounded,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import * as React from "react";
import ButtonTooltip from "./components/ButtonTooltip";

//import * as fabric from "fabric";

const initialColor = "#CB66F0";
const floatigBoxStyles = {
  position: "absolute",
  borderRadius: 2,
  border: `2px solid ${themePallet.BLACK}`,
  px: 2,
  top: 100,
  left: 0,
  py: 1,
  zIndex: 2,
  width: 210,
  bgcolor: "light",
  opacity: 0.9,
};

export default function DrawingCanvas(/* recibir la imagen a renderizar */) {
  //const [imageURL, setImageURL] = React.useState<string>(radiografia);
  const { editor, onReady } = useFabricJSEditor();
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const [strokeColor, setStrokeColor] = React.useState(initialColor);
  const [strokeWidth, setStrokeWidth] = React.useState(1);
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(-1);
  const [isCanvasReady, setIsCanvasReady] = React.useState<boolean>(false);
  const [selectedMode, setSelectedMode] = React.useState<string>("");
  const [activeShape, setActiveShape] = React.useState<fabric.Object | null>(null);

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
      console.log("asd");
      saveHistory();
    };

    const handleObjectSelected = () => {
      const canvasObject = editor?.canvas.getActiveObject();
      if (["rect", "circle"].includes(canvasObject?.type)) {
        setActiveShape(canvasObject);
      }
    };

    const handleObjectCleared = () => {
      setActiveShape(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    if (editor?.canvas) {
      editor.canvas.on("path:created", onPathCreated);
      editor.canvas.on("object:modified", handleObjectModified);
      editor.canvas.on("selection:created", handleObjectSelected);
      editor.canvas.on("selection:updated", handleObjectSelected);
      editor.canvas.on("selection:cleared", handleObjectCleared);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (editor?.canvas) {
        editor.canvas.off("path:created", onPathCreated);
        editor.canvas.off("object:modified", handleObjectModified);
        editor.canvas.off("selection:created", handleObjectSelected);
        editor.canvas.off("selection:updated", handleObjectSelected);
        editor.canvas.off("selection:cleared", handleObjectCleared);
      }
    };
  }, [editor, saveHistory, handleRedo, handleUndo]);

  const getLastObject = () => {
    if (editor) {
      const canvas = editor.canvas;
      const objects = canvas.getObjects();

      if (objects.length > 0) {
        const lastObject = objects[objects.length - 1];
        return lastObject;
      }
    }

    return null;
  };

  const handleAddRectangle = (fill?: string) => {
    if (editor) {
      editor.addRectangle();
      editor.canvas.isDrawingMode = false;
      const lastObjectInCanvas = getLastObject();

      if (lastObjectInCanvas) {
        lastObjectInCanvas.set({
          width: 200,
          height: 200,
          fill: fill ? strokeColor : "transparent",
          left: editor.canvas.getWidth() / 2 - 200,
          top: 100,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
      }
      editor.canvas.setActiveObject(lastObjectInCanvas);
      lastObjectInCanvas.setCoords();
      saveHistory();
    }
  };

  const handleAddCircle = (fill?: string) => {
    if (editor) {
      editor.addCircle();
      editor.canvas.isDrawingMode = false;
      const lastObjectInCanvas = getLastObject();

      if (lastObjectInCanvas) {
        lastObjectInCanvas.set({
          radius: 100,
          width: 200,
          height: 200,
          fill: fill ? strokeColor : "transparent",
          left: editor.canvas.getWidth() / 2 - 200,
          top: 100,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        });
      }
      editor.canvas.setActiveObject(lastObjectInCanvas);
      lastObjectInCanvas.setCoords();
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
      setSelectedMode((prevState) => (prevState === "stroke" ? "select" : "stroke"));
    }
  };

  const handleStrokeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strokeW = Number(event.target.value);
    setStrokeWidth(strokeW);
    if (editor) {
      editor.canvas.freeDrawingBrush.width = strokeW;
    }
  };

  const handleUpdateShape = (props: Record<string, string | number>) => {
    //The reference to the activeShape is beeing modified, not the actual value
    if (activeShape) {
      activeShape.set({
        ...props,
      });
      editor?.canvas.renderAll();
      saveHistory();
    }
  };

  const handleUpdateShapeStrokeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    //The reference to the activeShape is beeing modified, not the actual value
    const value = Number(event.target.value);
    if (activeShape) {
      activeShape.set({
        strokeWidth: value,
      });
      editor?.canvas.renderAll();
      saveHistory();
    }
  };
  /* const handleFillActiveShape = () => {
    //The reference to the activeShape is beeing modified, not the actual value
    if (activeShape) {
      activeShape.set({
        fill: strokeColor,
      });
      editor?.canvas.renderAll();
      saveHistory();
    }
  }; */

  return (
    <Box>
      <Stack sx={{ alignItems: "center", gap: 2 }}>
        <Container sx={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Stack
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              flexDirection: "row",
              gap: 5,
              px: 10,
              py: 1,
              my: 2,
              backgroundColor: "light",
              borderRadius: 10,
            }}
          >
            <ButtonTooltip title="Deshacer" handler={handleUndo}>
              <UndoRounded sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>

            <ButtonTooltip title="Rehacer" handler={handleRedo}>
              <RedoRounded sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>

            <ButtonTooltip title="Dibujar" handler={toggleDraw}>
              <CreateRounded sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>

            <ButtonTooltip title="Acercar" handler={() => editor?.zoomIn()} /* style={{ backgroundColor: strokeColor }} */>
              <ZoomIn sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>
            <ButtonTooltip title="Alejar" handler={() => editor?.zoomOut()} /* style={{ backgroundColor: strokeColor }} */>
              <ZoomOut sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>

            <ButtonTooltip
              title="Abrir menu de figuras geométricas"
              handler={() => setSelectedMode("shapes")} /* style={{ backgroundColor: strokeColor }} */
            >
              <Interests sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>

            <ButtonTooltip title="Eliminar selección" handler={() => editor?.deleteSelected()}>
              <Delete sx={{ width: "100%", height: "100%" }} />
            </ButtonTooltip>
          </Stack>

          {modes.includes(selectedMode) && (
            <Box sx={{ position: "sticky", width: "100%", top: 0, zIndex: 1 }}>
              <Box
                sx={{
                  ...floatigBoxStyles,
                }}
              >
                {selectedMode === "stroke" && (
                  <Stack>
                    <Stack>
                      <Typography sx={{ color: "text.primary", fontWeight: 600 }}>Grosor de línea: {strokeWidth}</Typography>
                      <input type="range" value={strokeWidth} min={1} max={50} onChange={handleStrokeWidth} />
                    </Stack>
                    <ButtonTooltip title="Cambiar color" handler={handleColorButtonClick} style={{ backgroundColor: strokeColor }}>
                      <ColorLens sx={{ width: "100%", height: "100%" }} />
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
                        left: 100,
                      }}
                    />
                  </Stack>
                )}
                {selectedMode === "shapes" && (
                  <Stack sx={{ gap: 1 }}>
                    <Typography sx={{ color: "text.primary", fontWeight: 600 }}>Figuras disponibles:</Typography>
                    <Stack sx={{ gap: 1, flexDirection: "row" }}>
                      <ButtonTooltip title="Cuadrado hueco" handler={() => handleAddRectangle()}>
                        <CropDinRounded sx={{ width: "100%", height: "100%" }} />
                      </ButtonTooltip>
                      <ButtonTooltip title="Cuadrado lleno" handler={() => handleAddRectangle("fill")}>
                        <SquareRounded sx={{ width: "100%", height: "100%" }} />
                      </ButtonTooltip>
                    </Stack>
                    <Stack sx={{ gap: 1, flexDirection: "row" }}>
                      <ButtonTooltip title="Cirulo hueco" handler={() => handleAddCircle()}>
                        <CircleOutlined sx={{ width: "100%", height: "100%" }} />
                      </ButtonTooltip>
                      <ButtonTooltip title="Circulo lleno" handler={() => handleAddCircle("fill")}>
                        <Circle sx={{ width: "100%", height: "100%" }} />
                      </ButtonTooltip>
                    </Stack>
                  </Stack>
                )}
              </Box>
              <>{console.log("activeShape", activeShape)}</>
              <>{console.log("activeShape", activeShape?.strokeWidth)}</>
              {activeShape && (
                <Box sx={{ ...floatigBoxStyles, right: 0, left: "auto" }}>
                  <Stack gap={1}>
                    <Typography sx={{ color: "text.primary", fontWeight: 600, mb: 1 }}>Estilos para la figura sleccionada:</Typography>

                    <Stack>
                      <Typography sx={{ color: "text.primary", fontWeight: 600 }}>Grosor del borde: {activeShape?.strokeWidth ?? 1}</Typography>
                      <input type="range" value={activeShape?.strokeWidth} min={1} max={50} onChange={handleUpdateShapeStrokeWidth} />
                    </Stack>
                    <Stack>
                      <Typography sx={{ color: "text.primary", fontWeight: 600 }}>Opacidad: {(activeShape?.opacity ?? 1) * 100}%</Typography>
                      <input
                        type="range"
                        value={activeShape?.opacity}
                        step={0.1}
                        min={0}
                        max={1}
                        onChange={(event) => handleUpdateShape({ opacity: Number(event.target.value) })}
                      />
                    </Stack>

                    <ButtonTooltip
                      title="Rellenar/Vaciar figura"
                      handler={() => handleUpdateShape({ fill: activeShape.fill === "transparent" ? strokeColor : "transparent" })} //change strokeColor or not?
                      //handler={() => handleUpdateShape({ fill: hexToOpacityAndHex(strokeColor, shapeProps.oppacity) })}
                    >
                      <FormatColorFillRounded sx={{ width: "100%", height: "100%" }} />
                    </ButtonTooltip>
                  </Stack>
                </Box>
              )}
            </Box>
          )}
          <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </Container>
      </Stack>
    </Box>
  );
}
