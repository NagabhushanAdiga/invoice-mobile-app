import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InvoiceContext = createContext(null);
const STORAGE_KEY = 'invoice_app_invoices';

const DEFAULT_INVOICES = [
  {
    id: 'INV-001',
    companyId: 'comp-1',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001',
    date: '2025-01-15',
    dueDate: '2025-02-15',
    status: 'Paid',
    taxPercentage: 8,
    items: [
      { name: 'Web Development Services', qty: 40, rate: 125, amount: 5000 },
      { name: 'UI/UX Design', qty: 20, rate: 100, amount: 2000 },
    ],
    subtotal: 7000,
    tax: 560,
    total: 7560,
  },
  {
    id: 'INV-002',
    companyId: 'comp-1',
    customerName: 'TechStart Inc',
    customerEmail: 'accounts@techstart.io',
    customerAddress: '456 Innovation Blvd\nSan Francisco, CA 94102',
    date: '2025-01-20',
    dueDate: '2025-02-20',
    status: 'Pending',
    taxPercentage: 8,
    items: [
      { name: 'Mobile App Development', qty: 80, rate: 150, amount: 12000 },
      { name: 'API Integration', qty: 15, rate: 120, amount: 1800 },
    ],
    subtotal: 13800,
    tax: 1104,
    total: 14904,
  },
  {
    id: 'INV-003',
    companyId: 'comp-1',
    customerName: 'Global Solutions Ltd',
    customerEmail: 'finance@globalsolutions.com',
    customerAddress: '789 Enterprise Way\nLondon, UK EC1A 1BB',
    date: '2025-01-25',
    dueDate: '2025-02-25',
    status: 'Overdue',
    taxPercentage: 8,
    items: [
      { name: 'Consulting Services', qty: 50, rate: 200, amount: 10000 },
      { name: 'Training Sessions', qty: 10, rate: 250, amount: 2500 },
    ],
    subtotal: 12500,
    tax: 1000,
    total: 13500,
  },
];

function computeTotals(items, taxPercentage) {
  const subtotal = items.reduce((sum, i) => sum + (i.amount || i.qty * i.rate), 0);
  const tax = Math.round(subtotal * (taxPercentage || 0) / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    }
  }, [invoices, loading]);

  const loadInvoices = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInvoices(JSON.parse(stored));
      } else {
        setInvoices(DEFAULT_INVOICES);
      }
    } catch (e) {
      setInvoices(DEFAULT_INVOICES);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = (invoice) => {
    const items = invoice.items.map((i) => ({
      ...i,
      amount: i.amount ?? i.qty * i.rate,
    }));
    const { subtotal, tax, total } = computeTotals(items, invoice.taxPercentage ?? 0);
    const id = `INV-${String(Date.now()).slice(-6)}`;
    const newInvoice = {
      ...invoice,
      id,
      items,
      subtotal,
      tax,
      total,
      status: invoice.status || 'Pending',
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoice = (id, updates) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const merged = { ...inv, ...updates };
        if (updates.items || updates.taxPercentage !== undefined) {
          const items = (updates.items ?? merged.items).map((i) => ({
            ...i,
            amount: i.amount ?? i.qty * i.rate,
          }));
          const { subtotal, tax, total } = computeTotals(
            items,
            updates.taxPercentage ?? merged.taxPercentage ?? 0
          );
          return { ...merged, items, subtotal, tax, total };
        }
        return merged;
      })
    );
  };

  const getInvoiceById = (id) => invoices.find((i) => i.id === id);

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
        computeTotals,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider');
  return ctx;
}
