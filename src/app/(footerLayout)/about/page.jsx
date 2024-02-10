import Image from "next/image";
import styles from "./page.module.css";

export default async function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h1 className={styles.head}>About Fitness Tracker</h1>
        <p className={styles.subHead}>
          We are here to help you on your fitness journey by providing a
          user-friendly platform to track your body weight and workouts.
        </p>
        <h3 className={styles.howHead}>
          Our Mission: Empowering Your Fitness Goals
        </h3>
        <p className={styles.howSubHead}>
          At Fitness Tracker, we believe in making fitness accessible to
          everyone. Our platform allows you to monitor your progress, set goals,
          and achieve a healthier lifestyle.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.guideHead}>Why Choose Fitness Tracker?</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>User-Friendly:</strong>
                <p>
                  Our intuitive design makes it easy for anyone to start
                  tracking their fitness journey.
                </p>
              </li>
              <li>
                <strong>Secure and Private:</strong>
                <p>
                  Your data is important to us. We ensure a secure and private
                  environment for your fitness information.
                </p>
              </li>
              <li>
                <strong>Goal-Oriented:</strong>
                <p>
                  Set your fitness goals, track your progress, and celebrate
                  your achievements along the way.
                </p>
              </li>
              <li>
                <strong>Visualize Your Success:</strong>
                <p>
                  Our dynamic graphs and charts allow you to see your fitness
                  journey at a glance.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
