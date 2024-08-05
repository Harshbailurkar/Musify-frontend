import axiosInstance from "./axiosConfig";

const checkoutSession = async (concertName, price, id, streamId) => {
  try {
    const response = await axiosInstance.post("/concert/checkout", {
      concertName,
      price,
      id,
      streamId,
    });
    return response;
  } catch (error) {
    console.error(
      "Error during checkout session:",
      error.response ? error.response.data : error.message
    );
  }
};

export { checkoutSession };
