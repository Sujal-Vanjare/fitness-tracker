"use client";
import styles from "./page.module.css";
import { getTokenFromLocalCookie } from "@/utils/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const jwt = getTokenFromLocalCookie();
  if (!jwt) {
    redirect("/register");
  }
}
