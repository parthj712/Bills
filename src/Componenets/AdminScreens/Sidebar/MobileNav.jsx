"use client";

import MenuIcon from "@mui/icons-material/Menu";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";


export default function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="lg:hidden flex justify-between items-center px-4 py-6 border-b bg-white">
                <MenuIcon
                    onClick={() => setOpen(true)}
                    className="cursor-pointer text-orange-500"
                />
                <img src="/LogoIcon.png" className="h-8 ml-3" />
            </div>

            <MobileSidebar open={open} onClose={() => setOpen(false)} />
        </>
    );
}
