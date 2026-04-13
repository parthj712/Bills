import {
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function BillCard({ bill, onView,onDelete  }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: "18px",
                        backgroundColor: "#fff",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    }}
                    className="flex flex-col gap-2"
                >
                    {/* HEADER */}
                    <Box className="flex justify-between items-center">
                        <Box>
                            <Typography fontWeight={700} fontSize={15} color="black">
                                Bill #{bill.billNo}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                                Generated bill
                            </Typography>
                        </Box>

                        <Chip
                            size="small"
                            label={new Date(bill.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                            sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#0b3c5d",
                                fontWeight: 600,
                                borderRadius: "12px",
                            }}
                        />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* AMOUNTS */}
                    <Box className="grid grid-cols-3 text-center">
                        <Box>
                            <Typography fontSize={12} color="text.primary" fontWeight={600}>
                                Subtotal
                            </Typography>
                            <Typography fontWeight={600} color="#616161">
                                ₹ {bill.subtotal}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={12} color="text.primary" fontWeight={600}>
                                GST
                            </Typography>
                            <Typography fontWeight={600} color="#616161">
                                ₹ {bill.gstAmount}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={12} color="text.primary" fontWeight={600}>
                                Total
                            </Typography>
                            <Typography
                                fontWeight={800}
                                fontSize={16}
                                color="#2e7d32"
                            >
                                ₹ {bill.grandTotal}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* ACTION BAR */}
                    <Box className="flex justify-end gap-3">
                        <IconButton
                            onClick={() => onView?.(bill)}
                            size="small"
                            sx={{
                                backgroundColor: "#e3f2fd",
                                "&:hover": { backgroundColor: "#bbdefb" },
                            }}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>

                        {/* <IconButton
                        size="small"
                        sx={{
                            backgroundColor: "#e8f5e9",
                            "&:hover": { backgroundColor: "#c8e6c9" },
                        }}
                    >
                        <Edit fontSize="small" />
                    </IconButton> */}

                        <IconButton
                            onClick={() => onDelete?.(bill._id)}    
                            size="small"
                            sx={{
                                backgroundColor: "#ffebee",
                                color: "#d32f2f",
                                "&:hover": { backgroundColor: "#ffcdd2" },
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </motion.div>


        </>
    );
}
