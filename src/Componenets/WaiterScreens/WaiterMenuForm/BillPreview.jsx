import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const BillPreview = ({
  items,
  subtotal,
  tax,
  total,
  shopInfo,
  orderType,
  date,
  customerName,
}) => {


  const formattedDate = new Date(date || new Date()).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedTime = new Date(date || new Date()).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  console.log("shopinfo", shopInfo)






  return (
    <div>
      <div
        id="bill-pdf"
        style={{
          width: "76mm",   // for 58mm printer
          // fontFamily: "monospace",
          fontSize: 12,
          margin: "0 auto",
          padding: 24,
          fontFamily: "'Inter', sans-serif",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          color: "#1E293B",
        }}
      >
        {/* Logo */}
        {shopInfo?.logo && (
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={shopInfo.logo?.url}
              alt="Hotel Logo"
              style={{ maxWidth: 70, objectFit: "contain" }}
            />
          </Box>
        )}

        {/* Shop Name */}
        <Typography align="center" fontSize={20} fontWeight={700}>
          {shopInfo?.shopName}
        </Typography>

        {shopInfo?.tagline && (
          <Typography
            align="center"
            fontSize={12}
            sx={{ color: "#64748B", mt: 0.5 }}
          >
            {shopInfo.tagline}
          </Typography>
        )}

        {shopInfo?.website && (
          <Typography
            align="center"
            fontSize={12}
            sx={{ color: "#64748B", mt: 0.5 }}
          >
            {shopInfo.website}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Order Meta */}
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="space-between"
          sx={{ fontSize: 12, color: "#64748B" }}
        >
          <span>{orderType}</span>
          <span>{formattedDate}</span>
        </Box>

        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="space-between"
          sx={{ fontSize: 12, color: "#64748B", mb: 2 }}
        >
          <span>{formattedTime}</span>
          <span>{customerName || "-"}</span>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Items */}
        {items.map((item) => (
          <Box
            key={item.menuItemId}
            display="flex"
            flexDirection={"column"}
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >

            <Typography fontSize={14} fontWeight={500}>
              {item.name}
            </Typography>

            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} my={0.5}>
              <Typography fontSize={14} >
                {item.qty} × ₹ {item.price.toFixed(2)}
              </Typography>
              <Typography fontSize={14} fontWeight={500}>
                ₹ {(item.price * item.qty).toFixed(2)}
              </Typography>

            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Totals */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontSize={13} color="#64748B">
            Subtotal
          </Typography>
          <Typography fontSize={13}>
            ₹ {subtotal.toFixed(2)}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontSize={13} color="#64748B">
            Tax
          </Typography>
          <Typography fontSize={13}>
            ₹ {tax.toFixed(2)}
          </Typography>
        </Box>

        <Divider />

        {/* Grand Total */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Typography fontSize={18} fontWeight={700}>
            Total
          </Typography>
          <Typography
            fontSize={20}
            fontWeight={800}
            sx={{ color: "#0F172A" }}
          >
            ₹ {total.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          align="center"
          fontSize={12}
          sx={{ color: "#64748B" }}
        >
          Thank You • Visit Again
        </Typography>

        {/* QR */}
        {shopInfo?.upiQr.url && (
          <Box mt={3} display="flex" flexDirection="column" alignItems="center">
            <Typography fontSize={12} fontWeight={600} mb={1}>
              Scan to Pay
            </Typography>

            <img
              src={shopInfo.upiQr.url}
              alt="UPI QR"
              style={{ width: 80, height: 80 }}
            />

            <Typography fontSize={11} mt={1} sx={{ color: "#64748B" }}>
              UPI Accepted
            </Typography>
          </Box>
        )}
      </div>
    </div>

  );
};

export default BillPreview;
