"use client";

import { Box, Typography, Chip, IconButton, LinearProgress } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function BarInventoryCard({ item, onDelete, onAddStock }) {

    const stockPercent =
        item.totalStockML > 0
            ? (item.currentStockML / item.totalStockML) * 100
            : 0;

    const getColor = (percent) => {
        if (percent < 30) return "error";
        if (percent < 70) return "warning";
        return "success";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
                className="flex flex-col"
            >
                {/* HEADER */}
                <Box className="flex justify-between items-center bg-[#0b3c5d] p-4 rounded-t-[18px]">
                    <Typography fontWeight={700} color="white">
                        {item.menuItemId?.name}
                    </Typography>

                    <Chip
                        label={`${item.bottleSizeML} ml`}
                        size="small"
                        sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#0b3c5d",
                            fontWeight: 600,
                        }}
                    />
                </Box>

                {/* BODY */}
                <Box p={3} className="flex flex-col gap-2">
                    <Typography color="black" fontSize={14}>
                        Stock: <b>{item.currentStockML} ml</b>
                    </Typography>

                    <Typography color="black" fontSize={14}>
                        Bottles: <b>{item.remainingBottles}</b>
                    </Typography>

                    {/* PROGRESS */}
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(stockPercent, 100)}
                        color={getColor(stockPercent)}
                        sx={{ height: 8, borderRadius: 5 }}
                    />

                    {/* ACTIONS */}
                    <Box className="flex justify-between mt-2">

                        <IconButton
                            size="small"
                            onClick={() => onDelete(item._id)}
                            sx={{
                                backgroundColor: "#ffebee",
                                color: "#d32f2f",
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>

                        <Chip
                            label="Add Stock"
                            onClick={() => onAddStock(item)}
                            sx={{
                                backgroundColor: "#e0f2fe",
                                color: "#0284c7",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        />


                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}