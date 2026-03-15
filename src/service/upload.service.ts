import axiosClient from "../utils/axios.client";

interface UploadResponse {
    success: boolean;
    message: string;
    imageUrl: string;
}

export const uploadImage = async (uri: string, fileName: string): Promise<UploadResponse> => {
    try {
        const formData = new FormData();

        // In React Native, this structure tells the engine to stream the local file binary
        formData.append('image', {
            uri: uri,
            type: 'image/jpeg',
            name: fileName,
        } as any);

        const response = await axiosClient.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response as any; // Cast to any or the interface because the interceptor might confuse TS
    } catch (error) {
        console.error('Upload Service Error:', error);
        throw error;
    }
};
