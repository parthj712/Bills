"use client";

import {
  addWebsite,
  getShofInfo,
  removeShopLogo,
  removeShopQR,
  uploadShopLogo,
  uploadShopQR,
} from "@/service/shopService";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfoRow from "./InfoCard";

export default function Settings() {
  const router = useRouter();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [editWebsite, setEditWebsite] = useState(false);

  const [logoPreview, setLogoPreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");

  const [logoLoading, setLogoLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  // ✅ Store admin + shop info
  const [shopData, setShopData] = useState(null);

  // ✅ Fetch Admin Info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getShofInfo();

        console.log("res", res.data?.data);

        setShopData(res.data?.data);

        setLoading(false);
      } catch (err) {
        console.log("Failed to fetch admin info", err);
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);
  useEffect(() => {
    if (!shopData) return;

    if (shopData.logo?.url) {
      setLogoPreview(shopData.logo.url);
    }

    if (shopData.upiQr?.url) {
      setQrPreview(shopData.upiQr.url);
    }
  }, [shopData]);

  // ✅ Website Edit Change
  const handleWebsiteChange = (e) => {
    setShopData({ ...shopData, website: e.target.value });
  };

  // ✅ Save Website Update
  const handleSaveWebsite = async () => {
    try {
      await addWebsite({
        website: shopData.website,
      });

      alert("Website Updated Successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to update website ❌");
    }
  };
  console.log("shopdata", shopData);

  // ❌ DO NOT TOUCH SIGN OUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoLoading(true);

    try {
      // instant preview
      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);

      // upload to cloudinary
      const res = await uploadShopLogo(file);

      // save real cloudinary url
      setLogoPreview(res.data.logo);
    } catch (err) {
      alert("Logo upload failed");
      console.log(err);
    } finally {
      setLogoLoading(false);
    }
  };

  const handleQrChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setQrLoading(true);

    try {
      const previewURL = URL.createObjectURL(file);
      setQrPreview(previewURL);

      const res = await uploadShopQR(file);

      setQrPreview(res.data.qr);
    } catch (err) {
      alert("QR upload failed");
      console.log(err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await removeShopLogo();

      setLogoPreview("");

      setShopData((prev) => ({
        ...prev,
        logo: { url: "", public_id: "" },
      }));
    } catch (err) {
      alert("Failed to remove logo");
    }
  };

  const handleRemoveQr = async () => {
    try {
      await removeShopQR();

      setQrPreview("");

      setShopData((prev) => ({
        ...prev,
        upiQr: { url: "", public_id: "" },
      }));
    } catch (err) {
      alert("Failed to remove QR");
    }
  };

  return (
    <Box className="min-h-screen p-4 bg-[#f9fafb]">
      {/* PAGE TITLE */}
      <Typography fontSize={28} fontWeight={700} mb={3} color="black">
        Settings
      </Typography>

      <Box className="flex flex-col gap-6 max-w-4xl">
        {/* BUSINESS SETTINGS */}
        <SettingsCard title="Business Information">
          {/* BUSINESS NAME */}
          <InfoRow label="Business Name" value={shopData.shopName} />

          {/* PHONE */}
          <InfoRow label="Phone Number" value={shopData.phone} />

          {/* EMAIL */}
          <InfoRow label="Email" value={shopData.email} />

          {/* ADDRESS */}
          <InfoRow label="Address" value={shopData.address} multiline />

          {/* GST */}
          <InfoRow label="GST Number" value={shopData.gstNumber} />
        </SettingsCard>

        {/* WEBSITE & BRANDING SECTION */}
        <SettingsCard title="Website & Branding">
          {/* WEBSITE */}
          {/* WEBSITE */}
          <Box>
            <Typography fontWeight={600} fontSize={14} mb={0.5}>
              Website Link
            </Typography>

            {/* If no website → show input directly */}
            {!shopData.website ? (
              <TextField
                value={shopData.website}
                onChange={handleWebsiteChange}
                fullWidth
                size="small"
                placeholder="Enter website link"
              />
            ) : (
              <>
                {/* Website exists */}
                {!editWebsite ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    {/* Clickable Website */}
                    <Typography
                      component="a"
                      href={
                        shopData.website.startsWith("http")
                          ? shopData.website
                          : `https://${shopData.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#0b3c5d",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {shopData.website}
                    </Typography>

                    {/* Edit Icon */}
                    <Button
                      size="small"
                      onClick={() => setEditWebsite(true)}
                      sx={{
                        minWidth: "auto",
                        padding: "4px",
                        borderRadius: "50%",
                      }}
                    >
                      ✏️
                    </Button>
                  </Box>
                ) : (
                  <>
                    {/* Edit Mode Input */}
                    <TextField
                      value={shopData.website}
                      onChange={handleWebsiteChange}
                      fullWidth
                      size="small"
                      autoFocus
                      placeholder="Enter website link"
                      sx={{ mt: 1 }}
                    />

                    {/* Action Buttons */}
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                      mt={1}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditWebsite(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          handleSaveWebsite();
                          setEditWebsite(false);
                        }}
                        sx={{
                          backgroundColor: "#0b3c5d",
                          textTransform: "none",
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          {/* COMPANY LOGO */}
          <Box mt={3}>
            <Typography fontWeight={600} fontSize={14} mb={1}>
              Company Logo
            </Typography>

            {logoLoading ? (
              <CircularProgress size={30} />
            ) : logoPreview ? (
              <Box position="relative" display="inline-block">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    height: 80,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />

                {/* Remove Button */}
                <Button
                  size="small"
                  onClick={handleRemoveLogo}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    minWidth: 0,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    fontSize: 12,
                    "&:hover": { backgroundColor: "#b91c1c" },
                  }}
                >
                  ✕
                </Button>
              </Box>
            ) : null}

            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none", m: qrPreview ? 1 : 2 }}
            >
              Upload Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoChange}
              />
            </Button>
          </Box>

          {/* QR UPI IMAGE */}
          <Box mt={3}>
            <Typography fontWeight={600} fontSize={14} mb={1}>
              UPI QR Code
            </Typography>

            {qrLoading ? (
              <CircularProgress size={30} />
            ) : qrPreview ? (
              <Box position="relative" display="inline-block">
                <img
                  src={qrPreview}
                  alt="QR Preview"
                  style={{
                    height: 120,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />

                {/* Remove Button */}
                <Button
                  size="small"
                  onClick={handleRemoveQr}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    minWidth: 0,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    fontSize: 12,
                    "&:hover": { backgroundColor: "#b91c1c" },
                  }}
                >
                  ✕
                </Button>
              </Box>
            ) : null}

            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none", m: qrPreview ? 1 : 2 }}
            >
              Upload QR Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleQrChange}
              />
            </Button>
          </Box>

          {/* SAVE BUTTON */}
          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              onClick={handleSaveWebsite}
              sx={{
                backgroundColor: "#0b3c5d",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </SettingsCard>

        {/* SIGN OUT */}
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

      {/* LOGOUT DIALOG */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Confirm Sign Out</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>

          <Button variant="contained" color="error" onClick={handleLogout}>
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

function SettingsSkeleton() {
  return (
    <Box className="min-h-screen p-4 bg-[#f9fafb]">
      {/* PAGE TITLE */}
      <Skeleton variant="text" width={160} height={40} sx={{ mb: 3 }} />

      <Box className="flex flex-col gap-6 max-w-4xl">
        {/* BUSINESS INFORMATION CARD */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          {/* Card title */}
          <Skeleton variant="text" width={220} height={28} sx={{ mb: 3 }} />

          <Box className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Box key={item}>
                <Skeleton variant="text" width={120} height={18} />
                <Skeleton variant="rectangular" height={32} sx={{ mt: 0.5 }} />
              </Box>
            ))}

            {/* Website Row */}
            <Box>
              <Skeleton variant="text" width={120} height={18} />
              <Skeleton variant="rectangular" height={32} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </Paper>

        {/* SIGN OUT CARD */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fff5f5",
            border: "1px solid #fecaca",
          }}
        >
          <Skeleton variant="text" width={100} height={22} />
          <Skeleton variant="text" width={260} height={18} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Paper>
      </Box>
    </Box>
  );
}
