"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, Box, Divider, Typography } from "@mui/material";

const CrmCard = ({ customer, isBakery }) => {
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
        className="flex flex-col"
      >
        {/* HEADER */}
        <Box className="flex justify-between items-start bg-[#0b3c5d] p-5 rounded-t-[12px]">
          <Box className="flex gap-3 items-center">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontWeight: 700,
                fontSize: 16,
                bgcolor: "#e3f2fd",
                color: "#0b3c5d",
              }}
            >
              {getInitials(customer.name)}
            </Avatar>

            <Box>
              <Typography fontWeight={700} fontSize={16} color="white">
                {customer.name}
              </Typography>

              {/* Show mobile only for bakery */}
              {isBakery && (
                <Typography fontSize={13} color="white">
                  {customer.mobile}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* BODY */}
        <Box px={3} py={2}>
          {/* Birth Date only for bakery */}
          {isBakery && (
            <>
              <Box mb={1}>
                <Typography fontSize={12} color="text.secondary">
                  Birth Date
                </Typography>

                <Typography fontWeight={700} color="#0369a1">
                  {customer.birthDate
                    ? new Date(customer.birthDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />
            </>
          )}

          {/* CRM STATS */}
          <Box className="grid grid-cols-3 gap-4 text-center">
            {/* Visits */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Visits
              </Typography>

              <Typography fontWeight={700} fontSize={14} color="#0369a1">
                {customer.totalOrders}
              </Typography>
            </Box>

            {/* Total Spend */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Total Spend
              </Typography>

              <Typography fontWeight={700} fontSize={14} color="#16a34a">
                ₹ {customer.totalSpend}
              </Typography>
            </Box>

            {/* Favorite Item */}
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Favorite
              </Typography>

              <Typography
                fontWeight={700}
                fontSize={13}
                className="text-[#000C5A]"
              >
                {customer.favoriteItem || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CrmCard;
