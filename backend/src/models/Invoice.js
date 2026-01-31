const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
  amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true },
    customerAddress: { type: String, trim: true },
    date: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Overdue'] },
    taxPercentage: { type: Number, default: 0 },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
  if (this.isNew && !this.invoiceId) {
    this.invoiceId = `INV-${String(Date.now()).slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
