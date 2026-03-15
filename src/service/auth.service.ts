import axiosClient from "../utils/axios.client";

enum AUTH_API {
    REGISTER = '/auth/register',
    LOGIN = '/auth/login',
    FORGOT_PASSWORD = '/auth/forgot-password',
    RESET_PASSWORD = '/auth/reset-password'
}

export const register = async (userData: any) => {
    try {
        const response = await axiosClient.post(AUTH_API.REGISTER, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (userData: any) => {
    try {
        const response = await axiosClient.post(AUTH_API.LOGIN, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (studentId: string) => {
    try {
        const response = await axiosClient.post(AUTH_API.FORGOT_PASSWORD, { studentId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosClient.post(AUTH_API.RESET_PASSWORD, { token, newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
}
