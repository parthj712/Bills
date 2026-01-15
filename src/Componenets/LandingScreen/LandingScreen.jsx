"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import AppButton from "../CommonComponents/AppButton";
import Image from "next/image";
import { useRouter } from "next/navigation";


const MotionBox = motion(Box);

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.96,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function LandingScreen() {

    const router = useRouter();


      const theme = useTheme();
    
      // BREAKPOINTS
      const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
      const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
      const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


    return (
        <Box
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: "url('/LandingPage/Landing.avif')",
            }}
        >

            {/* <motion.div
  layoutId="hero-image"
  className="absolute inset-0"
>
  <Image
    src="/LandingPage/Landing.avif"
    alt="Hero"
    fill
    className="object-cover"
    priority
  />
</motion.div> */}


            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Animated Glass Card */}
            <MotionBox
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="
          relative
          w-[90%] max-w-2xl
          rounded-2xl
          bg-black/50
          backdrop-blur-xl
          p-8
          text-center
          shadow-2xl
          flex
          flex-col
          gap-7
        "
            >
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <Image
                        src="/LogoDark.png"
                        alt="WebReady Logo"
                        width={200}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Description */}
                <Typography
                    sx={{ fontSize: isMobile ? 16 : 20, fontWeight: 500 }}
                    className="text-gray-200 leading-relaxed"
                >
                    Manage your entire business effortlessly with WebReady POS, a
                    powerful, easy-to-use system designed specifically for cafes,
                    hotels, and resorts.
                </Typography>

                <AppButton
                    label="Register"
                    variant="contained"
                    onClick={() => router.push("/register")}
                    className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                />

                <AppButton
                    label="Login"
                    variant="outlined"
                    onClick={() => router.push("/login")}
                    className="!border-white !text-white hover:!bg-white hover:!text-black"
                />
            </MotionBox>
        </Box>
    );
}
