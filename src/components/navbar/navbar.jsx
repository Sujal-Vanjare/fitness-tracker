"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { fetchDataFromApi } from "@/utils/api";
import { useFetchUser } from "@/utils/authContext";
import { unsetToken } from "@/utils/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);

  const visibleButton = () => {
    setIsVisible(!isVisible);
  };

  const [navActive, setNavActive] = useState(true);

  const mobileNavActiveClass = () => {
    setNavActive(!navActive);
  };
  const removeMobileNavActiveClass = () => {
    setNavActive(true);
  };

  const [workoutList, setWorkoutList] = useState("");

  // fetching Workout List
  useEffect(() => {
    fetchDataFromApi("/api/workouts")
      .then((data) => {
        setWorkoutList(data);
      })
      .catch((error) => {
        console.error("Failed to fetch weight history:", error);
      });
  }, []);
  // ////

  const { user, loading } = useFetchUser();

  const logout = () => {
    unsetToken();
  };
  const initials = user
    ? user
        .split(" ")
        .map((word) => word[0])
        .join("")
    : "";

  return (
    <div>
      <div className={styles.mobileNav}>
        <Link
          href={"/"}
          className={styles.mobileNavHead}
          onClick={removeMobileNavActiveClass}
        >
          <h4>Workout Tracker</h4>
        </Link>
        <div
          className={styles.menuIconContainer}
          onClick={mobileNavActiveClass}
        >
          <div
            className={`${styles.menuIcon}  ${
              navActive ? "" : styles.menuActive
            } `}
          >
            <span className={styles.line_1}></span>
            <span className={styles.line_2}></span>
          </div>
        </div>
      </div>

      <nav className={`${styles.navbar}  ${navActive ? "" : styles.active} `}>
        <div className={styles.horizontalNav}>
          <Link href={"/"} className={styles.top}>
            <h1 className={styles.head}> Workout Tracker</h1>
          </Link>
          <Link
            href={"/goal"}
            className={`${styles.goal} ${
              pathname === "/goal" ? styles.pageActive : ""
            }`}
            onClick={removeMobileNavActiveClass}
          >
            <Image
              width={100}
              height={100}
              src="/goal.png"
              className={styles.icon}
              alt="goal icon"
            />
            <span>Goal</span>
          </Link>
          <Link
            href={"/weight"}
            className={`${styles.goal} ${
              pathname === "/weight" ? styles.pageActive : ""
            }`}
            onClick={removeMobileNavActiveClass}
          >
            <Image
              width={100}
              height={100}
              src="/weight.png"
              className={styles.icon}
              alt="weight icon"
            />
            <span>Weight</span>
          </Link>
          <div className={styles.workout} onClick={visibleButton}>
            <div className={styles.workoutText}>
              <Image
                width={100}
                height={100}
                src="/workoutlist.png"
                className={styles.icon}
                alt="workout icon"
              />
              <span>Workout List</span>
            </div>

            <Image
              width={100}
              height={100}
              src="/down.png"
              className={`${styles.downIcon} ${
                isVisible ? "" : styles["inverted-down-icon"]
              }`}
              alt="down arrow"
            />
          </div>

          <ul
            className={`${styles.workoutList} ${isVisible ? "" : styles.hide}`}
          >
            {workoutList &&
              workoutList.data &&
              workoutList.data.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.attributes.slug}`}
                  className={`${styles.listItem} ${
                    pathname === `/workout/${workout.attributes.slug}`
                      ? styles.pageActive
                      : ""
                  }`}
                  onClick={removeMobileNavActiveClass}
                >
                  <Image
                    width={100}
                    height={100}
                    src="/dumbbell.png"
                    className={styles.listIcon}
                    alt="workout icon"
                  />
                  <span>{workout.attributes.workoutName}</span>
                </Link>
              ))}
          </ul>

          <div className={styles.darkModeButton}>
            <DarkModeToggle />
          </div>
        </div>
        <div className={styles.loginContainer}>
          {!loading &&
            (user ? (
              <>
                <div className={styles.profileImage}>{initials}</div>

                <div className={styles.username}>{user}</div>

                <div className={styles.logoutBtn} onClick={logout}>
                  Logout
                </div>
              </>
            ) : (
              ""
            ))}
          {!loading && !user ? (
            <>
              <Link href="/login" className={styles.signIn}>
                Login
              </Link>
              <Link href="/register" className={styles.signUp}>
                Register
              </Link>
            </>
          ) : (
            ""
          )}
        </div>
      </nav>
    </div>
  );
}
