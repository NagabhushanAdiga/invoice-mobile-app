/**
 * Seed script - creates demo user, companies, and invoices.
 * Run: node scripts/seed.js
 * Requires: MONGODB_URI and JWT_SECRET in .env
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Company = require('../src/models/Company');
const Invoice = require('../src/models/Invoice');

const DEMO_EMAIL = 'user@invoice.com';
const DEMO_PASSWORD = 'password123';

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is required. Copy .env.example to .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve)
    await User.deleteMany({});
    await Company.deleteMany({});
    await Invoice.deleteMany({});

    // Create demo user (password hashed by User model)
    const user = await User.create({
      name: 'John Doe',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    console.log('Created user:', user.email);

    // Create demo company
    const company = await Company.create({
      userId: user._id,
      name: 'Easy Invoice',
      gstin: '29AABCU9603R1ZM',
      website: 'www.invoicepro.com',
      address: '100 Commerce Street\nNew York, NY 10001',
      mobile: '+1 (555) 123-4567',
      email: 'invoices@invoicepro.com',
      logo: null,
    });
    console.log('Created company:', company.name);

    // Create demo invoices
    const invoices = [
      {
        userId: user._id,
        companyId: company._id,
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
        userId: user._id,
        companyId: company._id,
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
        userId: user._id,
        companyId: company._id,
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

    for (const inv of invoices) {
      const doc = new Invoice(inv);
      await doc.save();
      console.log('Created invoice:', doc.invoiceId);
    }

    console.log('\nSeed complete!');
    console.log('Demo login: email =', DEMO_EMAIL, ', password =', DEMO_PASSWORD);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
