import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COMPANY_INFO } from '../data/invoices';
import { useCompanies } from '../context/CompanyContext';
import { useInvoices } from '../context/InvoiceContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { getTemplateHtml } from '../templates/invoicePdfTemplates';
import { FadeInView, SlideUpView } from '../components/AnimatedView';
import { ButtonLoader } from '../components/Loader.jsx';
import ConfirmDialog from '../components/ConfirmDialog';

export default function InvoiceDetailScreen({ route, navigation }) {
  const { invoice } = route.params;
  const { getCompanyById, toCompanyInfo } = useCompanies();
  const { deleteInvoice } = useInvoices();
  const { openMenu } = useMenu();
  const { theme } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ visible: false, title: '', message: '', variant: 'success' });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const company = invoice.companyId ? getCompanyById(invoice.companyId) : null;
  const companyInfo = company ? toCompanyInfo(company) : COMPANY_INFO;

  const generatePdf = async () => {
    const html = getTemplateHtml('stylish', invoice, companyInfo);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    return uri;
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const uri = await generatePdf();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Download Invoice ${invoice.id}`,
        });
      } else {
        setMessageDialog({ visible: true, title: 'Success', message: 'PDF saved. Check your device files.', variant: 'success' });
      }
    } catch (err) {
      setMessageDialog({ visible: true, title: 'Error', message: err.message || 'Failed to generate PDF', variant: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  const handleSharePdf = async () => {
    setDownloading(true);
    try {
      const uri = await generatePdf();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share Invoice ${invoice.id}`,
        });
        setViewModalVisible(false);
      } else {
        setMessageDialog({ visible: true, title: 'Not Available', message: 'Sharing is not available on this device.', variant: 'warning' });
      }
    } catch (err) {
      setMessageDialog({ visible: true, title: 'Error', message: err.message || 'Failed to share PDF', variant: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteInvoice = () => {
    setDeleteDialogVisible(false);
    deleteInvoice(invoice.id);
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={theme.gradientDetail}
      style={styles.container}
    >
      <FadeInView delay={0} duration={400} style={styles.header}>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: theme.surfaceAlt }]}
          onPress={openMenu}
          activeOpacity={0.7}
        >
          <Text style={[styles.menuIcon, { color: theme.text }]}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrap}>
          <Text style={[styles.backBtn, { color: theme.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{invoice.id}</Text>
        <View style={[styles.badge, styles[`badge_${invoice.status}`]]}>
          <Text style={styles.badgeText}>{invoice.status}</Text>
        </View>
      </FadeInView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SlideUpView delay={100} style={styles.card}>
          <Text style={styles.cardLabel}>Customer</Text>
          <Text style={styles.cardValue}>{invoice.customerName}</Text>
          <Text style={styles.cardSub}>{invoice.customerEmail}</Text>
          <Text style={styles.cardSub}>{invoice.customerAddress}</Text>
        </SlideUpView>

        <SlideUpView delay={150} style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.cardLabel}>Date</Text>
            <Text style={styles.cardValue}>{invoice.date}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.cardLabel}>Due Date</Text>
            <Text style={styles.cardValue}>{invoice.dueDate}</Text>
          </View>
        </SlideUpView>

        <SlideUpView delay={200} style={styles.card}>
          <Text style={styles.cardLabel}>Items</Text>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </SlideUpView>

        <SlideUpView delay={250} style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{invoice.subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>₹{invoice.tax.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>₹{invoice.total.toLocaleString('en-IN')}</Text>
          </View>
        </SlideUpView>

        <SlideUpView delay={280} style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => setViewModalVisible(true)}
          >
            <Text style={styles.viewBtnText}>View Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.downloadBtn, downloading && styles.downloadBtnDisabled]}
            onPress={handleDownloadPdf}
            disabled={downloading}
          >
            {downloading ? (
              <View style={styles.downloadBtnContent}>
                <ButtonLoader size="small" />
                <Text style={styles.downloadBtnText}>Generating...</Text>
              </View>
            ) : (
              <Text style={styles.downloadBtnText}>Download PDF</Text>
            )}
          </TouchableOpacity>
          <View style={styles.shareDeleteRow}>
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: theme.accent }, downloading && styles.downloadBtnDisabled]}
              onPress={handleSharePdf}
              disabled={downloading}
            >
              {downloading ? (
                <View style={styles.downloadBtnContent}>
                  <ButtonLoader size="small" />
                  <Text style={styles.shareBtnText}>...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.shareIcon}>↗</Text>
                  <Text style={styles.shareBtnText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: theme.danger }]}
              onPress={() => setDeleteDialogVisible(true)}
            >
              <Text style={[styles.deleteBtnText, { color: theme.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </SlideUpView>

        <Modal
          visible={viewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setViewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Invoice Preview</Text>
                <Pressable
                  onPress={() => setViewModalVisible(false)}
                  style={styles.modalClose}
                >
                  <Text style={styles.modalCloseText}>✕ Close</Text>
                </Pressable>
              </View>
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.previewDoc}>
                  <View style={styles.previewHeader}>
                    <View>
                      <Text style={styles.previewCompany}>{companyInfo.name}</Text>
                      <Text style={styles.previewCompanyMeta}>
                        {companyInfo.address.replace(/\n/g, ' · ')} · {companyInfo.email} · {companyInfo.phone}
                      </Text>
                    </View>
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>{invoice.id}</Text>
                    </View>
                  </View>
                  <View style={styles.previewContent}>
                    <View style={styles.previewSectionRow}>
                      <View style={styles.previewSection}>
                        <Text style={styles.previewSectionLabel}>Bill To</Text>
                        <Text style={styles.previewSectionValue}>{invoice.customerName}</Text>
                        <Text style={styles.previewSectionSub}>{invoice.customerAddress}</Text>
                        <Text style={styles.previewSectionSub}>{invoice.customerEmail}</Text>
                      </View>
                      <View style={styles.previewSection}>
                        <Text style={styles.previewSectionLabel}>Invoice Details</Text>
                        <Text style={styles.previewMetaLabel}>Date</Text>
                        <Text style={styles.previewMetaValue}>{invoice.date}</Text>
                        <Text style={styles.previewMetaLabel}>Due Date</Text>
                        <Text style={styles.previewMetaValue}>{invoice.dueDate}</Text>
                        <View style={[styles.previewStatusBadge, styles[`previewStatus_${invoice.status}`]]}>
                          <Text style={[styles.previewStatusText, styles[`previewStatusText_${invoice.status}`]]}>{invoice.status}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.previewItemsTitle}>Items</Text>
                    <View style={styles.previewTable}>
                      <View style={styles.previewTableHeader}>
                        <Text style={styles.previewTh}>Description</Text>
                        <Text style={styles.previewTh}>Qty</Text>
                        <Text style={styles.previewTh}>Rate</Text>
                        <Text style={styles.previewTh}>Amount</Text>
                      </View>
                      {invoice.items.map((item, i) => (
                        <View key={i} style={styles.previewTableRow}>
                          <Text style={styles.previewTd}>{item.name}</Text>
                          <Text style={styles.previewTd}>{item.qty}</Text>
                          <Text style={styles.previewTd}>₹{item.rate?.toFixed(2)}</Text>
                          <Text style={[styles.previewTd, styles.previewTdAmount]}>₹{item.amount?.toLocaleString('en-IN')}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.previewTotalsWrap}>
                      <View style={styles.previewTotalRow}>
                        <Text style={styles.previewTotalLabel}>Subtotal</Text>
                        <Text style={styles.previewTotalValue}>₹{invoice.subtotal?.toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={styles.previewTotalRow}>
                        <Text style={styles.previewTotalLabel}>Tax</Text>
                        <Text style={styles.previewTotalValue}>₹{invoice.tax?.toLocaleString('en-IN')}</Text>
                      </View>
                      <View style={styles.previewGrandTotal}>
                        <Text style={styles.previewGrandLabel}>Total</Text>
                        <Text style={styles.previewGrandValue}>₹{invoice.total?.toLocaleString('en-IN')}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.previewFooter}>
                    <Text style={styles.previewFooterText}>Thank you for your business · Easy Invoice</Text>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalShareBtn}
                  onPress={handleSharePdf}
                  disabled={downloading}
                >
                  {downloading ? (
                    <View style={styles.modalShareContent}>
                      <ButtonLoader size="small" />
                      <Text style={styles.modalShareText}>Preparing...</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.modalShareIcon}>↗</Text>
                      <Text style={styles.modalShareText}>Share</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setViewModalVisible(false)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ConfirmDialog
          visible={messageDialog.visible}
          title={messageDialog.title}
          message={messageDialog.message}
          confirmText="OK"
          variant={messageDialog.variant}
          showCancel={false}
          onConfirm={() => setMessageDialog((d) => ({ ...d, visible: false }))}
        />
        <ConfirmDialog
          visible={deleteDialogVisible}
          title="Delete Invoice"
          message={`Are you sure you want to delete ${invoice.id}? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={handleDeleteInvoice}
          onCancel={() => setDeleteDialogVisible(false)}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  backBtnWrap: {
    marginLeft: 12,
  },
  backBtn: {
    fontSize: 16,
    color: '#e94560',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  badge_Paid: { backgroundColor: 'rgba(16, 185, 129, 0.3)' },
  badge_Pending: { backgroundColor: 'rgba(245, 158, 11, 0.3)' },
  badge_Overdue: { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardLabel: {
    fontSize: 12,
    color: '#8892b0',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cardSub: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  rowItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  totalsCard: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderRadius: 6,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#8892b0',
  },
  totalValue: {
    fontSize: 16,
    color: '#fff',
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e94560',
  },
  actionButtons: {
    gap: 12,
  },
  viewBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  viewBtnText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadBtn: {
    backgroundColor: '#e94560',
    borderRadius: 6,
    padding: 18,
    alignItems: 'center',
  },
  downloadBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadBtnDisabled: {
    opacity: 0.7,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  shareDeleteRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareIcon: {
    fontSize: 16,
    color: '#fff',
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  modalScroll: {
    maxHeight: 500,
  },
  modalScrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  previewDoc: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  previewCompany: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  previewCompanyMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    lineHeight: 18,
  },
  previewBadge: {
    backgroundColor: '#e94560',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  previewBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  previewContent: {
    padding: 24,
  },
  previewSectionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  previewSection: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewSectionLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 10,
  },
  previewSectionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  previewSectionSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  previewMetaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  previewMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  previewStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  previewStatus_Paid: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  previewStatus_Pending: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  previewStatus_Overdue: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  previewStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewStatusText_Paid: { color: '#16a34a' },
  previewStatusText_Pending: { color: '#d97706' },
  previewStatusText_Overdue: { color: '#dc2626' },
  previewItemsTitle: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  previewTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  previewTh: {
    flex: 1,
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewTableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  previewTd: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  previewTdAmount: {
    fontWeight: '700',
    color: '#0f172a',
  },
  previewTotalsWrap: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 24,
    alignSelf: 'flex-end',
    minWidth: 280,
  },
  previewTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  previewTotalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  previewTotalValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  previewGrandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  previewGrandLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  previewGrandValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  previewFooter: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  previewFooterText: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
