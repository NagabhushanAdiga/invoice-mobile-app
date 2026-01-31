import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useInvoices } from '../context/InvoiceContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideInItem } from '../components/AnimatedView';
import { PageLoader } from '../components/Loader.jsx';

const STATUS_COLORS = {
  Paid: { gradient: ['#8b5cf6', '#7c3aed'], accent: '#a78bfa' },
  Pending: { gradient: ['#06b6d4', '#0891b2'], accent: '#22d3ee' },
  Overdue: { gradient: ['#ec4899', '#db2777'], accent: '#f472b6' },
};

export default function InvoiceListScreen({ navigation }) {
  const { invoices, loading } = useInvoices();
  const { openMenu } = useMenu();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <PageLoader text="Loading invoices..." />;
  }

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase().trim();
    return invoices.filter(
      (inv) =>
        inv.customerName?.toLowerCase().includes(q) ||
        inv.id?.toLowerCase().includes(q) ||
        inv.status?.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);
  const renderItem = ({ item, index }) => {
    const colors = STATUS_COLORS[item.status] || STATUS_COLORS.Pending;
    return (
      <SlideInItem index={index}>
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => navigation.navigate('InvoiceDetail', { invoice: item })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[`${colors.gradient[0]}30`, `${colors.gradient[1]}15`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderLeftColor: colors.gradient[0] }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.invoiceId, { color: colors.accent }]}>{item.id}</Text>
              <View style={[styles.badge, { backgroundColor: `${colors.gradient[0]}50` }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={[styles.customer, { color: theme.text }]}>{item.customerName}</Text>
            <Text style={[styles.date, { color: theme.textHint }]}>{item.date}</Text>
            <Text style={[styles.total, { color: colors.accent }]}>₹{item.total.toLocaleString('en-IN')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SlideInItem>
    );
  };

  return (
    <LinearGradient
      colors={theme.gradientList}
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
        <View style={styles.headerCenter}>
        <Text style={[styles.title, { color: theme.text }]}>All Invoices</Text>
        <Text style={[styles.subtitle, { color: theme.textHint }]}>{invoices.length} invoices</Text>
        </View>
      </FadeInView>

      <View style={[styles.searchWrap, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, ID or status..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredInvoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 6,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  customer: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
});
