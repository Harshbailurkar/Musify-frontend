import axiosInstance from "./axiosConfig";

export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post("/users/login", loginData);
    return response.data;
  } catch (error) {
    if (error.response.status === 400) {
      throw new Error("Invalid credentials");
    } else if (error.response.status === 404) {
      throw new Error("User Not Found");
    }
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export async function registerUser(registerFormData) {
  try {
    const response = await axiosInstance.post(
      "/users/register",
      registerFormData
    );
    return response.data;
  } catch (error) {
    if (error.response.status === 500) {
      throw new Error("Failed to register");
    } else if (error.response.status === 400) {
      throw new Error("Username or email already exists");
    } else if (error.response.status === 402) {
      throw new Error("please provide all the details");
    }
    throw error.response
      ? error.response.data
      : new Error("Failed to register");
  }
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
      localStorage.setItem("isAuthenticated", false);
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
      localStorage.setItem("isAuthenticated", false);
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

export async function updateUserInfo(userInfo) {
  try {
    const response = await axiosInstance.patch(
      "/users/update-account",
      userInfo
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to update");
  }
}
export async function updateAvatar(avatar) {
  const formData = new FormData();
  formData.append("avatar", avatar);

  try {
    const response = await axiosInstance.patch(
      "/users/change-avatar",
      formData
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to update");
  }
}
export async function updatePassword(passwordData) {
  try {
    const response = await axiosInstance.post(
      "/users/change-password",
      passwordData
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to update");
  }
}

export async function SignInWithGoogle(token) {
  try {
    const response = await axiosInstance.post(
      "/users/login/google",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to login");
  }
}
