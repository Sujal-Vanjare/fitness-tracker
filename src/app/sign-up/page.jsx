"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={styles.page}>
      <form
        //  onSubmit={handleSubmit}
        className={styles.form}
      >
        <h2 className={styles.head}>Sign up to continue</h2>
        <p className={styles.smallText}>Email or username</p>
        <input
          type="text"
          name="identifier"
          // onChange={handleChange}
          placeholder="Username"
          className={styles.username}
          required
        />
        <p className={styles.smallText}>Password</p>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={styles.password}
            required
            inputMode="verbatim"
          />

          <Image
            onClick={handleTogglePassword}
            src={showPassword ? "/open-eye-icon.png" : "/closed-eye-icon.png"}
            alt={showPassword ? "Open eye" : "Closed eye"}
            width={24}
            height={24}
            className={styles.eye}
          />
        </div>

        <button className={styles.submit} type="submit">
          Login
        </button>
        <div className={styles.forgot}> Forgot Password?</div>
        <div className={styles.signUpContainer}>
          <span className={styles.newHere}>Already have account?</span>{" "}
          <Link className={styles.signUp} href="/sign-in">
            Login now
          </Link>
        </div>
      </form>
    </div>
  );
}
