import { apiFetch } from './api';

export async function getInvoices() {
  return apiFetch('/api/invoices');
}

export async function getInvoice(id) {
  return apiFetch(`/api/invoices/${id}`);
}

export async function createInvoice(invoice) {
  return apiFetch('/api/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  });
}

export async function updateInvoice(id, updates) {
  return apiFetch(`/api/invoices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteInvoice(id) {
  return apiFetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
}

export async function markInvoiceAsPaid(id) {
  return apiFetch(`/api/invoices/${id}/mark-paid`, {
    method: 'PUT',
  });
}
