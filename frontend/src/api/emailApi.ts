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
        remainingQuota: number;
    };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const composeEmail = async (params: EmailRequest): Promise<EmailResponse> => {
    const response = await axios.post(`${API_BASE_URL}/email/compose`, params, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAllPrompts = ({ page = 1, limit = 5 }: PaginationParams = {}) => {
  return axios.get(`${API_BASE_URL}/email/prompts`, {
    params: { page, limit },
    headers: getAuthHeader()
  });
};