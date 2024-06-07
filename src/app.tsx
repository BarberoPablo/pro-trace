import { ThemeProvider } from "@emotion/react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Box, IconButton, createTheme, useMediaQuery } from "@mui/material";
import { amber, blue, grey } from "@mui/material/colors";
import React from "react";
import Home from "./app/Home";
import { themePallet } from "./utils/constants";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState(prefersDarkMode);
  const appTheme = createTheme({
    palette: {
      mode: mode ? "dark" : "light",
      ...(mode
        ? {
            // palette values for dark mode
            primary: blue,
            black: themePallet.BLACK,
            green: themePallet.GREEN,
            light: themePallet.LIGHT,
            dark: themePallet.DARK,

            background: {
              default: themePallet.DARK,
            },
            text: {
              primary: "#000",
              secondary: grey[500],
            },
          }
        : {
            // palette values for light mode
            primary: amber,
            divider: amber[400],
            background: {
              default: amber[200],
            },
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }),
    },
    components: {
      MuiButton: {
        defaultProps: {
          style: {
            //backgroundColor: mode ? themePallet.LIGHT : themePallet.BLACK,
            //color: mode ? "black" : "white",
            //textTransform: "none",
          },
        },
      },
      /* MuiIconButton: {
        defaultProps: {
          style: {
            backgroundColor: mode ? themePallet.LIGHT : themePallet.DARK,
            color: mode ? "black" : "white",
            //textTransform: "none",
          },
        },
      }, */
    },
  });
  document.body.style.backgroundColor = appTheme.palette.background.default;

  const handleChangeTheme = () => {
    setMode(!mode);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <Box
        sx={{
          //backgroundColor: "background.default",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          //minHeight: "100vh",
          //height: "100%",
        }}
      >
        <IconButton sx={{ width: 32, height: 32 }} onClick={handleChangeTheme} color="inherit">
          {appTheme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>{" "}
        <Home />
      </Box>
    </ThemeProvider>
  );
}
