import api from "./api";

export interface LoginResponse {
    error_code: number;
    error_message: string;
    data: {
      token: string;
    };
  }
  

export const login = async (username: string, password: string) => {
  const response = await api.post<LoginResponse>("/login", { username, password });
  console.log("API Response:", response.data);
  return response.data.data.token;
};
