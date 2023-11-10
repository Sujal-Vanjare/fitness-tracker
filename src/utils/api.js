import { API_URL, STRAPI_API_TOKEN } from "./urls";

export async function fetchDataFromApi(endpoints) {
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + STRAPI_API_TOKEN,
    },
  };
  const res = await fetch(`${API_URL}${endpoints}`, options);
  const data = await res.json();
  return data;
}

//

export async function postDataToApi(endpoint, data) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
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
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
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
