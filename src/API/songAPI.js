import axiosInstance from "./axiosConfig";

export async function getAllSongs(page) {
  try {
    const response = await axiosInstance.get(`/songs/${page}`);
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
        localStorage.setItem("isAuthenticated", false);
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
export async function getSongById(songId) {
  try {
    const response = await axiosInstance.get(`/songs/songid/${songId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("No Songs are availabe");
      } else if (error.response.status === 400) {
        throw new Error("Bad request. Please check the owner parameter.");
      } else if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login Required");
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
        localStorage.setItem("isAuthenticated", false);
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
export async function uploadSong(formData) {
  try {
    const response = await axiosInstance.post("/songs/add-song", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else if (error.response.status === 400) {
        throw new Error("Song is required");
      } else if (error.response.status === 500) {
        throw new Error("Error in Uploading Song");
      } else if (error.response.status === 404) {
        throw new Error("Cannot find the song");
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
export async function deleteSong(SongId) {
  console.log(`Deleting song with ID: ${SongId}`);
  try {
    const response = await axiosInstance.delete(
      `/songs/delete/songid/${SongId}`
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      throw new Error("Song not found");
    }
    if (error.response.status === 401) {
      localStorage.setItem("isAuthenticated", false);
      throw new Error("Login required");
    }
    if (error.response.status === 402) {
      throw new Error(
        "Unauthorized request! you dont have permission to perform this action !"
      );
    }
    if (error.response.status === 500) {
      throw new Error("Failed to delete song. Try Again !");
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
export async function updateSong(songId, formData) {
  try {
    const response = await axiosInstance.patch(
      `/songs/update-song/${songId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (e) {
    if (e.response.status === 404) {
      throw new Error("Song not found");
    }
    if (e.response.status === 401) {
      localStorage.setItem("isAuthenticated", false);
      throw new Error("Login required");
    }
    if (e.response.status === 402) {
      throw new Error(
        "Unauthorized request! you dont have permission to perform this action !"
      );
    }
    if (e.response.status === 500) {
      throw new Error("Failed to update song. Try Again !");
    } else if (e.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
}
