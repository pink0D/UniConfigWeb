const isDevelopment = import.meta.env.DEV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

class ApiService {
  static _buildUrl(endpoint, isGet) {
    if (isDevelopment) {
      if (apiBaseUrl) {
        return `${apiBaseUrl}${endpoint}`;
      }
      // Fallback to local JSON files when no API base URL is configured
      return isGet ? `${endpoint}.json` : endpoint;
    }
    return endpoint;
  }

  static async fetchConfig(endpoint) {
    const url = ApiService._buildUrl(endpoint, true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch config from ${endpoint}: ${response.status}`);
    }
    return response.json();
  }

  static async saveConfig(endpoint, data) {
    if (isDevelopment && !apiBaseUrl) {
      // In development mode without a real backend, simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ok: true, status: 200 };
    }
    const url = ApiService._buildUrl(endpoint, false);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }
}

export default ApiService;