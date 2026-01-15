"use client";

import {
    Box,
    Card,
    Typography,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";

export default function WaiterMenuForm() {
    return (
        <Box className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <IconButton>
                    <ArrowBackIcon />
                </IconButton>

                <Select
                    size="small"
                    value={1}
                    className="w-64 bg-white rounded-lg"
                >
                    <MenuItem value={1}>Table Number 1</MenuItem>
                    <MenuItem value={2}>Table Number 2</MenuItem>
                </Select>
            </div>

            <div className="grid grid-cols-12 gap-6 ">
                {/* LEFT: ORDER INPUT */}
                <div className="col-span-12 md:col-span-7 ">
                    <Card className="flex flex-col gap-6 p-6 rounded-2xl space-y-4 ">
                        <TextField
                            placeholder="Search"
                            fullWidth
                            size="small"
                        />

                        <Select fullWidth size="small" displayEmpty>
                            <MenuItem disabled>Categories</MenuItem>
                            <MenuItem>Starters</MenuItem>
                            <MenuItem>Main Course</MenuItem>
                        </Select>

                        <TextField
                            placeholder="Item Code"
                            fullWidth
                            size="small"
                        />

                        <TextField
                            placeholder="Item Quantity"
                            fullWidth
                            size="small"
                        />

                        <TextField
                            placeholder="Item Name"
                            fullWidth
                            size="small"
                        />

                        <TextField
                            placeholder="KOT Message"
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <div className="flex justify-end">
                            <AppButton
                                label="Add to Order"
                                variant="contained"
                                className="!bg-orange-500 hover:!bg-orange-600 !text-white px-8"
                                onClick={() => {
                                    // later: push item to bill state
                                    console.log("Item added to order");
                                }}
                            />
                        </div>

                    </Card>
                </div>

                {/* RIGHT: BILL PREVIEW */}
                <div className="col-span-12 md:col-span-5">
                    <Card className="p-6 rounded-2xl border-dashed border-2 border-gray-300">
                        {/* Bill Header */}
                        <div className="flex justify-between mb-4">
                            <Typography fontSize={14}>
                                Order ID
                                <br />
                                <strong>1001185</strong>
                            </Typography>

                            <Typography fontSize={14} textAlign="right">
                                Date
                                <br />
                                <strong>12/02/2025</strong>
                            </Typography>
                        </div>

                        <Divider className="mb-4" />

                        {/* Items */}
                        {[
                            { name: "Paneer Chilly", price: 250, qty: 1 },
                            { name: "Paneer Burger", price: 200, qty: 2 },
                            { name: "Paneer Makhani Pizza", price: 650, qty: 2 },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center my-3"
                            >
                                <div>
                                    <Typography fontSize={14}>{item.name}</Typography>
                                    <Typography fontSize={13} color="text.secondary">
                                        ₹ {item.price}/-
                                    </Typography>
                                </div>

                                <div className="flex items-center gap-2">
                                    <IconButton size="small">
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography>{item.qty}</Typography>
                                    <IconButton size="small">
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}

                        <Divider className="my-4" />

                        {/* Totals */}
                        <div className="space-y-2 text-sm my-3">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹ 1000/-</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹ 10/-</span>
                            </div>

                            <Divider />

                            <div className="flex justify-between font-semibold my-3">
                                <span>Grand Total</span>
                                <span>₹ 1100/-</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Box>
    );
}
