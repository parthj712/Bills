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
    doc.setFontSize(16);
    doc.text(shopData?.shopName || "Shop Name", 14, 15);
    doc.setFontSize(10);
    doc.text(`GSTIN: ${shopData?.gstNumber}`, 14, 22);
    doc.text(`Period: ${fromDate} to ${toDate}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

    const tableColumn = [
      "GST %",
      "Taxable",
      "CGST",
      "SGST",
      "IGST",
      "Total GST",
      "Total Sales",
    ];

    const tableRows = [];

    data.slabs.forEach((slab) => {
      tableRows.push([
        slab._id,
        slab.taxable.toFixed(2),
        slab.cgst.toFixed(2),
        slab.sgst.toFixed(2),
        slab.igst.toFixed(2),
        slab.totalGST.toFixed(2),
        slab.grandTotal.toFixed(2),
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.save(`GST_Report_${fromDate}_to_${toDate}.pdf`);
  };

  const hasGST = Boolean(shopData?.gstNumber);

  return (
    <Box className="min-h-screen p-3 md:p-5 bg-[#f5f7fb]">

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
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
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
            gap: 4,
            alignItems: "center",
          }}
        >
          <TextField
          fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            size="small"
          />

          <TextField
          fullWidth
            type="date"
            label="To Date"
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
              alignItems : "flex-end",
              backgroundColor: "#0b3c5d",
              "&:hover": { backgroundColor: "#092c45" },
              borderRadius: 2,
              px: 16,
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

          {/* SUMMARY */}
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 3,
              background: "linear-gradient(135deg,#eef3ff,#f7f9ff)",
            }}
          >
            <Typography
              fontSize={20}
              fontWeight={700}
              mb={2}
              color="#0b3c5d"
            >
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

                  <Typography
                    fontSize={18}
                    fontWeight={700}
                    color="#0b3c5d"
                  >
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
