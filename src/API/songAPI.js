import axiosInstance from "./axiosConfig";

export async function getAllSongs(page) {
  try {
    const response = await axiosInstance.get(`/songs/${page}`);
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

export async function getSongByOwner(owner) {
  try {
    const response = await axiosInstance.get(`/songs/owner/${owner}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No Songs are availabe");
      } else if (error.response.status === 400) {
        throw new Error("Bad request. Please check the owner parameter.");
      } else if (error.response.status === 401) {
        throw new Error("Login required");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
export async function searchQuery(query) {
  try {
    const response = await axiosInstance.get(`/songs/search`, {
      params: { query },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No Songs are availabe");
      } else if (error.response.status === 400) {
        throw new Error("Bad request. Please check the owner parameter.");
      } else if (error.response.status === 401) {
        throw new Error("Login required");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
