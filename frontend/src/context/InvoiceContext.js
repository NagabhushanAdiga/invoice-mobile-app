import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as invoiceService from '../services/invoiceService';

const InvoiceContext = createContext(null);

function computeTotals(items, taxPercentage) {
  const subtotal = items.reduce((sum, i) => sum + (i.amount ?? i.qty * i.rate), 0);
  const tax = Math.round(subtotal * (taxPercentage || 0) / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function InvoiceProvider({ children }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInvoices();
    } else {
      setInvoices([]);
      setLoading(false);
    }
  }, [user]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (e) {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice) => {
    const items = invoice.items.map((i) => ({
      ...i,
      amount: i.amount ?? i.qty * i.rate,
    }));
    const payload = {
      ...invoice,
      items,
      status: invoice.status || 'Pending',
    };
    const newInvoice = await invoiceService.createInvoice(payload);
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoice = async (id, updates) => {
    const updated = await invoiceService.updateInvoice(id, updates);
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? updated : inv))
    );
    return updated;
  };

  const markAsPaid = async (id) => {
    const updated = await invoiceService.markInvoiceAsPaid(id);
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? updated : inv))
    );
    return updated;
  };

  const getInvoiceById = (id) => invoices.find((i) => i.id === id);

  const deleteInvoice = async (id) => {
    await invoiceService.deleteInvoice(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
        addInvoice,
        updateInvoice,
        markAsPaid,
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
