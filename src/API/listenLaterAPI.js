import axiosInstance from "./axiosConfig";

export async function getAllListenLaterSong() {
  try {
    const response = await axiosInstance.get("/listenlater");
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
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
