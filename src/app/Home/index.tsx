import { Box, Container } from "@mui/material";
import ImageLoader from "./components/ImageLoader";
import * as React from "react";
import DrawingCanvas from "./components/DrawingCanvas";

export default function Home() {
  const [image, setImage] = React.useState<string | null>(null);

  return (
    <Box height="100vh">
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ImageLoader setImage={setImage} />
        {image && <DrawingCanvas imageUrl={image} />}
      </Container>
    </Box>
  );
}
