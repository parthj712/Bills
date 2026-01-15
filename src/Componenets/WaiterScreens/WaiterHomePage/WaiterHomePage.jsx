"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Box, Typography, Card, useTheme, useMediaQuery } from "@mui/material";


const dineInTables = [
    { id: "01", status: "active" },
    { id: "02", status: "available" },
    { id: "03", status: "available" },
    { id: "04", status: "available" },
    { id: "05", status: "available" },
    { id: "06", status: "available" },
    { id: "07", status: "available" },
    { id: "08", status: "available" },
    { id: "09", status: "available" },
    { id: "10", status: "available" },
    { id: "11", status: "available" },
    { id: "12", status: "available" },
    { id: "13", status: "available" },
    { id: "14", status: "available" },
    { id: "15", status: "available" },
    { id: "16", status: "available" },
];


const tableStyles = {
    active: "!bg-green-400 !text-white shadow-md",
    available: "!bg-white text-black border border-gray-200",
};

const activeCount = dineInTables.filter(
    (t) => t.status === "active"
).length;




const topProducts = [
    { name: "Chicken Chilly", percent: 40, color: "bg-red-500" },
    { name: "Misal-Pav", percent: 40, color: "bg-green-500" },
    { name: "Cheese Chilly Toast", percent: 40, color: "bg-yellow-400" },
    { name: "Cheese Sandwich", percent: 40, color: "bg-purple-400" },
    { name: "Vegetable Salad", percent: 40, color: "bg-pink-400" },
];

export default function WaiterHomePage() {

    const theme = useTheme();

    // BREAKPOINTS
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    return (
        <Box className="min-h-screen bg-gray-50 p-6">
            {/* Top Buttons */}
            <div className="flex items-center gap-4 mb-6">
                <AppButton
                    label="Swiggy"
                    className="!bg-orange-500 !text-white flex-1"
                />
                <AppButton
                    label="Zomato"
                    className="!bg-red-600 !text-white flex-1"
                />
            </div>

            <div className="grid grid-cols-12 gap-6">

                {/* LEFT PANEL */}
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col gap-4 order-2 md:order-1">

                    {/* Takeaway */}
                    <AppButton
                        label="Takeaway"
                        className="!bg-orange-500 !text-white"
                    />

                    {/* Top Products */}
                    <Card className="p-6 rounded-xl">
                        <Typography fontSize={26} fontWeight={600} mb={2}>
                            Top Products
                        </Typography>

                        <div className="flex flex-col gap-3">
                            {topProducts.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <Typography fontSize={16}>
                                            {item.name}
                                        </Typography>
                                        <span className="font-semibold text-[14px] bg-gray-100 px-2 py-0.5 rounded-full">
                                            {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* RIGHT PANEL */}
               <div className="col-span-12 md:col-span-8 lg:col-span-8 order-1 md:order-2">

                    <Card className="p-7 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Typography fontSize={24} fontWeight={600}>
                                Dine-In Orders
                            </Typography>

                            <span className="
    text-sm
    font-semibold
    bg-green-100
    text-green-700
    px-3
    py-1
    rounded-full
  ">
                                {activeCount} Active
                            </span>
                        </div>


                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {dineInTables.map((table) => (
                                <Card
                                    key={table.id}
                                    className={`
        h-25
        flex items-center justify-center
        rounded-xl
        cursor-pointer
        transition
        hover:shadow-md
        ${tableStyles[table.status]}
      `}
                                >
                                    <Typography fontSize={18} fontWeight={600}>
                                        {table.id}
                                    </Typography>
                                </Card>
                            ))}
                        </div>

                    </Card>
                </div>

            </div>
        </Box>
    );
}
