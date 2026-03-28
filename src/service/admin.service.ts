import axiosClient from "../utils/axios.client";

enum ADMIN_API {
    STATS = '/admin/stats',
    USERS = '/admin/users',
    UPDATE_ROLE = '/admin/users',
    PENDING_BOOKS = '/admin/books/pending',
    APPROVE_BOOK = '/admin/books',
    REJECT_BOOK = '/admin/books',
    ORDERS = '/admin/orders'
}

export const getAdminStats = async () => {
    try {
        const response: any = await axiosClient.get(ADMIN_API.STATS);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response: any = await axiosClient.get(ADMIN_API.USERS);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateUserRole = async (userId: string, role: string) => {
    try {
        const response: any = await axiosClient.put(`${ADMIN_API.UPDATE_ROLE}/${userId}/role`, { role });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const response: any = await axiosClient.delete(`${ADMIN_API.USERS}/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateUserStatus = async (userId: string, isBanned: boolean) => {
    try {
        const response: any = await axiosClient.put(`${ADMIN_API.USERS}/${userId}/status`, { isBanned });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getPendingBooks = async () => {
    try {
        const response: any = await axiosClient.get(ADMIN_API.PENDING_BOOKS);
        return response;
    } catch (error) {
        throw error;
    }
}

export const approveBook = async (bookId: string) => {
    try {
        const response: any = await axiosClient.put(`${ADMIN_API.APPROVE_BOOK}/${bookId}/approve`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const rejectBook = async (bookId: string) => {
    try {
        const response: any = await axiosClient.put(`${ADMIN_API.REJECT_BOOK}/${bookId}/reject`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllOrders = async () => {
    try {
        const response: any = await axiosClient.get(ADMIN_API.ORDERS);
        return response;
    } catch (error) {
        throw error;
    }
}
