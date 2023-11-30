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
} from "@/utils/api";
import { useEffect, useState } from "react";
import { getUserId } from "@/utils/auth";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

function aggregateWeightByMonth(bodyWeights) {
  const aggregatedData = {};

  bodyWeights.forEach((bodyWeightsEntry) => {
    const date = new Date(bodyWeightsEntry.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name, e.g., "Jan"
    const day = date.getDate();

    const key = `${day} ${month} ${year}`; // Adjusted key to include day, month, and year
    if (!aggregatedData[key]) {
      aggregatedData[key] = { sum: 0, count: 0 };
    }

    aggregatedData[key].sum += bodyWeightsEntry.weight;
    aggregatedData[key].count++;
  });

  const result = [];

  for (const key in aggregatedData) {
    if (aggregatedData.hasOwnProperty(key)) {
      const avgWeight = aggregatedData[key].sum / aggregatedData[key].count;
      result.push({ month: key, weight: avgWeight });
    }
  }

  return result;
}

export default function Page() {
  const id = getUserId();

  const [bodyWeights, setBodyWeights] = useState([]); // Initialize weights as an object with a data property that is an empty array
  const [currentWeight, setCurrentWeight] = useState("..."); // Find the most recent weight entry
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(""); // upload bodyWeight, date field
  const [weight, setWeight] = useState(""); // upload bodyWeight , weight field
  // format date
  function formatDate(inputDate) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString(undefined, options);
  }
  // fetching weight history
  useEffect(() => {
    fetchDataFromApi("/api/users/me?populate=body_weights")
      .then((data) => {
        const sortedBodyWeights = data.body_weights.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBodyWeights(sortedBodyWeights);
        setCurrentWeight(sortedBodyWeights[0].weight);
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

    // Set loading to true before making the API call
    setLoading(true);

    const data = {
      data: {
        weight: weight,
        date: date,
        user: {
          connect: [{ id }],
        },
      },
    };

    try {
      // Make the API call to add a new weight entry
      const response = await postDataToApi("/api/body-weights", data);

      // Fetch the updated weight history after adding a new entry
      const updatedData = await fetchDataFromApi(
        "/api/users/me?populate=body_weights"
      );

      // Sort the updated data by date in descending order
      const sortedBodyWeights = updatedData.body_weights.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Update the state with the sorted data
      setBodyWeights(sortedBodyWeights);
      setCurrentWeight(sortedBodyWeights[0].weight);

      // Clear the input fields after successfully adding the weight
      setWeight("");
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

      const response = await deleteDataFromApi(`/api/body-weights/${weightId}`);
      if (response.data) {
        console.log("Weight entry deleted successfully");

        // Fetch the updated weight history after deleting the entry
        const updatedData = await fetchDataFromApi(
          "/api/users/me?populate=body_weights"
        );

        // Sort the updated data by date in descending order
        const sortedBodyWeights = updatedData.body_weights.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Update the state with the sorted data
        setBodyWeights(sortedBodyWeights);
        setCurrentWeight(sortedBodyWeights[0].weight);
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

  // ////  graph code
  const chartData = aggregateWeightByMonth(bodyWeights);

  // Calculate weight difference between the current month and the previous month
  const currentMonthWeight = chartData[0]?.weight || 0;
  const previousMonthWeight = chartData[1]?.weight || 0;
  const weightDifference = currentMonthWeight - previousMonthWeight;
  const formattedWeightDifference =
    weightDifference % 1 !== 0
      ? weightDifference.toFixed(1)
      : weightDifference.toFixed(0);
  chartData.reverse();

  const data = {
    labels: chartData.map((data) => data.month),
    datasets: [
      {
        label: "Weight",
        data: chartData.map((data) => data.weight),
        borderColor: "#EAEAF2",
        borderWidth: 3,
        pointBorderColor: "#27262B",
        pointBorderWidth: 3,
        tension: 0.5,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#5063EE");
          gradient.addColorStop(1, "#E0DFE7");
          return gradient;
        },
      },
    ],
  };

  const options = {
    plugins: {
      legend: false,
    },
    responsive: true,
    scales: {
      y: {
        ticks: {
          font: {
            size: 17,
            weight: "bold",
          },
          color: "white",
          callback: function (value, index, values) {
            return value + " kg"; // Return a string with " kg" appended to the tick value
          },
        },
        // max: 100,
        // min: 40,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: {
          font: {
            size: 17,
            weight: "bold",
          },
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  //  media query to apply the smallScreenFont class for small screens
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

            <h1 className={styles.weightNum}>
              {/* {weightGoal ? `${weightGoal.attributes.weightGoal} Kg` : "..."} */}
            </h1>
            <h4 className={styles.weightText}>Goal Weight</h4>

            {/* {isEditingGoalWeight && (
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
                  onClick={() => setIsEditingGoalWeight(false)} // Wrap it in an arrow function
                />
              </div>
            )} */}
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
                this Month
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
                placeholder="00.00 Kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
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
        ) : (
          bodyWeights.map((weightData) => (
            <div key={weightData.id} className={styles.thirdRowItem}>
              <div className={styles.item}>
                <div className={styles.itemWeight}>{weightData.weight} Kg</div>
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
