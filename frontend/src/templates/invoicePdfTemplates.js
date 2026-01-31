/**
 * Predefined PDF templates for invoices.
 * Each template returns HTML string for PDF generation.
 */

export const PDF_TEMPLATES = {
  stylish: {
    id: 'stylish',
    name: 'Stylish',
    description: 'Modern minimalist design with bold accents',
    icon: '✨',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with bold headers',
    icon: '📋',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with accent colors',
    icon: '✨',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    icon: '◻️',
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with borders',
    icon: '💼',
  },
};

export function getTemplateHtml(templateId, invoice, companyInfo) {
  switch (templateId) {
    case 'stylish':
      return stylishTemplate(invoice, companyInfo);
    case 'classic':
      return classicTemplate(invoice, companyInfo);
    case 'modern':
      return modernTemplate(invoice, companyInfo);
    case 'minimal':
      return minimalTemplate(invoice, companyInfo);
    case 'professional':
      return professionalTemplate(invoice, companyInfo);
    default:
      return stylishTemplate(invoice, companyInfo);
  }
}

function stylishTemplate(invoice, company) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 48px; color: #0f172a; font-size: 14px; background: #fafafa; }
    .invoice { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 48px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company-name { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .company-meta { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 10px; line-height: 1.6; }
    .invoice-badge { background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
    .content { padding: 40px 48px; }
    .section-row { display: flex; gap: 32px; margin-bottom: 32px; }
    .section { flex: 1; background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; }
    .section-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 12px; }
    .section-value { font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.5; }
    .section-sub { font-size: 13px; color: #64748b; margin-top: 6px; }
    .meta-grid { display: flex; gap: 24px; margin-bottom: 28px; }
    .meta-item { flex: 1; }
    .meta-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .meta-value { font-size: 14px; font-weight: 600; color: #0f172a; }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
    .status-Paid { background: rgba(34, 197, 94, 0.15); color: #16a34a; }
    .status-Pending { background: rgba(245, 158, 11, 0.15); color: #d97706; }
    .status-Overdue { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
    .items-title { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 14px 20px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; }
    td { padding: 18px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
    td:last-child { font-weight: 700; color: #0f172a; }
    .totals-wrap { width: 320px; margin-left: auto; margin-top: 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; padding: 28px 32px; }
    .total-line { display: flex; justify-content: space-between; font-size: 15px; color: rgba(255,255,255,0.9); margin: 8px 0; }
    .grand-total { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.2); font-size: 24px; font-weight: 800; color: #fff; }
    .footer { padding: 24px 48px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div>
        <div class="company-name">${company.name}</div>
        <div class="company-meta">${company.address.replace(/\n/g, ' · ')} · ${company.email} · ${company.phone}</div>
      </div>
      <div class="invoice-badge">${invoice.id}</div>
    </div>
    <div class="content">
      <div class="section-row">
        <div class="section">
          <div class="section-label">Bill To</div>
          <div class="section-value">${invoice.customerName}</div>
          <div class="section-sub">${invoice.customerAddress.replace(/\n/g, '<br>')}</div>
          <div class="section-sub">${invoice.customerEmail}</div>
        </div>
        <div class="section">
          <div class="section-label">Invoice Details</div>
          <div class="meta-grid">
            <div class="meta-item">
              <div class="meta-label">Date</div>
              <div class="meta-value">${invoice.date}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Due Date</div>
              <div class="meta-value">${invoice.dueDate}</div>
            </div>
          </div>
          <span class="status-badge status-${invoice.status}">${invoice.status}</span>
        </div>
      </div>
      <div class="items-title">Items</div>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr><td>${item.name}</td><td>${item.qty}</td><td>₹${item.rate.toFixed(2)}</td><td>₹${item.amount.toLocaleString('en-IN')}</td></tr>
          `).join('')}
        </tbody>
      </table>
      <div class="totals-wrap">
        <div class="total-line"><span>Subtotal</span><span>₹${invoice.subtotal.toLocaleString('en-IN')}</span></div>
        <div class="total-line"><span>Tax</span><span>₹${invoice.tax.toLocaleString('en-IN')}</span></div>
        <div class="grand-total"><span>Total</span><span>₹${invoice.total.toLocaleString('en-IN')}</span></div>
      </div>
    </div>
    <div class="footer">Thank you for your business${company.name ? ` · ${company.name}` : ''}</div>
  </div>
</body>
</html>
  `;
}

function classicTemplate(invoice, company) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; padding: 40px; color: #2d3748; font-size: 14px; }
    .top-bar { background: #1a1a2e; color: #fff; padding: 20px 32px; margin: -40px -40px 32px -40px; }
    .company { font-size: 26px; font-weight: bold; letter-spacing: 2px; }
    .company-info { margin-top: 6px; font-size: 12px; opacity: 0.9; }
    .invoice-title { font-size: 36px; color: #1a1a2e; font-weight: bold; text-align: center; margin-bottom: 32px; letter-spacing: 4px; }
    .meta-row { display: flex; justify-content: space-between; padding: 24px 0; border-top: 2px solid #1a1a2e; border-bottom: 2px solid #1a1a2e; }
    .label { font-size: 10px; color: #718096; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .value { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 32px 0; border: 2px solid #1a1a2e; }
    th { background: #1a1a2e; color: #fff; padding: 16px 20px; text-align: left; font-weight: 600; font-size: 12px; letter-spacing: 1px; }
    td { padding: 16px 20px; border: 1px solid #e2e8f0; }
    .totals { width: 320px; margin-left: auto; border: 2px solid #1a1a2e; padding: 24px 32px; }
    .total-row { font-size: 15px; margin: 8px 0; }
    .grand-total { font-size: 22px; font-weight: bold; color: #1a1a2e; margin-top: 16px; padding-top: 16px; border-top: 2px solid #1a1a2e; }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="company">${company.name}</div>
    <div class="company-info">${company.address.replace(/\n/g, ' | ')} | ${company.email} | ${company.phone}</div>
  </div>
  <div class="invoice-title">INVOICE ${invoice.id}</div>
  <div class="meta-row">
    <div>
      <div class="label">Bill To</div>
      <div class="value" style="font-weight: bold;">${invoice.customerName}</div>
      <div class="value">${invoice.customerAddress.replace(/\n/g, '<br>')}</div>
      <div class="value">${invoice.customerEmail}</div>
    </div>
    <div style="text-align: right;">
      <div class="label">Date</div>
      <div class="value">${invoice.date}</div>
      <div class="label" style="margin-top: 12px;">Due</div>
      <div class="value">${invoice.dueDate}</div>
      <div class="label" style="margin-top: 12px;">Status</div>
      <div class="value" style="font-weight: bold;">${invoice.status}</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      ${invoice.items.map((item) => `
        <tr><td>${item.name}</td><td>${item.qty}</td><td>₹${item.rate.toFixed(2)}</td><td>₹${item.amount.toLocaleString('en-IN')}</td></tr>
      `).join('')}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row">Subtotal: ₹${invoice.subtotal.toLocaleString('en-IN')}</div>
    <div class="total-row">Tax: ₹${invoice.tax.toLocaleString('en-IN')}</div>
    <div class="grand-total">Total: ₹${invoice.total.toLocaleString('en-IN')}</div>
  </div>
</body>
</html>
  `;
}

function modernTemplate(invoice, company) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 48px; color: #1e293b; font-size: 14px; background: #f8fafc; }
    .wrapper { background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #e94560, #ff6b6b); padding: 40px 48px; display: flex; justify-content: space-between; align-items: center; }
    .company { font-size: 28px; font-weight: 800; color: #fff; }
    .invoice-badge { background: rgba(255,255,255,0.3); color: #fff; padding: 14px 28px; border-radius: 16px; font-size: 18px; font-weight: 700; }
    .content { padding: 40px 48px; }
    .cards { display: flex; gap: 24px; margin-bottom: 32px; }
    .card { flex: 1; background: #f1f5f9; padding: 24px; border-radius: 16px; }
    .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .value { font-size: 15px; font-weight: 600; line-height: 1.5; }
    .items-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #1e293b; }
    .item-row { display: flex; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; align-items: center; }
    .item-row:nth-child(even) { background: #f8fafc; }
    .item-name { font-weight: 600; }
    .item-meta { color: #64748b; font-size: 13px; }
    .item-amount { font-weight: 700; color: #e94560; }
    .totals-box { background: linear-gradient(135deg, #e9456015, #ff6b6b08); border: 2px solid #e9456030; border-radius: 20px; padding: 32px; margin-top: 32px; text-align: right; }
    .total-row { font-size: 16px; margin: 8px 0; }
    .grand-total { font-size: 28px; font-weight: 800; color: #e94560; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="company">${company.name}</div>
      <div class="invoice-badge">${invoice.id}</div>
    </div>
    <div class="content">
      <div style="color: #64748b; font-size: 13px; margin-bottom: 24px;">${company.address.replace(/\n/g, ' · ')} · ${company.email} · ${company.phone}</div>
      <div class="cards">
        <div class="card">
          <div class="label">Bill To</div>
          <div class="value">${invoice.customerName}</div>
          <div class="value" style="font-weight: 400; font-size: 13px; margin-top: 6px;">${invoice.customerAddress.replace(/\n/g, '<br>')}</div>
          <div class="value" style="font-weight: 400; font-size: 13px;">${invoice.customerEmail}</div>
        </div>
        <div class="card">
          <div class="label">Invoice Details</div>
          <div class="value">Date: ${invoice.date}</div>
          <div class="value" style="margin-top: 8px;">Due: ${invoice.dueDate}</div>
          <div class="value" style="margin-top: 8px; color: #e94560;">${invoice.status}</div>
        </div>
      </div>
      <div class="items-title">Items</div>
      ${invoice.items.map((item) => `
        <div class="item-row">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">${item.qty} × ₹${item.rate.toFixed(2)}</div>
          </div>
          <div class="item-amount">₹${item.amount.toLocaleString('en-IN')}</div>
        </div>
      `).join('')}
      <div class="totals-box">
        <div class="total-row">Subtotal ₹${invoice.subtotal.toLocaleString('en-IN')}</div>
        <div class="total-row">Tax ₹${invoice.tax.toLocaleString('en-IN')}</div>
        <div class="grand-total">₹${invoice.total.toLocaleString('en-IN')}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function minimalTemplate(invoice, company) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 80px 120px; color: #334155; font-size: 14px; line-height: 2; max-width: 560px; margin: 0 auto; }
    .line { border-bottom: 1px solid #e2e8f0; margin: 24px 0; }
    .company { font-size: 20px; font-weight: 400; color: #0f172a; letter-spacing: 3px; }
    .meta { font-size: 12px; color: #94a3b8; margin-top: 8px; }
    .invoice-num { font-size: 11px; color: #94a3b8; letter-spacing: 2px; margin-top: 40px; }
    .billto { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-top: 32px; margin-bottom: 8px; }
    .item-line { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .item-detail { color: #64748b; font-size: 12px; }
    .total-line { display: flex; justify-content: space-between; padding: 16px 0; font-size: 14px; }
    .grand { font-size: 24px; font-weight: 400; color: #0f172a; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="company">${company.name}</div>
  <div class="meta">${company.address.replace(/\n/g, ' / ')} / ${company.email} / ${company.phone}</div>
  <div class="line"></div>
  <div class="invoice-num">${invoice.id}</div>
  <div class="meta">${invoice.date} · Due ${invoice.dueDate} · ${invoice.status}</div>
  <div class="billto">Bill to</div>
  <div>${invoice.customerName}</div>
  <div class="meta">${invoice.customerAddress.replace(/\n/g, ', ')}</div>
  <div class="meta">${invoice.customerEmail}</div>
  <div class="line"></div>
  ${invoice.items.map((item) => `
    <div class="item-line">
      <div>
        <div>${item.name}</div>
        <div class="item-detail">${item.qty} × ₹${item.rate.toFixed(2)}</div>
      </div>
      <div>₹${item.amount.toLocaleString('en-IN')}</div>
    </div>
  `).join('')}
  <div class="total-line"><span>Subtotal</span><span>₹${invoice.subtotal.toLocaleString('en-IN')}</span></div>
  <div class="total-line"><span>Tax</span><span>₹${invoice.tax.toLocaleString('en-IN')}</span></div>
  <div class="total-line grand"><span>Total</span><span>₹${invoice.total.toLocaleString('en-IN')}</span></div>
</body>
</html>
  `;
}

function professionalTemplate(invoice, company) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', 'Times New Roman', serif; color: #1e293b; font-size: 13px; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 220px; background: #1e293b; color: #fff; padding: 40px 28px; }
    .sidebar .company { font-size: 18px; font-weight: bold; line-height: 1.4; }
    .sidebar .info { font-size: 11px; margin-top: 20px; line-height: 1.8; opacity: 0.9; }
    .main { flex: 1; padding: 40px 48px; }
    .invoice-header { border-bottom: 3px solid #1e293b; padding-bottom: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
    .invoice-title { font-size: 24px; font-weight: bold; color: #1e293b; }
    .invoice-meta { text-align: right; font-size: 12px; }
    .two-col { display: flex; gap: 48px; margin-bottom: 32px; }
    .col { flex: 1; }
    .label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .value { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; color: #475569; padding: 14px 18px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #e2e8f0; }
    td { padding: 14px 18px; border: 1px solid #e2e8f0; }
    .totals-table { width: 280px; margin-left: auto; margin-top: 24px; }
    .totals-table td { padding: 12px 18px; }
    .totals-table .grand td { font-size: 18px; font-weight: bold; background: #1e293b; color: #fff; border-color: #1e293b; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="sidebar">
      <div class="company">${company.name}</div>
      <div class="info">${company.address.replace(/\n/g, '<br>')}<br><br>${company.email}<br>${company.phone}</div>
    </div>
    <div class="main">
      <div class="invoice-header">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-meta">
          <div style="font-weight: bold;">${invoice.id}</div>
          <div>Date: ${invoice.date}</div>
          <div>Due: ${invoice.dueDate}</div>
          <div>Status: ${invoice.status}</div>
        </div>
      </div>
      <div class="two-col">
        <div class="col">
          <div class="label">Bill To</div>
          <div class="value" style="font-weight: bold;">${invoice.customerName}</div>
          <div class="value">${invoice.customerAddress.replace(/\n/g, '<br>')}</div>
          <div class="value">${invoice.customerEmail}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
        <tbody>
          ${invoice.items.map((item) => `
            <tr><td>${item.name}</td><td>${item.qty}</td><td>₹${item.rate.toFixed(2)}</td><td>₹${item.amount.toLocaleString('en-IN')}</td></tr>
          `).join('')}
        </tbody>
      </table>
      <table class="totals-table">
        <tr><td>Subtotal</td><td style="text-align: right;">₹${invoice.subtotal.toLocaleString('en-IN')}</td></tr>
        <tr><td>Tax</td><td style="text-align: right;">₹${invoice.tax.toLocaleString('en-IN')}</td></tr>
        <tr class="grand"><td>Total</td><td style="text-align: right;">₹${invoice.total.toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>
</body>
</html>
  `;
}
