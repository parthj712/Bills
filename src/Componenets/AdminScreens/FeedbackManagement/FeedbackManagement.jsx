"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { getFeedbacks, updateResovleStatus } from "@/service/feedbackService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import { Add } from "@mui/icons-material";

import {
  Box,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const FeedbackManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [feedbacks, setFeedbacks] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];
  const fetchSubscriptionExpiry = async () => {
    try {
      const res = await getSubscriptionExpiry();
      setSubscription(res.data);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoadingSub(false); // ✅ stop loading
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await getFeedbacks();
      console.log(res.data);
      setFeedbacks(res.data);
    } catch (error) {
      console.log("failed to fetch feedbacks", error.message);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchSubscriptionExpiry();
  }, []);

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleResolveToggle = async (feedback) => {
    try {
      await updateResovleStatus(feedback._id, {
        isResolved: !feedback.isResolved,
      });

      fetchFeedbacks(); // refresh list
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box className="flex flex-col gap-6 p-2">
      <Box className="flex flex-row gap-2">
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#000C5A]"
        >
          Customer Feedbacks
        </Typography>
      </Box>

      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            // boxShadow: "0 10px 45px rgba(0,0,0,0.10)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Customer",
                  "Mobile",
                  "Comment",
                  "Food",
                  "Service",
                  "Ambience",
                  "Overall",
                  "Resolved",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "white",
                      fontWeight: 600,
                      borderBottom: "none",
                      py: 2,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {feedbacks?.data?.map((fb, index) => (
                <TableRow
                  key={fb._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                    "&:hover": { backgroundColor: "#eef6ff" },
                    transition: "0.2s",
                  }}
                >
                  {/* Date */}
                  <TableCell>
                    <Typography fontSize={13}>
                      {formatDate(fb.createdAt)}
                    </Typography>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <Typography fontWeight={500}>
                      {fb.customerName || "-"}
                    </Typography>
                  </TableCell>

                  {/* Mobile */}
                  <TableCell>
                    <Typography>{fb.customerMobile}</Typography>
                  </TableCell>

                  {/* Comment */}
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography
                      fontSize={13}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fb.comment}
                    </Typography>
                  </TableCell>

                  {/* Food Rating */}
                  <TableCell>⭐ {fb.foodRating}</TableCell>

                  {/* Service Rating */}
                  <TableCell>⭐ {fb.serviceRating}</TableCell>

                  {/* Ambience Rating */}
                  <TableCell>⭐ {fb.ambienceRating}</TableCell>

                  {/* Overall Rating */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      ⭐ {fb.overallRating}
                    </Typography>
                  </TableCell>

                  {/* Resolved Toggle */}
                  <TableCell>
                    <Switch
                      checked={fb.isResolved}
                      color="success"
                      onChange={() => handleResolveToggle(fb)}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {feedbacks?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography fontWeight={600}>
                      No feedbacks received yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FeedbackManagement;
