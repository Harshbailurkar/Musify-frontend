import axiosInstance from "./axiosConfig";

export async function getAllPlaylist() {
  try {
    const response = await axiosInstance.get(`/playlists/`);
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else {
      throw new Error("Network request failed");
    }
  }
}

export async function createPlaylist(playlistName) {
  console.log("I am from create Playlist");
  console.log(playlistName);
  try {
    const response = await axiosInstance.post(`/playlists/create`, {
      name: playlistName,
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else {
      throw new Error("Network request failed");
    }
  }
}

export async function deletePlaylist(playlistId) {
  try {
    const response = await axiosInstance.delete(
      `/playlists/delete/${playlistId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 400) {
      throw new Error("Playlist with name already exists");
    } else if (error.response.status === 404) {
      throw new Error("Playlist not found");
    } else if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else {
      throw new Error("Network request failed");
    }
  }
}
export async function updatePlaylist(playlistId, playlistName) {
  try {
    const response = await axiosInstance.patch(
      `/playlists/update/${playlistId}`,
      {
        name: playlistName,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 402) {
      throw new Error(402, "Playlist with name already exists");
    } else if (error.response.status === 400) {
      throw new Error("Playlist Name is required");
    } else if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else {
      throw new Error("Network request failed");
    }
  }
}
