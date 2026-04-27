"use client";

import { getOrders } from "@/service/orderService";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PictureAsPdf } from "@mui/icons-material";

const OrdersReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      const data = Array.isArray(res.data?.orders) ? res.data.orders : [];
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Order Summary
  const orderSummary = useMemo(() => {
    return orders.reduce((acc, order) => {
      const type = order.orderType || "UNKNOWN";

      if (!acc[type]) {
        acc[type] = {
          totalOrders: 0,
          totalRevenue: 0,
        };
      }

      acc[type].totalOrders += 1;
      acc[type].totalRevenue += Number(order.subtotal || 0);

      return acc;
    }, {});
  }, [orders]);

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.subtotal || 0),
    0,
  );

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(11, 60, 93);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Order Type Report", 14, 20);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 28);

    autoTable(doc, {
      startY: 50,
      head: [["Order Type", "Orders", "Revenue", "Avg Order Value"]],
      body: Object.entries(orderSummary).map(([type, data]) => [
        type,
        data.totalOrders,
        `₹ ${data.totalRevenue.toFixed(2)}`,
        `₹ ${(data.totalRevenue / data.totalOrders).toFixed(2)}`,
      ]),
      headStyles: {
        fillColor: [11, 60, 93],
      },
    });

    doc.save("Order-Type-Report.pdf");
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        mb={3}
        gap={2}
      >
        <Box>
          <Typography
            fontSize={isMobile ? 22 : 28}
            fontWeight={700}
            className="text-[#000C5A]"
          >
            Order Type Report
          </Typography>

          <Typography color="text.secondary" fontSize={isMobile ? 13 : 14}>
            Analyze dine-in, takeaway & delivery orders
          </Typography>
        </Box>

        {/* Desktop Export */}
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportPDF}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            }}
          >
            Export PDF
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : "repeat(2,1fr)"}
        gap={2}
        mb={4}
      >
        {/* Total Orders */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#0f172a,#1e293b)",
            color: "#fff",
          }}
        >
          <Typography fontSize={14}>Total Orders</Typography>
          <Typography fontSize={28} fontWeight={700}>
            {totalOrders}
          </Typography>
        </Paper>

        {/* Total Revenue */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#065f46,#047857)",
            color: "#fff",
          }}
        >
          <Typography fontSize={14}>Total Revenue</Typography>
          <Typography fontSize={28} fontWeight={700}>
            ₹ {totalRevenue.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* Desktop Table */}
      {!isMobile ? (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                {[
                  "Order Type",
                  "Total Orders",
                  "Revenue",
                  "Avg Order Value",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align="center"
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.entries(orderSummary).map(([type, data]) => (
                <TableRow key={type}>
                  <TableCell align="center">{type}</TableCell>
                  <TableCell align="center">{data.totalOrders}</TableCell>
                  <TableCell align="center">
                    ₹ {data.totalRevenue.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    ₹ {(data.totalRevenue / data.totalOrders).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        /* Mobile Cards */
        <Box display="grid" gap={2}>
          {Object.entries(orderSummary).map(([type, data]) => (
            <Card
              key={type}
              sx={{
                borderRadius: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Typography fontWeight={700} fontSize={18}>
                  {type}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography>
                  Total Orders: <strong>{data.totalOrders}</strong>
                </Typography>

                <Typography>
                  Revenue: <strong>₹ {data.totalRevenue.toFixed(2)}</strong>
                </Typography>

                <Typography>
                  Avg Order Value:{" "}
                  <strong>
                    ₹ {(data.totalRevenue / data.totalOrders).toFixed(2)}
                  </strong>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Floating Button for Mobile */}
      {isMobile && Object.entries(orderSummary).length > 0 && (
        <Fab
          onClick={exportPDF}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(135deg,#082b44,#1565c0)",
            },
          }}
        >
          <PictureAsPdf />
        </Fab>
      )}
    </Box>
  );
};

export default OrdersReport;
