import { IconButton, Tooltip, Typography } from "@mui/material";
import * as React from "react";

export default function ButtonTooltip({
  title,
  handler,
  disabled = false,
  active,
  placement = "top",
  style,
  children,
}: {
  title: string;
  handler?: () => void;
  disabled?: boolean;
  active?: boolean;
  placement?: "top" | "right" | "bottom" | "left";
  style?: Record<string, string | number>;
  children: React.ReactNode;
}) {
  return (
    <Tooltip
      title={<Typography variant="title">{title}</Typography>}
      placement={placement}
      arrow
      sx={{ zIndex: 1 }}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "white",
            border: "1px solid black",
          },
        },
      }}
    >
      <IconButton
        disabled={disabled}
        onClick={handler}
        sx={{ width: 54, height: 54, backgroundColor: active ? "selected" : "dark", color: "white", ...style }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
