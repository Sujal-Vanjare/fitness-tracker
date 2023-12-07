"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import Image from "next/image";
import { fetcher } from "@/utils/api";
import { setToken, unsetToken } from "@/utils/auth";
import { useFetchUser } from "@/utils/authContext";
import { API_URL } from "@/utils/urls";

export default function Page() {
  const [data, setData] = useState({
    identifier: "",
    password: "",
  });

  const { user, loading } = useFetchUser();
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false); // for login loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true); // Set loading to true when login starts

    try {
      const responseData = await fetcher(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      });

      if (responseData.error) {
        setErrorMsg(
          "Invalid identifier or password. Please choose the correct one."
        );
      } else {
        // Login successful
        setToken(responseData);
      }
    } catch (error) {
      setErrorMsg("An error occurred during login. Please try again.");
    } finally {
      setLoadingLogin(false); // Set loading to false after login completes (whether successful or not)
    }
  };

  const logout = () => {
    unsetToken();
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  ////////
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={styles.page}>
      {!loading &&
        (user ? (
          <div className={styles.logoutContainer}>
            <h2 className={styles.head}>Welcome Back!</h2>
            <p className={styles.wlcTxt}>
              Great to see you again. Let's continue your fitness journey!
            </p>
            <h3>Go to .. </h3>
            <Link href="/" className={styles.home}>
              Home page
            </Link>
            <div className={styles.forgot}>or you can logout!</div>
            <div className={styles.logoutBtn} onClick={logout}>
              Logout
            </div>
          </div>
        ) : (
          ""
        ))}
      {!loading && !user ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.head}>Login to continue</h2>
          <p className={styles.smallText}>Email or username</p>
          <input
            type="text"
            name="identifier"
            onChange={handleChange}
            placeholder="Username"
            className={styles.username}
            required
          />
          <p className={styles.smallText}>Password</p>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className={styles.password}
              required
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
          <button
            className={styles.submit}
            type="submit"
            disabled={loadingLogin}
          >
            {loadingLogin ? "Logging in..." : "Login"}
          </button>
          <div className={styles.forgot}> Forgot Password?</div>
          <div className={styles.errorMsg}>{errorMsg}</div>
          <div className={styles.signUpContainer}>
            <span className={styles.newHere}>New here?</span>{" "}
            <Link className={styles.signUp} href="/register">
              Sign Up now
            </Link>
          </div>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}
