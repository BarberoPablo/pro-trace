import radiografia from "@/assets/radiografia.png";
import { Circle, ColorLens, CreateRounded, Delete, Square } from "@mui/icons-material";
import { Box, Container, Stack } from "@mui/material";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import ButtonTooltip from "./components/ButtonTooltip";
import * as React from "react";

//import * as fabric from "fabric";

const initialColor = "#CB66F0";
export default function DrawingCanvas(/* recibir la imagen a renderizar */) {
  //const [imageURL, setImageURL] = React.useState<string>(radiografia);
  const { editor, onReady } = useFabricJSEditor();
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const [strokeColor, setStrokeColor] = React.useState(initialColor);
  //const [strokeWidth, setStrokeWidth] = React.useState(2);

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
    editor?.addText("asd");
  };

  const onAddCircle = () => {
    editor?.addCircle();
  };

  const handleColorButtonClick = () => {
    colorInputRef.current?.click();
  };

  const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);

    if (editor) {
      editor.canvas.freeDrawingBrush.color = event.target.value;
    }
  };

  /* React.useEffect(() => {
    if (editor && strokeColor) {
      editor.canvas.freeDrawingBrush.color = strokeColor;
    }
  }, [strokeColor, editor]); */

  const toggleDraw = () => {
    if (editor) {
      editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
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

            <ButtonTooltip title="Colocar círculo" handler={() => editor?.zoomIn()} /* style={{ backgroundColor: strokeColor }} */>
              IN
            </ButtonTooltip>
            <ButtonTooltip title="Colocar círculo" handler={() => editor?.zoomOut()} /* style={{ backgroundColor: strokeColor }} */>
              OUT
            </ButtonTooltip>

            <ButtonTooltip title="Colocar círculo" handler={onAddCircle} /* style={{ backgroundColor: strokeColor }} */>
              <Circle />
            </ButtonTooltip>

            <ButtonTooltip title="Colocar cuadrado" handler={handleAddSquare} /* style={{ backgroundColor: strokeColor }} */>
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
