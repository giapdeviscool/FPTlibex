import axiosClient from "../utils/axios.client";

export const updateProfile = async (userData: any) => {
    try {
        const response = await axiosClient.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProfile = async () => {
    try {
        const response = await axiosClient.get('/users/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosClient.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
}

