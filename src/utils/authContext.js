"use client";
import { useEffect, useState } from "react";
import { getUserFromLocalCookie } from "./auth";

// State variable to store user data and loading status
let userState;

// Custom hook for fetching user data
export const useFetchUser = () => {
  const [data, setUser] = useState({
    user: userState || null, // Initialize user data with previously stored state or null
    loading: userState === undefined, // Set loading to true if userState is undefined, indicating initial loading state
  });

  useEffect(() => {
    // Check if userState is already defined (not undefined)
    if (userState !== undefined) {
      return; // If userState is defined, return to avoid unnecessary fetch
    }

    // Variable to track whether the component is mounted
    let isMounted = true;

    // Function to asynchronously resolve and set user data
    const resolveUser = async () => {
      // Fetch user data from local cookie
      const user = await getUserFromLocalCookie();
      // Update user data and loading status only if component is still mounted
      if (isMounted) {
        setUser({ user, loading: false }); // Update state with fetched user data and set loading to false
      }
    };
    resolveUser(); // Call resolveUser function to fetch user data

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []); //  runs only once, similar to componentDidMount

  return data; // Return current state containing user data and loading status
};
