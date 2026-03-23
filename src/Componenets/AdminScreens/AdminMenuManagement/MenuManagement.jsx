"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";

import { Edit, Delete, Add, Search, Close } from "@mui/icons-material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useMemo, useState } from "react";
import AddMenuItems from "./AddMenuItems";
import {
  addMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuAvailability,
  updateMenuItem,
  uploadExcelFile,
} from "@/service/menuService";
import UpdateMenuItem from "./UpdateMenu";
import KpiPill from "./KpiPill/KpiPill";
import { motion } from "framer-motion";
import MenuItemCard from "./MenuItemCard";
import { Download, UploadFile, Description } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchMenuItems } from "@/redux/slices/menuSlice";
import AppPagination from "@/Componenets/CommonComponents/PaginationControl";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

export default function MenuManagement() {
  const { showSnackbar } = useAppSnackbar();

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

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

  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [openAdd, setOpenAdd] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFetchMenu = async () => {
    try {
      setLoading(true);
      const res = await getMenuItems();

      setMenuItems(res.data?.menu || []);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchMenu();
    fetchSubscriptionExpiry();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    await deleteMenuItem(id);
    handleFetchMenu();
  };

  const handleUpdate = async (id, data) => {
    await updateMenuItem(id, data);
    handleFetchMenu();
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuAvailability(item._id, {
        isAvailable: !item.isAvailable,
      });
      setMenuItems((prev) =>
        prev.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m,
        ),
      );
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message || error);
    }
  };

  // ---------- premium: filter + stats ----------
  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return menuItems;

    return menuItems.filter((m) => {
      const blob =
        `${m.itemCode || ""} ${m.name || ""} ${m.description || ""} ${m.categoryName || ""} ${m.price?.half || ""} ${m.price?.full || ""} 
${m.variants?.map((v) => v.name + v.price).join(" ") || ""}`
          .toLowerCase()
          .trim();
      return blob.includes(q);
    });
  }, [menuItems, search]);

  const stats = useMemo(() => {
    const total = menuItems.length;
    const available = menuItems.filter((m) => m.isAvailable).length;
    const unavailable = total - available;
    return { total, available, unavailable };
  }, [menuItems]);

  //download excel sheet filed from tabble
  const handleDownloadExcel = () => {
    if (!filteredMenu.length) return;

    // 1️⃣ Define headers exactly like table
    const headers = [
      "Item Code",
      "Item Name",
      "Description",
      "Category",
      "Variant",
      "Price",

      "Half Price",
      "Full Price",
      "Availability",
    ];

    // 2️⃣ Map table data
    const data = [];

    filteredMenu.forEach((item) => {
      if (item.priceType === "VARIANT" && item.variants?.length) {
        item.variants.forEach((v) => {
          data.push({
            "Item Code": item.itemCode || "",
            "Item Name": item.name || "",
            Description: item.description || "",
            Category: item.categoryName || "",
            Variant: v.name,
            Price: v.price,
            Availability: item.isAvailable ? "Available" : "Unavailable",
          });
        });
      } else {
        data.push({
          "Item Code": item.itemCode || "",
          "Item Name": item.name || "",
          Description: item.description || "",
          Category: item.categoryName || "",
          "Half Price": item.price?.half ?? 0,
          "Full Price": item.price?.full ?? 0,
          Availability: item.isAvailable ? "Available" : "Unavailable",
        });
      }
    });

    // 3️⃣ Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
    });

    // 4️⃣ Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Menu");

    // 5️⃣ Export file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `menu-items-${Date.now()}.xlsx`);
  };

  //download empty excel sheet to fill it
  const handleDownloadEmptyTemplate = () => {
    const headers = [
      "name",
      "categoryName",
      "subCategory",
      "foodType",
      "itemCode",
      "priceType",
      "priceHalf",
      "priceFull",
      "variantName",
      "variantPrice",
      "portionML",
      "description",
    ];

    const worksheet = XLSX.utils.json_to_sheet([], { header: headers });

    // Menu sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Template");

    // Notes sheet
    const notesData = [
      { Notes: "Important Instructions:" },
      { Notes: "1. categoryName example: Liquor for alcohol, Food, Beverage" },
      { Notes: "2. foodType example: Drink ,Veg ,Non-Veg" },
      {
        Notes:
          "3. priceType: VARIANT if using variants like( 30ml,60ml,500g,1kg,2kg) ,HALF_FULL for hotel menus Like(paneer chill etc),SINGLE like(items that dose not have half version)",
      },
      { Notes: "4. variantName example: 30ml, 60ml, 90ml ,500g, 1kg,2,kg" },
      { Notes: "5. portionML should contain numeric value like 30, 60, 90" },
      {
        Notes:
          "6. priceHalf and priceFull are used only for simple pricing in HALF_FULL",
      },
      { Notes: "7. itemCode should be unique for each item" },
    ];

    const notesSheet = XLSX.utils.json_to_sheet(notesData);
    XLSX.utils.book_append_sheet(workbook, notesSheet, "Instructions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "menu-upload-template.xlsx");
  };

  // Handle file select (Excel only)
  const handleExcelSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      showSnackbar("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setExcelFile(file);
  };

  const handleUploadExcel = async () => {
    if (!excelFile) return;

    try {
      const res = await uploadExcelFile(excelFile);

      showSnackbar(`Uploaded Successfully: ${res.data.inserted} items added`);

      setOpenUpload(false);
      setExcelFile(null);
      handleFetchMenu();
    } catch (error) {
      console.error(error);
      showSnackbar("Upload Failed");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedMenu = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredMenu.slice(start, end);
  }, [filteredMenu, page, rowsPerPage]);

  return (
    <Box className="flex flex-col gap-6 p-2">
      {/* Premium Header */}
      <Box className="flex flex-row gap-2">
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#000C5A]"
        >
          Menu Management
        </Typography>

        <Box className="md:ml-auto">
          {!isMobile && (
            <AppButton
              label="Add Menu"
              startIcon={<Add />}
              onClick={() => {
                if (!hasAccess) {
                  showSnackbar(
                    "Upgrade to Premium to add more tables 🚀",
                    "warning",
                  );
                  return;
                }

                setOpenAdd(true);
              }}
              // onClick={() => setOpenAdd(true)}
              sx={{
                backgroundColor: "#0b3c5d",
                color: "#fff",
                px: 2,
                minWidth: 140,
                height: 40,
                borderRadius: 2,
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Search + KPI Cards */}
      <Box className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, name, description, category..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#0b3c5d" }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ color: "gray.500" }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 1.5,
            height: 44,
            "& .MuiInputBase-root": {
              height: 44,
            },
            "& input": {
              fontSize: 14,
              padding: "8px 0",
            },
            "& fieldset": { border: "none" },
            // boxShadow: "0 6px 10px rgba(0,0,0,0.06)",
            border: "2px solid",
            borderColor: "gray.200",
            bgcolor: "white",
          }}
        />

        <KpiPill label="Total" value={stats.total} color="primary" />
        <KpiPill label="Available" value={stats.available} color="success" />
        <KpiPill label="Unavailable" value={stats.unavailable} color="error" />
      </Box>

      {/* Actions: Download / Upload / File */}
      <Box className="flex justify-end gap-3">
        <Tooltip title="Download Menu">
          <IconButton
            onClick={handleDownloadExcel}
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#0b3c5d",
              "&:hover": { backgroundColor: "#bbdefb" },
              // boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>

        <Tooltip title="Upload Menu">
          <IconButton
            onClick={() => setOpenUpload(true)}
            sx={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              "&:hover": { backgroundColor: "#c8e6c9" },
              // boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <UploadFile />
          </IconButton>
        </Tooltip>

        <Tooltip title="View File Template">
          <IconButton
            onClick={handleDownloadEmptyTemplate}
            sx={{
              backgroundColor: "#fff3e0",
              color: "#ef6c00",
              "&:hover": { backgroundColor: "#ffe0b2" },

              // boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Description />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Premium Table */}
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
                  "Item Code",
                  "Item",
                  "Category",
                  "Variant",
                  "Price",
                  "Status",
                  "Actions",
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
              {loading &&
                Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                paginatedMenu.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                      "& td": {
                        py: 2,
                      },
                      "&:hover": { backgroundColor: "#eef6ff" },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 300, color: "#0b3c5d" }}>
                      {item.itemCode}
                    </TableCell>

                    <TableCell>
                      <Box className="flex flex-col">
                        <Typography fontWeight={300} className="text-black">
                          {item.name}
                        </Typography>
                        <Typography
                          fontSize={13}
                          className="text-gray-500 line-clamp-1"
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.categoryName || "—"}
                        sx={{
                          fontWeight: 300,
                          borderRadius: 2,
                          backgroundColor: "#e3f2fd",
                          color: "#0b3c5d",
                          border: "1px solid",
                          borderColor: "#90caf9",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {item.priceType === "VARIANT" ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.7 }}
                        >
                          {item.variants?.map((v, i) => (
                            <Chip
                              key={i}
                              size="small"
                              label={v.name}
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {item.priceType === "VARIANT" ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 0.6,
                          }}
                        >
                          {item.variants?.map((v, i) => (
                            <Chip
                              key={i}
                              size="small"
                              label={`₹${v.price}`}
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                              }}
                            />
                          ))}
                        </Box>
                      ) : item.priceType === "HALF_FULL" ? (
                        <Typography>
                          ₹ {item?.price?.half ?? 0} / {item?.price?.full ?? 0}
                        </Typography>
                      ) : (
                        <Typography>₹ {item?.price?.full ?? 0}</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Switch
                          checked={!!item.isAvailable}
                          color="success"
                          onChange={() => handleToggleAvailability(item)}
                        />
                        <Chip
                          size="small"
                          label={item.isAvailable ? "Available" : "Unavailable"}
                          sx={{
                            fontWeight: 300,
                            borderRadius: 2,
                            backgroundColor: item.isAvailable
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: item.isAvailable ? "#2e7d32" : "#d32f2f",
                            border: "1px solid",
                            borderColor: item.isAvailable
                              ? "#81c784"
                              : "#ef9a9a",
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Tooltip title="Edit Menu" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMenu(item);
                              setOpenEdit(true);
                            }}
                            sx={{
                              backgroundColor: "#fff3e0",
                              "&:hover": { backgroundColor: "#ffe0b2" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Menu" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item._id)}
                            sx={{
                              backgroundColor: "#ffebee",
                              color: "#d32f2f",
                              "&:hover": { backgroundColor: "#ffcdd2" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredMenu.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                    <Typography color="text.secondary" fontWeight={700}>
                      No menu items found.
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Try searching by code, name, category or description.
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
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={160} />
            ))}

          {!loading &&
            paginatedMenu.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onToggle={handleToggleAvailability}
                onDelete={handleDelete}
                onEdit={(menu) => {
                  setSelectedMenu(menu);
                  setOpenEdit(true);
                }}
              />
            ))}

          {!loading && filteredMenu.length === 0 && (
            <Box className="col-span-full text-center py-10">
              <Typography fontWeight={700} color="text.secondary">
                No menu items found
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Modals */}
      <AddMenuItems
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) => {}}
        onSuccess={handleFetchMenu}
      />

      <UpdateMenuItem
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        menu={selectedMenu}
        onUpdate={handleUpdate}
      />

      {isMobile && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={() => setOpenAdd(true)}
            sx={{
              height: 56,
              width: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A18, #FFB347)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(255,122,24,0.45)",
              cursor: "pointer",
              transition: "0.2s",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Add sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}
      <AppPagination
        totalItems={filteredMenu.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
      />

      <Dialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Upload Menu File To Upload
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4">
          <Typography fontSize={14} color="text.secondary">
            Upload the filled Excel template to add menu items in bulk.
          </Typography>

          <Button
            variant="outlined"
            component="label"
            sx={{
              borderStyle: "dashed",
              height: 120,
              fontWeight: 600,
            }}
          >
            {excelFile ? excelFile.name : "Click to select Excel file"}
            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelSelect}
            />
          </Button>

          <Typography fontSize={12} color="text.secondary">
            Supported formats: .xlsx, .xls
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUploadExcel}
            disabled={!excelFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
