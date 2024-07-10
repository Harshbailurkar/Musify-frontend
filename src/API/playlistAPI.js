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
export async function getFirstThreePlaylist() {
  try {
    const response = await axiosInstance.get(`/playlists/showLatest3Playlists`);
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 404) {
      throw new Error("No Playlist Found");
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
export async function addSongToPlaylist(playlistId, songId) {
  try {
    const response = await axiosInstance.post(
      `/playlists/add/${playlistId}/${songId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 404) {
      throw new Error("Playlist or Song not found");
    } else if (error.response.status === 402) {
      throw new Error("Song already exists in playlist");
    } else if (error.response.status === 401) {
      throw new Error("Playlist with name already exists");
    } else if (error.response.status === 400) {
      throw new Error("Playlist Id and Song Id are required");
    } else if (error.response) {
      throw new Error(
        error.response.data.message || "Network response was not ok"
      );
    } else {
      throw new Error("Network request failed");
    }
  }
}
export async function removeSongFromPlaylist(playlistId, songId) {
  try {
    const response = await axiosInstance.delete(
      `/playlists/remove/${playlistId}/${songId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 404) {
      throw new Error(402, "Playlist Not Found");
    } else if (error.response.status === 500) {
      throw new Error("Internal Server Error");
    } else {
      throw new Error("Network request failed");
    }
  }
}
export async function moveSongToTopInPlaylist(playlistId, songId) {
  try {
    const response = await axiosInstance.patch(
      `/playlists/move-to-top/${playlistId}/${songId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 404) {
      throw new Error("Playlist not found");
    } else if (error.response.status === 400) {
      throw new Error("Playlist Id and Song Id are required");
    } else {
      throw new Error("Network request failed");
    }
  }
}
export async function moveSongToBottomInPlaylist(playlistId, songId) {
  try {
    const response = await axiosInstance.patch(
      `/playlists/move-to-bottom/${playlistId}/${songId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      throw new Error("Login required");
    } else if (error.response.status === 404) {
      throw new Error("Playlist not found");
    } else if (error.response.status === 400) {
      throw new Error("Playlist Id and Song Id are required");
    } else {
      throw new Error("Network request failed");
    }
  }
}
