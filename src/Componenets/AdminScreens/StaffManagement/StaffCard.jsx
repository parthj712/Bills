import {
    Box,
    Typography,
    IconButton,
    Chip,
    Switch,
    Divider,
    Avatar,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";

const getInitials = (name = "") =>
    name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

export default function StaffCard({
    staff,
    onEdit,
    onDelete,
    onToggle,
    onView,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <Box
                sx={{
                    // p: 2.5,
                    borderRadius: "18px",
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
                                fontSize: 16,
                                bgcolor: "#e3f2fd",
                                color: "#0b3c5d",
                            }}
                        >
                            {getInitials(staff.name)}
                        </Avatar>

                        <Box>
                            <Typography fontWeight={700} fontSize={16} color="white">
                                {staff.name}
                            </Typography>
                            <Typography fontSize={13} color="white">
                                {staff.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        size="small"
                        label={staff.isActive ? "Active" : "Inactive"}
                        sx={{
                            fontWeight: 700,
                            borderRadius: "20px",
                            backgroundColor: staff.isActive
                                ? "#e8f5e9"
                                : "#ffebee",
                            color: staff.isActive
                                ? "#2e7d32"
                                : "#d32f2f",
                        }}
                    />
                </Box>

                <Box px={3} py={1.8}>
                    {/* INFO */}
                    <Box className="grid grid-cols-2 gap-3 mt-1">
                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Phone
                            </Typography>
                            <Typography fontWeight={600} color="#424242">
                                {staff.phone}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Joining Date
                            </Typography>
                            <Typography fontWeight={600} color="#424242">
                                {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* STATUS + ACTIONS */}
                    <Box className="flex justify-between items-center">
                        <Switch
                            checked={!!staff.isActive}
                            color="success"
                            onChange={() => onToggle(staff._id)}
                        />

                        <Box className="flex gap-3">
                            <IconButton
                                size="small"
                                onClick={() => onView(staff)}
                                sx={{
                                    backgroundColor: "#e3f2fd",
                                    "&:hover": { backgroundColor: "#bbdefb" },
                                }}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => onEdit(staff)}
                                sx={{
                                    backgroundColor: "#fff3e0",
                                    "&:hover": { backgroundColor: "#ffe0b2" },
                                }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => onDelete(staff._id)}
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
                </Box>
            </Box>
        </motion.div>
    );
}
