"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getBills } from "@/service/billsService";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  Button,
  Divider,
  TablePagination,
  Fab, // add this
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PictureAsPdf } from "@mui/icons-material";
const DiscountReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBills = async () => {
    try {
      const res = await getBills();

      const billData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setBills(billData);
    } catch (error) {
      console.log("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Filter discounted bills only
  const discountBills = useMemo(() => {
    return bills.filter((bill) => Number(bill.discountAmount || 0) > 0);
  }, [bills]);

  // Summary calculations
  const totalDiscount = useMemo(() => {
    return discountBills.reduce(
      (sum, bill) => sum + Number(bill.discountAmount || 0),
      0,
    );
  }, [discountBills]);

  const totalDiscountBills = discountBills.length;

  const avgDiscount =
    totalDiscountBills > 0 ? totalDiscount / totalDiscountBills : 0;

  // Staff summary
  const staffSummary = useMemo(() => {
    return discountBills.reduce((acc, bill) => {
      const staffName = bill.staffId?.name || "Unknown Staff";

      if (!acc[staffName]) {
        acc[staffName] = {
          count: 0,
          totalDiscount: 0,
        };
      }

      acc[staffName].count += 1;
      acc[staffName].totalDiscount += Number(bill.discountAmount || 0);

      return acc;
    }, {});
  }, [discountBills]);

  // Paginated bills
  const paginatedBills = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    return discountBills.slice(start, end);
  }, [discountBills, page, rowsPerPage]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();

    // =========================
    // HEADER
    // =========================
    doc.setFillColor(11, 60, 93); // dark blue
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("DISCOUNT REPORT", 14, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
      pageWidth - 65,
      18,
    );

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // =========================
    // SUMMARY SECTION
    // =========================
    let startY = 45;

    const summaryCards = [
      {
        title: "Total Discount",
        value: `Rs ${totalDiscount.toFixed(2)}`,
        color: [239, 68, 68],
      },
      {
        title: "Discount Bills",
        value: `${totalDiscountBills}`,
        color: [37, 99, 235],
      },
      {
        title: "Avg Discount",
        value: `Rs ${avgDiscount.toFixed(2)}`,
        color: [5, 150, 105],
      },
    ];

    let x = 14;

    summaryCards.forEach((card) => {
      doc.setFillColor(...card.color);
      doc.roundedRect(x, startY, 55, 25, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(card.title, x + 5, startY + 9);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(card.value, x + 5, startY + 18);

      x += 60;
    });

    // =========================
    // TABLE TITLE
    // =========================
    startY += 40;

    doc.setTextColor(11, 60, 93);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Discount Transactions", 14, startY);

    // =========================
    // TABLE
    // =========================
    autoTable(doc, {
      startY: startY + 8,

      head: [
        [
          "Bill No",
          "Date",
          "Staff",
          "Discount %",
          "Discount Amount",
          "Grand Total",
        ],
      ],

      body: discountBills.map((bill) => [
        bill.billNo,
        new Date(bill.createdAt).toLocaleDateString("en-IN"),
        bill.staffId?.name || "N/A",
        `${bill.discountPercent}%`,
        `Rs ${bill.discountAmount}`,
        `Rs ${bill.grandTotal}`,
      ]),

      headStyles: {
        fillColor: [11, 60, 93],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },

      bodyStyles: {
        fontSize: 10,
        textColor: [50, 50, 50],
      },

      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },

      styles: {
        cellPadding: 4,
        overflow: "linebreak",
      },

      columnStyles: {
        3: { halign: "center" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });

    // =========================
    // FOOTER
    // =========================
    const finalY = doc.lastAutoTable.finalY + 20;

    doc.setDrawColor(220, 220, 220);
    doc.line(14, finalY, pageWidth - 14, finalY);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);

    doc.text("Generated by BillFlow POS Analytics", 14, finalY + 10);

    doc.text(
      `Total Records: ${discountBills.length}`,
      pageWidth - 60,
      finalY + 10,
    );

    // Save
    doc.save(`Discount_Report_${new Date().toLocaleDateString("en-IN")}.pdf`);
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 4}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="#0b3c5d"
        >
          Discount Report
        </Typography>

        {/* Desktop Export Button */}
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportPDF}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
              boxShadow: "0px 8px 20px rgba(25,118,210,0.3)",
            }}
          >
            Export PDF
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : "repeat(3,1fr)"}
        gap={2}
        mb={4}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
          }}
        >
          <Typography fontSize={14}>Total Discount Given</Typography>
          <Typography fontSize={24} fontWeight={700}>
            ₹ {totalDiscount.toFixed(2)}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
          }}
        >
          <Typography fontSize={14}>Discount Bills</Typography>
          <Typography fontSize={24} fontWeight={700}>
            {totalDiscountBills}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#059669,#047857)",
            color: "#fff",
          }}
        >
          <Typography fontSize={14}>Average Discount</Typography>
          <Typography fontSize={24} fontWeight={700}>
            ₹ {avgDiscount.toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {/* Empty state */}
      {discountBills.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">
            No discounted bills found
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Desktop Table */}
          {!isMobile ? (
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "Bill No",
                      "Date",
                      "Staff",
                      "Discount %",
                      "Discount Amount",
                      "Grand Total",
                    ].map((head) => (
                      <TableCell
                        key={head}
                        sx={{
                          backgroundColor: "#0b3c5d",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedBills.map((bill) => (
                    <TableRow key={bill._id} hover>
                      <TableCell>{bill.billNo}</TableCell>

                      <TableCell>
                        {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>

                      <TableCell>{bill.staffId?.name || "N/A"}</TableCell>

                      <TableCell>
                        <Chip
                          label={`${bill.discountPercent}%`}
                          color="warning"
                          size="small"
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        ₹ {bill.discountAmount}
                      </TableCell>

                      <TableCell>₹ {bill.grandTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            /* Mobile Cards */
            <Box display="grid" gap={2} mb={2}>
              {paginatedBills.map((bill) => (
                <Card
                  key={bill._id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <Typography fontWeight={700}>{bill.billNo}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography>Staff: {bill.staffId?.name || "N/A"}</Typography>

                  <Typography>
                    Discount:{" "}
                    <span
                      style={{
                        color: "red",
                        fontWeight: 600,
                      }}
                    >
                      ₹ {bill.discountAmount}
                    </span>
                  </Typography>

                  <Typography>Discount %: {bill.discountPercent}%</Typography>

                  <Typography fontWeight={700}>
                    Total: ₹ {bill.grandTotal}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              mb: 4,
            }}
          >
            <TablePagination
              component="div"
              count={discountBills.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>

          {/* Staff Summary */}
          <Typography variant="h6" fontWeight={700} mb={2} color="#0b3c5d">
            Staff Discount Summary
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={
              isMobile ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))"
            }
            gap={2}
          >
            {Object.entries(staffSummary).map(([staff, data]) => (
              <Card
                key={staff}
                sx={{
                  p: 3,
                  borderRadius: 3,
                }}
              >
                <Typography fontWeight={700}>{staff}</Typography>

                <Typography mt={1}>Bills Discounted: {data.count}</Typography>

                <Typography color="red" fontWeight={600}>
                  Total Discount: ₹ {data.totalDiscount.toFixed(2)}
                </Typography>
              </Card>
            ))}
          </Box>
        </>
      )}
      {/* Mobile Floating Export Button */}
      {isMobile && discountBills.length > 0 && (
        <Fab
          color="primary"
          onClick={exportPDF}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            color: "#fff",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.25)",
            "&:hover": {
              background: "linear-gradient(135deg,#082b44,#1565c0)",
            },
          }}
        >
          <PictureAsPdf />
        </Fab>
      )}
    </Box>
  );
};

export default DiscountReport;
