"use client";

import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const greetings = [
  "Hello",
  "नमस्ते",
  "Bonjour",
  "Hola",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "مرحبا",
  "Guten Tag",
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user?.email?.split("@")[0] || "");
      setUserRole(user?.role || "");
    }
  }, []);

  // Rotate greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // Show logo after greetings
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Redirect based on role
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/waiter");
      }
    }, 4800);

    return () => clearTimeout(timer);
  }, [router, userRole]);

  return (
    <MotionBox
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.2 }}
      sx={{
        height: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box textAlign="center">
        {!showLogo ? (
          <>
            <AnimatePresence mode="wait">
              <MotionTypography
                key={greetings[index]}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: [1, 1.03, 1],
                }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.9 }}
                sx={{
                  fontSize: { xs: 42, md: 86 },
                  fontWeight: 500,
                  letterSpacing: "-2px",
                  color: "#000C5A",
                }}
              >
                {greetings[index]}
              </MotionTypography>
            </AnimatePresence>
          </>
        ) : (
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/LogoIcon.png"
              alt="Logo"
              width={120}
              height={120}
              priority
            />
          </MotionBox>
        )}
      </Box>

      {/* Thin Loading Line */}
      <MotionBox
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 4.5, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          background: "linear-gradient(90deg, #6366f1, #4f46e5)",
        }}
      />
    </MotionBox>
  );
}
