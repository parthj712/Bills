"use client";

import { Button } from "@mui/material";
import clsx from "clsx";

export default function AppButton({
  label,
  variant = "contained",
  fullWidth = true,
  className,
  onClick,
  sx,
  size,
  ...rest
}) {
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      onClick={onClick}
      size={size}
      sx={sx}
      className={clsx("!py-3 !rounded-lg !font-semibold", className)}
      {...rest}
    >
      {label}
    </Button>
  );
}
