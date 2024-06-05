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

  React.useEffect(() => {
    if (editor?.canvas) {
      console.log("asd");
      console.log(editor.canvas.__eventListeners["mouse:wheel"]);
      const img = new Image();
      img.src = radiografia;
      img.onload = function () {
        editor.canvas.setWidth(img.width);
        editor.canvas.setHeight(img.height);
        editor.canvas.setBackgroundImage(radiografia, editor.canvas.renderAll.bind(editor.canvas));
        editor.canvas.freeDrawingBrush.color = initialColor;
      };
    }
  }, [editor]);

  const handleAddSquare = () => {
    if (editor) {
      editor.addRectangle();
      editor.canvas.isDrawingMode = false;
    }
  };

  const onAddCircle = () => {
    if (editor) {
      editor.addCircle();
      editor.canvas.isDrawingMode = false;
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

            <ButtonTooltip title="Colocar círculo" handler={onAddCircle} /* style={{ backgroundColor: strokeColor }} */>
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
