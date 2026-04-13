"use client";

import MenuIcon from "@mui/icons-material/Menu";
import MobileSidebar from "./MobileSidebar";
import { useEffect, useState } from "react";
import { getShopInfo } from "@/service/shopService";
import { motion } from "framer-motion";

export default function MobileNav() {
    const [open, setOpen] = useState(false);

    const [shopName, setShopName] = useState("");

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await getShopInfo();
                setShopName(res.data?.data?.shopName || "");
            } catch (err) {
                console.log("Shop fetch error", err);
            }
        };

        fetchShop();
    }, []);

    return (
        <>
            <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b bg-white">

                {/* LEFT - MENU */}
                <MenuIcon
                    onClick={() => setOpen(true)}
                    className="cursor-pointer text-orange-500"
                />

                {/* CENTER - SHOP NAME */}
                <div className="flex-1 text-center px-2">
                    <motion.div className="relative inline-block overflow-hidden bg-orange-100 px-3 py-1 rounded-md border border-orange-200">

                        {/* ✨ GLASS SHIMMER EFFECT */}
                        <motion.span
                            initial={{ x: "-40%" }}
                            animate={{ x: "140%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                            }}
                            className="
                                    pointer-events-none
                                    absolute top-0 left-0
                                    h-full w-1/3
                                    bg-gradient-to-r
                                    from-transparent
                                    via-white/60
                                    to-transparent
                                    rotate-6
                                "
                        />

                        {/* TEXT */}
                        <p className="text-[15px] font-medium text-black truncate max-w-[140px]">
                            {shopName || "Loading..."}
                        </p>

                    </motion.div>
                </div>

                {/* RIGHT - LOGO */}
                <img src="/LogoIcon.png" className="h-6" />
            </div>

            <MobileSidebar open={open} onClose={() => setOpen(false)} />
        </>
    );
}
