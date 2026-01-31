const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    gstin: { type: String, trim: true }, // optional
    website: { type: String, trim: true }, // optional
    address: { type: String, trim: true },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true },
    logo: { type: String, default: null }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
