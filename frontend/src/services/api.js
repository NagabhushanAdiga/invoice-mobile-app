import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'invoice_app_token';

// Use env or fallback: local dev vs production
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || data.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (e) {
    if (e.message === 'Network request failed' || e.name === 'TypeError') {
      const hint = API_BASE_URL.includes('localhost')
        ? ' On a real device, set EXPO_PUBLIC_API_URL to your computer\'s IP (e.g. http://192.168.1.x:3000) in frontend/.env'
        : '';
      throw new Error(`Cannot reach server at ${API_BASE_URL}.${hint} Ensure backend is running and device is on same WiFi.`);
    }
    throw e;
  }
}
