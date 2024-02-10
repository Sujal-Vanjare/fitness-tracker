"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import Image from "next/image";
import { setToken, unsetToken } from "@/utils/auth";
import { fetcher } from "@/utils/api";
import { API_URL } from "@/utils/urls";
import { useFetchUser } from "@/utils/authContext";
import { redirect } from "next/navigation";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  /////
  const { user, loading } = useFetchUser();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [loadingRegister, setLoadingRegister] = useState(false); // for register loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingRegister(true); // Set loading to true when registration starts

    try {
      const responseData = await fetcher(`${API_URL}/api/auth/local/register`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          username: userData.username,
        }),
        method: "POST",
      });

      if (responseData.error) {
        setErrorMsg(
          "Email or Username are already taken. Please choose a different one."
        );
      } else {
        // Registration successful
        setToken(responseData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRegister(false); // Set loading to false after registration completes (whether successful or not)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const logout = () => {
    unsetToken();
  };

  if (user) {
    redirect("/body-weight");
  }

  return (
    <div className={styles.page}>
      {!loading &&
        (user ? (
          <div className={styles.logoutContainer}>
            <h2 className={styles.head}>Registration Successful!</h2>
            <p className={styles.wlcTxt}>
              Great! You're all set. Start tracking your workouts and achieving
              your fitness goals now!
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
          <h2 className={styles.head}>Register your account</h2>
          <p className={styles.smallText}>Username</p>
          <input
            type="text"
            name="username"
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            className={styles.username}
            required
          />
          <p className={styles.smallText}>Email</p>
          <input
            type="email"
            name="email"
            onChange={(e) => handleChange(e)}
            placeholder="abcd@gmail.com"
            className={styles.username}
            required
          />
          <p className={styles.smallText}>Password</p>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => handleChange(e)}
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
            disabled={loadingRegister}
          >
            {loadingRegister ? "Registering..." : "Register"}
          </button>
          {/* <div className={styles.forgot}> Forgot Password?</div> */}
          <div className={styles.errorMsg}>{errorMsg}</div>
          <div className={styles.signUpContainer}>
            <span className={styles.newHere}>Already have account?</span>
            <Link className={styles.signUp} href="/login">
              Login now
            </Link>
          </div>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}
