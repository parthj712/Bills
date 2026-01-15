"use client";

import {
    Box,
    Card,
    Typography,
} from "@mui/material";
import {
    Dashboard,
    TableBar,
    RestaurantMenu,
    Receipt,
    BarChart,
    People,
    Settings,
    ShoppingCart,
    CurrencyRupee,
    EmojiEmotions,
    HomeWork
} from "@mui/icons-material";
import { StatCard } from "./StatCard";



const sidebarItems = [
    { label: "Dashboard", icon: <Dashboard fontSize="small" /> },
    { label: "Table Management", icon: <TableBar fontSize="small" /> },
    { label: "Menu Management", icon: <RestaurantMenu fontSize="small" /> },
    { label: "Order Management", icon: <Receipt fontSize="small" /> },
    { label: "Billing & Payments", icon: <Receipt fontSize="small" /> },
    { label: "Analytics & Graphs", icon: <BarChart fontSize="small" /> },
    { label: "Staff Management", icon: <People fontSize="small" /> },
    { label: "Settings", icon: <Settings fontSize="small" /> },
];

const stats = [
    {
        title: "Total Sales",
        value: "Rs.5k",
        change: "+10% from yesterday",
        icon: <HomeWork fontSize="large" />,
        bg: "bg-orange-100",
        iconColor: "text-orange-500",
        changeColor: "text-orange-500",
        border : "text-orange-500"
    },
    {
        title: "Total Orders",
        value: "500",
        change: "+8% from yesterday",
        icon: <ShoppingCart fontSize="large" />,
        bg: "bg-green-100",
        iconColor: "text-green-500",
        changeColor: "text-green-500",
    },
    {
        title: "Today's Sale",
        value: "Rs.5k",
        change: "+1% from yesterday",
        icon: <CurrencyRupee fontSize="large" />,
        bg: "bg-purple-100",
        iconColor: "text-purple-500",
        changeColor: "text-purple-500",
    },
    {
        title: "Satisfaction",
        value: "85%",
        change: "",
        icon: <EmojiEmotions fontSize="large" />,
        bg: "bg-yellow-100",
        iconColor: "text-yellow-500",
        changeColor: "text-yellow-500",
    },
];
const topProducts = [
    { name: "Chicken Chilly", percent: 40, color: "bg-red-500" },
    { name: "Misal-Pav", percent: 40, color: "bg-green-500" },
    { name: "Cheese Chilly Toast", percent: 40, color: "bg-black" },
    { name: "Cheese Sandwich", percent: 40, color: "bg-purple-400" },
    { name: "Vegetable Salad", percent: 40, color: "bg-pink-400" },
];

export default function AdminHomePage() {
    return (
        <Box className="min-h-screen flex bg-gray-50">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r px-4 py-6 hidden md:block">
                <div className="flex items-center gap-2 mb-8">
                    <img src="/Logo.png" className="h-8" />
                </div>

                <nav className="space-y-5">
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            className="text-black flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-orange-50 text-[18px]"
                        >
                            {item.icon}
                            {item.label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6">

                {/* Header */}
                <Typography color="black" fontSize={30} fontWeight={600} mb={4}>
                    Dashboard
                </Typography>

                {/* STATS */}
                <div className="pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* TOP PRODUCTS */}
                    <Card className="p-6 rounded-xl">
                        <Typography fontWeight={600} mb={4}>
                            Top Products
                        </Typography>

                        <div className="space-y-4">
                            {topProducts.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">{item.name}</span>
                                        <span className="text-xs bg-gray-100 px-2 rounded-full">
                                            {item.percent}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* SPEED DIAL */}
                    <Card className="p-6 rounded-xl lg:col-span-2">
                        <Typography fontWeight={600} mb={4}>
                            Speed Dial
                        </Typography>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                "Total Orders",
                                "Active Tables",
                                "Cancelled Orders",
                                "Top Selling Item",
                                "Peak Hours",
                                "Cancelled Orders",
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="
                    border
                    rounded-xl
                    p-4
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-sm
                    cursor-pointer
                    hover:shadow-sm
                  "
                                >
                                    <div className="h-8 w-8 mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                                        ⚡
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </main>
        </Box>
    );
}
