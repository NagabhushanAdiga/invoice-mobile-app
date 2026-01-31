import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompanyContext = createContext(null);
const STORAGE_KEY = 'invoice_app_companies';

const DEFAULT_COMPANIES = [
  {
    id: 'comp-1',
    name: 'Easy Invoice',
    gstin: '29AABCU9603R1ZM',
    website: 'www.invoicepro.com',
    address: '100 Commerce Street\nNew York, NY 10001',
    mobile: '+1 (555) 123-4567',
    email: 'invoices@invoicepro.com',
    logo: null,
  },
];

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    }
  }, [companies, loading]);

  const loadCompanies = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompanies(JSON.parse(stored));
      } else {
        setCompanies(DEFAULT_COMPANIES);
      }
    } catch (e) {
      setCompanies(DEFAULT_COMPANIES);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = (company) => {
    const id = `comp-${Date.now()}`;
    const newCompany = { ...company, id };
    setCompanies((prev) => [newCompany, ...prev]);
    return id;
  };

  const updateCompany = (id, updates) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCompany = (id) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const getCompanyById = (id) => companies.find((c) => c.id === id);

  const toCompanyInfo = (company) => ({
    name: company?.name || 'Company',
    address: company?.address || '',
    email: company?.email || '',
    phone: company?.mobile || '',
    website: company?.website || '',
    gstin: company?.gstin || '',
    logo: company?.logo || null,
  });

  return (
    <CompanyContext.Provider
      value={{
        companies,
        loading,
        addCompany,
        updateCompany,
        deleteCompany,
        getCompanyById,
        toCompanyInfo,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanies() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompanies must be used within CompanyProvider');
  return ctx;
}
