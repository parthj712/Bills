import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const BillPreview = ({
  items,
  subtotal,
  gst = 0,
  vat = 0,
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
    },
  );

  const formattedTime = new Date(date || new Date()).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div>
      <div
        id="print-bill"
        style={{
          width: "76mm",
          fontSize: 12,
          margin: "0 auto",
          fontFamily: "'Inter', sans-serif",
          color: "#1E293B",
          padding: 8,
          background: "#fff",
        }}
      >
        {/* Logo */}
        {shopInfo?.logo?.url && (
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={shopInfo.logo.url}
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
        <Box sx={{ fontSize: 12, color: "#64748B" }}>
          <div>{orderType}</div>
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
          <div>{customerName || "-"}</div>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items */}
        {items.map((item) => (
          <Box
            key={`${item.menuItemId}-${item.portion}-${item.addedAt}`}
            sx={{ mb: 1.5 }}
          >
            <Typography fontSize={14} fontWeight={500}>
              {item.name}
            </Typography>

            <Box display="flex" justifyContent="space-between" my={0.5}>
              <Typography fontSize={14}>
                {item.qty} × ₹ {Number(item.price).toFixed(2)}
              </Typography>

              <Typography fontSize={14} fontWeight={500}>
                ₹ {(item.price * item.qty).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Subtotal */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontSize={13} color="#64748B">
            Subtotal
          </Typography>
          <Typography fontSize={13}>₹ {subtotal.toFixed(2)}</Typography>
        </Box>

        {/* GST */}
        {gst > 0 && (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={13} color="#64748B">
              GST (5%)
            </Typography>
            <Typography fontSize={13}>₹ {gst.toFixed(2)}</Typography>
          </Box>
        )}

        {/* VAT */}
        {vat > 0 && (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontSize={13} color="#64748B">
              VAT (10%)
            </Typography>
            <Typography fontSize={13}>₹ {vat.toFixed(2)}</Typography>
          </Box>
        )}

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

          <Typography fontSize={20} fontWeight={800} sx={{ color: "#0F172A" }}>
            ₹ {total.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography align="center" fontSize={12} sx={{ color: "#64748B" }}>
          Thank You • Visit Again
        </Typography>

        {/* QR */}
        {shopInfo?.upiQr?.url && (
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
