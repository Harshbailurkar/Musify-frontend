import axiosInstance from "./axiosConfig";

export async function getAllListenLaterSong() {
  try {
    const response = await axiosInstance.get("/listenlater");
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.setItem("isAuthenticated", false);
      throw new Error("Login required");
    }
    if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
export async function addSongToListenLater(songId) {
  try {
    const response = await axiosInstance.post(`/listenlater/add/${songId}`);
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.setItem("isAuthenticated", false);
      throw new Error("Login required");
    }
    if (error.response.status === 402) {
      throw new Error("song ready exists in listen later");
    }
    if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
export async function removeSongToListenLater(songId) {
  try {
    const response = await axiosInstance.delete(
      `/listenlater/remove/${songId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.setItem("isAuthenticated", false);
      throw new Error("Login required");
    }
    if (error.response.status === 404) {
      throw new Error("song not found in listen later");
    }
    if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
