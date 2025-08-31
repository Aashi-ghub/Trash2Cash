// API Client for Trash2Cash Backend
// Deployed backend URL
const API_BASE_URL = 'https://trash2cash-j8zs.onrender.com';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  details?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'host' | 'operator' | 'device';
  display_name: string;
  contact_phone?: string;
  contact_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Bin {
  id: string;
  bin_code: string;
  user_id: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface BinEvent {
  id: string;
  bin_id: string;
  user_id: string;
  timestamp_utc: string;
  categories: {
    plastic: number;
    paper: number;
    metal: number;
    glass: number;
    organic: number;
  };
  payload_json: any;
  hv_count: number;
  lv_count: number;
  org_count: number;
  battery_pct: number;
  fill_level_pct: number;
  weight_kg_total: number;
  weight_kg_delta: number;
  created_at: string;
}

export interface AnalyticsInsights {
  bin_id: string;
  insights: string[];
  recommendations: string[];
  generated_at: string;
}

export interface AnalyticsAnomalies {
  bin_id: string;
  anomalies: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    detected_at: string;
  }>;
}

export interface RewardsSummary {
  total_points: number;
  monthly_points: number;
  items_recycled: number;
  co2_saved: number;
  rank: string;
  next_rank_points: number;
}

export interface DashboardStats {
  total_bins: number;
  active_bins: number;
  total_collections: number;
  monthly_revenue: number;
  avg_fill_level: number;
  top_performing_bin: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('trash2cash_token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create a basic error response
        data = {
          status: 'error',
          message: `Server returned ${response.status}: ${response.statusText}`
        };
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          data: data
        });
        
        return {
          status: 'error',
          message: data.message || data.msg || `HTTP error! status: ${response.status}`,
          details: data.details || data.error || response.statusText
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication API
  async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ token: string }>> {
    return this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/api/users/me');
  }

  // Users API
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/api/users');
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/api/users/${userId}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Bins API
  async getBins(): Promise<ApiResponse<Bin[]>> {
    return this.request('/api/bins');
  }

  async getBin(binId: string): Promise<ApiResponse<Bin>> {
    return this.request(`/api/bins/${binId}`);
  }

  async getBinsByUser(userId: string): Promise<ApiResponse<Bin[]>> {
    return this.request(`/api/bins/user/${userId}`);
  }

  async createBin(binData: Partial<Bin>): Promise<ApiResponse<Bin>> {
    return this.request('/api/bins', {
      method: 'POST',
      body: JSON.stringify(binData),
    });
  }

  async updateBin(binId: string, binData: Partial<Bin>): Promise<ApiResponse<Bin>> {
    return this.request(`/api/bins/${binId}`, {
      method: 'PUT',
      body: JSON.stringify(binData),
    });
  }

  async deleteBin(binId: string): Promise<ApiResponse> {
    return this.request(`/api/bins/${binId}`, {
      method: 'DELETE',
    });
  }

  async getBinStats(binId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/bins/${binId}/stats`);
  }

  // Events API
  async getEvents(params?: {
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<BinEvent[]>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const endpoint = `/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getEvent(eventId: string): Promise<ApiResponse<BinEvent>> {
    return this.request(`/api/events/${eventId}`);
  }

  async getEventsByBin(binId: string): Promise<ApiResponse<BinEvent[]>> {
    return this.request(`/api/events/bin/${binId}`);
  }

  async createEvent(eventData: Partial<BinEvent>): Promise<ApiResponse<BinEvent>> {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async createBulkEvents(events: Partial<BinEvent>[]): Promise<ApiResponse<BinEvent[]>> {
    return this.request('/api/events/bulk', {
      method: 'POST',
      body: JSON.stringify({ events }),
    });
  }

  async updateEvent(eventId: string, eventData: Partial<BinEvent>): Promise<ApiResponse<BinEvent>> {
    return this.request(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: string): Promise<ApiResponse> {
    return this.request(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Analytics API
  async getAnalyticsInsights(binId: string): Promise<ApiResponse<AnalyticsInsights>> {
    return this.request(`/api/analytics/insights/${binId}`);
  }

  async getAnalyticsAnomalies(binId: string): Promise<ApiResponse<AnalyticsAnomalies>> {
    return this.request(`/api/analytics/anomalies/${binId}`);
  }

  async getRewardsHistory(): Promise<ApiResponse<any[]>> {
    return this.request('/api/analytics/rewards/me');
  }

  async getRewardsSummary(): Promise<ApiResponse<RewardsSummary>> {
    return this.request('/api/analytics/rewards/summary');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/api/analytics/dashboard-stats/me');
  }

  async redeemReward(rewardName: string, pointsCost: number): Promise<ApiResponse<any>> {
    return this.request('/api/analytics/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({
        reward_name: rewardName,
        points_cost: pointsCost,
      }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
