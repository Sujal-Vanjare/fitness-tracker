"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { fetchDataFromApi } from "@/utils/api";
import { useFetchUser } from "@/utils/authContext";
import { getTokenFromLocalCookie, unsetToken } from "@/utils/auth";

export default function Navbar() {
  const jwt = getTokenFromLocalCookie();
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
    fetchDataFromApi("/api/workout-lists", jwt)
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
          <h4>Fitness Tracker</h4>
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
            <h1 className={styles.head}>Fitness Tracker</h1>
          </Link>
          <Link
            href={"/about"}
            className={`${styles.about} ${
              pathname === "/about" ? styles.pageActive : ""
            }`}
            onClick={removeMobileNavActiveClass}
          >
            <Image
              width={100}
              height={100}
              src="/about.png"
              className={styles.icon}
              alt="about icon"
            />
            <span>About</span>
          </Link>
          <Link
            href={"/body-weight"}
            className={`${styles.about} ${
              pathname === "/body-weight" ? styles.pageActive : ""
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
            <span>Body Weight</span>
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
              workoutList.data
                .sort((a, b) => a.attributes.num - b.attributes.num)
                .map((workout) => (
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
                      src={`/workout-icons/${workout.attributes.slug}-icon.png`}
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
              <Link
                href="/login"
                className={styles.signIn}
                onClick={removeMobileNavActiveClass}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={styles.signUp}
                onClick={removeMobileNavActiveClass}
              >
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
