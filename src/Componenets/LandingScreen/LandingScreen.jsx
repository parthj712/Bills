"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AppButton from "../CommonComponents/AppButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MotionBox = motion(Box);

const businessTypes = [
    "Restaurants",
    "Cafes",
    "Ice Cream Parlours",
    "Retail Stores",
    "Kirana Shops",
];

export default function LandingScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [index, setIndex] = useState(0);

    // Auto rotate every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % businessTypes.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            sx={{
                background:
                    "#f8fafc",
            }}
        >
            <Box className="relative z-10 w-[90%] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">

                {/* LEFT SIDE */}
                <MotionBox
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center md:text-left"
                >
                    <Typography
                        sx={{
                            fontSize: isMobile ? 36 : 56,
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                        className="text-[#0f172a]"
                    >
                        Powering{" "}
                        <br />
                        <span className="text-indigo-500 inline-block min-w-[280px]">

                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={businessTypes[index]}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="inline-block"
                                >
                                    {businessTypes[index]}
                                </motion.span>
                            </AnimatePresence>

                        </span>

                        <br />
                        With One Smart
                        
                        POS
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 400,
                            marginTop: 3,
                            maxWidth: 550,
                        }}
                        className="text-gray-400"
                    >
                        Billing, table management, staff control, and powerful analytics
                        all in one modern cloud-based POS system built for modern businesses.
                    </Typography>

                    <Box className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
                        <AppButton
                            label="Register"
                            variant="contained"
                            onClick={() => router.push("/register")}
                            className="!bg-[#0f172a] hover:!bg-[#122759] !text-white !px-8 !py-3 !rounded-lg"
                        />

                        <AppButton
                            label="Login"
                            variant="outlined"
                            onClick={() => router.push("/login")}
                            className="!border-[#0f172a] !text-[#122759] hover:!bg-[#0f172a] hover:!text-white !px-8 !py-3 !rounded-lg"
                        />
                    </Box>
                </MotionBox>

                {/* RIGHT SIDE */}
                <MotionBox
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative"
                >
                    <Box
                        className="
              rounded-2xl
              border border-white/10
              bg-white/5
              backdrop-blur-xl
              shadow-[0_10px_60px_rgba(0,0,0,0.6)]
              overflow-hidden
            "
                    >
                        <Image
                            src="/dashboard-preview.png"
                            alt="POS Dashboard Preview"
                            width={600}
                            height={400}
                            className="object-cover"
                        />
                    </Box>
                </MotionBox>
            </Box>
        </Box>
    );
}
