import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompanies } from '../context/CompanyContext';
import { useInvoices } from '../context/InvoiceContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideUpView } from '../components/AnimatedView';
import { PageLoader } from '../components/Loader.jsx';

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
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('8');
  const [items, setItems] = useState([
    { name: '', qty: 1, rate: 0, amount: 0 },
  ]);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

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

  const handleSave = () => {
    if (!companyId) {
      Alert.alert('Required', 'Please select a company.');
      return;
    }
    if (!customerName.trim()) {
      Alert.alert('Required', 'Please enter customer name.');
      return;
    }
    const validItems = items.filter((i) => i.name.trim());
    if (validItems.length === 0) {
      Alert.alert('Required', 'Please add at least one item.');
      return;
    }
    const invoice = {
      companyId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress: customerAddress.trim(),
      date,
      dueDate: dueDate || date,
      taxPercentage: parseFloat(taxPercentage) || 0,
      items: validItems.map((i) => ({
        name: i.name.trim(),
        qty: Number(i.qty) || 0,
        rate: Number(i.rate) || 0,
        amount: (Number(i.qty) || 0) * (Number(i.rate) || 0),
      })),
    };
    const created = addInvoice(invoice);
    Alert.alert('Success', 'Invoice created.');
    navigation.navigate('InvoiceDetail', { invoice: created });
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
          <Text style={styles.label}>Company</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowCompanyPicker(true)}
          >
            <Text style={styles.pickerText}>
              {selectedCompany?.name || 'Select company'}
            </Text>
          </TouchableOpacity>
        </SlideUpView>

        <SlideUpView delay={150} style={styles.section}>
          <Text style={styles.label}>Customer Name *</Text>
          <TextInput
            style={styles.input}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer name"
            placeholderTextColor={theme.textMuted}
          />
        </SlideUpView>

        <SlideUpView delay={200} style={styles.section}>
          <Text style={styles.label}>Customer Email</Text>
          <TextInput
            style={styles.input}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="email@example.com"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
          />
        </SlideUpView>

        <SlideUpView delay={250} style={styles.section}>
          <Text style={styles.label}>Customer Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={customerAddress}
            onChangeText={setCustomerAddress}
            placeholder="Address"
            placeholderTextColor={theme.textMuted}
            multiline
          />
        </SlideUpView>

        <SlideUpView delay={300} style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Due Date</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </SlideUpView>

        <SlideUpView delay={350} style={styles.section}>
          <Text style={styles.label}>Tax %</Text>
          <TextInput
            style={styles.input}
            value={taxPercentage}
            onChangeText={setTaxPercentage}
            placeholder="8"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
          />
        </SlideUpView>

        <SlideUpView delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Items</Text>
            <TouchableOpacity onPress={addItem}>
              <Text style={styles.addItem}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <TextInput
                style={[styles.input, styles.itemName]}
                value={item.name}
                onChangeText={(v) => updateItem(i, 'name', v)}
                placeholder="Description"
                placeholderTextColor={theme.textMuted}
              />
              <TextInput
                style={[styles.input, styles.itemQty]}
                value={String(item.qty)}
                onChangeText={(v) => updateItem(i, 'qty', v)}
                placeholder="Qty"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
              />
              <TextInput
                style={[styles.input, styles.itemRate]}
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Company</Text>
            {companies.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.modalItem}
                onPress={() => {
                  setCompanyId(c.id);
                  setShowCompanyPicker(false);
                }}
              >
                <Text style={styles.modalItemText}>{c.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCompanyPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
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
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: { minHeight: 60 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  rowItem: { flex: 1 },
  picker: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pickerText: {
    color: '#fff',
    fontSize: 16,
  },
  addItem: {
    color: '#e94560',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
});
