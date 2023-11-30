"use client";
import styles from "./page.module.css";
import { useFetchUser } from "@/utils/authContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, loading } = useFetchUser();

  if (!loading && !user) {
    // Redirect to login page if the user is not logged in
    redirect("/login");
    return null; // Add this line to prevent further execution of the component
  }

  // Return the welcome home page
  return (
    <div className={styles.home}>
      <h1>Welcome Home!</h1>
      {/* Add your home page content here */}
    </div>
  );
}
