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
  const pathname = usePathname(); // For highlighting the current page Link
  const [isVisible, setIsVisible] = useState(true); // For workout list show and hide
  const [navActive, setNavActive] = useState(true); // For mobile nav active and inactive
  const [workoutList, setWorkoutList] = useState(""); // for workout list data storing
  const { user, loading } = useFetchUser(); // finding if user logged in or not

  //  toggle visibility of workout list
  const visibleButton = () => {
    setIsVisible(!isVisible);
  };

  // toggle mobile nav active class
  const mobileNavActiveClass = () => {
    setNavActive(!navActive);
  };

  // to remove mobile nav active class
  const removeMobileNavActiveClass = () => {
    setNavActive(true);
  };

  // Fetch workout list when user is authenticated
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Function to fetch workout list from API
  const fetchData = async () => {
    try {
      const data = await fetchDataFromApi("/api/workout-lists");
      setWorkoutList(data);
    } catch (error) {
      console.error("Failed to fetch workout list:", error);
    }
  };
  //

  // Function to handle user logout
  const logout = () => {
    unsetToken();
  };
  const initials = user
    ? user // If the user exist, split the user's full name into an array of words
        .split(" ")
        .map((word) => word[0]) // Map over each word in the array and extract the first letter of each word
        .join("") // Join the extracted first letters together into a single string
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
            {user ? (
              workoutList &&
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
                ))
            ) : (
              <li className={styles.listItem}>
                <p>Login First</p>
              </li>
            )}
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
            ))}
        </div>
      </nav>
    </div>
  );
}
