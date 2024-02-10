import { getTokenFromLocalCookie } from "./auth";
import { API_URL } from "./urls";

export async function fetchDataFromApi(endpoints) {
  const jwt = getTokenFromLocalCookie();
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  };
  const res = await fetch(`${API_URL}${endpoints}`, options);
  const data = await res.json();
  return data;
}

//

export async function postDataToApi(endpoint, data) {
  const jwt = getTokenFromLocalCookie();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Failed to post data to the API: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
}

//

export async function putDataToApi(endpoint, data) {
  const jwt = getTokenFromLocalCookie();
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Failed to put data to the API: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
}

//

export async function deleteDataFromApi(endpoint) {
  const jwt = getTokenFromLocalCookie();
  const options = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Failed to delete data from the API: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    throw error;
  }
}

// synchronous function for fetching data from a specified URL with optional request options.
export async function fetcher(url, options = {}) {
  let response;

  // If options are not provided, perform a simple fetch without additional options
  if (!options) {
    response = await fetch(url);
  } else {
    // Otherwise, perform a fetch with the provided options
    response = await fetch(url, options);
  }
  const data = await response.json(); // Parse the response body as JSON
  return data;
}
