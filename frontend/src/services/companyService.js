import { apiFetch } from './api';

export async function getCompanies() {
  return apiFetch('/api/companies');
}

export async function getCompany(id) {
  return apiFetch(`/api/companies/${id}`);
}

export async function createCompany(company) {
  return apiFetch('/api/companies', {
    method: 'POST',
    body: JSON.stringify(company),
  });
}

export async function updateCompany(id, updates) {
  return apiFetch(`/api/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteCompany(id) {
  return apiFetch(`/api/companies/${id}`, {
    method: 'DELETE',
  });
}
