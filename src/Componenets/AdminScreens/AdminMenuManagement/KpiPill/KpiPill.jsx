import { Box, Typography } from "@mui/material"


const KpiPill = ({ label, value, color }) => {
    return (
        <div>
            <Box
                sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 1.5,
                    backgroundColor: `${color}.50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent : "center",
                    gap: 1.5,
                    // boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                    border: `2px solid`,
                    borderColor: `${color}.100`,
                     bgcolor: "white",
                }}
            >
                <Typography fontSize={14} color="black" fontWeight={600}>
                    {label}
                </Typography>
                <Typography fontSize={16} fontWeight={700} color={`${color}`}>
                    {value}
                </Typography>
            </Box>
        </div>
    )
}

export default KpiPill
