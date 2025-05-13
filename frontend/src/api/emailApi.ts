import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface EmailRequest {
    prompt: string;
    tone: string;
    variables?: Record<string, string>;
}

interface EmailResponse {
    success: boolean;
    data: {
        id: number;
        generatedEmail: string;
    };
}

export const composeEmail = async (params: EmailRequest): Promise<EmailResponse> => {
    const response = await axios.post(`${API_BASE_URL}/email/compose`, params);
    return response.data;
};