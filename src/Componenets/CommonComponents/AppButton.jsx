import { Button } from "@mui/material";

export default function AppButton({
  label,
  variant = "contained",
  fullWidth = true,
  className,
  onClick,
  sx,
  size,
  color = "primary", // 👈 add this
  ...rest
}) {
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      color={color} // 👈 pass color
      onClick={onClick}
      size={size}
      sx={{
        py: 1.5,
        borderRadius: 2,
        fontWeight: 600,
        ...sx,
      }}
      className={className}
      {...rest}
    >
      {label}
    </Button>
  );
}
