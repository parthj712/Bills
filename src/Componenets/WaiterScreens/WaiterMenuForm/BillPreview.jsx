"use client";

import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const BillPreview = ({
  items,
  subtotal,
  cgst = 0,
  sgst = 0,
  vat = 0,
  discountPercent = 0,
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
  console.log("shopInfo", shopInfo);

  const formattedTime = new Date(date || new Date()).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div
      id="print-bill"
      style={{
        width: shopInfo?.printerType === "58MM" ? "58mm" : "76mm",
        fontSize: 12,
        margin: "0 auto",
        fontFamily: "monospace",
        color: "#000",
        padding: "10px",
        background: "#fff",
      }}
    >
      {/* LOGO */}
      {shopInfo?.logo?.url && (
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={shopInfo.logo.url}
            alt="Hotel Logo"
            crossOrigin="anonymous"
            style={{
              width: 70,
              height: 70,
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      {/* SHOP NAME... */}
      <Typography
        align="center"
        sx={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {shopInfo?.shopName}
      </Typography>

      {/* TAGLINE */}
      {shopInfo?.tagline && (
        <Typography align="center" fontSize={12}>
          {shopInfo.tagline}
        </Typography>
      )}

      {/* WEBSITE */}
      {shopInfo?.website && (
        <Typography align="center" fontSize={11}>
          {shopInfo.website}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* ORDER INFO */}
      <Box sx={{ fontSize: 12 }}>
        <Typography fontSize={12}>Order Type: {orderType}</Typography>

        <Typography fontSize={12}>Date: {formattedDate}</Typography>

        <Typography fontSize={12}>Time: {formattedTime}</Typography>

        {customerName && (
          <Typography fontSize={12}>Customer: {customerName}</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ITEMS */}
      {items.map((item) => (
        <Box key={`${item.menuItemId}-${item.addedAt}`} sx={{ mb: 1 }}>
          <Typography fontSize={13} fontWeight={600}>
            {item.name}
          </Typography>

          {(item.variantName || item.portion) && (
            <Typography fontSize={11}>
              {item.variantName} {item.portion}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={12}>
              {item.qty} × ₹{Number(item.price).toFixed(2)}
            </Typography>

            <Typography fontSize={12}>
              ₹{(item.qty * item.price).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* SUBTOTAL */}
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={12}>Subtotal</Typography>
        <Typography fontSize={12}>₹{subtotal.toFixed(2)}</Typography>
      </Box>

      {/* CGST */}
      {cgst > 0 && (
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>CGST (2.5%)</Typography>
          <Typography fontSize={12}>₹{cgst.toFixed(2)}</Typography>
        </Box>
      )}

      {/* SGST */}
      {sgst > 0 && (
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>SGST (2.5%)</Typography>
          <Typography fontSize={12}>₹{sgst.toFixed(2)}</Typography>
        </Box>
      )}

      {/* VAT */}
      {vat > 0 && (
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>VAT (10%)</Typography>
          <Typography fontSize={12}>₹{vat.toFixed(2)}</Typography>
        </Box>
      )}

      {/* DISCOUNT */}
      {discountPercent > 0 && (
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>Discount ({discountPercent}%)</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* GRAND TOTAL */}
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight="bold" fontSize={16}>
          TOTAL
        </Typography>

        <Typography fontWeight="bold" fontSize={16}>
          ₹{total.toFixed(2)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* QR */}
      {shopInfo?.upiQr?.url && (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Typography fontSize={12} fontWeight={600}>
            Scan & Pay
          </Typography>

          <img
            src={shopInfo.upiQr.url}
            alt="UPI QR"
            crossOrigin="anonymous"
            style={{
              width: 90,
              height: 90,
              objectFit: "contain",
            }}
          />

          <Typography fontSize={11}>UPI Accepted</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography align="center" fontSize={12}>
        Thank You • Visit Again
      </Typography>
    </div>
  );
};

export default BillPreview;
