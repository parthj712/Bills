"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Divider,
    Box,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";

const ViewBillStaffDialog = ({ open, onClose, staff }) => {
    if (!staff) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontSize={20} fontWeight={700}>Staff Details</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* Content */}
            <DialogContent sx={{ py: 4 }}>
                <Box className="flex flex-col gap-4">
                    {/* Aadhaar */}
                    <Box className="flex items-center gap-3">
                        <Box className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BadgeIcon className="text-blue-600" />
                        </Box>
                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Aadhaar Number
                            </Typography>
                            <Typography fontSize={16} fontWeight={600}>
                                {staff.adharCard || "—"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Email */}
                    <Box className="flex items-center gap-3">
                        <Box className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <EmailIcon className="text-green-600" />
                        </Box>
                        <Box>
                            <Typography fontSize={12} color="text.secondary">
                                Email
                            </Typography>
                            <Typography fontSize={16} fontWeight={600}>
                                {staff.email || "—"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ViewBillStaffDialog;
