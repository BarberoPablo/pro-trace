declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    //regular: React.CSSProperties;
    title: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    //regular: true;
    title: true;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    black: string;
    selected: string;
    light: string;
    dark: string;
  }

  interface PaletteOptions {
    black?: string;
    selected?: string;
    light?: string;
    dark?: string;
  }
}

export {};
