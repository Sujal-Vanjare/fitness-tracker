"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import styles from "./page.module.css";
import Image from "next/image";
import {
  deleteDataFromApi,
  fetchDataFromApi,
  postDataToApi,
  putDataToApi,
} from "@/utils/api";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/auth";
import { redirect } from "next/navigation";

// Registering ChartJS components for use in creating charts
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

// Function to aggregate weight data by month
function aggregateWeightByMonth(bodyWeights) {
  const aggregatedData = {}; // Initialize an object to store aggregated weight data

  // Iterate over each entry in the bodyWeights array
  bodyWeights.forEach((bodyWeightsEntry) => {
    const date = new Date(bodyWeightsEntry.date); // Extract year, month, and day from the date of each entry
    const year = date.getFullYear(); // Get the year from the date
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name, e.g., "Jan"
    const day = date.getDate(); // Get the day from the date

    // Construct a key for the aggregatedData object using day, month, and year
    const key = `${day} ${month} ${year}`; // Adjusted key to include day, month, and year

    // If the key doesn't exist in aggregatedData, initialize it with sum and count properties
    if (!aggregatedData[key]) {
      aggregatedData[key] = { sum: 0, count: 0 };
    }

    // Accumulate weight and count for each key
    aggregatedData[key].sum += bodyWeightsEntry.weight;
    aggregatedData[key].count++;
  });

  // Initialize an array to store the final result
  const result = [];

  // Iterate over each key in the aggregatedData object
  for (const key in aggregatedData) {
    // Check if the current key belongs to the object itself (not inherited)
    if (aggregatedData.hasOwnProperty(key)) {
      // Calculate the average weight for the current month
      const avgWeight = aggregatedData[key].sum / aggregatedData[key].count;
      // Push an object representing the month and its average weight to the result array
      result.push({ month: key, weight: avgWeight });
    }
  }

  return result; // Return the final result containing aggregated weight data by month
}

export default function Page({ params }) {
  const pluralize = require("pluralize"); // Import the pluralize library

  const originalSlug = params.slug; // Assuming params.slug is "barbell_bench_press"

  // Replace hyphens with underscores
  const underscoreSlug = originalSlug.replace(/-/g, "_");

  // Pluralize the slug
  const pluralizedSlug = pluralize(originalSlug);

  //getting user id
  const id = getUserId();
  if (!id) {
    // Redirect to login page if the user is not logged in
    redirect("/login");
  }

  const [bodyWeights, setBodyWeights] = useState([]); // Initialize weights as an object with a data property that is an empty array
  const [currentWeight, setCurrentWeight] = useState("..."); // Find the most recent weight entry
  const [goalBodyWeight, setGoalBodyWeight] = useState("..."); // goal bodyWeight
  const [isEditingGoalWeight, setIsEditingGoalWeight] = useState(false); // goal weight edit tab hide and show
  const [newGoalWeight, setNewGoalWeight] = useState(""); // goal weight input field

  const [loading, setLoading] = useState(true); //loading when add new weight history

  const [date, setDate] = useState(""); // upload bodyWeight, date field
  const [reps, setReps] = useState(""); // upload bodyWeight, reps field
  const [weight, setWeight] = useState(""); // upload bodyWeight , weight field
  // format date
  function formatDate(inputDate) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString(undefined, options);
  }
  // convert slug into Heading
  function convertSlugToTitle(slug) {
    const words = slug.split("-");
    const title = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return title;
  }
  const convertedTitle = convertSlugToTitle(originalSlug);
  // fetching weight history
  useEffect(() => {
    fetchDataFromApi(`/api/users/me?populate=${underscoreSlug}`)
      .then((data) => {
        setGoalBodyWeight(data[`goal_${underscoreSlug}`] || "...");
        const sortedBodyWeights = data[underscoreSlug].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setBodyWeights(sortedBodyWeights);
        setCurrentWeight(sortedBodyWeights[0]?.weight || "...");
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Failed to fetch weight history:", error);
      });
  }, []);

  // add New weight history item
  const handleAddWeight = async () => {
    // Check if weight and date are not empty
    if (!weight || !date) {
      console.error("Weight and date fields are required.");
      return;
    }

    // Set loading to true before making the API calls
    setLoading(true);

    const data = {
      data: {
        weight: weight,
        date: date,
        reps: reps,
        user: {
          connect: [{ id }],
        },
      },
    };

    try {
      // Make the API call to add a new weight entry
      const response = await postDataToApi(`/api/${pluralizedSlug}`, data);

      // Fetch the updated weight history after adding a new entry
      const updatedData = await fetchDataFromApi(
        `/api/users/me?populate=${underscoreSlug}`
      );

      // Sort the updated data by date in descending order

      const sortedBodyWeights = updatedData[underscoreSlug].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Update the state with the sorted data
      setBodyWeights(sortedBodyWeights);
      setCurrentWeight(sortedBodyWeights[0]?.weight || "...");

      // Clear the input fields after successfully adding the weight
      setWeight("");
      setReps("");
      setDate("");
    } catch (error) {
      console.error("Error adding weight entry:", error);
    } finally {
      // Set loading to false after API call completes (whether successful or not)
      setLoading(false);
    }
  };

  // delete weight history item
  const handleDeleteWeight = async (weightId) => {
    try {
      // Set loading to true before making the API call
      setLoading(true);

      const response = await deleteDataFromApi(
        `/api/${pluralizedSlug}/${weightId}`
      );
      if (response.data) {
        console.log("Weight entry deleted successfully");

        // Fetch the updated weight history after deleting the entry
        const updatedData = await fetchDataFromApi(
          `/api/users/me?populate=${underscoreSlug}`
        );

        // Sort the updated data by date in descending order
        const sortedBodyWeights = updatedData[underscoreSlug].sort(
          (a, b) => new Date(b.date) - new Date(a.date) // latest date first, descending order based on the date
        );

        // Update the state with the sorted data
        setBodyWeights(sortedBodyWeights);
        setCurrentWeight(sortedBodyWeights[0]?.weight || "...");
      } else {
        console.error("Failed to delete weight entry");
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error);
    } finally {
      // Set loading to false after API call completes (whether successful or not)
      setLoading(false);
    }
  };

  // Update Goal Weight

  const handleAddGoalWeight = async () => {
    // Check if goal weight is not empty
    if (!newGoalWeight) {
      console.error("Goal weight field is required.");
      return;
    }

    const endpoint = `/api/users/${id}`;
    const data = {
      [`goal_${underscoreSlug}`]: parseFloat(newGoalWeight), // Convert the value to a floating-point number (00.00)
    };

    try {
      const response = await putDataToApi(endpoint, data);
      setGoalBodyWeight(response[`goal_${underscoreSlug}`]);
      setIsEditingGoalWeight(false);

      console.log("Goal  weight updated successfully:");
    } catch (error) {
      console.error("Error updating goal body weight:", error);
    }
  };

  // adding data to graph
  const chartData = aggregateWeightByMonth(bodyWeights);

  // Calculate weight difference between the current month and the previous month
  const currentMonthWeight = chartData[0]?.weight || 0;
  const previousMonthWeight = chartData[1]?.weight || 0;
  const weightDifference = currentMonthWeight - previousMonthWeight;
  const formattedWeightDifference = // Format weight difference to 1 decimal place if not a whole number, otherwise to 0 decimal places
    weightDifference % 1 !== 0
      ? weightDifference.toFixed(1)
      : weightDifference.toFixed(0);
  chartData.reverse(); // Reverse the order of chartData array to display months in chronological order

  const data = {
    labels: chartData.map((data) => data.month), // Extract month labels from chartData array
    datasets: [
      {
        label: "Weight", // Label for weight dataset
        data: chartData.map((data) => data.weight), // Extract weight data from chartData array
        borderColor: "#EAEAF2", // Border color for the line chart
        borderWidth: 3, // Border width for the line chart
        pointBorderColor: "#27262B", // Border color for data points
        pointBorderWidth: 3, // Border width for data points
        tension: 0.5, // Line tension (curvature) for smoother lines
        fill: true, // Fill the area under the line chart
        backgroundColor: (context) => {
          // Create linear gradient for the fill color
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#5063EE");
          gradient.addColorStop(1, "#E0DFE7");
          return gradient;
        },
      },
    ],
  };

  // Configuration options for ChartJS
  const options = {
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          // Callback function to format tooltip labels
          label: function (context) {
            const label = context.dataset.label || ""; // Get dataset label
            const value = context.parsed.y; // Get parsed y-value
            return `${label}: ${value} Kg`; // Return formatted label with value in kilograms
          },
        },
      },
    },
    responsive: true, // Enable responsiveness
    scales: {
      y: {
        ticks: {
          font: {
            size: 17,
            weight: "bold",
          },
          color: "white",
          callback: function (value) {
            return value + " kg"; // Return a string with " kg" appended to the tick value, on Y axis
          },
        },
        // max: 100,
        // min: 40,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        // X-axis configuration
        ticks: {
          font: {
            size: 17, // Font size for x-axis ticks
            weight: "bold", // Font weight for x-axis ticks
          },
          color: "white", // Text color for x-axis ticks
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Color for x-axis grid lines
        },
      },
    },
  };

  // Apply font size adjustments for small screens using media queries
  if (window.innerWidth <= 1560) {
    options.scales.y.ticks.font.size = 14;
    options.scales.x.ticks.font.size = 14;
  }
  if (window.innerWidth <= 320) {
    options.scales.y.ticks.font.size = 12;
    options.scales.x.ticks.font.size = 12;
  }

  return (
    <div className={styles.page}>
      <section className={styles.pageHead}>
        <div className={styles.workoutName}> {convertedTitle}</div>

        <Image
          width={500}
          height={500}
          src={`/${params.slug}.png`}
          alt="Workout Image"
          className={styles.workoutImg}
          priority
        />
      </section>
      <section className={styles.firstRow}>
        <div className={styles.graph}>
          <Line data={data} options={options}></Line>
        </div>
        <div className={styles.weightContainer}>
          <div className={styles.currentWeight}>
            <Image
              width={28}
              height={28}
              src="/edit-icon.png"
              alt="edit"
              className={styles.editIcon}
              onClick={() => setIsEditingGoalWeight(true)} // Click handler to show the edit section
            />

            <h1 className={styles.weightNum}>{goalBodyWeight} Kg</h1>
            <h4 className={styles.weightText}>Goal Weight</h4>

            {isEditingGoalWeight && (
              <div className={styles.editGoalWeight}>
                <Image
                  width={28}
                  height={28}
                  src="/save-icon.png"
                  alt="edit"
                  className={styles.editIcon}
                  onClick={handleAddGoalWeight} // Connect the function to the "save" icon
                />
                <input
                  className={styles.weightAdd}
                  type="number"
                  name="weight"
                  placeholder="00.00"
                  value={newGoalWeight}
                  onChange={(e) => setNewGoalWeight(e.target.value)}
                />
                <h4 className={styles.weightText}>Edit Goal Weight</h4>
                <Image
                  width={30}
                  height={30}
                  src="/dlt.png"
                  className={styles.exitIcon}
                  alt="exit icon"
                  onClick={() => setIsEditingGoalWeight(false)} /// Wrap it in an arrow function
                />
              </div>
            )}
          </div>
          <div className={styles.goalWeight}>
            <h1 className={styles.weightNum}>{currentWeight} Kg</h1>
            <h4 className={styles.weightText}>Current Weight</h4>
          </div>
          <div className={styles.howMuchNeed}>
            <div className={styles.howMuchNeed}>
              <h1 className={styles.weightNum}>
                {formattedWeightDifference} Kg
              </h1>
              <h4 className={styles.weightText}>
                <span
                  className={
                    weightDifference > 0
                      ? styles.gainedText
                      : weightDifference < 0
                      ? styles.loosedText
                      : styles.maintainedText
                  }
                >
                  {weightDifference > 0
                    ? "Gained"
                    : weightDifference < 0
                    ? "Loosed"
                    : "Maintained"}
                </span>{" "}
                since last
              </h4>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.secondRow}>
        <h3 className={styles.secondRowHead}>Add Weight</h3>
        <div className={styles.secondRowItem}>
          <div className={styles.add}>
            <div className={styles.weightInput}>
              <p>Weight :</p>
              <input
                className={styles.weightAdd}
                type="number"
                name="weight"
                placeholder="00.00"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className={styles.weightInput}>
              <p>Reps :</p>
              <input
                className={styles.weightAdd}
                type="number"
                name="reps"
                placeholder="00"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>

            <div className={styles.dateInput}>
              <p>Date :</p>
              <input
                className={styles.dateAdd}
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.addButton} onClick={handleAddWeight}>
            Add
          </div>
        </div>
      </section>
      <section className={styles.thirdRow}>
        <h3 className={styles.thirdRowHead}>Weight History</h3>

        {loading ? (
          <div className={styles.thirdRowItem}>Updating...</div>
        ) : bodyWeights.length === 0 ? (
          <div className={styles.thirdRowItem}>
            You haven't added any data yet
          </div>
        ) : (
          bodyWeights.map((weightData) => (
            <div key={weightData.id} className={styles.thirdRowItem}>
              <div className={styles.item}>
                <div className={styles.repsContainer}>
                  <span className={styles.itemWeight}>
                    {weightData.weight} Kg
                  </span>
                  <span className={styles.itemReps}>
                    {weightData.reps} reps
                  </span>
                </div>

                <div className={styles.itemDate}>
                  on {formatDate(weightData.date)}
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemDlt}>
                  <Image
                    width={30}
                    height={30}
                    src="/dlt.png"
                    className={styles.dltIcon}
                    alt="workout icon"
                    onClick={() => handleDeleteWeight(weightData.id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
