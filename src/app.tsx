import { ThemeProvider } from "@emotion/react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Box, IconButton, createTheme, useMediaQuery } from "@mui/material";
import { amber, blue, grey } from "@mui/material/colors";
import React from "react";
import Home from "./app/Home";
import { darkThemePallet, lightThemePallet } from "./utils/constants.tsx";

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
            black: darkThemePallet.BLACK,
            selected: darkThemePallet.SELECTED,
            light: darkThemePallet.LIGHT,
            dark: darkThemePallet.DARK,

            background: {
              default: darkThemePallet.DARK,
            },
            text: {
              primary: "#000",
              secondary: grey[500],
            },
          }
        : {
            // palette values for light mode
            primary: amber,
            black: lightThemePallet.BLACK,
            selected: lightThemePallet.SELECTED,
            light: lightThemePallet.LIGHT,
            dark: lightThemePallet.DARK,

            background: {
              default: lightThemePallet.DARK,
            },
            text: {
              primary: "#000",
              secondary: grey[500],
            },
          }),
    },
    typography: {
      fontFamily: "Arial",
      fontSize: 16,

      title: {
        fontSize: 18,
        color: "rgb(59,59,59)",
      },
      reference: {
        fontFamily: "Arial",
        fontSize: 16,
        color: "rgb(59,59,59)",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          style: {
            textTransform: "none",
          },
        },
      },
      MuiToggleButton: {
        defaultProps: {
          style: {
            textTransform: "none",
          },
        },
      },
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
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton sx={{ width: 32, height: 32 }} onClick={handleChangeTheme} color="inherit">
          {appTheme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Home />
      </Box>
    </ThemeProvider>
  );
}
