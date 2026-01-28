import { Card, Typography, Box } from "@mui/material";

export const TopProductsCard = ({ topProducts }) => {
    return (
        <Card
            sx={{
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                    "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
            }}
            className="p-6"
        >
            {/* Header */}
            <Box mb={2}>
                <Typography fontSize={20} fontWeight={700}>
                    Top Selling Products
                </Typography>
                {/* <Typography fontSize={13} className="text-gray-500">
                    Based on current month sales
                </Typography> */}
            </Box>

            {/* List */}
            <div className="space-y-5">
                {topProducts.map((item, index) => (
                    <div
                        key={index}
                        className="group transition-all"
                    >
                        {/* Name & Percentage */}
                        <div className="flex justify-between items-center mb-2">
                            <Typography
                                fontSize={14}
                                fontWeight={600}
                                className="text-black"
                            >
                                {item.name}
                            </Typography>

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    text-gray-600
                                    px-1.5
                                    py-0.5
                                    rounded-full
                                    bg-black/5
                                    border
                                    border-black/10
                                "
                            >
                                {item.percent}%
                            </span>

                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <div
                                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-orange-400
                  to-orange-600
                  transition-all
                  duration-500
                  group-hover:to-orange-700
                "
                                style={{ width: `${item.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
