import { Circle, CircleOutlined, ClearRounded, CropDinRounded, FormatColorFillRounded, SquareRounded } from "@mui/icons-material";

export const modes = ["stroke", "shapes"];

export enum themePallet {
  LIGHT = "#5A99E6",
  DARK = "#274989",
  BLACK = "#1B2B36",
  GREEN = "#44BCA1",
}

export function hexToOpacityAndHex(hex: string, opacity: number) {
  const opacityValue = Math.round(opacity * 255);
  const opacityHex = opacityValue.toString(16).padStart(2, "0");

  return hex + opacityHex;
}

export const icons: { [key: string]: { full: JSX.Element; empty: JSX.Element } } = {
  rect: {
    full: <SquareRounded sx={{ width: "100%", height: "100%" }} />,
    empty: <CropDinRounded sx={{ width: "100%", height: "100%" }} />,
  },
  circle: {
    full: <Circle sx={{ width: "100%", height: "100%" }} />,
    empty: <CircleOutlined sx={{ width: "100%", height: "100%" }} />,
  },
  path: {
    full: <FormatColorFillRounded sx={{ width: "100%", height: "100%" }} />,
    empty: <ClearRounded sx={{ width: "100%", height: "100%" }} />,
  },
  /* 
  group:{
    full: <></>,
    empty: <></>,
  }
  */
};
