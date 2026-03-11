"use client";

import { getOrders } from "@/service/orderService";
import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import KpiPill from "../AdminMenuManagement/KpiPill/KpiPill";
import CrmCard from "./CrmCard";
import { getShopInfo } from "@/service/shopService";

const CrmMain = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [customerInfo, setCustomerInfo] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [shopData, setShopData] = useState(null);
  const isBakery = shopData?.businessCategory === "BAKERY";
  // ✅ Fetch Admin Info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getShopInfo();

        setShopData(res.data?.data);
      } catch (err) {
        console.log("Failed to fetch admin info", err);
      }
    };

    fetchInfo();
  }, []);
  console.log(shopData);
  // format date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // get most frequent item
  const getMostFrequent = (items) => {
    if (!items.length) return "-";

    const count = {};

    items.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
  };

  // fetch orders
  const fetchCustomerInfo = async () => {
    try {
      const res = await getOrders();

      const orders = res.data.orders || [];

      const customerMap = {};

      orders.forEach((order) => {
        const mobile = order.customer?.mobile || "unknown";

        if (!customerMap[mobile]) {
          customerMap[mobile] = {
            name: order.customer?.name || "Walk-in",
            mobile,
            birthDate: order.customer?.birthDate,
            totalOrders: 0,
            totalSpend: 0,
            lastVisit: order.createdAt,
            items: [],
          };
        }

        customerMap[mobile].totalOrders += 1;
        customerMap[mobile].totalSpend += order.subtotal || 0;

        if (
          new Date(order.createdAt) > new Date(customerMap[mobile].lastVisit)
        ) {
          customerMap[mobile].lastVisit = order.createdAt;
        }

        order.items?.forEach((item) => {
          customerMap[mobile].items.push(item.name);
        });
      });

      const formatted = Object.values(customerMap).map((c) => ({
        ...c,
        favoriteItem: getMostFrequent(c.items),
      }));

      setCustomerInfo(formatted);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  // search filter
  const filteredCustomers = customerInfo.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.toString().includes(search),
  );

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // stats
  const stats = useMemo(() => {
    const totalCustomers = customerInfo.length;

    const totalOrders = customerInfo.reduce((sum, c) => sum + c.totalOrders, 0);

    const totalRevenue = customerInfo.reduce((sum, c) => sum + c.totalSpend, 0);

    return {
      totalCustomers,
      totalOrders,
      totalRevenue,
    };
  }, [customerInfo]);

  const getUpcomingBirthdays = (customers) => {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    return customers.filter((customer) => {
      if (!customer.birthDate) return false;

      const birth = new Date(customer.birthDate);

      // set birthday for this year
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birth.getMonth(),
        birth.getDate(),
      );

      return thisYearBirthday >= today && thisYearBirthday <= next7Days;
    });
  };
  const upcomingBirthdays = useMemo(() => {
    return getUpcomingBirthdays(customerInfo);
  }, [customerInfo]);

  return (
    <Box className="p-2 lg:p-4">
      {/* Title */}
      <Typography
        fontSize={isMobile ? 24 : 30}
        fontWeight={700}
        className="text-[#000C5A]"
      >
        Customer CRM
      </Typography>

      {/* Search + KPI */}
      <Box className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-3">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          size="small"
          sx={{
            gridColumn: { lg: "span 3" },
            bgcolor: "white",
            borderRadius: 2,
          }}
        />

        <KpiPill
          label="Total Customers"
          value={stats.totalCustomers}
          color="primary"
        />

        <KpiPill
          label="Total Orders"
          value={stats.totalOrders}
          color="success"
        />

        <KpiPill
          label="Revenue"
          value={`₹ ${stats.totalRevenue}`}
          color="warning"
        />
      </Box>

      {isBakery && upcomingBirthdays.length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "#fff7ed",
            border: "1px solid #fed7aa",
          }}
        >
          <Typography fontWeight={700} fontSize={16} mb={2} color="#c2410c">
            🎂 Upcoming Birthdays (Next 7 Days)
          </Typography>

          {/* Desktop */}
          {isDesktop && (
            <Box className="flex flex-col gap-2">
              {upcomingBirthdays.map((customer, index) => (
                <Box
                  key={customer.mobile || index}
                  className="flex justify-between items-center"
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: "white",
                  }}
                >
                  <Box className="flex items-center gap-2">
                    <Avatar sx={{ width: 30, height: 30, bgcolor: "#ea580c" }}>
                      {customer.name?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography
                        fontWeight={600}
                        fontSize={14}
                        color="#c2410c"
                      >
                        {customer.name}
                      </Typography>

                      <Typography fontSize={12} color="#ea580c">
                        {customer.mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography fontWeight={600} color="#ea580c">
                    {new Date(customer.birthDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Mobile */}
          {!isDesktop && (
            <Box className="flex gap-3 overflow-x-auto pb-2">
              {upcomingBirthdays.map((customer, index) => (
                <Box
                  key={customer.mobile || index}
                  sx={{
                    minWidth: 160,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#ea580c",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    {customer.name?.charAt(0)}
                  </Avatar>

                  <Typography fontWeight={600} fontSize={13} color="#c2410c">
                    {customer.name}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary">
                    {customer.mobile}
                  </Typography>

                  <Typography
                    fontWeight={700}
                    fontSize={12}
                    color="#ea580c"
                    mt={1}
                  >
                    🎂{" "}
                    {new Date(customer.birthDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Table */}
      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            mt: 3,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#123F5A",
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: 14,
                    py: 2,
                  }}
                >
                  Customer
                </TableCell>

                {isBakery && (
                  <TableCell
                    sx={{
                      backgroundColor: "#123F5A",
                      color: "#fff",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Mobile
                  </TableCell>
                )}

                {isBakery && (
                  <TableCell
                    sx={{
                      backgroundColor: "#123F5A",
                      color: "#fff",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Birth Date
                  </TableCell>
                )}

                <TableCell
                  sx={{
                    backgroundColor: "#123F5A",
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Visits
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "#123F5A",
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Total Spend
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "#123F5A",
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Favorite Item
                </TableCell>

                <TableCell
                  sx={{
                    backgroundColor: "#123F5A",
                    color: "#fff",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Last Visit
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCustomers.map((customer, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f8fafc",
                    },
                    "&:hover": {
                      backgroundColor: "#eef6ff",
                    },
                  }}
                >
                  {/* Customer */}
                  <TableCell align="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      <Typography fontWeight={600}>{customer.name}</Typography>
                    </Box>
                  </TableCell>

                  {/* Mobile */}
                  {isBakery && (
                    <TableCell align="center">{customer.mobile}</TableCell>
                  )}

                  {isBakery && (
                    <TableCell align="center">
                      {formatDate(customer.birthDate)}
                    </TableCell>
                  )}

                  {/* Visits */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        bgcolor: "#e0f2fe",
                        color: "#0369a1",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: 13,
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {customer.totalOrders}
                    </Box>
                  </TableCell>

                  {/* Total Spend */}
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, color: "#16a34a" }}
                  >
                    ₹ {customer.totalSpend}
                  </TableCell>

                  {/* Favorite Item */}
                  <TableCell align="center">{customer.favoriteItem}</TableCell>

                  {/* Last Visit */}
                  <TableCell align="center">
                    {formatDate(customer.lastVisit)}
                  </TableCell>
                </TableRow>
              ))}

              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No customers found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      )}

      {!isDesktop && (
        <>
          <Box className="flex flex-col gap-4 py-5">
            {paginatedCustomers.map((customer, index) => (
              <CrmCard
                key={customer.mobile || index}
                customer={customer}
                isBakery={isBakery}
              />
            ))}
          </Box>

          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </>
      )}
    </Box>
  );
};

export default CrmMain;
