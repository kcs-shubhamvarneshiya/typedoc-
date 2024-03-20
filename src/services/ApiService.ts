import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';


class ApiService {
  public readonly axiosInstance: AxiosInstance;
  
  constructor() {    
    const baseURL = process.env.REACT_APP_API_URL;
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        // Add any other common headers or authentication tokens here if needed
      },
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response?.data;
  }

  public async postForm<T>(url: string, data: FormData): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Add other HTTP methods as needed (e.g., PATCH, OPTIONS)

  // You can also include error handling and interceptors if required
}

const api = new ApiService();

export default api;
