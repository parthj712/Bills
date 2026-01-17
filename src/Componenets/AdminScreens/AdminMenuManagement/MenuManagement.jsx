"use client";

import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    IconButton,
    TextField,
    Tooltip,
} from "@mui/material";

import { Edit, Delete, Add } from "@mui/icons-material";
import AppButton from "@/Componenets/CommonComponents/AppButton";


const menuItems = [
    {
        id: 1,
        name: "Paneer Butter Masala",
        description: "A rich, creamy North Indian curry made with paneer",
        category: "Main Course",
        price: 200,
        active: false,
    },
    {
        id: 2,
        name: "Veg Manchurian",
        description: "A rich, creamy North Indian curry made with paneer",
        category: "Chinese",
        price: 160,
        active: true,
    },
    {
        id: 3,
        name: "Veg Manchurian",
        description: "A rich, creamy North Indian curry made with paneer",
        category: "Chinese",
        price: 160,
        active: true,
    },
];

export default function MenuManagement() {
    return (
        <Box className="flex flex-col gap-6 p-2">
            {/* Header */}
            <Box className="flex items-center justify-between">
                <Typography fontSize={28} fontWeight={600} className="text-black">
                    Menu Management
                </Typography>
            </Box>

            {/* Search + Add */}
            <Box className="flex items-center justify-between gap-4">
                <TextField
                    fullWidth
                    placeholder="Search Menu"
                    size="small"
                    className="max-w-3xl bg-gray-50"
                />


                <AppButton
                    label="Add Menu"
                    startIcon={<Add />}
                    sx={{
                        backgroundColor: "#3B82F6", // blue-500
                        color: "#fff",
                        px: 2, // padding left & right (px-4)
                        minWidth: 120,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": {
                            backgroundColor: "#2563EB", // blue-600
                        },
                    }}
                />


            </Box>

            {/* Table */}
            <TableContainer sx={{ borderRadius: 4 }} component={Paper} className="rounded-2xl shadow-none">
                <Table>
                    {/* Table Head */}
                    <TableHead>
                        <TableRow className="bg-blue-500">
                            <TableCell className="!text-white">Image</TableCell>
                            <TableCell className="!text-white">
                                Item Name & Description
                            </TableCell>
                            <TableCell className="!text-white">Category</TableCell>
                            <TableCell className="!text-white">Price</TableCell>
                            <TableCell className="!text-white">Status</TableCell>
                            <TableCell className="!text-white">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                {/* Image */}
                                <TableCell>
                                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                                        Image
                                    </div>
                                </TableCell>

                                {/* Name & Desc */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-black ">
                                            {item.name}
                                        </span>
                                        <span className="text-sm text-gray-500 line-clamp-1">
                                            {item.description}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Category */}
                                <TableCell>{item.category}</TableCell>

                                {/* Price */}
                                <TableCell sx={{ fontWeight: 600 }}>Rs.{item.price}</TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Switch checked={item.active} color="success" />
                                </TableCell>

                                {/* Actions */}
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Tooltip title="Delete Menu" arrow>
                                            <IconButton size="small" className="!text-red-500">
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>


                                        <Tooltip title="Edit Menu" arrow>
                                            <IconButton size="small" className="!text-orange-500">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
