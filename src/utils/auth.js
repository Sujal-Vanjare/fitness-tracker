import Cookies from "js-cookie";
import { fetcher } from "./api";
import { API_URL } from "./urls";

// reloading the current page
const Reload = () => {
  window.location.reload();
};

// Function for setting authentication token and user data
export const setToken = async (data) => {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return;
  }

  // Set cookies for user data and authentication token
  Cookies.set("id", data.user.id);
  Cookies.set("username", data.user.username);
  Cookies.set("jwt", data.jwt);

  // Reload the page if username cookie exists
  if (Cookies.get("username")) {
    Reload();
  }
};

// Function definition for removing authentication token and user data
export const unsetToken = () => {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return;
  }

  // Remove cookies for user data and authentication token
  Cookies.remove("id");
  Cookies.remove("jwt");
  Cookies.remove("username");

  // Reload the page
  Reload();
};

// Function for retrieving Username data from local cookie
export const getUserFromLocalCookie = () => {
  // Retrieve JWT token from local cookie
  const jwt = getTokenFromLocalCookie();

  // Check if JWT token exists
  if (jwt) {
    return fetcher(`${API_URL}/api/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((data) => {
        return data.username; // return the User name
      })
      .catch((error) => console.error(error));
  } else {
    return; //  Return nothing if jwt token doesn't exist
  }
};

// Function for retrieving user ID from local cookie
export const getIdFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();

  // Check if JWT token exists
  if (jwt) {
    // Fetch user data from API using the JWT token
    return fetcher(`${API_URL}/api/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((data) => {
      return data.id; // return id of user
    });
  } else {
    return;
  }
};

// get JWT token from Local Cookie
export const getTokenFromLocalCookie = () => {
  return Cookies.get("jwt");
};

// get User Id from Local Cookie
export const getUserId = () => {
  return Cookies.get("id");
};

// Function retrieving JWT token from server-side cookie
export const getTokenFromServerCookie = (req) => {
  // Check if the request headers contain the 'cookie' field
  if (!req.headers.cookie || "") {
    return undefined; // If no cookie is found, return undefined
  }

  // Find the cookie containing the JWT token from the cookie string in request headers
  const jwtCookie = req.headers.cookie
    .split(";") // Split the cookie string into an array of individual cookies
    .find((c) => c.trim().startsWith("jwt=")); // Find the cookie that starts with "jwt="

  // If no JWT cookie is found, return undefined
  if (!jwtCookie) {
    return undefined;
  }

  const jwt = jwtCookie.split("=")[1]; // Extract the JWT token value from the cookie

  return jwt; // Return the extracted JWT token
};

// Function retrieving user ID from server-side cookie
export const getIdFromServerCookie = (req) => {
  // Check if the request headers contain the 'cookie' field
  if (!req.headers.cookie || "") {
    return undefined; // If no cookie is found, return undefined
  }

  // Find the cookie containing the user ID from the cookie string in request headers
  const idCookie = req.headers.cookie
    .split(";") // Split the cookie string into an array of individual cookies
    .find((c) => c.trim().startsWith("id=")); // Find the cookie that starts with "id="

  // If no user ID cookie is found, return undefined
  if (!idCookie) {
    return undefined;
  }
  const id = idCookie.split("=")[1]; // Extract the user ID value from the cookie
  return id; // Return the extracted user ID
};
