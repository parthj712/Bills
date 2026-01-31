"use client";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Settings() {
  const router = useRouter();


  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);


  // ❌ DO NOT TOUCH SIGN OUT LOGIC
  const handleLogout = () => {
    // if (!confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Box className="min-h-screen p-4 bg-[#f9fafb]">
      {/* PAGE TITLE */}
      <Typography
        fontSize={28}
        fontWeight={700}
        className="text-[#0b3c5d]"
        mb={3}
      >
        Settings
      </Typography>

      <Box className="flex flex-col gap-6 max-w-4xl">
        {/* BUSINESS SETTINGS */}
        <SettingsCard title="Business Information">
          <TextField label="Business Name" fullWidth />
          <TextField label="Phone Number" fullWidth />
          <TextField label="Email" fullWidth />
          <TextField label="Address" multiline rows={2} fullWidth />
          <TextField label="GST Number" fullWidth />
          <TextField label="Website (If Any)" fullWidth />

          <SaveButton />
        </SettingsCard>

        {/* BILLING SETTINGS */}
        {/* <SettingsCard title="Billing & Tax">
          <TextField label="GST Percentage" type="number" />
          <TextField label="Invoice Prefix" />

          <FormControlLabel control={<Switch />} label="Enable GST" />
          <FormControlLabel control={<Switch />} label="Round off total" />

          <SaveButton />
        </SettingsCard> */}

        {/* ORDER SETTINGS */}
        {/* <SettingsCard title="Order Settings">
          <FormControlLabel
            control={<Switch />}
            label="Allow order cancellation"
          />
          <FormControlLabel
            control={<Switch />}
            label="Auto close unpaid orders"
          />

          <SaveButton />
        </SettingsCard> */}

        {/* STAFF / SECURITY */}
        {/* <SettingsCard title="Security">
          <TextField label="Change Password" type="password" fullWidth />
          <FormControlLabel
            control={<Switch />}
            label="Auto logout after inactivity"
          />

          <SaveButton />
        </SettingsCard> */}

        {/* SIGN OUT (SEPARATE & SAFE) */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #fecaca",
            backgroundColor: "#fff5f5",
          }}
        >
          <Typography fontWeight={700} mb={1}>
            Sign Out
          </Typography>

          <Typography fontSize={14} color="text.secondary" mb={2}>
            You will be logged out from this admin panel.
          </Typography>

          {/* ❗ SAME SIGN OUT FUNCTIONALITY */}
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenLogoutDialog(true)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Sign Out
          </Button>

        </Paper>
      </Box>


      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          Confirm Sign Out
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out from the admin panel?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

/* ----------------- HELPERS ----------------- */

function SettingsCard({ title, children }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontSize={18} fontWeight={700} mb={2}>
        {title}
      </Typography>

      <Box className="flex flex-col gap-3">{children}</Box>
    </Paper>
  );
}

function SaveButton() {
  return (
    <>
      <Divider sx={{ my: 1 }} />
      <Box textAlign="right">
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "#0b3c5d",
            "&:hover": { backgroundColor: "#0a3552" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
}
