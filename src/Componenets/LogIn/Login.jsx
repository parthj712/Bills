"use client";

import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import Image from "next/image";
import AppButton from "../CommonComponents/AppButton";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/service/api";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAppSnackbar } from "../CommonComponents/SnackbarProvider/SnackbarProvider";
import {
  forgetPassword,
  resetPassword,
  verifyForgotOtp,
} from "@/service/authService";

const MotionDiv = motion.div;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [step, setStep] = useState("email"); // email | otp | reset
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { showSnackbar } = useAppSnackbar();

  const validate = () => {
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit number";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLogin = async () => {
    if (!validate()) {
      showSnackbar("Please fix the highlighted errors", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: formData.email,
        phone: formData.phone, // ✅ Now sending phone also
        password: formData.password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSnackbar("Login Successful 🎉", "success");

      if (user.role === "ADMIN") {
        router.push("/welcome");
      } else {
        router.push("/welcome");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";

      if (message === "Invalid credentials") {
        showSnackbar("Invalid Email, Phone or Password", "error");
      } else {
        showSnackbar("Server Error. Try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  //send otp
  const handleSendOtp = async () => {
    if (!forgotEmail) {
      showSnackbar("Enter your email", "warning");
      return;
    }

    try {
      setLoading(true);
      await forgetPassword({ email: forgotEmail });
      showSnackbar("OTP sent successfully 📩", "success");
      setStep("otp");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.message || "Failed to send OTP",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async () => {
    if (!otp) {
      showSnackbar("Enter OTP", "warning");
      return;
    }

    try {
      setLoading(true);
      await verifyForgotOtp(forgotEmail, otp);
      showSnackbar("OTP Verified ✅", "success");
      setStep("reset");
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      showSnackbar("Minimum 6 characters required", "warning");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(forgotEmail, newPassword);

      showSnackbar("Password reset successful 🎉", "success");

      setOpenForgot(false);
      setStep("email");
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "Reset failed", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc", // ✅ Requested background
          px: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 5,
            borderRadius: 4,
            background: "white",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Title */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h5" fontWeight={600} sx={{ color: "#0f172a" }}>
              Welcome Back
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
              Sign in to manage your business
            </Typography>
          </Box>

          {/* Email */}
          <TextField
            fullWidth
            placeholder="Email"
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              textTransform : "lowercase",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
              },
            }}
          />

          {/* Phone */}
          <TextField
            fullWidth
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
              },
            }}
          />

          {/* Password */}
          <TextField
            type="password"
            fullWidth
            placeholder="Password"
            value={formData.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
              },
            }}
          />

          <Typography
            sx={{
              textAlign: "right",
              fontSize: 14,
              cursor: "pointer",
              color: "#4f46e5",
              fontWeight: 500,
            }}
            onClick={() => setOpenForgot(true)}
          >
            Forgot Password?
          </Typography>

          {/* Login Button */}
          <AppButton
            type="submit"
            label={loading ? "Signing In..." : "Log In"}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #4338ca)",
              },
            }}
          />

          {/* Back Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push("/")}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
              color: "#64748b",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#f1f5f9",
                color: "#4f46e5",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>

      <Dialog
        open={openForgot}
        onClose={() => {
          setOpenForgot(false);
          setStep("email");
          setForgotEmail("");
          setOtp("");
          setNewPassword("");
        }}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Close Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            size="small"
            onClick={() => setOpenForgot(false)}
            sx={{ color: "#64748b" }}
          >
            ✕
          </IconButton>
        </Box>

        {/* Title Section */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Reset Your Password
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
            {step === "email" && "Enter your registered email"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "reset" && "Create a new secure password"}
          </Typography>
        </Box>

        {/* Step Indicator */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          {["email", "otp", "reset"].map((s, index) => (
            <Box
              key={s}
              sx={{
                width: 30,
                height: 6,
                borderRadius: 5,
                background:
                  step === s
                    ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                    : "#e2e8f0",
                transition: "0.3s",
              }}
            />
          ))}
        </Box>

        {/* Step Content */}
        {step === "email" && (
          <>
            <TextField
              fullWidth
              label="Registered Email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            <AppButton
              label={loading ? "Sending..." : "Send OTP"}
              onClick={handleSendOtp}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              }}
            />
          </>
        )}

        {step === "otp" && (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            <AppButton
              label={loading ? "Verifying..." : "Verify OTP"}
              onClick={handleVerifyOtp}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              }}
            />
          </>
        )}

        {step === "reset" && (
          <>
            <TextField
              type="password"
              fullWidth
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            <AppButton
              label={loading ? "Updating..." : "Reset Password"}
              onClick={handleResetPassword}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              }}
            />
          </>
        )}
      </Dialog>
    </>
  );
}
