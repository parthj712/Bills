"use client";

import {
  Box,
  Button,
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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useAppSnackbar } from "../CommonComponents/SnackbarProvider/SnackbarProvider";

const MotionDiv = motion.div;

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
        router.push("/admin");
      } else {
        router.push("/waiter");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong";

      if (message === "Invalid credentials") {
        showSnackbar("Invalid Email, Phone or Password", "error");
      } else {
        showSnackbar("Server Error. Try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ color: "#0f172a" }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#64748b", mt: 1 }}
          >
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
            background:
              "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow:
              "0 8px 20px rgba(99,102,241,0.25)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #4f46e5, #4338ca)",
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
            fontSize: 14,
            fontWeight: 500,
            color: "#64748b",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#f1f5f9",
              color: "#0f172a",
            },
          }}
        >
          Back to Home
        </Button>

      </Box>
    </Box>
  );


}
