import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as companyService from '../services/companyService';

const CompanyContext = createContext(null);

export function CompanyProvider({ children }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCompanies();
    } else {
      setCompanies([]);
      setLoading(false);
    }
  }, [user]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (e) {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (company) => {
    try {
      const newCompany = await companyService.createCompany(company);
      setCompanies((prev) => [newCompany, ...prev]);
      return newCompany.id;
    } catch (e) {
      throw e;
    }
  };

  const updateCompany = async (id, updates) => {
    try {
      const updated = await companyService.updateCompany(id, updates);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (e) {
      throw e;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await companyService.deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      throw e;
    }
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
