"use client";

import {
  Box,
  IconButton,
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
import { useRef } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import { useAppSnackbar } from "@/app/SnackbarProvider";


//toast notification
import { useAppSnackbar } from "../CommonComponents/SnackbarProvider/SnackbarProvider";
// import { NOTIFICATIONS } from "../ToastConstant/notifications";

const MotionDiv = motion.div;

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

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { showSnackbar } = useAppSnackbar();


  const validate = () => {
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      showSnackbar("Please fix the highlighted errors", "warning");

      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ SAVE TOKEN
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSnackbar("Login Successful", "success");

      // ✅ REDIRECT BY ROLE
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "CASHIER") {
        router.push("/waiter");
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";
      setErrors(message);

      if (message === "Invalid credentials") {

        showSnackbar("Invalid Email or Password", "error");
      } else {

        showSnackbar("Something Went Wrong", "error");
      }
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
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="
            w-full max-w-lg
            px-8 py-10
            rounded-l-3xl
            flex flex-col gap-6
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
              Welcome Back to Smart Business
            </Typography>
          </div>

          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Phone */}
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          {/* Actions */}
          <div className="flex items-center gap-6  mt-4">
            <IconButton
              onClick={() => router.push("/")}
              sx={{
                // position: "absolute",
                // top: 24,
                // left: 24,
                color: "#111827",
                background: "#F3F4F6",
                "&:hover": { background: "#E5E7EB" },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <AppButton
              type="submit"
              label={loading ? "Logging in..." : "Log In"}
              variant="contained"
              disabled={loading}
              className="!bg-orange-500 hover:!bg-orange-600 !text-white px-10"
            />
          </div>
        </Box>
      </MotionDiv>
    </Box>
  );
}
