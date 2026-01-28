import { Card, Typography, Divider, Box } from "@mui/material";
import TrendingUp from "@mui/icons-material/TrendingUp";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import TableBar from "@mui/icons-material/TableBar";
import AccessTime from "@mui/icons-material/AccessTime";
import Cancel from "@mui/icons-material/Cancel";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";


export const QuickInsights = () => {
    const insights = [
        {
            label: "Total Orders",
            icon: ShoppingCart,
            bg: "bg-blue-100/70",
            color: "text-blue-600",
        },
        {
            label: "Active Tables",
            icon: TableBar,
            bg: "bg-green-100/70",
            color: "text-green-600",
        },
        {
            label: "Peak Hours",
            icon: AccessTime,
            bg: "bg-purple-100/70",
            color: "text-purple-600",
        },
        {
            label: "Top Selling Item",
            icon: RestaurantMenu,
            bg: "bg-orange-100/70",
            color: "text-orange-600",
        },
        {
            label: "Cancelled Orders",
            icon: Cancel,
            bg: "bg-red-100/70",
            color: "text-red-600",
        },
        {
            label: "Revenue Growth",
            icon: TrendingUp,
            bg: "bg-emerald-100/70",
            color: "text-emerald-600",
        },
    ];


    return (
        <Card
            sx={{
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                    "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
            }}
            className="p-6 lg:col-span-2"
        >
            {/* Header */}
            <Box mb={3}>
                <Typography fontSize={20} fontWeight={700}>
                    Quick Insights
                </Typography>
            </Box>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {insights.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={index}
                            sx={{
                                borderRadius: "16px",
                                border: "1px solid rgba(0,0,0,0.06)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                },
                            }}
                            className="p-5 text-center cursor-pointer"
                        >
                            {/* Icon */}
                            <Box
                                className={`
                  mx-auto
                  mb-3
                  h-11
                  w-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                `}
                            >
                                <Icon className={`${item.color} text-[20px]`} />
                            </Box>

                            {/* Label */}
                            <Typography fontSize={15} fontWeight={600}>
                                {item.label}
                            </Typography>
                        </Card>
                    );
                })}
            </div>
        </Card>
    );
};
