const express = require('express');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Company = require('../models/Company');
const auth = require('../middleware/auth');
const { isValidObjectId } = require('../utils/validators');

const router = express.Router();

// All routes require auth
router.use(auth);

function computeTotals(items, taxPercentage) {
  const subtotal = items.reduce((sum, i) => sum + (i.amount ?? i.qty * i.rate), 0);
  const tax = Math.round((subtotal * (taxPercentage || 0)) / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// Map document to frontend format
const toResponse = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj.invoiceId || obj._id?.toString(),
    companyId: obj.companyId?.toString(),
    customerName: obj.customerName,
    customerEmail: obj.customerEmail,
    customerAddress: obj.customerAddress,
    date: obj.date,
    dueDate: obj.dueDate,
    status: obj.status,
    taxPercentage: obj.taxPercentage,
    items: obj.items || [],
    subtotal: obj.subtotal,
    tax: obj.tax,
    total: obj.total,
  };
};

// GET / - List all invoices for user
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('companyId', 'name');
    res.json(invoices.map(toResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get invoice by id (invoiceId or _id)
router.get('/:id', async (req, res) => {
  try {
    const query = isValidObjectId(req.params.id)
      ? { _id: new mongoose.Types.ObjectId(req.params.id), userId: req.user._id }
      : { invoiceId: req.params.id, userId: req.user._id };
    const invoice = await Invoice.findOne(query).populate('companyId');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.json(toResponse(invoice));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create invoice
router.post('/', async (req, res) => {
  try {
    const { companyId, customerName, customerEmail, customerAddress, date, dueDate, taxPercentage, items } = req.body;
    if (!companyId || !customerName?.trim()) {
      return res.status(400).json({ error: 'Company and customer name are required.' });
    }
    if (!isValidObjectId(companyId)) {
      return res.status(400).json({ error: 'Invalid company id.' });
    }
    const company = await Company.findOne({ _id: companyId, userId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    const validItems = (items || []).filter((i) => i?.name?.trim()).map((i) => ({
      name: i.name.trim(),
      qty: Number(i.qty) || 0,
      rate: Number(i.rate) || 0,
      amount: i.amount ?? (Number(i.qty) || 0) * (Number(i.rate) || 0),
    }));
    if (validItems.length === 0) {
      return res.status(400).json({ error: 'At least one item is required.' });
    }
    const { subtotal, tax, total } = computeTotals(validItems, taxPercentage ?? 0);
    const invoice = new Invoice({
      userId: req.user._id,
      companyId,
      customerName: customerName.trim(),
      customerEmail: customerEmail?.trim() || undefined,
      customerAddress: customerAddress?.trim() || undefined,
      date: date || new Date().toISOString().slice(0, 10),
      dueDate: dueDate || date || new Date().toISOString().slice(0, 10),
      taxPercentage: taxPercentage ?? 0,
      items: validItems,
      subtotal,
      tax,
      total,
      status: req.body.status || 'Pending',
    });
    await invoice.save();
    res.status(201).json(toResponse(invoice));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /:id - Update invoice
router.patch('/:id', async (req, res) => {
  try {
    const query = isValidObjectId(req.params.id)
      ? { _id: new mongoose.Types.ObjectId(req.params.id), userId: req.user._id }
      : { invoiceId: req.params.id, userId: req.user._id };

    const existing = await Invoice.findOne(query);
    if (!existing) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    const updates = { ...req.body };
    if (updates.items || updates.taxPercentage !== undefined) {
      const items = (updates.items || existing.items).map((i) => ({
        name: i.name,
        qty: Number(i.qty) || 0,
        rate: Number(i.rate) || 0,
        amount: i.amount ?? (Number(i.qty) || 0) * (Number(i.rate) || 0),
      }));
      const { subtotal, tax, total } = computeTotals(items, updates.taxPercentage ?? existing.taxPercentage);
      updates.items = items;
      updates.subtotal = subtotal;
      updates.tax = tax;
      updates.total = total;
    }
    delete updates.userId;
    delete updates.companyId;
    delete updates._id;
    delete updates.invoiceId;

    const invoice = await Invoice.findOneAndUpdate(query, updates, { new: true });
    res.json(toResponse(invoice));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id/mark-paid - Mark invoice as paid
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const query = isValidObjectId(req.params.id)
      ? { _id: new mongoose.Types.ObjectId(req.params.id), userId: req.user._id }
      : { invoiceId: req.params.id, userId: req.user._id };
    const invoice = await Invoice.findOneAndUpdate(
      query,
      { status: 'Paid' },
      { new: true }
    ).populate('companyId');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.json(toResponse(invoice));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const query = isValidObjectId(req.params.id)
      ? { _id: new mongoose.Types.ObjectId(req.params.id), userId: req.user._id }
      : { invoiceId: req.params.id, userId: req.user._id };
    const invoice = await Invoice.findOneAndDelete(query);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
