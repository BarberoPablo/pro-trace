import { icons, references } from "@/utils/constants";
import { BodyPart, ReferenceData, Shapes } from "@/utils/types";
import { ModeEditOutlineOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import * as React from "react";

export default function ImageReferences({
  bodyPart,
  handleData,
  handleColor,
}: {
  bodyPart: BodyPart;
  handleData: { [key in Shapes]: (fill?: boolean, angle?: number) => void };
  handleColor: React.Dispatch<React.SetStateAction<{ stroke: string; fill: string }>>;
  //handleColor: ({ stroke, fill }: { stroke: string; fill: string }) => void;
}) {
  const [referenceData] = React.useState<ReferenceData | undefined>(references[bodyPart]);
  const [fill, setFill] = React.useState<string>("full");
  const [selectedColor, setSelectedColor] = React.useState<string>("black");

  const handleChangeFillType = (value: string) => {
    setFill(value);
  };

  const handleChangeColor = (color: string) => {
    setSelectedColor(color);
    handleColor((prevColor) => ({
      ...prevColor,
      stroke: color,
      fill: color,
    }));
  };

  return (
    <Box sx={{ position: "sticky", width: "100%", top: 0, zIndex: 1 }}>
      <Box
        sx={{
          backgroundColor: "white",
          position: "absolute",
          borderRadius: 2,
          px: 1,
          top: 80,
          left: -104,
          py: 1,
          zIndex: 2,
          opacity: 0.9,
        }}
      >
        {referenceData && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                <ToggleButtonGroup color="primary" value={fill} exclusive onChange={(_event, value) => handleChangeFillType(value)}>
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

            <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: "rgb(150,150,150)" }} />

            <Stack>
              <ToggleButtonGroup color="primary" value={selectedColor} exclusive onChange={(_event, value) => handleChangeColor(value)}>
                <Stack>
                  {Object.keys(referenceData.references.colors).map((colorKey) => (
                    <ToggleButton key={colorKey} value={colorKey} sx={{ justifyContent: "initial", height: 40 }}>
                      <ModeEditOutlineOutlined sx={{ color: colorKey }} />
                      <Typography variant="reference">{referenceData.references.colors[colorKey]}</Typography>
                    </ToggleButton>
                  ))}
                </Stack>
              </ToggleButtonGroup>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
