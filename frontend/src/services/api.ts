import axios, { isAxiosError } from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { User, PaginatedResponse, SingleResponse, SchoolSettings } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        withCredentials: true,
      });

      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      this.refreshTokenPromise = null;
      return accessToken;
    })();

    return this.refreshTokenPromise;
  }

  private clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Auth
  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const response = await this.client.post<SingleResponse<{ user: User; accessToken: string | null; pendingApproval?: boolean }>>('/auth/register', data);
    if (response.data.data?.accessToken) this.setAuth(response.data.data);
    return response.data;
  }

  async login(data: { email: string; password: string; rememberMe?: boolean }) {
    const response = await this.client.post<SingleResponse<{ user: User; accessToken: string }>>('/auth/login', data);
    this.setAuth(response.data.data);
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    this.clearAuth();
  }

  async getMe() {
    const response = await this.client.get<SingleResponse<{ user: User }>>('/auth/me');
    if (response.data.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  async forgotPassword(email: string) {
    return this.client.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string) {
    return this.client.post('/auth/reset-password', { token, password });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.client.post('/auth/change-password', { currentPassword, newPassword });
  }

  async verifyEmail(token: string) {
    return this.client.post('/auth/verify-email', { token });
  }

  async resendVerification(email: string) {
    return this.client.post('/auth/resend-verification', { email });
  }

  private setAuth(data: { user: User; accessToken: string | null }) {
    if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    // refreshToken is set via httpOnly cookie
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Generic CRUD
  async get<T>(url: string, params?: Record<string, any>) {
    const response = await this.client.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  }

  async getSingle<T>(url: string) {
    const response = await this.client.get<SingleResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data: any) {
    const response = await this.client.post<SingleResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any) {
    const response = await this.client.put<SingleResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data: any) {
    const response = await this.client.patch<SingleResponse<T>>(url, data);
    return response.data;
  }

  async delete(url: string) {
    const response = await this.client.delete<SingleResponse<null>>(url);
    return response.data;
  }

  // File upload
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<SingleResponse<{ url: string }>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return response.data;
  }

  // Public endpoints (no auth required)
  async getPublicSettings(): Promise<SchoolSettings> {
    const response = await this.client.get<SingleResponse<{ settings: SchoolSettings }>>('/public/settings');
    return response.data.data?.settings || {};
  }

  async getPublishedNotices(params?: any) {
    return this.client.get('/notices/published', { params });
  }

  async getPublishedGalleries(params?: any) {
    return this.client.get('/galleries/published', { params });
  }

  async getPublishedActivities(params?: any) {
    return this.client.get('/activities/published', { params });
  }

  async getPublishedAchievements(params?: any) {
    return this.client.get('/achievements/published', { params });
  }

  async getPublishedFacilities(params?: any) {
    return this.client.get('/facilities/published', { params });
  }

  async getPublishedDownloads(params?: any) {
    return this.client.get('/downloads/public', { params });
  }

  async getPinnedNotices() {
    return this.client.get('/notices/pinned');
  }

  async getLatestNotices(limit?: number) {
    return this.client.get('/notices/latest', { params: { limit } });
  }

  async getWeeklyECA() {
    return this.client.get('/activities/weekly-eca');
  }

  async getExamSchedule(params?: any) {
    return this.client.get('/exams/schedule', { params });
  }

  async searchResultByRoll(params: { rollNumber?: string; examId?: string; academicYear?: string; symbolNumber?: string; classId?: string }) {
    return this.client.get('/results/search', { params });
  }

  async submitAdmission(data: any) {
    return this.client.post('/admissions', data);
  }

  async submitSuggestion(data: any) {
    return this.client.post('/suggestions', data);
  }

  async submitContact(data: any) {
    return this.client.post('/contacts', data);
  }

  async incrementDownload(id: string) {
    return this.client.post(`/downloads/${id}/download`);
  }
}

export const api = new ApiService();
export default api;