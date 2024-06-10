import { icons, references } from "@/utils/constants";
import { BodyPart, ReferenceData, Shapes } from "@/utils/types";
import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import * as React from "react";

export default function ImageReferences({
  bodyPart,
  handleData,
}: {
  bodyPart: BodyPart;
  handleData: { [key in Shapes]: (fill?: boolean, angle?: number) => void };
}) {
  const [referenceData] = React.useState<ReferenceData | undefined>(references[bodyPart]);
  const [fill, setFill] = React.useState<string>("empty");

  const handleChangeFill = (value: string) => {
    setFill(value);
  };

  return (
    <Box sx={{ position: "sticky", width: "100%", top: 0, zIndex: 1 }}>
      <Box
        sx={{
          backgroundColor: "white",
          position: "absolute",
          borderRadius: 2,
          px: 2,
          top: 100,
          left: -30,
          py: 1,
          zIndex: 2,
          opacity: 0.9,
        }}
      >
        <Box>
          {referenceData && (
            <Stack sx={{ width: "100%" }}>
              {Object.keys(referenceData.references.shapes).map((shape) => (
                <Button
                  onClick={() => (shape === "rhombus" ? handleData[shape as Shapes](fill === "full", 45) : handleData[shape as Shapes](fill === "full"))}
                  startIcon={icons[shape]?.empty}
                  key={shape}
                  sx={{ justifyContent: "initial" }}
                >
                  <Typography variant="reference">{referenceData.references.shapes[shape as Shapes]}</Typography>
                </Button>
              ))}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1, height: 70 }}>
                <ToggleButtonGroup color="primary" value={fill} exclusive onChange={(_event, value) => handleChangeFill(value)} aria-label="Platform">
                  {Object.keys(referenceData.references.fill).map((fill) => (
                    <ToggleButton key={fill} value={fill}>
                      <Typography variant="reference" sx={{ whiteSpace: "pre-wrap" }}>
                        {referenceData.references.fill[fill]}
                      </Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
