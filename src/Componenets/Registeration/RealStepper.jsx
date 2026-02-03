import {
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import React from 'react'

const steps = ["Basic Info", "OTP Verification", "Business Setup"];

const RealStepper = ({ step }) => {
    return (
        <div>
            <Stepper
                activeStep={step}
                alternativeLabel
                sx={{
                    mb: 4,
                    "& .MuiStepIcon-root": {
                        color: "#E5E7EB", // gray-300
                    },
                    "& .Mui-active .MuiStepIcon-root": {
                        color: "#2563EB", // blue-600
                    },
                    "& .Mui-completed .MuiStepIcon-root": {
                        color: "#16A34A", // green-600
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    )
}

export default RealStepper