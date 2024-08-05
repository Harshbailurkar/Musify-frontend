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
export const getStreamById = async (id) => {
  try {
    const response = await axiosInstance.get(`/streams/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else if (error.response.status === 403) {
        throw new Error("payment required");
      } else if (error.response.status === 404) {
        throw new Error("Stream Not Found");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    }
    console.error(error);
  }
};
export const getUserPaidStreams = async () => {
  try {
    const response = await axiosInstance.get("/p/paidstreams");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getUserStream = async (userId) => {
  try {
    const response = await axiosInstance.get(`/streams/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.setItem("isAuthenticated", false);
        throw new Error("Login required");
      } else if (error.response.status === 403) {
        throw new Error("payment required");
      } else if (error.response.status === 404) {
        throw new Error("Stream Not Found");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    }
    console.error(error);
  }
};
export const stopStream = async (id) => {
  try {
    const response = await axiosInstance.post(`/streams/stopstream/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Stream Not Found");
      } else {
        throw new Error(
          error.response.data.message || "Network response was not ok"
        );
      }
    }
    console.error(error);
  }
};
