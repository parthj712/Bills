"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import { useRefreshData } from "@/hooks/useRefreshData";
import { getFeedbacks, updateResovleStatus } from "@/service/feedbackService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Box,
  IconButton,
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
import FeedbackCard from "./FeedbackCard";

const FeedbackManagement = () => {
  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { showSnackbar } = useAppSnackbar();
  const [feedbacks, setFeedbacks] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const { refresh } = useRefreshData(showSnackbar);
  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];
  const fetchSubscriptionExpiry = async () => {
    try {
      const res = await getSubscriptionExpiry();
      setSubscription(res.data);
    } catch (error) {
      console.log(error?.message || error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await getFeedbacks();

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

  const handleRefresh = () => {
    refresh([fetchFeedbacks, fetchSubscriptionExpiry], "Feedbacks refreshed");
  };
  return (
    <Box className="flex flex-col gap-6 p-2">
      <Box className="flex justify-between items-center">
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#000C5A]"
        >
          Customer Feedbacks
        </Typography>

        <IconButton
          onClick={handleRefresh}
          sx={{
            backgroundColor: "#ede7f6",
            color: "#5e35b1",
            "&:hover": { backgroundColor: "#d1c4e9" },
          }}
        >
          <RefreshIcon />
        </IconButton>
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


      {/* MOBILE + TABLET CARDS */}
      {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {feedbacks?.data?.map((fb) => (
            <FeedbackCard
              key={fb._id}
              feedback={fb}
              onToggle={handleResolveToggle}
            />
          ))}

          {feedbacks?.data?.length === 0 && (
            <Box className="col-span-full text-center py-10">
              <Typography fontWeight={700} color="text.secondary">
                No feedbacks found
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FeedbackManagement;
