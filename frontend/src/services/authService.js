import { apiFetch, setToken } from './api';

export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.success && data.token) {
    await setToken(data.token);
    return { success: true, user: data.user };
  }
  return { success: false, error: data.error || 'Login failed' };
}

export async function register(name, email, password) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data.success && data.token) {
    await setToken(data.token);
    return { success: true, user: data.user };
  }
  return { success: false, error: data.error || 'Registration failed' };
}

export async function getMe() {
  const data = await apiFetch('/api/auth/me');
  return data.user;
}

export async function changePassword(currentPassword, newPassword) {
  const data = await apiFetch('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return data;
}
