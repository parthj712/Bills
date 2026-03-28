"use client";

import { Box, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppButton from "../CommonComponents/AppButton";
import API from "@/service/api";
import { useAppSnackbar } from "../CommonComponents/SnackbarProvider/SnackbarProvider";

export default function StaffLogin() {
  const router = useRouter();
  const { showSnackbar } = useAppSnackbar();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Username required";
    }

    if (formData.password.length < 4) {
      newErrors.password = "Minimum 4 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // ✅ Staff Login API
  const handleLogin = async () => {
    if (!validate()) {
      showSnackbar("Please fix errors", "warning");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/staff/staff-login", {
        userName: formData.userName,
        password: formData.password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSnackbar("Login Successful 🎉", "success");

      // ✅ Role based redirect
      if (
        user.role === "WAITER" ||
        user.role === "CASHIER" ||
        user.role === "MANAGER"
      ) {
        router.push("/welcome");
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#0f172a" }}
          fontWeight={600}
          textAlign="center"
        >
          Staff Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={formData.userName}
          onChange={handleChange("userName")}
          error={!!errors.userName}
          helperText={errors.userName}
        />

        <TextField
          type="password"
          fullWidth
          label="Password"
          value={formData.password}
          onChange={handleChange("password")}
          error={!!errors.password}
          helperText={errors.password}
        />

        <AppButton
          label={loading ? "Signing In..." : "Login"}
          onClick={handleLogin}
          disabled={loading}
        />

        <Button
          onClick={() => router.push("/login")}
          sx={{ textTransform: "none" }}
        >
          Login as Admin
        </Button>
      </Box>
    </Box>
  );
}
