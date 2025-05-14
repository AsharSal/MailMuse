import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/users';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};