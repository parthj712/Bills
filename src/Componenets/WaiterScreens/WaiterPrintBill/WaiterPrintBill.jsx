"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import {
  Card,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function WaiterPrintBill() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* BILL CARD */}
      <Card className="w-full max-w-xl p-6 rounded-2xl border-dashed border-2 border-gray-400 bg-gray-200">
        
        {/* Header */}
        <div className="flex justify-between mb-4">
          <Typography fontSize={14}>
            Order ID
            <br />
            <strong>1001185</strong>
          </Typography>

          <Typography fontSize={14} textAlign="right">
            Date
            <br />
            <strong>12/02/2025</strong>
          </Typography>
        </div>

        <Divider className="mb-4" />

        {/* Items */}
        {[
          { name: "Paneer Chilly", price: 250, qty: 1 },
          { name: "Paneer Burger", price: 200, qty: 2 },
          { name: "Paneer Makhani Pizza", price: 650, qty: 2 },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center my-3"
          >
            <div>
              <Typography fontSize={14}>{item.name}</Typography>
              <Typography fontSize={13}>
                ₹ {item.price}/-
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              <IconButton size="small">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography fontSize={14}>{item.qty}</Typography>
              <IconButton size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        ))}

        <Divider className="my-4" />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ 1000/-</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹ 10/-</span>
          </div>

          <Divider />

          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <span>₹ 1100/-</span>
          </div>
        </div>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex gap-6 mt-8">
        <AppButton
          label="Cancel & Return"
          variant="contained"
          className="
            !bg-green-400
            hover:!bg-green-500
            !text-black
            
          "
          onClick={() => {
            console.log("Cancel & Return");
          }}
        />

        <AppButton
          label="Print Bill"
          variant="contained"
          className="
            !bg-blue-500
            hover:!bg-blue-600
            !text-white
            px-8
          "
          onClick={() => {
            console.log("Print bill");
          }}
        />
      </div>
    </div>
  );
}
