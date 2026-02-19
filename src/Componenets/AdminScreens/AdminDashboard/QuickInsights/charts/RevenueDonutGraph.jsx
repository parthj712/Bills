"use client";

import { Card, Typography, Box, Divider } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { getDineInTakeAway } from "@/utils/reportHelper";
import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";


export default function RevenueDonutChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [shopData, setShopData] = useState(null);

  const fecthShopData = async () => {
    try {
      const res = await getShopInfo();
      setShopData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fecthShopData();
  }, []);

  const isDineIn = shopData?.businessCategory === "DINE_IN";
  if (!bills?.length) return null;

  let totalRevenue = bills.reduce(
    (sum, b) => sum + (b.grandTotal || 0),
    0
  );

  let data = [];
  let dineIn = 0;
  let takeAway = 0;

  if (isDineIn) {
    const result = getDineInTakeAway(bills);
    data = result.data;

    dineIn = data.find((d) => d.label === "Dine In")?.value || 0;
    takeAway =
      data.find((d) => d.label === "Take Away")?.value || 0;
  } else {
    takeAway = totalRevenue;

    data = [
      {
        id: 0,
        value: totalRevenue,
        label: "Orders",
        color: "#3b82f6",
      },
    ];
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        p: isMobile ? 2 : 3,
        background:
          "linear-gradient(180deg,#ffffff,#fafafa)",
      }}
    >
      {/* Header */}
      <Box mb={isMobile ? 1.5 : 2}>
        <Typography
          fontSize={isMobile ? 16 : 18}
          fontWeight={700}
        >
          {isDineIn
            ? "🍽 Revenue Split"
            : "🧾 Total Sales"}
        </Typography>

        <Typography
          fontSize={isMobile ? 12 : 13}
          sx={{ opacity: 0.65 }}
        >
          {isDineIn
            ? "Dine-In vs TakeAway Contribution"
            : "Total billing revenue"}
        </Typography>
      </Box>

      {/* Chart */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: isMobile ? 260 : 320,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PieChart
          series={[
            {
              innerRadius: isMobile ? 55 : 75,
              outerRadius: isMobile ? 85 : 115,
              paddingAngle: 3,
              cornerRadius: 8,
              data,
            },
          ]}
          width={isMobile ? 260 : 360}
          height={isMobile ? 240 : 300}
          slotProps={{
            legend: {
              direction: "row",
              position: {
                vertical: "bottom",
                horizontal: "middle",
              },
              padding: 5,
            },
          }}
        />

        {/* Center Text */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            fontSize={isMobile ? 11 : 13}
            sx={{ opacity: 0.6 }}
          >
            Total Revenue
          </Typography>

          <Typography
            fontSize={isMobile ? 18 : 22}
            fontWeight={800}
          >
            ₹
            {totalRevenue.toLocaleString(
              "en-IN"
            )}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Split */}
      {isDineIn && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile
                ? "column"
                : "row",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                background:
                  "rgba(34,197,94,0.08)",
                textAlign: "center",
              }}
            >
              <Typography
                fontSize={12}
                sx={{ opacity: 0.7 }}
              >
                Dine In
              </Typography>

              <Typography
                fontWeight={800}
                fontSize={isMobile ? 15 : 16}
              >
                ₹
                {dineIn.toLocaleString(
                  "en-IN"
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                background:
                  "rgba(59,130,246,0.08)",
                textAlign: "center",
              }}
            >
              <Typography
                fontSize={12}
                sx={{ opacity: 0.7 }}
              >
                Take Away
              </Typography>

              <Typography
                fontWeight={800}
                fontSize={isMobile ? 15 : 16}
              >
                ₹
                {takeAway.toLocaleString(
                  "en-IN"
                )}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
}

