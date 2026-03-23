import { User } from "../data/mockUsers";
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
    avatar: string;
    price: number;
    originalPrice: number;
    condition: Condition;
    image: string;
    seller: User
    faculty: Faculty;
    createdAt: string;
    updatedAt: string;
}

export const createSellingBook = async (bookData: any) => {
    try {
        return await axiosClient.post(BOOK_API.SELLING_BOOK, bookData);
    } catch (error) {
        throw error;
    }
}

export const getAllSellingBooks = async () => {
    try {
        return await axiosClient.get<BookResponse[]>(BOOK_API.SELLING_BOOK);
    } catch (error) {
        throw error;
    }
}

export const getBookById = async (bookId: string) => {
    try {
        return await axiosClient.get<BookResponse>(`${BOOK_API.SELLING_BOOK}/${bookId}`);
    } catch (error) {
        throw error;
    }
}

export const getSellerBooks = async (studentId: string) => {
    try {
        return await axiosClient.get<BookResponse[]>(`${BOOK_API.SELLING_BOOK}/seller/${studentId}`);
    } catch (error) {
        throw error;
    }
}

export const deleteSellingBook = async (bookId: string) => {
    try {
        return await axiosClient.delete(`${BOOK_API.SELLING_BOOK}/${bookId}`);
    } catch (error) {
        throw error;
    }
}

export const updateSellingBook = async (bookId: string, bookData: any) => {
    try {
        return await axiosClient.put(`${BOOK_API.SELLING_BOOK}/${bookId}`, bookData);
    } catch (error) {
        throw error;
    }
}