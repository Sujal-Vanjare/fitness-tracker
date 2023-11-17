"use client";
import styles from "./page.module.css";
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
import Image from "next/image";
import {
  deleteDataFromApi,
  fetchDataFromApi,
  getWeightsHistory,
  postDataToApi,
} from "@/utils/api";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

function aggregateWeightByMonth(weightData) {
  const aggregatedData = {};

  weightData.forEach((weightEntry) => {
    const date = new Date(weightEntry.attributes.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name, e.g., "Jan"
    const day = date.getDate();

    const key = `${day} ${month} ${year}`; // Adjusted key to include day, month, and year
    if (!aggregatedData[key]) {
      aggregatedData[key] = { sum: 0, count: 0 };
    }

    aggregatedData[key].sum += weightEntry.attributes.weight_kg;
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
  const [weight, setWeight] = useState(""); // State variable for weight
  const [newGoalWeight, setNewGoalWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState(""); // State variable for weight
  const [isEditingGoalWeight, setIsEditingGoalWeight] = useState(false);

  const [date, setDate] = useState(""); // State variable for date
  const [weights, setWeights] = useState({ data: [] }); // Initialize weights as an object with a data property that is an empty array

  // Find the most recent weight entry
  const currentWeightEntry = weights.data[0];

  // Function to calculate weight difference
  const calculateWeightDifference = (weightHistory) => {
    const validWeights = weightHistory.filter(
      (weight) => weight.attributes && weight.attributes.weight_kg !== undefined
    );
    validWeights.sort(
      (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date)
    );

    if (validWeights.length >= 2) {
      const currentWeight = validWeights[0].attributes.weight_kg;
      const previousWeight = validWeights[1].attributes.weight_kg;
      const difference = currentWeight - previousWeight;

      if (!isNaN(difference)) {
        if (difference > 0) {
          return (
            <div className={styles.howMuchNeed}>
              <h1 className={styles.weightNum}>{Math.abs(difference)} Kg</h1>
              <h4 className={styles.weightText}>
                <span className={styles.gainedText}>Gained </span>
                this Month
              </h4>
            </div>
          );
        } else if (difference < 0) {
          return (
            <div className={styles.howMuchNeed}>
              <h1 className={styles.weightNum}>{Math.abs(difference)} Kg</h1>
              <h4 className={styles.weightText}>
                <span className={styles.loosedText}>Lost</span> this Month
              </h4>
            </div>
          );
        } else {
          return (
            <div className={styles.howMuchNeed}>
              <h1 className={styles.weightNum}>Maintained weight</h1>
            </div>
          );
        }
      }
    }

    return (
      <div>
        <h1 className={styles.weightNum}>...</h1>
      </div>
    );
  };

  // Assuming weights.data holds the weight entries in reverse chronological order (most recent on top)
  const weightDifference = calculateWeightDifference(weights.data);

  //

  const chartData = aggregateWeightByMonth(weights.data);

  chartData.reverse();
  console.log(aggregateWeightByMonth(weights.data));

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
        max: 100,
        min: 40,
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

  // format date
  function formatDate(inputDate) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString(undefined, options);
  }

  //  fetching weight goal
  useEffect(() => {
    fetchDataFromApi("/api/weight-goals")
      .then((data) => {
        if (data.data && data.data.length > 0) {
          // Sort the data array by updatedAt in descending order
          const sortedData = data.data.sort((a, b) => {
            return (
              new Date(b.attributes.updatedAt) -
              new Date(a.attributes.updatedAt)
            );
          });

          const latestWeightGoal = sortedData[0]; // Get the latest item
          setWeightGoal(latestWeightGoal); // Set the latest item as the state
        } else {
          console.log("No weight goals found in the data.");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch goal weight:", error);
      });
  }, []);

  // Function to handle the submission of the new goal weight
  const handleAddGoalWeight = async () => {
    if (newGoalWeight.trim() === "") {
      console.error("Goal weight field is required.");
      return;
    }

    const data = {
      data: {
        weightGoal: parseFloat(newGoalWeight),
      },
    };

    try {
      const response = await postDataToApi("/api/weight-goals", data);

      // After successfully adding a new goal weight, fetch the latest goal weight
      fetchDataFromApi("/api/weight-goals").then((data) => {
        if (data.data && data.data.length > 0) {
          const sortedData = data.data.sort((a, b) => {
            return (
              new Date(b.attributes.updatedAt) -
              new Date(a.attributes.updatedAt)
            );
          });
          const latestWeightGoal = sortedData[0];
          setWeightGoal(latestWeightGoal); // Update the state with the latest goal weight
        }
      });

      setNewGoalWeight("");
      setIsEditingGoalWeight(false);
    } catch (error) {
      console.error("Error adding goal weight:", error);
    }
  };

  // fetching weight history
  useEffect(() => {
    fetchDataFromApi("/api/weights")
      .then((data) => {
        setWeights(data);
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

    const data = {
      data: {
        weight_kg: weight, // Use the weight state variable
        date: date, // Use the date state variable
      },
    };

    try {
      const response = await postDataToApi("/api/weights", data);

      // Optionally, you can fetch the updated weight history after adding a new entry
      fetchDataFromApi("/api/weights").then((data) => {
        setWeights(data);
      });

      // Clear the input fields after successfully adding the weight
      setWeight("");
      setDate("");
    } catch (error) {
      console.error("Error adding weight entry:", error);
    }
  };

  // delete weight history item
  const handleDeleteWeight = async (weightId) => {
    try {
      const response = await deleteDataFromApi(`/api/weights/${weightId}`);
      if (response.data) {
        console.log("Weight entry deleted successfully");
        // Optionally, you can fetch the updated weight history after deleting the entry
        fetchDataFromApi("/api/weights").then((data) => {
          setWeights(data);
        });
      } else {
        console.error("Failed to delete weight entry");
      }
    } catch (error) {
      console.error("Error deleting weight entry:", error);
    }
  };

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
              {weightGoal ? `${weightGoal.attributes.weightGoal} Kg` : "..."}
            </h1>
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
                  onClick={() => setIsEditingGoalWeight(false)} // Wrap it in an arrow function
                />
              </div>
            )}
          </div>
          <div className={styles.goalWeight}>
            <h1 className={styles.weightNum}>
              {currentWeightEntry
                ? `${currentWeightEntry.attributes.weight_kg} Kg`
                : "No data"}
            </h1>
            <h4 className={styles.weightText}>Current Weight</h4>
          </div>
          <div className={styles.howMuchNeed}>
            <section>{weightDifference}</section>
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
        {weights.data
          .sort(
            (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date)
          ) // Sort by date, with the newest one on top

          .map((weight) => (
            <div key={weight.id} className={styles.thirdRowItem}>
              <div className={styles.item}>
                <div className={styles.itemWeight}>
                  {weight.attributes.weight_kg} Kg
                </div>
                <div className={styles.itemDate}>
                  on {formatDate(weight.attributes.date)}
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
                    onClick={() => handleDeleteWeight(weight.id)}
                  />
                </div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}
