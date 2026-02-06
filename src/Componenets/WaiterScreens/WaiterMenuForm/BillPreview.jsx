import React from "react";
import { Divider, Typography } from "@mui/material";

const BillPreview = ({ items, subtotal, tax, total, shopInfo }) => {
  return (
    <div>
      <div
        id="bill-pdf"
        style={{
          width: 300,
          padding: 16,
          fontFamily: "monospace",
          color: "black",
        }}
      >
        <Typography align="center" fontWeight={700}>
          {shopInfo.shopName}
        </Typography>

        <Typography align="center" fontSize={12}>
          GSTIN: {shopInfo.gstNumber}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {items.map((item) => (
          <div key={item.cartId} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹ {item.unitPrice * item.qty}</span>
          </div>
        ))}

        <Divider sx={{ my: 1 }} />

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
      </div>
    </div>
  );
};

export default BillPreview;
