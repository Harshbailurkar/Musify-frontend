import axiosInstance from "./axiosConfig";

export const getLiveStreams = async () => {
  try {
    const response = await axiosInstance.get("/streams/live");
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    }
    console.error(error);
  }
};

export const createStream = async (streamData) => {
  try {
    const response = await axiosInstance.post(
      "/streams/createstream",
      streamData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const createIngress = async () => {
  try {
    const response = await axiosInstance.post("/streams/Ingress");
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    }
    console.error(error);
  }
};
