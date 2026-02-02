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
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/service/api";

const MotionDiv = motion.div;

const slideInFromRight = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // premium easing
    },
  },
};

const slidePanel = {
  hidden: (isMobile) => ({
    opacity: 0,
    x: isMobile ? 0 : 80,
    y: isMobile ? 60 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (isMobile) => ({
    opacity: 0,
    x: isMobile ? 0 : -80,
    y: isMobile ? 60 : 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

export default function RegisterScreen() {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // ✅ Strong Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email (example@gmail.com)";
    }

    // ✅ Indian Phone Validation (10 digits only)
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    // ✅ GST Validation (15-digit official format)
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (gstNumber && !gstRegex.test(gstNumber.toUpperCase())) {
      newErrors.gstNumber =
        "Enter a valid GST number (example: 27ABCDE1234F1Z5)";
    }

    // ✅ Name Validation
    if (!ownerName.trim()) {
      newErrors.ownerName = "Full name is required";
    }

    // ✅ Business Name Validation
    if (!shopName.trim()) {
      newErrors.shopName = "Business name is required";
    }

    // ✅ Password Validation (min 6 chars)
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await API.post("/auth/register", {
        ownerName,
        shopName,
        email,
        phone,
        gstNumber,
        address,
        password,
      });

      // Axios response data
      const data = res.data;

      // ✅ Success
      router.push("/login"); // or dashboard
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen w-full flex bg-black overflow-x-hidden">
      {/* LEFT IMAGE */}
      <motion.div
        layoutId="hero-image"
        className="hidden md:block md:w-1/2 relative"
      >
        <Image
          src="/LandingPage/Landing.avif"
          alt="Food"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* RIGHT FORM */}
      <MotionDiv
        custom={isMobile}
        variants={slidePanel}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
    w-full md:w-1/2
    flex items-center justify-center
    bg-white/95
    backdrop-blur-md
    shadow-[-20px_0_40px_rgba(0,0,0,0.25)]
    relative
    z-10
  "
      >
        <Box
          className="
            w-full max-w-lg
            px-8 md:px-4 lg:px-4 py-10
            rounded-l-3xl
            flex flex-col gap-4 md:gap-5 lg:gap-6
          "
        >
          {/* Logo + Title */}
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <Image
              src="/LogoIcon.png"
              alt="WebReady Logo"
              width={40}
              height={40}
            />
            <Typography
              sx={{
                fontSize: isMobile ? 16 : 20,
                fontWeight: 600,
                color: "black",
              }}
            >
              Begin Your Smart Business Journey
            </Typography>
          </div>

          {/* Inputs */}
          <TextField
            label="Full Name"
            fullWidth
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName}
          />

          <TextField
            label="Business Name"
            fullWidth
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            error={!!errors.shopName}
            helperText={errors.shopName}
          />

          <div className="flex gap-4">
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </div>
          <TextField
            label="GST No"
            fullWidth
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            error={!!errors.gstNumber}
            helperText={errors.gstNumber}
          />

          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            {/* Back Button */}
            <AppButton
              label="← Back"
              variant="text"
              onClick={() => router.push("/")}
              className="
    !text-orange-500
    hover:!underline
    !font-medium
    !px-0
    !min-w-0
  "
            />

            {/* Register Button */}
            <AppButton
              label={loading ? "Registering..." : "Register"}
              variant="contained"
              disabled={loading}
              onClick={handleRegister}
              className="!bg-orange-500 hover:!bg-orange-600 !text-white px-10"
            />
          </div>
        </Box>
      </MotionDiv>
    </Box>
  );
}
