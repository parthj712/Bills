import { Card, Typography } from "@mui/material";

export const StatCard = ({ stat }) => {
    return (
        <Card 
            className={`
    p-4
    rounded-3xl
    ${stat.bg}
    shadow-none
    min-h-[120px]
    flex
    flex-col
    justify-between
  `}
        >
            {/* Icon */}
            <div className={`${stat.iconColor}`}>
                {stat.icon}
            </div>

            {/* Value */}
            <Typography fontSize={26} fontWeight={700} className="text-black">
                {stat.value}
            </Typography>

            {/* Title */}
            <Typography fontSize={18} fontWeight={500} className="text-black">
                {stat.title}
            </Typography>

            {/* Change */}
            {stat.change && (
                <Typography
                    fontSize={16}
                    fontWeight={500}
                    className={stat.changeColor}
                >
                    {stat.change}
                </Typography>
            )}
        </Card>
    );
};
