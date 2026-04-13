"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Alert,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { gstSummary } from "@/service/reportService";
import { getShopInfo } from "@/service/shopService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AssessmentIcon from "@mui/icons-material/Assessment";

const GstReport = () => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [shopData, setShopData] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const fetchShopInfo = async () => {
    try {
      const res = await getShopInfo();
      setShopData(res.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchReport = async () => {
    if (!shopData?.gstNumber) {
      alert("Gst Number not found. Please update shop profile");
      return;
    }
    if (!fromDate || !toDate) {
      alert("please select date range first");
      return;
    }
    try {
      const res = await gstSummary(fromDate, toDate);
      setData(res.data);
    } catch (error) {
      console.log(error.message);
      alert("Failed to fetch gst report");
    }
  };
  useEffect(() => {
    fetchShopInfo();
  }, []);

  //Excel download

  const downloadExcel = () => {
    if (!data) return;

    const worksheetData = data.slabs.map((slab) => ({
      "GST%": slab._id,
      Taxable: slab.taxable,
      CGST: slab.cgst,
      SGST: slab.sgst,
      IGST: slab.igst,
      "Total GST": slab.totalGST,
      "Totat Sales": slab.grandTotal,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
    XLSX.writeFile(workbook, `GST_REPORT_${fromDate}_to_${toDate}.xlsx`);
  };

  const downloadPdf = () => {
    if (!data) return;

    const doc = new jsPDF();

    // 🎨 Colors
    const primary = [30, 41, 59];
    const gray = [100, 116, 139];

    // 💰 Format currency (Indian)
    const format = (val) =>
      Number(val).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // 🏷️ HEADER (Centered)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...primary);
    doc.text(shopData?.shopName || "Shop Name", 105, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);

    doc.text(`GSTIN: ${shopData?.gstNumber || "-"}`, 14, 25);
    doc.text(`Period: ${fromDate} to ${toDate}`, 14, 31);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 37);

    // 📊 TABLE HEADERS (clean)
    const tableColumn = [
      "GST%",
      "Taxable",
      "CGST",
      "SGST",
      "IGST",
      "GST",
      "Total ",
    ];

    const tableRows = [];

    let totalTaxable = 0;
    let totalGST = 0;
    let totalSales = 0;

    data.slabs.forEach((slab) => {
      totalTaxable += slab.taxable;
      totalGST += slab.totalGST;
      totalSales += slab.grandTotal;

      tableRows.push([
        slab._id + "%",
        format(slab.taxable),
        format(slab.cgst),
        format(slab.sgst),
        format(slab.igst),
        format(slab.totalGST),
        format(slab.grandTotal),
      ]);
    });

    // ➕ TOTAL ROW
    tableRows.push([
      "TOTAL",
      format(totalTaxable),
      "",
      "",
      "",
      format(totalGST),
      format(totalSales),
    ]);

    // 🧾 TABLE
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,

      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
      },

      headStyles: {
        fillColor: primary,
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },

      columnStyles: {
        0: { halign: "center", cellWidth: 18 },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      didParseCell: function (data) {
        // 🎯 Highlight TOTAL row
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [226, 232, 240];
        }
      },

      margin: { left: 10, right: 10 },
    });

    // 📌 FOOTER
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("This is a system generated GST report", 105, pageHeight - 10, {
      align: "center",
    });

    // 💾 SAVE
    doc.save(`GST_Report_${fromDate}_to_${toDate}.pdf`);
  };

  const hasGST = Boolean(shopData?.gstNumber);

  return (
    <Box className="min-h-screen p-2 md:p-5 bg-[#f5f7fb]">
      {/* PAGE HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <AssessmentIcon sx={{ color: "#0b3c5d" }} />
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          color="#0b3c5d"
        >
          GST Summary Report
        </Typography>
      </Box>

      {/* SHOP INFO CARD */}
      {shopData && (
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              justifyContent="space-between"
              gap={isMobile ? 0.5 : 0}
            >
              <Typography fontSize={18} fontWeight={700}>
                {shopData.shopName}
              </Typography>

              <Typography fontSize={14} fontWeight={600}>
                GSTIN: {shopData.gstNumber || "Not Available"}
              </Typography>
            </Box>

            <Typography fontSize={14} color="text.secondary">
              Address: {shopData.address}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!hasGST && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          GST Number is not added in shop profile. Please add GSTIN to generate
          GST report.
        </Alert>
      )}

      {/* DATE FILTER CARD */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            // flexWrap: "wrap",
            gap: isMobile ? 2 : 4,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <TextField
            type="date"
            label="From Date"
            fullWidth={isMobile}
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            size="small"
          />

          <TextField
            type="date"
            label="To Date"
            fullWidth={isMobile}
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            size="small"
          />

          <Button
            variant="contained"
            onClick={fetchReport}
            disabled={!hasGST}
            sx={{
              alignItems: "flex-end",
              backgroundColor: "#0b3c5d",
              "&:hover": { backgroundColor: "#092c45" },
              borderRadius: 2,
              px: isMobile ? 2 : 16,
              fontSize: 14,
            }}
          >
            Generate
          </Button>

          {data && hasGST && (
            <>
              <Button
                variant="contained"
                startIcon={<TableViewIcon />}
                onClick={downloadExcel}
                sx={{
                  backgroundColor: "#1D6F42",
                  "&:hover": { backgroundColor: "#155a34" },
                  borderRadius: 2,
                }}
              >
                Excel
              </Button>

              <Button
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={downloadPdf}
                sx={{
                  backgroundColor: "#B00020",
                  "&:hover": { backgroundColor: "#8e0019" },
                  borderRadius: 2,
                }}
              >
                PDF
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* TABLE */}
      {data && (
        <>
          {isMobile ? (
            <Box>
              {data.slabs.map((slab, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                  }}
                >
                  <CardContent>
                    <Typography fontWeight={700} color="#0b3c5d" mb={1}>
                      GST {slab._id}%
                    </Typography>

                    <Divider sx={{ mb: 1 }} />

                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">Taxable</Typography>
                      <Typography>₹{slab.taxable.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">CGST</Typography>
                      <Typography>₹{slab.cgst.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">SGST</Typography>
                      <Typography>₹{slab.sgst.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">IGST</Typography>
                      <Typography>₹{slab.igst.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">Total GST</Typography>
                      <Typography>₹{slab.totalGST.toFixed(2)}</Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={700}>Total Sales</Typography>
                      <Typography fontWeight={700} color="#0b3c5d">
                        ₹{slab.grandTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                mb: 4,
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#0b3c5d",
                      }}
                    >
                      {[
                        "GST %",
                        "Taxable",
                        "CGST",
                        "SGST",
                        "IGST",
                        "Total GST",
                        "Total Sales",
                      ].map((head) => (
                        <TableCell
                          key={head}
                          sx={{
                            color: "#fff",
                            fontWeight: 700,
                            textAlign: "center",
                            fontSize: 14,
                          }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data.slabs.map((slab, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#f9fafb" : "#ffffff",
                          "&:hover": {
                            backgroundColor: "#eef5ff",
                          },
                        }}
                      >
                        <TableCell align="center">{slab._id}%</TableCell>

                        <TableCell align="center">
                          ₹{slab.taxable.toFixed(2)}
                        </TableCell>

                        <TableCell align="center">
                          ₹{slab.cgst.toFixed(2)}
                        </TableCell>

                        <TableCell align="center">
                          ₹{slab.sgst.toFixed(2)}
                        </TableCell>

                        <TableCell align="center">
                          ₹{slab.igst.toFixed(2)}
                        </TableCell>

                        <TableCell align="center">
                          ₹{slab.totalGST.toFixed(2)}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 700,
                            color: "#0b3c5d",
                          }}
                        >
                          ₹{slab.grandTotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          )}

          {/* SUMMARY */}
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 3,
              background: "linear-gradient(135deg,#eef3ff,#f7f9ff)",
            }}
          >
            <Typography fontSize={20} fontWeight={700} mb={2} color="#0b3c5d">
              Overall Summary
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns={
                isMobile ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))"
              }
              gap={2}
            >
              {[
                { label: "Taxable", value: data.overall.taxable },
                { label: "CGST", value: data.overall.cgst },
                { label: "SGST", value: data.overall.sgst },
                { label: "IGST", value: data.overall.igst },
                { label: "Total Sales", value: data.overall.grandTotal },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    backgroundColor: "#fff",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    {item.label}
                  </Typography>

                  <Typography fontSize={18} fontWeight={700} color="#0b3c5d">
                    ₹{item.value.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </>
      )}
    </Box>
  );
};

export default GstReport;
