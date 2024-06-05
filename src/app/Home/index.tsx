import { Box, Stack } from "@mui/material";
import DrawingCanvas from "./DrawingCanvas";

export default function Home() {
  return (
    <Box>
      <Stack alignItems="center">
        <DrawingCanvas />
      </Stack>
    </Box>
  );
}
