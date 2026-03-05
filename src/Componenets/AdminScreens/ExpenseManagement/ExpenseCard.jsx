import {
    Box,
    Typography,
    IconButton,
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Chip,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ExpenseCard({ expense, onDelete, onView }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <Box
                sx={{
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
                className="flex flex-col gap-2"
            >
                {/* HEADER */}
                <Box className="flex justify-between items-start bg-[#0b3c5d] p-6 rounded-t-[18px]">
                    <Box className="flex gap-3 items-center">
                        <Avatar
                            sx={{
                                width: 42,
                                height: 42,
                                fontWeight: 700,
                                bgcolor: "#e3f2fd",
                                color: "#0b3c5d",
                            }}
                        >
                            ₹
                        </Avatar>

                        <Box>
                            <Typography fontWeight={700} fontSize={16} color="white">
                                ₹ {expense.amount}
                            </Typography>

                            <Typography fontSize={13} color="white">
                                {expense.categoryId?.name || "No Category"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Menu */}
                    <Box>
                        <IconButton
                            size="small"
                            onClick={handleMenuOpen}
                            sx={{
                                backgroundColor: "#f5f5f5",
                                "&:hover": { backgroundColor: "#e0e0e0" },
                            }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    onView(expense);
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Visibility fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>View</ListItemText>
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    onDelete(expense._id);
                                    handleMenuClose();
                                }}
                                sx={{ color: "#d32f2f" }}
                            >
                                <ListItemIcon>
                                    <Delete fontSize="small" sx={{ color: "#d32f2f" }} />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* BODY */}
                <Box px={3} py={2}>
                    <Box className="grid grid-cols-3 gap-3">
                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Note
                            </Typography>
                            <Typography fontWeight={600} color="#424242">
                                {expense.note || "-"}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Payment
                            </Typography>
                            <Typography fontWeight={600} color="#424242">
                                {expense.paymentMode?.toUpperCase()}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Date
                            </Typography>
                            <Typography fontWeight={600} color="#424242">
                                {new Date(expense.date).toLocaleDateString("en-IN")}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box className="flex justify-between items-center">
                        <Chip
                            label={expense.categoryId?.name || "No Category"}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                backgroundColor: "#e3f2fd",
                                color: "#0b3c5d",
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}