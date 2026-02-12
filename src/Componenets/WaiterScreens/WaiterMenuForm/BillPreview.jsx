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

  return (
    <div>
      <div
        id="bill-pdf"
        style={{
          width: 500,
          padding: 16,
          fontFamily: "monospace",
          color: "black",
        }}
      >
        {/* 🔥 LOGO (Only if exists) */}
        {shopInfo?.logo && (
          <Box display="flex" justifyContent="center" mb={1}>
            <img
              src={shopInfo.logo}
              alt="Hotel Logo"
              style={{
                maxWidth: 80,
                maxHeight: 80,
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        {/* Shop Name */}
        <Typography align="center" fontWeight={700}>
          {shopInfo?.shopName}
        </Typography>

        {shopInfo?.tagline && (
          <Typography
            align="center"
            fontSize={12}
            color="text.secondary"
            sx={{ fontStyle: "italic", mt: 0.5 }}
          >
            {shopInfo.tagline}
          </Typography>
        )}

        {/* <Typography align="center" fontSize={12}>
          GSTIN: {shopInfo?.gstNumber}
        </Typography> */}

        <Divider sx={{ my: 1 }} />

        {/* Order Info */}
        <Box display="flex" justifyContent="space-between">
          {shopInfo?.website && (
            <Typography fontSize={12}>
              Website: {shopInfo.website}
            </Typography>
          )}
          <Typography fontSize={12}>
            Order Type: {orderType}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>
            Date: {formattedDate}
          </Typography>

          <Typography fontSize={12}>
            Time: {formattedTime}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Items */}
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹ {(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Totals */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹ {tax.toFixed(2)}</span>
        </div>

        <Divider sx={{ my: 1 }} />

        <Typography fontWeight={700} className="flex justify-between">
          <span>Total</span>
          <span>₹ {total.toFixed(2)}</span>
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography align="center" fontSize={12}>
          Thank You 🙏 Visit Again
        </Typography>


        {/* 🔥 UPI QR Code (Only if exists) */}
        {shopInfo?.upiQrImage && (
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Typography fontSize={12} fontWeight={600} mb={1}>
              Scan & Pay via UPI
            </Typography>

            <img
              src={shopInfo.upiQrImage}
              alt="UPI QR"
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
              }}
            />

            <Typography fontSize={11} mt={1}>
              Pay using any UPI App
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default BillPreview;
