import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

const API_BASE_URL = '/api/v1';

class ApiClient {
  public client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response.data?.data !== undefined ? response.data.data : response.data,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem('refreshToken')) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshQueue.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            const { accessToken, refreshToken: newRefresh } = res.data?.data || res.data;

            localStorage.setItem('accessToken', accessToken);
            if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

            this.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            this.refreshQueue.forEach((cb) => cb(accessToken));
            this.refreshQueue = [];

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshErr) {
            this.refreshQueue = [];
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshErr);
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error.response?.data?.message || error.message);
      },
    );
  }

  // Auth API
  async login(credentials: any) {
    const res: any = await this.client.post('/auth/login', credentials);
    if (res?.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    return res;
  }

  async register(data: any) {
    const res: any = await this.client.post('/auth/register', data);
    if (res?.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    return res;
  }

  // Projects API
  async getProjects(params?: any) {
    return this.client.get('/projects', { params });
  }

  async getProjectDetails(id: string) {
    return this.client.get(`/projects/${id}`);
  }

  async getProjectHealth(id: string) {
    return this.client.get(`/projects/${id}/health`);
  }

  async createProject(data: any) {
    return this.client.post('/projects', data);
  }

  // Sprints API
  async getSprints(projectId: string) {
    return this.client.get(`/sprints/project/${projectId}`);
  }

  async getSprintDetails(sprintId: string) {
    return this.client.get(`/sprints/${sprintId}`);
  }

  async getBurndown(sprintId: string) {
    return this.client.get(`/sprints/${sprintId}/burndown`);
  }

  async startSprint(sprintId: string) {
    return this.client.patch(`/sprints/${sprintId}/start`);
  }

  async closeSprint(sprintId: string) {
    return this.client.patch(`/sprints/${sprintId}/close`);
  }

  // Tasks & Kanban API
  async getTasks(params?: any) {
    return this.client.get('/tasks', { params });
  }

  async getTaskDetails(taskId: string) {
    return this.client.get(`/tasks/${taskId}`);
  }

  async createTask(data: any) {
    return this.client.post('/tasks', data);
  }

  async updateTaskStatus(taskId: string, status: string) {
    // BUG-FE-01 intentional defect: Stale closure or optimistic update reversion behavior when network response lags or errors occur without invalidation rollback
    return this.client.patch(`/tasks/${taskId}/status`, { status });
  }

  async updateTask(taskId: string, data: any) {
    return this.client.patch(`/tasks/${taskId}`, data);
  }

  async addTaskComment(taskId: string, content: string) {
    return this.client.post(`/tasks/${taskId}/comments`, { content });
  }

  async toggleSubtask(subtaskId: string, isCompleted: boolean) {
    return this.client.patch(`/tasks/subtasks/${subtaskId}/toggle`, { isCompleted });
  }

  // AI Hub API
  async aiGenerateTasks(prompt: string, projectId?: string) {
    return this.client.post('/ai/task-generator', { prompt, projectId });
  }

  async aiPlanSprint(prompt: string, projectId: string) {
    return this.client.post('/ai/sprint-planner', { prompt, projectId });
  }

  async aiGenerateStory(prompt: string, projectId?: string) {
    return this.client.post('/ai/story-generator', { prompt, projectId });
  }

  async aiSummarizeBug(logs: string, projectId?: string) {
    return this.client.post('/ai/summarize-bug', { logs, projectId });
  }

  async aiPredictRisk(projectContext: string, projectId: string) {
    return this.client.post('/ai/predict-risk', { projectContext, projectId });
  }

  async aiMeetingNotes(transcript: string, projectId?: string) {
    return this.client.post('/ai/meeting-notes', { transcript, projectId });
  }

  async aiSmartSearch(query: string, projectId?: string) {
    return this.client.post('/ai/smart-search', { query, projectId });
  }

  async aiGenerateReport(timeframe: string, projectId?: string) {
    return this.client.post('/ai/generate-report', { timeframe, projectId });
  }

  async aiRagChat(question: string, projectId?: string) {
    return this.client.post('/ai/rag-chat', { question, projectId });
  }

  async aiAssistantChat(message: string, projectId?: string) {
    return this.client.post('/ai/assistant-chat', { message, projectId });
  }

  // Analytics API
  async getDashboardMetrics(teamId?: string) {
    return this.client.get('/analytics/dashboard', { params: { teamId } });
  }

  async getVelocityChart(projectId: string) {
    return this.client.get(`/analytics/velocity/${projectId}`);
  }

  async getTaskDistribution(projectId?: string) {
    return this.client.get('/analytics/distribution', { params: { projectId } });
  }

  // Knowledge API
  async getKnowledgeDocs(projectId?: string) {
    return this.client.get('/knowledge', { params: { projectId } });
  }

  async uploadKnowledgeDoc(data: any) {
    return this.client.post('/knowledge', data);
  }
}

export const api = new ApiClient();
