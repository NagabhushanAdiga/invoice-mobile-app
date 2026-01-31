import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompanies } from '../context/CompanyContext';
import { useInvoices } from '../context/InvoiceContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideUpView } from '../components/AnimatedView';
import { PageLoader } from '../components/Loader.jsx';
import { toast } from '../utils/toast';

export default function CreateInvoiceScreen({ navigation }) {
  const { companies, loading: companiesLoading } = useCompanies();
  const { addInvoice } = useInvoices();
  const { openMenu } = useMenu();
  const { theme } = useTheme();

  if (companiesLoading) {
    return <PageLoader text="Loading form..." />;
  }
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(today);
  const [dueDate, setDueDate] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState('8');
  const [items, setItems] = useState([
    { name: '', qty: 1, rate: 0, amount: 0 },
  ]);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState(null); // 'date' | 'dueDate' | null

  const formatDate = (d) => (d ? d.toISOString().slice(0, 10) : '');

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setDatePickerMode(null);
    if (event.type === 'dismissed') return;
    if (datePickerMode === 'date') {
      setDate(selectedDate || date);
    } else if (datePickerMode === 'dueDate') {
      setDueDate(selectedDate || dueDate);
    }
  };

  const selectedCompany = companies.find((c) => c.id === companyId);

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      updated[index].amount = (updated[index].qty || 0) * (updated[index].rate || 0);
    }
    setItems(updated);
  };

  const handleSave = async () => {
    if (!companyId) {
      toast.error('Please select a company.', 'Required');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Please enter customer name.', 'Required');
      return;
    }
    const validItems = items.filter((i) => i.name.trim());
    if (validItems.length === 0) {
      toast.error('Please add at least one item.', 'Required');
      return;
    }
    const invoice = {
      companyId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress: customerAddress.trim(),
      date: formatDate(date),
      dueDate: formatDate(dueDate || date),
      taxPercentage: parseFloat(taxPercentage) || 0,
      items: validItems.map((i) => ({
        name: i.name.trim(),
        qty: Number(i.qty) || 0,
        rate: Number(i.rate) || 0,
        amount: (Number(i.qty) || 0) * (Number(i.rate) || 0),
      })),
    };
    try {
      const created = await addInvoice(invoice);
      toast.success('Invoice created.');
      navigation.navigate('InvoiceDetail', { invoice: created });
    } catch (e) {
      toast.error(e.data?.error || e.message || 'Failed to create invoice.');
    }
  };

  return (
    <LinearGradient
      colors={theme.gradient}
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
        <Text style={[styles.title, { color: theme.text }]}>Create Invoice</Text>
      </FadeInView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SlideUpView delay={100} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Company</Text>
          <TouchableOpacity
            style={[styles.picker, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
            onPress={() => setShowCompanyPicker(true)}
          >
            <Text style={[styles.pickerText, { color: theme.text }]}>
              {selectedCompany?.name || 'Select company'}
            </Text>
          </TouchableOpacity>
        </SlideUpView>

        <SlideUpView delay={150} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Customer Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer name"
            placeholderTextColor={theme.textMuted}
          />
        </SlideUpView>

        <SlideUpView delay={200} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Customer Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="email@example.com"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
          />
        </SlideUpView>

        <SlideUpView delay={250} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Customer Address</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={customerAddress}
            onChangeText={setCustomerAddress}
            placeholder="Address"
            placeholderTextColor={theme.textMuted}
            multiline
          />
        </SlideUpView>

        <SlideUpView delay={300} style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={[styles.label, { color: theme.textHint }]}>Date</Text>
            <TouchableOpacity
              style={[styles.picker, styles.pickerRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              onPress={() => setDatePickerMode('date')}
              activeOpacity={0.7}
            >
              <Text style={[styles.pickerText, { color: theme.text }]}>
                {formatDate(date)}
              </Text>
              <Text style={styles.pickerIcon}>📅</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.label, { color: theme.textHint }]}>Due Date</Text>
            <TouchableOpacity
              style={[styles.picker, styles.pickerRow, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
              onPress={() => setDatePickerMode('dueDate')}
              activeOpacity={0.7}
            >
              <Text style={[styles.pickerText, { color: dueDate ? theme.text : theme.textMuted }]}>
                {formatDate(dueDate) || 'Select due date'}
              </Text>
              <Text style={styles.pickerIcon}>📅</Text>
            </TouchableOpacity>
          </View>
        </SlideUpView>

        {datePickerMode && (
          Platform.OS === 'ios' ? (
            <Modal visible transparent animationType="slide">
              <Pressable style={styles.datePickerOverlay} onPress={() => setDatePickerMode(null)}>
                <Pressable style={[styles.datePickerModal, { backgroundColor: theme.dialogBg }]} onPress={() => {}}>
                  <View style={[styles.datePickerHeader, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => setDatePickerMode(null)}>
                      <Text style={[styles.datePickerDone, { color: theme.accent }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={datePickerMode === 'date' ? date : (dueDate || date)}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={datePickerMode === 'dueDate' ? date : undefined}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          ) : (
            <DateTimePicker
              value={datePickerMode === 'date' ? date : (dueDate || date)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={datePickerMode === 'dueDate' ? date : undefined}
            />
          )
        )}

        <SlideUpView delay={350} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Tax %</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={taxPercentage}
            onChangeText={setTaxPercentage}
            placeholder="8"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
          />
        </SlideUpView>

        <SlideUpView delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.label, { color: theme.textHint }]}>Items</Text>
            <TouchableOpacity onPress={addItem}>
              <Text style={[styles.addItem, { color: theme.accent }]}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <TextInput
                style={[styles.input, styles.itemName, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={item.name}
                onChangeText={(v) => updateItem(i, 'name', v)}
                placeholder="Description"
                placeholderTextColor={theme.textMuted}
              />
              <TextInput
                style={[styles.input, styles.itemQty, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={String(item.qty)}
                onChangeText={(v) => updateItem(i, 'qty', v)}
                placeholder="Qty"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
              />
              <TextInput
                style={[styles.input, styles.itemRate, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                value={String(item.rate)}
                onChangeText={(v) => updateItem(i, 'rate', v)}
                placeholder="Rate (₹)"
                placeholderTextColor={theme.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          ))}
        </SlideUpView>

        <SlideUpView delay={450}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Create Invoice</Text>
          </TouchableOpacity>
        </SlideUpView>
      </ScrollView>

      <Modal
        visible={showCompanyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCompanyPicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.dialogBg }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Company</Text>
            {companies.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.modalItem, { borderBottomColor: theme.border }]}
                onPress={() => {
                  setCompanyId(c.id);
                  setShowCompanyPicker(false);
                }}
              >
                <Text style={[styles.modalItemText, { color: theme.text }]}>{c.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalClose, { borderTopColor: theme.border }]}
              onPress={() => setShowCompanyPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.accent }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  backBtnWrap: {
    marginLeft: 12,
  },
  backBtn: {
    fontSize: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: { minHeight: 60 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  rowItem: { flex: 1 },
  picker: {
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
  },
  pickerIcon: {
    fontSize: 18,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
  },
  datePickerDone: {
    fontSize: 17,
    fontWeight: '600',
  },
  addItem: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  itemName: { flex: 2 },
  itemQty: { flex: 0.6 },
  itemRate: { flex: 1 },
  saveBtn: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
