import axiosClient from "../utils/axios.client";

export interface OrderData {
    bookId: string;
    buyer: string; // studentId
    seller: string; // studentId
}

export const createOrder = async (orderData: OrderData) => {
    try {
        const response = await axiosClient.post('/books/orders', orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOrdersByUserId = async (studentId: string) => {
    try {
        const response = await axiosClient.get(`/books/orders/user/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateOrderStatus = async (orderId: string, status: string, statusLabel: string) => {
    try {
        const response = await axiosClient.patch(`/books/orders/${orderId}/status`, { status, statusLabel });
        return response.data;
    } catch (error) {
        throw error;
    }
}
