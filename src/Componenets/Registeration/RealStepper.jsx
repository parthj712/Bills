import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    PersonOutline,
    LockOutlined,
    StorefrontOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import React from "react";

const steps = [
    {
        label: "Basic Info",
        icon: <PersonOutline fontSize="small" />,
        hint: "Tell us about you",
    },
    {
        label: "Verify OTP",
        icon: <LockOutlined fontSize="small" />,
        hint: "Secure verification",
    },
    {
        label: "Business Setup",
        icon: <StorefrontOutlined fontSize="small" />,
        hint: "Almost there 🚀",
    },
];

const MotionBox = motion(Box);

const RealStepper = ({ step }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));


    return (
        <Box>
            <Stepper
                activeStep={step}
                alternativeLabel
                sx={{
                    mb: 1,
                    "& .MuiStepConnector-line": {
                        borderColor: "#E5E7EB",
                    },
                    "& .Mui-completed .MuiStepConnector-line": {
                        borderColor: "#16A34A",
                    },
                }}
            >
                {steps.map((item, index) => (
                    <Step key={item.label}>
                        <StepLabel
                            icon={
                                <MotionBox
                                    animate={
                                        step === index
                                            ? { scale: 1.15 }
                                            : { scale: 1 }
                                    }
                                    transition={{ duration: 0.25 }}
                                    sx={{
                                        width: isMobile ? 30 : 36,
                                        height: isMobile ? 30 : 36,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor:
                                            step > index
                                                ? "#16A34A"
                                                : step === index
                                                    ? "#2563EB"
                                                    : "#E5E7EB",
                                        color:
                                            step >= index ? "#fff" : "#6B7280",
                                        boxShadow:
                                            step === index
                                                ? "0 0 0 6px rgba(37,99,235,0.15)"
                                                : "none",
                                    }}
                                >
                                    {item.icon}
                                </MotionBox>
                            }
                        >
                            <Typography
                                fontSize={12}
                                fontWeight={step === index ? 700 : 500}
                                color={step >= index ? "black" : "gray"}
                            >
                                {item.label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* 👇 Micro-copy under stepper */}
            <Typography
                textAlign="center"
                fontSize={13}
                color="gray"
            >
                {steps[step]?.hint}
            </Typography>
        </Box>
    );
};

export default RealStepper;
