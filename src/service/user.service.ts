import axiosClient from "../utils/axios.client";

export const updateProfile = async (userData: any) => {
    try {
        return await axiosClient.put('/users/profile', userData);
    } catch (error) {
        throw error;
    }
}

export const getProfile = async () => {
    try {
        return await axiosClient.get('/users/profile');
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        return await axiosClient.get('/users');
    } catch (error) {
        throw error;
    }
}

