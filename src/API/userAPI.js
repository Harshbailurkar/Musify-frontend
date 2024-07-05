// userAPI.js
import axiosInstance from "./axiosConfig";

export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post("/users/login", loginData);
    return response.data;
  } catch (error) {
    if (error.response.status === 402) {
      throw new Error("Invalid credentials");
    }
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export async function registerUser(registerFormData) {
  return await fetch(
    `https://musify-backend-mzce.onrender.com/api/v1/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerFormData),
    }
  ).then((response) => {
    console.log(response);
    if (!response.ok) {
      throw new Error(
        "Error while creating your account! please try again later."
      );
    }
    return response.json();
  });
}

export async function logoutUser() {
  try {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
  } catch (error) {
    if (error.response.status == 500) {
      throw new Error("Failed to logout");
    }
    throw error.response ? error.response.data : new Error("failed to logout");
  }
}

export async function getChannel(username) {
  try {
    const response = await axiosInstance.get(`/users/c/${username}`);
    return response.data;
  } catch (error) {
    if (error.response.status === 501) {
      throw new Error("User Not found");
    } else if (error.response.status === 401) {
      throw new Error("Login required");
    }
    throw error.response ? error.response.data : new Error("user not Found");
  }
}

export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get(`/users/current-user`);
    return response.data;
  } catch (error) {
    if (error.response.status === 501) {
      throw new Error("User Not found");
    } else if (error.response.status === 401) {
      throw new Error("Login required");
    }
    throw error.response ? error.response.data : new Error("user not Found");
  }
}

export async function followUser(userId) {
  try {
    const response = await axiosInstance.post(`/users/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Failed to follow user");
  }
}

export async function unfollowUser(userId) {
  try {
    const response = await axiosInstance.post(`/users/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Failed to unfollow user");
  }
}
export async function getFollowedAccounts() {
  try {
    const response = await axiosInstance.get("/users/followed-channels", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Failed to get followed channels");
  }
}
