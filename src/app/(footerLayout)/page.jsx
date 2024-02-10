import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1 className={styles.head}>Welcome to Fitness Tracker</h1>
        <p className={styles.subHead}>
          Start your fitness journey by tracking your body weight, workouts, and
          achieving your fitness goals with us.
        </p>
        <h3 className={styles.howHead}>
          Get Started with the Fitness Tracker: Create Your Account
        </h3>
        <p className={styles.howSubHead}>
          Follow these simple steps to create an account. Your account ensures
          that your body weight and workout data are securely stored for your
          personal use.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.guideHead}>Registering a new account</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/register.png"
              alt="register form"
              width={400}
              height={560}
              className={styles.registerImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Step 1: Create an Account</strong>
                <p>
                  If you are new, initiate the registration process to set up
                  your account.
                </p>
              </li>
              <li>
                <strong>Step 2: Navigate to the Registration Page</strong>
                <p>
                  Access the{" "}
                  <Link href="/register" className={styles.link}>
                    registration
                  </Link>{" "}
                  page where you will encounter a form similar to the one shown
                  in the image.
                </p>
              </li>
              <li>
                <strong>Step 3: Unique Username</strong>
                <p>
                  Enter a unique username. It must be distinct, as duplicate
                  usernames are not permitted for registration.
                </p>
              </li>
              <li>
                <strong>Step 4: Valid Email</strong>
                <p>
                  Provide a valid email address. This email is crucial, as it
                  will be used for password recovery in case you forget your
                  login credentials.
                </p>
              </li>
              <li>
                <strong>Step 5: Register</strong>
                <p>
                  Click or press enter on the registration button to complete
                  the process. Once done, you are ready to proceed.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.guideHead}>Login existing account</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/login.png"
              alt="login form"
              width={400}
              height={480}
              className={styles.loginImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Step 1: Log In to Your Account</strong>
                <p>If you've already registered, log in to your account.</p>
              </li>
              <li>
                <strong>Step 2: Go to the Login Page</strong>
                <p>
                  Visit the{" "}
                  <Link href="/login" className={styles.link}>
                    login
                  </Link>{" "}
                  page where you'll find a form similar to the one shown in the
                  image.
                </p>
              </li>
              <li>
                <strong>Step 3: Enter Your Username or Email</strong>
                <p>
                  Provide the username or email associated with your registered
                  account.
                </p>
              </li>
              <li>
                <strong>Step 4: Enter Your Password</strong>
                <p>Enter your account password correctly.</p>
              </li>
              <li>
                <strong>Step 5: Log In</strong>
                <p>
                  Click or Press Enter the login button to access your account.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.guideHead}>How to add Goal Weight of any</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/add-goal-weight.png"
              alt="goal weight tile "
              width={400}
              height={480}
              className={styles.goalWeightImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Step 1: Access the Goal Weight Tile</strong>
                <p>
                  On the body weight or workout page, locate the "Goal Weight"
                  tile, similar to the one shown in the image.
                </p>
              </li>
              <li>
                <strong>Step 2: Edit the Goal Weight</strong>
                <p>
                  Click on the edit icon within the goal weight tile. This
                  action will reveal the option to edit the desired weight in
                  kilograms.
                </p>
              </li>
              <li>
                <strong>Step 3: Set Your Desired Weight</strong>
                <p>
                  Enter your desired weight in kilograms in the provided input
                  field.
                </p>
              </li>
              <li>
                <strong>Step 4: Save Changes</strong>
                <p>
                  Click on the post icon to save the updated goal weight. If you
                  decide to cancel, you can click on the cross icon.
                </p>
              </li>
              <li>You can change the Goal weight multiple times</li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.guideHead}>How to Add Weight Entry of any</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/add-weight.png"
              alt="add weight form"
              width={400}
              height={274}
              className={styles.weightImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Step 1: Access the Weight Section</strong>
                <p>
                  Navigate to the "Body Weight" or "Workout" page where you'll
                  find the "Add Weight" section.
                </p>
              </li>
              <li>
                <strong>Step 2: Input Weight Details</strong>
                <p>
                  In the weight section, you'll see a form resembling the image
                  provided. For the "Body Weight" page, enter the weight in
                  kilograms (e.g., 00.00) and the corresponding date. Similar in
                  "Workout" page, just specify the number of repetitions in the
                  reps input field.
                </p>
              </li>
              <li>
                <strong>Step 3: Click "Add"</strong>
                <p>
                  After entering the required details, click the "Add" button to
                  submit the information. This action will successfully add the
                  new weight entry.
                </p>
              </li>
              <li>
                <strong>Step 4: View Updated History</strong>
                <p>
                  Upon successful submission, the weight history will be
                  automatically updated and loaded for your reference.
                </p>
              </li>
              <li>
                <strong>Note:</strong>
                <p>
                  Ensure that all input fields are filled; otherwise, the
                  submission may not work as expected.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.guideHead}>How to Delete Weight Entry of any</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/delete-weight.png"
              alt="delete form"
              width={400}
              height={161}
              className={styles.deleteImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Step 1: Navigate to Weight History</strong>
                <p>
                  Go to the "Weight History" section where you'll find a tile as
                  shown in the image.
                </p>
              </li>
              <li>
                <strong>Step 2: Click the Cross Icon</strong>
                <p>
                  Find the weight entry you wish to delete and click on the
                  cross icon associated with that entry.
                </p>
              </li>
              <li>
                <strong>Step 3: View Updated History</strong>
                <p>
                  Once deleted, the weight history will be automatically
                  updated, and the entry will no longer be visible.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.guideHead}>Features</h3>
        <div className={styles.boxContainer}>
          <div className={styles.box1}>
            <Image
              src="/features.png"
              alt="features image"
              width={400}
              height={582}
              className={styles.featureImg}
            />
          </div>
          <div className={styles.box2}>
            <ul>
              <li>
                <strong>Visualize Your Progress:</strong> Add multiple weight
                entries and see a dynamic line graph.
              </li>
              <li>
                <strong>Track Trends:</strong> Easily observe ups and downs in
                weight over different dates.
              </li>
              <li>
                <strong>Instant Weight Status:</strong> Check your current
                weight and understand if it has increased, decreased, or stayed
                the same.
              </li>
              <li>
                <strong>Quick Insights:</strong> Identify weight changes
                effortlessly, just like the example shown in the image.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
