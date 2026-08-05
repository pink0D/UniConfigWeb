const isDevelopment = import.meta.env.DEV;

class ApiService {
  static async fetchConfig(endpoint) {
    const url = isDevelopment ? `${endpoint}.json` : endpoint;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch config from ${endpoint}: ${response.status}`);
    }
    return response.json();
  }

  static async saveConfig(endpoint, data) {
    if (isDevelopment) {
      // In development mode, simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ok: true, status: 200 };
    }
    const response = await fetch(endpoint, {
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