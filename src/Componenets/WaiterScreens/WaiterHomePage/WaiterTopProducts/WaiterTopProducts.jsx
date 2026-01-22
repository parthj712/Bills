import { Card, Typography } from '@mui/material'
import React from 'react'


const topProducts = [
    { name: "Chicken Chilly", percent: 75, color: "bg-red-500" },
    { name: "Misal-Pav", percent: 40, color: "bg-green-500" },
    { name: "Cheese Chilly Toast", percent: 90, color: "bg-yellow-400" },
    { name: "Cheese Sandwich", percent: 60, color: "bg-purple-400" },
    { name: "Vegetable Salad", percent: 30, color: "bg-pink-400" },
];


const colorMap = {
    "bg-red-500": {
        glass: "bg-red-500/20",
        border: "border-red-500/60",
        text: "text-red-700",
    },
    "bg-green-500": {
        glass: "bg-green-500/20",
        border: "border-green-500/60",
        text: "text-green-700",
    },
    "bg-yellow-400": {
        glass: "bg-yellow-400/20",
        border: "border-yellow-500/60",
        text: "text-yellow-700",
    },
    "bg-purple-400": {
        glass: "bg-purple-400/20",
        border: "border-purple-500/60",
        text: "text-purple-700",
    },
    "bg-pink-400": {
        glass: "bg-pink-400/20",
        border: "border-pink-500/60",
        text: "text-pink-700",
    },
};


const WaiterTopProducts = () => {
    return (
        <div>
            <Card className="p-6 !rounded-2xl">
                <Typography fontSize={26} fontWeight={600} mb={2}>
                    Top Products
                </Typography>

                <div className="flex flex-col gap-6">
                    {topProducts.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                                <Typography fontSize={16} fontWeight={600}>{item.name}</Typography>
                                <span
                                    className={`
                                        text-[13px]
                                        font-semibold
                                        px-2.5
                                        py-0.5
                                        rounded-full
                                        border
                                        backdrop-blur-md
                                        ${colorMap[item.color].glass}
                                        ${colorMap[item.color].border}
                                        ${colorMap[item.color].text}
                                    `}
                                                                    >
                                    {item.percent}%
                                </span>

                            </div>
                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
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
    )
}

export default WaiterTopProducts