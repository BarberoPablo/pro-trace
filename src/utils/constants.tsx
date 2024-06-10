import prostata from "@/assets/body/prostata.png";
import { Circle, CircleOutlined, ClearRounded, CropDinRounded, FormatColorFillRounded, SquareRounded } from "@mui/icons-material";
import { BodyPart, ReferenceData } from "./types";

export const modes = ["stroke", "shapes"];

export enum darkThemePallet {
  LIGHT = "#5A99E6",
  DARK = "#274989",
  BLACK = "#1B2B36",
  SELECTED = "#44BCA1",
}

export enum lightThemePallet {
  LIGHT = "#ffcdd2",
  DARK = "#ef5350",
  BLACK = "#1B2B36",
  SELECTED = "#44BCA1",
}

export function hexToOpacityAndHex(hex: string, opacity: number) {
  const opacityValue = Math.round(opacity * 255);
  const opacityHex = opacityValue.toString(16).padStart(2, "0");

  return hex + opacityHex;
}

export const icons: { [key: string]: { full: JSX.Element; empty: JSX.Element } } = {
  rect: {
    full: <SquareRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
    empty: <CropDinRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
  },
  circle: {
    full: <Circle /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
    empty: <CircleOutlined /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
  },
  path: {
    full: <FormatColorFillRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
    empty: <ClearRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
  },
  text: {
    full: <FormatColorFillRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
    empty: <ClearRounded /* sx={{ width: "100%", height: "100%" }} */ sx={{ color: "rgb(56,56,56)" }} />,
  },
  rhombus: {
    full: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path
          fill="rgb(56,56,56)"
          d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8C13 2.19 12.5 2 12 2"
        />
      </svg>
    ),
    empty: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path
          fill="rgb(56,56,56)"
          d="M12 2c-.5 0-1 .19-1.41.59l-8 8c-.79.78-.79 2.04 0 2.82l8 8c.78.79 2.04.79 2.82 0l8-8c.79-.78.79-2.04 0-2.82l-8-8C13 2.19 12.5 2 12 2m0 2l8 8l-8 8l-8-8Z"
        />
      </svg>
    ),
  },
  /* 
  group:{
    full: <></>,
    empty: <></>,
  }
  */
};

export const references: { [key in BodyPart]?: ReferenceData } = {
  prostata: {
    image: prostata,
    references: {
      shapes: {
        circle: "Nódulo dérmico",
        rect: "Colección",
        rhombus: "Lesión cicatrizal",
      },
      fill: {
        full: "Activa\n(relleno)",
        empty: "Inactiva\n(vacío)",
      },
    },
  },
};
