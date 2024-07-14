import axiosInstance from "./axiosConfig";

export async function getAllLikedSong() {
  try {
    const response = await axiosInstance.get("/likedsongs");
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

export async function toggleLikeSong(id) {
  try {
    const response = await axiosInstance.post(`/likedsongs/toggle-like/${id}`);
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
