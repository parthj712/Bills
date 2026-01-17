"use client";

import {
    Dashboard,
    TableBar,
    RestaurantMenu,
    Receipt,
    BarChart,
    People,
    Settings,
    MenuBook
} from "@mui/icons-material";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";


const mainItems = [
    { label: "Dashboard", href: "/admin", icon: <Dashboard fontSize="small" /> },
    { label: "Table Management", href: "/admin/tables", icon: <TableBar fontSize="small" /> },
    { label: "Menu Management", href: "/admin/menu", icon: <RestaurantMenu fontSize="small" /> },
    { label: "Order Management", href: "/admin/orders", icon: <MenuBook fontSize="small" /> },
    { label: "Billing & Payments", href: "/admin/bills", icon: <Receipt fontSize="small" /> },
    { label: "Analytics & Graphs", href: "/admin/analytics", icon: <BarChart fontSize="small" /> },
    { label: "Staff Management", href: "/admin/staff", icon: <People fontSize="small" /> },
];

const settingsItem = {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings fontSize="small" />,
};


export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-64 bg-white border-r px-4 py-6 hidden md:flex flex-col"
        >
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
                <img src="/Logo.png" className="h-8" alt="Logo" />
            </div>

            {/* MAIN NAV */}
            <nav className="space-y-4">
                {mainItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.label} href={item.href}>
                            <motion.div
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg
              text-[17px] cursor-pointer
              ${isActive ? "font-semibold text-orange-600" : "text-black"}
            `}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="active-indicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-orange-500"
                                    />
                                )}

                                <motion.span whileHover={{ scale: 1.15 }}>
                                    {item.icon}
                                </motion.span>

                                <span>{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* SETTINGS AT BOTTOM */}
            <div className="mt-auto pt-6 border-t">
                <Link href={settingsItem.href}>
                    <motion.div
                        whileHover={{ x: 6 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg
          text-[17px] cursor-pointer
          ${pathname === settingsItem.href
                                ? "font-semibold text-orange-600"
                                : "text-black"}
        `}
                    >
                        {settingsItem.icon}
                        {settingsItem.label}
                    </motion.div>
                </Link>
            </div>
        </motion.aside>

    );
}
