"use client";
const { Box, Typography, useTheme, useMediaQuery } = require("@mui/material");

const InfoRow = ({ label, value, multiline }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: multiline ? "flex-start" : "flex-start",
        gap: isMobile ? 1 : 3,
        py: 1,
      }}
    >
      {/* Label */}
      <Typography
        fontSize={14}
        fontWeight={500}
        color="text.secondary"
        sx={{ minWidth: "140px" }}
      >
        {label}
      </Typography>

      {/* Value */}
      <Typography
        fontSize={isMobile ? 17 : 15}
        fontWeight={600}
        sx={{
          flex: 1,
          textAlign: "right",
          whiteSpace: multiline ? "normal" : "nowrap",
          wordBreak: "break-word",
          textTransform : "capitalize",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
};

export default InfoRow;
