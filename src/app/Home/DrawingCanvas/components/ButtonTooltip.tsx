import { IconButton, Tooltip, Typography } from "@mui/material";
import * as React from "react";

export default function ButtonTooltip({
  title,
  handler,
  disabled = false,
  style,
  children,
}: {
  title: string;
  handler?: () => void;
  disabled?: boolean;
  style?: Record<string, string | number>;
  children: React.ReactNode;
}) {
  return (
    <Tooltip
      title={<Typography sx={{ color: "text.primary", fontWeight: 600 }}>{title}</Typography>}
      placement="top"
      arrow
      sx={{ zIndex: 1 }}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "light",
            border: "1px solid black",
          },
        },
      }}
    >
      <IconButton disabled={disabled} onClick={handler} sx={{ width: 54, height: 54, backgroundColor: "dark", color: "white", ...style }}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
