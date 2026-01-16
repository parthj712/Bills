"use client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }) {
  const token = cookies().get("token");
  if (!token) redirect("/login");

  return children;
}
