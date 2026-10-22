import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

/**
 * Tema MUI espelhando os tokens de design (app/globals.css) — paleta SIGDATA.
 */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#003567", dark: "#002397", contrastText: "#f5f5f5" },
    neutral: { main: "#e3e3e3", dark: "#d8d8d8", contrastText: "#1e1e1e" },
    success: { main: "#0f766e", light: "#eaf6f2", contrastText: "#ffffff" },
    warning: { main: "#966415", light: "#fff6e5", contrastText: "#ffffff" },
    info: { main: "#3d6f9e", light: "#eef2ff", contrastText: "#ffffff" },
    error: { main: "#b3261e" },
    background: { default: "#f5f7fa", paper: "#ffffff" },
    text: { primary: "#202a35", secondary: "#6f7986" },
    divider: "#e0e5eb",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          gap: 8,
          "&.MuiButton-containedPrimary:hover": { backgroundColor: "#002397" },
          "&.MuiButton-containedNeutral:hover": { backgroundColor: "#d8d8d8" },
        },
        startIcon: { marginInlineEnd: 0 },
        endIcon: { marginInlineStart: 0 },
        sizeMedium: { minHeight: 40, paddingLeft: 12, paddingRight: 12 },
        sizeSmall: { minHeight: 32, paddingLeft: 8, paddingRight: 8 },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiCheckbox: {
      defaultProps: { size: "small", color: "primary" },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #e0e5eb",
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500 },
        sizeSmall: { height: 24, fontSize: "0.75rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { fontSize: "0.875rem", borderRadius: 8 },
      },
    },
    MuiMenuItem: {
      styleOverrides: { root: { fontSize: "0.875rem", minHeight: 40 } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          minHeight: 44,
          paddingInline: 0,
          marginRight: 24,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: "0.75rem", borderRadius: 6, backgroundColor: "#202a35" },
      },
    },
    MuiMenu: {
      styleOverrides: { paper: { borderRadius: 12 } },
    },
  },
});
