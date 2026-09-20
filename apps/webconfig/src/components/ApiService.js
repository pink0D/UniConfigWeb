const isDevelopment = import.meta.env.DEV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

class ApiService {
  static _buildUrl(endpoint, isGet) {
    if (isDevelopment) {
      if (apiBaseUrl) {
        return `${apiBaseUrl}${endpoint}`;
      }
      // Root config: load from config.json when no apiBaseUrl
      if (isGet && endpoint === '/config') {
        return 'config.json';
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
      return data;
    }
    const url = ApiService._buildUrl(endpoint, false);
    // 1. POST — response body is ignored
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(errorText || `Failed to save config: ${postResponse.status}`);
    }
    // 2. GET — authoritative state from server
    const getResponse = await fetch(ApiService._buildUrl(endpoint, true));
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch config after save: ${getResponse.status}`);
    }
    return getResponse.json();
  }
}

export default ApiService;