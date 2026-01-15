import axios, { type AxiosInstance, type AxiosError } from 'axios';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for auth (Task Juggler Laravel Sanctum)
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add app context header for all requests
        config.headers['X-App-Context'] = 'ideacircuit';
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods (Task Juggler Laravel Sanctum)
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async signup(userData: {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
  }) {
    return this.client.post('/auth/register', userData);
  }

  async logout() {
    localStorage.removeItem('token');
  }

  async getUser() {
    return this.client.get('/auth/user');
  }

  // Meeting methods (Task Juggler API)
  async createMeeting(data: { title: string; description?: string; [key: string]: any }) {
    return this.client.post('/ideacircuit/meetings', data);
  }

  async joinMeeting(meetingId: string, data: { name: string; [key: string]: any }) {
    return this.client.post(`/ideacircuit/meetings/${meetingId}/join`, data);
  }

  async getMeeting(meetingId: string) {
    return this.client.get(`/ideacircuit/meetings/${meetingId}`);
  }

  async endMeeting(meetingId: string) {
    return this.client.post(`/ideacircuit/meetings/${meetingId}/end`);
  }

  // Notes methods
  async getNotes(meetingId: string) {
    return this.client.get(`/ideacircuit/meetings/${meetingId}/notes`);
  }

  async addNote(meetingId: string, note: { category: string; content: string }) {
    return this.client.post(`/ideacircuit/meetings/${meetingId}/notes`, note);
  }

  // Transcript methods
  async getTranscript(meetingId: string) {
    return this.client.get(`/ideacircuit/meetings/${meetingId}/transcript`);
  }

  // Chat/Message methods
  async getMessages(meetingId: string) {
    return this.client.get(`/ideacircuit/meetings/${meetingId}/messages`);
  }

  async sendMessage(meetingId: string, data: { text: string; participant_id: string }) {
    return this.client.post(`/ideacircuit/meetings/${meetingId}/messages`, data);
  }

  // AI methods (OpenRouter)
  async aiChat(messages: Array<{ role: string; content: string }>, model?: string) {
    return this.client.post('/ideacircuit/ai/chat', { messages, model });
  }

  async createAIBot(data: any) {
    return this.client.post('/ideacircuit/ai/bots', data);
  }

  async executeAIBot(botId: string, data: any) {
    return this.client.post(`/ideacircuit/ai/bots/${botId}/execute`, data);
  }

  // Generic HTTP methods
  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export default new ApiService();

