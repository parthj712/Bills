"use client";

import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

export default function DateRangeFilter({
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ textAlign: "left", mb: 3 }}>
      {/* ================= MOBILE DROPDOWN ================= */}
      {isMobile ? (
        <FormControl size="small" >
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            sx={{
              borderRadius: "12px",
              background: "#fff",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">7 Days</MenuItem>
            <MenuItem value="month">30 Days</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      ) : (
        /* ================= DESKTOP TOGGLES ================= */
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
      )}

      {/* ================= CUSTOM DATE PICKER ================= */}
      {range === "custom" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <TextField
            type="date"
            size="small"
            label="From"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: isMobile ? "100%" : 170,
              background: "#fff",
              borderRadius: "12px",
            }}
          />

          <TextField
            type="date"
            size="small"
            label="To"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: isMobile ? "100%" : 170,
              background: "#fff",
              borderRadius: "12px",
            }}
          />
        </Box>
      )}
    </Box>
  );
}