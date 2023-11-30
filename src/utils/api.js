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

//

export async function fetcher(url, options = {}) {
  let response;
  if (!options) {
    response = await fetch(url);
  } else {
    response = await fetch(url, options);
  }
  const data = await response.json();
  return data;
}

// useEffect(() => {
//   fetchDataFromApi("/api/users/me?populate=body_weights", jwtToken)
//     .then((data) => {
//       setBodyWeight(data.body_weights);
//       // console.log(data.body_weights);
//     })
//     .catch((error) => {
//       console.error("Failed to fetch weight history:", error);
//     });
// }, []);
