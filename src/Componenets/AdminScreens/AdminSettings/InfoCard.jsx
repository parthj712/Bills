"use client";
const { Box, Typography } = require("@mui/material");

const InfoRow = ({ label, value, multiline }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: multiline ? "flex-start" : "center",
        gap: 3,
        py: 1,
      }}
    >
      {/* Label */}
      <Typography
        fontSize={14}
        fontWeight={600}
        color="text.secondary"
        sx={{ minWidth: "140px" }}
      >
        {label}
      </Typography>

      {/* Value */}
      <Typography
        fontSize={15}
        fontWeight={500}
        sx={{
          flex: 1,
          textAlign: "right",
          whiteSpace: multiline ? "normal" : "nowrap",
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
};

export default InfoRow;
