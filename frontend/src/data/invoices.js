// Static invoice data
export const INVOICES = [
  {
    id: 'INV-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001',
    date: '2025-01-15',
    dueDate: '2025-02-15',
    status: 'Paid',
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
    customerName: 'TechStart Inc',
    customerEmail: 'accounts@techstart.io',
    customerAddress: '456 Innovation Blvd\nSan Francisco, CA 94102',
    date: '2025-01-20',
    dueDate: '2025-02-20',
    status: 'Pending',
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
    customerName: 'Global Solutions Ltd',
    customerEmail: 'finance@globalsolutions.com',
    customerAddress: '789 Enterprise Way\nLondon, UK EC1A 1BB',
    date: '2025-01-25',
    dueDate: '2025-02-25',
    status: 'Overdue',
    items: [
      { name: 'Consulting Services', qty: 50, rate: 200, amount: 10000 },
      { name: 'Training Sessions', qty: 10, rate: 250, amount: 2500 },
    ],
    subtotal: 12500,
    tax: 1000,
    total: 13500,
  },
];

export const COMPANY_INFO = {
  name: 'Easy Invoice',
  address: '100 Commerce Street\nNew York, NY 10001',
  email: 'invoices@invoicepro.com',
  phone: '+1 (555) 123-4567',
};
