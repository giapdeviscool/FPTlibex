import axiosClient from "../utils/axios.client";

export const depositCoin = async (amount: number, description?: string) => {
  try {
    const response = await axiosClient.post("/wallet/deposit", {
      amount,
      description,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const withdrawCoin = async (amount: number, bankInfo: string) => {
  try {
    const response = await axiosClient.post("/wallet/withdraw", {
      amount,
      bankInfo,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWalletBalance = async () => {
  try {
    const response = await axiosClient.get("/wallet/balance");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWalletHistory = async () => {
  try {
    const response = await axiosClient.get("/wallet/history");
    return response.data;
  } catch (error) {
    throw error;
  }
};
