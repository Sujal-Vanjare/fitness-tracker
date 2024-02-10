import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.page}>
      <p className={styles.text}>
        &copy; 2024 Fitness Tracker. All rights reserved.
      </p>
      <Link
        href="https://sujalvanjareportfolio.vercel.app"
        target="_blank"
        className={styles.link}
      >
        made by Sujal
      </Link>
    </footer>
  );
}
