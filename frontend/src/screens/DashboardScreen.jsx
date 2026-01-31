import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../context/InvoiceContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideUpView, FadeInItem } from '../components/AnimatedView';
import { PageLoader } from '../components/Loader.jsx';

const STAT_COLORS = [
  { bg: '#dcfce7', accent: '#16a34a', label: 'Total Revenue' },
  { bg: '#dbeafe', accent: '#2563eb', label: 'Paid Invoices' },
  { bg: '#fef3c7', accent: '#d97706', label: 'Pending' },
];

const STATUS_STYLES = {
  Paid: { accent: '#22c55e', icon: '✓' },
  Pending: { accent: '#3b82f6', icon: '⏳' },
  Overdue: { accent: '#ef4444', icon: '!' },
};

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { invoices, loading } = useInvoices();
  const { openMenu } = useMenu();
  const { theme } = useTheme();

  if (loading) {
    return (
      <PageLoader text="Loading dashboard..." />
    );
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidCount = invoices.filter((inv) => inv.status === 'Paid').length;
  const pendingCount = invoices.filter((inv) => inv.status === 'Pending').length;

  const stats = [
    { value: `₹${totalRevenue.toLocaleString('en-IN')}`, ...STAT_COLORS[0] },
    { value: paidCount.toString(), ...STAT_COLORS[1] },
    { value: pendingCount.toString(), ...STAT_COLORS[2] },
  ];

  const recentInvoices = invoices.slice(0, 4);

  const getStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.Pending;

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
        <View style={styles.headerCenter} />
        <TouchableOpacity
          style={[styles.createInvoiceBtn, { backgroundColor: theme.accentMuted }]}
          onPress={() => navigation.navigate('CreateInvoice')}
          activeOpacity={0.7}
        >
          <Text style={[styles.createInvoiceBtnText, { color: theme.accentLight }]}>+ Create Invoice</Text>
        </TouchableOpacity>
      </FadeInView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SlideUpView delay={50} style={styles.welcomeSection}>
          <Text style={[styles.greeting, { color: theme.textMuted }]}>Welcome back</Text>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'}</Text>
        </SlideUpView>
        <SlideUpView delay={100} style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <FadeInItem key={stat.label} index={index} style={styles.statCard}>
              <View style={[styles.statInner, { backgroundColor: stat.bg, borderColor: theme.border }]}>
                <Text style={[styles.statValue, { color: stat.accent }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            </FadeInItem>
          ))}
        </SlideUpView>

        <SlideUpView delay={200} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Invoices</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('InvoiceList')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={[styles.seeAll, { color: theme.accent }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentInvoices.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surfaceMuted, borderColor: theme.borderLight }]}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No invoices yet</Text>
              <TouchableOpacity
                style={[styles.createBtn, { backgroundColor: theme.accentMuted }]}
                onPress={() => navigation.navigate('CreateInvoice')}
              >
                <Text style={[styles.createBtnText, { color: theme.accent }]}>Create Invoice</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.invoiceGrid}>
              {recentInvoices.map((inv, index) => {
                const s = getStyle(inv.status);
                return (
                  <FadeInItem key={inv.id} index={index} style={styles.invoiceCardWrapper}>
                    <TouchableOpacity
                      style={[styles.invoiceCard, { backgroundColor: theme.surface, borderColor: theme.borderLight }]}
                      onPress={() =>
                        navigation.navigate('InvoiceDetail', { invoice: inv })
                      }
                      activeOpacity={0.8}
                    >
                      <View style={[styles.invoiceAccent, { backgroundColor: s.accent }]} />
                      <View style={styles.invoiceBody}>
                        <View style={styles.invoiceTop}>
                          <Text style={[styles.invoiceId, { color: s.accent }]} numberOfLines={1}>
                            {inv.id}
                          </Text>
                          <View style={[styles.badge, { backgroundColor: `${s.accent}22` }]}>
                            <Text style={[styles.badgeText, { color: s.accent }]}>
                              {inv.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.invoiceCustomer, { color: theme.textSecondary }]} numberOfLines={1}>{inv.customerName}</Text>
                        <Text style={[styles.invoiceTotal, { color: s.accent }]}>
                          ₹{inv.total.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </FadeInItem>
                );
              })}
            </View>
          )}
        </SlideUpView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  createInvoiceBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  createInvoiceBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
  },
  statInner: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 15,
    marginBottom: 12,
  },
  createBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  createBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  invoiceGrid: {
    gap: 10,
  },
  invoiceCardWrapper: {
    width: '100%',
  },
  invoiceCard: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  invoiceAccent: {
    width: 4,
  },
  invoiceBody: {
    flex: 1,
    padding: 14,
  },
  invoiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceId: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  invoiceCustomer: {
    fontSize: 15,
    marginTop: 6,
  },
  invoiceTotal: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },
});
