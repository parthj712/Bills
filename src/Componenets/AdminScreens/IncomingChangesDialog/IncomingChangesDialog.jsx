"use client";

import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function IncomingChangesDialog({ open, onClose }) {
    const features = [
        "Swiggy/Zomato Integration",
        "Advanced Inventory Alerts",
        "Auto Daily Profit Summary on WhatsApp",
        "Staff Performance Tracking",
        "CRM",
        "QR Table Ordering",
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden",
                },
            }}
        >
            {/* HEADER */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    color: "#ea580c",
                    background: "#fff7ed",
                    borderBottom: "1px solid #fde3c8",
                }}
            >
                <Typography
                    fontSize={{ xs: 13, sm: 16 }}
                    fontWeight={600}
                    sx={{ lineHeight: 1.4 }}
                >
                    Exciting new features arriving soon to enhance your business operations.
                </Typography>

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} my={3}>
                    {features.map((feature) => (
                        <Box
                            key={feature}
                            sx={{
                                p: 2.2,
                                borderRadius: 3,
                                background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                                border: "1px solid #fde3c8",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                "&:hover": {
                                    transform: "translateY(-3px) scale(1.02)",
                                    boxShadow: "0 8px 20px rgba(249,115,22,0.2)",
                                    borderColor: "#fb923c",
                                    background: "linear-gradient(135deg, #ffedd5, #ffffff)",
                                },
                            }}
                        >
                            <Typography fontWeight={600}>
                                🚀 {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}