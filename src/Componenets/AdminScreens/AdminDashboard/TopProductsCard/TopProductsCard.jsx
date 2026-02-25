import { getOrders } from "@/service/orderService";
import { Card, Typography, Box, Skeleton } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useMemo, useState } from "react";


export const TopProductsCard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  console.log();
  // ✅ Fetch Orders Dynamically
  useEffect(() => {
    setLoading(true);
    getOrders()
      .then((res) => {
        setOrders(res.data?.orders || []);
      })
      .finally(() => setLoading(false));
  }, []);


  const topProducts = useMemo(() => {
    let productMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = {
            name: item.name,
            qtySold: 0,
          };
        }

        productMap[item.name].qtySold += item.qty;
      });
    });
    let productsArray = Object.values(productMap);
    productsArray.sort((a, b) => b.qtySold - a.qtySold);
    let top5 = productsArray.slice(0, 5);
    const totalQty = top5.reduce((sum, p) => sum + p.qtySold, 0);
    return top5.map((p) => ({
      name: p.name,
      percent: totalQty > 0 ? Math.round((p.qtySold / totalQty) * 100) : 0,
    }));
  }, [orders]);

  return (
    <Card
      sx={{
        my: 2,
        borderRadius: "10px",
        border: "1px solid rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
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

      {loading ? (
        <BarSkeleton />
      ) : topProducts.length > 0 ? (
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
          colors={["#f97316"]}
        />
      ) : (
        <Typography fontSize={14} color="text.secondary">
          No sales data available.
        </Typography>
      )}
    </Card>
  );
};





const BarSkeleton = () => (
  <Box display="flex" flexDirection="column" gap={1.4}>
    {[1, 2, 3, 4, 5].map((_, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        height={16}
        width={`${80 - i * 10}%`}
        sx={{ borderRadius: "8px" }}
      />
    ))}
  </Box>
);
