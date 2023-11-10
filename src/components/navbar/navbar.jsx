"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";

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
            <Link
              href={"/workout/push"}
              className={`${styles.listItem} ${
                pathname === "/workout/push" ? styles.pageActive : ""
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
              <span>Push</span>
            </Link>
            <Link href={"/workout/pull"} className={styles.listItem}>
              <Image
                width={100}
                height={100}
                src="/dumbbell.png"
                className={styles.listIcon}
                alt="workout icon"
              />
              <span>Pull</span>
            </Link>

            <Link href={"/workout/legs"} className={styles.listItem}>
              <Image
                width={100}
                height={100}
                src="/dumbbell.png"
                className={styles.listIcon}
                alt="workout icon"
              />
              <span>Legs</span>
            </Link>

            <Link href={"/workout/barbell"} className={styles.listItem}>
              <Image
                width={100}
                height={100}
                src="/dumbbell.png"
                className={styles.listIcon}
                alt="workout icon"
              />
              <span>Barbell</span>
            </Link>
            <Link href={"/workout/arms"} className={styles.listItem}>
              <Image
                width={100}
                height={100}
                src="/dumbbell.png"
                className={styles.listIcon}
                alt="workout icon"
              />
              <span>Arms</span>
            </Link>
          </ul>
          <div className={styles.darkModeButton}>
            <DarkModeToggle />
          </div>
        </div>

        <div className={styles.login}>
          <Image
            width={40}
            height={40}
            src="/profile.png"
            alt="profile image"
          />
          <h1 className={styles.loginText}>login</h1>
        </div>
      </nav>
    </div>
  );
}
