"use client";

import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import AppButton from "../CommonComponents/AppButton";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "@/service/api";

const MotionDiv = motion.div;

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Form Fields
  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    password: "",
  });

  // ✅ OTP States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ✅ UI States
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------------------
  // ✅ Input Handler
  // -------------------------------
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // -------------------------------
  // ✅ Validation
  // -------------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.ownerName.trim()) newErrors.ownerName = "Full name required";
    if (!form.shopName.trim()) newErrors.shopName = "Business name required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter valid email";
    if (form.password.length < 6)
      newErrors.password = "Min 6 characters required";
    if (!form.gstNumber.trim()) newErrors.gstNumber = "GST Number required";
    if (!form.address.trim()) newErrors.address = "Address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // ✅ Send OTP
  // -------------------------------
  const sendOtp = useCallback(async () => {
    if (!form.email) return alert("Enter email first");

    setOtpLoading(true);

    try {
      await API.post("/auth/send-otp", { email: form.email });

      setOtpSent(true);
      setResendTimer(30);

      alert("OTP Sent ✅");
    } catch (err) {
      alert(err.response?.data?.message || "OTP send failed");
    } finally {
      setOtpLoading(false);
    }
  }, [form.email]);

  // -------------------------------
  // ✅ Verify OTP
  // -------------------------------
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    setOtpLoading(true);

    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp,
      });

      setOtpVerified(true);
      alert("Email Verified ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------------------
  // ✅ Register
  // -------------------------------
  const handleRegister = async () => {
    if (!validate()) return;

    if (!otpVerified) return alert("Please verify your email OTP first!");

    setLoading(true);

    try {
      await API.post("/auth/register", form);
      alert("Registration Successful ✅");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // ✅ Reset OTP if Email Changes
  // -------------------------------
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendTimer(0);
  }, [form.email]);

  // -------------------------------
  // ✅ Resend Timer Countdown
  // -------------------------------
  useEffect(() => {
    if (resendTimer === 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <Box className="min-h-screen w-full flex bg-black overflow-hidden">
      {/* LEFT IMAGE */}
      <motion.div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/LandingPage/Landing.avif"
          alt="Food"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* RIGHT FORM */}
      <MotionDiv className="w-full md:w-1/2 flex justify-center items-center bg-white">
        <Box className="w-full max-w-lg px-8 py-10 flex flex-col gap-4">
          {/* Title */}
          <Typography
            fontSize={20}
            fontWeight={700}
            textAlign="center"
            color="black"
          >
            Begin Your Smart Business Journey 🚀
          </Typography>

          {/* Full Name */}
          <TextField
            label="Full Name"
            value={form.ownerName}
            onChange={handleChange("ownerName")}
            error={!!errors.ownerName}
            helperText={errors.ownerName}
          />

          {/* Shop Name */}
          <TextField
            label="Business Name"
            value={form.shopName}
            onChange={handleChange("shopName")}
            error={!!errors.shopName}
            helperText={errors.shopName}
          />

          {/* Email */}
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            disabled={otpVerified}
          />

          {/* OTP Buttons */}
          {!otpSent ? (
            <AppButton
              label={otpLoading ? "Sending..." : "Send OTP"}
              onClick={sendOtp}
              disabled={otpLoading}
              className="!bg-blue-500"
            />
          ) : !otpVerified ? (
            <>
              <TextField
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <AppButton
                label={otpLoading ? "Verifying..." : "Verify OTP"}
                onClick={verifyOtp}
                className="!bg-green-500"
              />

              {resendTimer > 0 ? (
                <Typography align="center" color="gray">
                  Resend OTP in {resendTimer}s
                </Typography>
              ) : (
                <AppButton
                  label="Resend OTP"
                  variant="text"
                  onClick={sendOtp}
                  className="!text-blue-600"
                />
              )}
            </>
          ) : (
            <Typography color="green" fontWeight={600}>
              Email Verified ✅
            </Typography>
          )}

          {/* Phone */}
          <TextField
            label="Phone Number"
            value={form.phone}
            onChange={handleChange("phone")}
            disabled={!otpVerified}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          {/* GST Number */}
          <TextField
            label="GST Number"
            value={form.gstNumber}
            onChange={handleChange("gstNumber")}
            error={!!errors.gstNumber}
            helperText={errors.gstNumber}
          />

          {/* Address */}
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
            multiline
            rows={2}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Register */}
          <AppButton
            label={loading ? "Registering..." : "Register"}
            onClick={handleRegister}
            disabled={loading}
            className="!bg-orange-500"
          />
        </Box>
      </MotionDiv>
    </Box>
  );
}
