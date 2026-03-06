"use client";

import React, { useEffect, useState } from "react";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import {
  createNewTable,
  createSection,
  getTableSection,
} from "@/service/tableService";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { Box } from "@mui/system";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { motion, AnimatePresence } from "framer-motion";

const AddTable = ({ open, onClose, onSuccess }) => {
  const [tableNo, setTableNo] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState("");

  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const [loading, setLoading] = useState(false);

  // fetch sections
  const fetchSections = async () => {
    try {
      const res = await getTableSection();
      setSections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchSections();
  }, [open]);

  // create section
  const handleCreateSection = async () => {
    if (!newSectionName) return;

    try {
      const res = await createSection({ name: newSectionName });

      const newSection = res.data;

      setSections((prev) => [...prev, newSection]);

      setSectionId(newSection._id);

      setNewSectionName("");
      setShowAddSection(false);
    } catch (err) {
      console.error(err);
    }
  };

  // create table
  const handleAddTable = async () => {
    try {
      setLoading(true);

      const newTable = await createNewTable({
        tableNo: Number(tableNo),
        sectionId,
      });

      onSuccess(newTable);

      setTableNo("");
      setSectionId("");

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <TableRestaurantIcon />
              <Typography fontWeight={700}>Add Table</Typography>
            </Box>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ mt: 2 }}>
            {/* SECTION DROPDOWN */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Section</InputLabel>

              <Select
                value={sectionId}
                label="Section"
                onChange={(e) => {
                  if (e.target.value === "ADD_NEW") {
                    setShowAddSection(true);
                  } else {
                    setSectionId(e.target.value);
                  }
                }}
              >
                {sections.map((section) => (
                  <MenuItem key={section._id} value={section._id}>
                    {section.name}
                  </MenuItem>
                ))}

                <Divider />

                <MenuItem value="ADD_NEW">
                  <Box display="flex" alignItems="center" gap={1}>
                    <AddIcon fontSize="small" />
                    Add New Section
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* ADD SECTION INLINE */}
            {showAddSection && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    label="New Section"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <AppButton
                    label="Add"
                    onClick={handleCreateSection}
                    className="!bg-blue-500 !text-white"
                  />
                </Box>
              </motion.div>
            )}

            {/* TABLE NUMBER */}
            <TextField
              label="Table Number"
              type="number"
              fullWidth
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TableRestaurantIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <AppButton label="Cancel" variant="outlined" onClick={onClose} />

            <AppButton
              label="Add Table"
              loading={loading}
              disabled={!tableNo || !sectionId}
              onClick={handleAddTable}
              className="!bg-green-500 !text-white"
            />
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AddTable;
