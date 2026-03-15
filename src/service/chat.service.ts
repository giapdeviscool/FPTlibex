import axiosClient from "../utils/axios.client";

export const getOrCreateChatRoom = async (recipientStudentCode: string, senderId: string, bookId: string) => {
    try {
        const response = await axiosClient.post('/chat/room', { recipientStudentCode, senderId, bookId });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getMyChatRooms = async () => {
    try {
        const response = await axiosClient.get('/chat/my-rooms');
        return response;
    } catch (error) {
        throw error;
    }
}

export const getMessages = async (roomId: string) => {
    try {
        const response = await axiosClient.get(`/chat/${roomId}/messages`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const sendMessageApi = async (data: { conversationId: string, senderId: string, text: string }) => {
    try {
        const response = await axiosClient.post('/chat/room/message', data);
        return response;
    } catch (error) {
        throw error;
    }
}
