import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#33c9dc",
      dark: "#008394",
      contrastText: "#000",
    },
  },
});

export enum themePallet {
  MAIN = "#33c9dc",
  DARK = "#008394",
  MAIN_GREY = "#00bcd4",
}
