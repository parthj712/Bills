import { Card, Typography, Box } from "@mui/material";

export const StatCard = ({ stat, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: onClick ? "pointer" : "default",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                    "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                    // transform: "translateY(-4px)",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
                },
            }}
            className="group p-5 flex flex-row flex-row-reverse items-center justify-between hover:cursor-default"
        >
            {/* Top row */}
            <Box className="flex items-center justify-between">
                {/* Icon */}
                <Box
                    className="
            w-13 h-13
            flex items-center justify-center
            rounded-xl
            bg-black/5
            transition-transform
            group-hover:scale-110
          "
                >
                    <span className={`${stat.iconColor} text-lg`}>
                        {stat.icon}
                    </span>
                </Box>

                {/* Change badge */}
                {stat.change && (
                    <Typography
                        fontSize={13}
                        fontWeight={600}
                        className={`px-2 py-1 rounded-full ${stat.changeColor} bg-black/5`}
                    >
                        {stat.change}
                    </Typography>
                )}
            </Box>

            <Box>
                {/* Value */}
                <Typography
                    fontSize={28}
                    fontWeight={700}
                    letterSpacing="-0.5px"
                    className="text-[#000C5A]"
                >
                    {stat.value}
                </Typography>

                {/* Title */}
                <Typography
                    fontSize={18}
                    fontWeight={500}
                    className="text-[#000C5A]"
                >
                    {stat.title}
                </Typography>
            </Box>
        </Card>
    );
};
