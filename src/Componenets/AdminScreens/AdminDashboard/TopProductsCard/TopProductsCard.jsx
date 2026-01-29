import { Card, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

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
            <Box mb={3}>
                <Typography fontSize={20} fontWeight={700}>
                    Top Selling Products
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                    Sales contribution (%)
                </Typography>
            </Box>

            {/* Graph */}
            <BarChart
                height={210}
                layout="horizontal"
                series={[
                    {
                        data: topProducts.map((p) => p.percent),
                        label: "Sales %",
                    },
                ]}
                yAxis={[
                    {
                        scaleType: "band",
                        data: topProducts.map((p) => p.name),
                    },
                ]}
                xAxis={[
                    {
                        max: 100,
                        label: "Percentage",
                    },
                ]}
                colors={["#f97316"]} // orange
                sx={{
                    "& .MuiChartsAxis-tickLabel": {
                        fontSize: 12,
                        fill: "#444",
                    },
                    "& .MuiChartsAxis-label": {
                        fontSize: 12,
                    },
                }}
            />
        </Card>
    );
};
