const express = require('express');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const { isValidObjectId } = require('../utils/validators');

const router = express.Router();

// All routes require auth
router.use(auth);

// Map document to frontend format (id instead of _id)
const toResponse = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id?.toString(),
    name: obj.name,
    gstin: obj.gstin,
    website: obj.website,
    address: obj.address,
    mobile: obj.mobile,
    email: obj.email,
    logo: obj.logo,
  };
};

// GET / - List all companies for user
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(companies.map(toResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get company by id
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid company id.' });
    }
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.json(toResponse(company));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Create company
router.post('/', async (req, res) => {
  try {
    const { name, gstin, website, address, mobile, email, logo } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Company name is required.' });
    }
    const company = new Company({
      userId: req.user._id,
      name: name.trim(),
      gstin: gstin?.trim() || undefined,
      website: website?.trim() || undefined,
      address: address?.trim() || undefined,
      mobile: mobile?.trim() || undefined,
      email: email?.trim() || undefined,
      logo: logo || null,
    });
    await company.save();
    res.status(201).json(toResponse(company));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /:id - Update company
router.patch('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid company id.' });
    }
    const { name, gstin, website, address, mobile, email, logo } = req.body;
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(name !== undefined && { name: name.trim() }),
        ...(gstin !== undefined && { gstin: gstin?.trim() || undefined }),
        ...(website !== undefined && { website: website?.trim() || undefined }),
        ...(address !== undefined && { address: address?.trim() || undefined }),
        ...(mobile !== undefined && { mobile: mobile?.trim() || undefined }),
        ...(email !== undefined && { email: email?.trim() || undefined }),
        ...(logo !== undefined && { logo: logo || null }),
      },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.json(toResponse(company));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /:id - Delete company
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid company id.' });
    }
    const hasInvoices = await Invoice.exists({ companyId: req.params.id, userId: req.user._id });
    if (hasInvoices) {
      return res.status(400).json({
        error: 'Cannot delete company with existing invoices. Delete or reassign invoices first.',
      });
    }
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
