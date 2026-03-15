import axiosClient from "../utils/axios.client";

enum BOOK_API {
    SELLING_BOOK = '/books'
}

export type Condition = 'Như mới' | 'Tốt' | 'Khá' | 'Cũ' | '';
export type Faculty = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ' | 'Thiết kế' | 'Marketing' | 'Khác' | '';

export interface BookResponse {
    description: any;
    _id: string;
    title: string;
    author: string;
    price: number;
    originalPrice: number;
    condition: Condition;
    image: string;
    seller: string;
    faculty: Faculty;
    createdAt: string;
    updatedAt: string;
}

export const createSellingBook = async (bookData: any) => {
    try {
        const response = await axiosClient.post(BOOK_API.SELLING_BOOK, bookData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllSellingBooks = async () => {
    try {
        const response = await axiosClient.get<BookResponse[]>(BOOK_API.SELLING_BOOK);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSellerBooks = async (studentId: string) => {
    try {
        const response = await axiosClient.get<BookResponse[]>(`${BOOK_API.SELLING_BOOK}/seller/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteSellingBook = async (bookId: string) => {
    try {
        const response = await axiosClient.delete(`${BOOK_API.SELLING_BOOK}/${bookId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateSellingBook = async (bookId: string, bookData: any) => {
    try {
        const response = await axiosClient.put(`${BOOK_API.SELLING_BOOK}/${bookId}`, bookData);
        return response.data;
    } catch (error) {
        throw error;
    }
}