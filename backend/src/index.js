const { validateEnv } = require('./config/env');
validateEnv();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const invoiceRoutes = require('./routes/invoices');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // For base64 logos

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Invoice API is running' });
});

app.get('/', (req, res) => {
  res.redirect('/api/health');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ error: message });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Connect DB and start server (local) or export for Vercel serverless
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  connectDB().catch((err) => console.error('MongoDB connect error:', err));
  module.exports = app;
} else {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
