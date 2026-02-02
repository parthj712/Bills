"use client";

import { Box, ToggleButton, ToggleButtonGroup, TextField } from "@mui/material";

export default function DateRangeFilter({
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}) {
  return (
    <Box sx={{ textAlign: "center", mb: 3 }}>
      {/* ✅ Toggle Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={(e, value) => value && setRange(value)}
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",

            "& .MuiToggleButton-root": {
              px: 2.5,
              py: 0.8,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              color: "#475569",
              transition: "0.2s",
            },

            "& .Mui-selected": {
              background: "linear-gradient(90deg,#2563eb,#3b82f6)",
              color: "white !important",
            },
          }}
        >
          <ToggleButton value="today">Today</ToggleButton>
          <ToggleButton value="week">7 Days</ToggleButton>
          <ToggleButton value="month">30 Days</ToggleButton>
          <ToggleButton value="custom">Custom</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ✅ Date Picker Appears Only for Custom */}
      {range === "custom" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* From Date */}
          <TextField
            type="date"
            size="small"
            label="From"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 170,
              background: "#fff",
              borderRadius: "12px",
            }}
          />

          {/* To Date */}
          <TextField
            type="date"
            size="small"
            label="To"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 170,
              background: "#fff",
              borderRadius: "12px",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
