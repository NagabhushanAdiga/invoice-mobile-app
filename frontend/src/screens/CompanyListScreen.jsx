import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompanies } from '../context/CompanyContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideInItem } from '../components/AnimatedView';
import { PageLoader } from '../components/Loader.jsx';

export default function CompanyListScreen({ navigation }) {
  const { companies, loading } = useCompanies();
  const { openMenu } = useMenu();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <PageLoader text="Loading companies..." />;
  }

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    const q = searchQuery.toLowerCase().trim();
    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q)
    );
  }, [companies, searchQuery]);

  const renderItem = ({ item, index }) => (
    <SlideInItem index={index}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => navigation.navigate('CreateCompany', { company: item, edit: true })}
        activeOpacity={0.9}
      >
        <View style={styles.cardRow}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.accentMuted }]}>
              <Text style={[styles.logoText, { color: theme.accent }]}>{item.name?.charAt(0) || '?'}</Text>
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={[styles.companyName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.companyDetail, { color: theme.textHint }]}>{item.email}</Text>
            {item.gstin ? (
              <Text style={[styles.companyGstin, { color: theme.textSecondary }]}>GSTIN: {item.gstin}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </SlideInItem>
  );

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
          <Text style={[styles.title, { color: theme.text }]}>Companies</Text>
          <Text style={[styles.subtitle, { color: theme.textHint }]}>{companies.length} companies</Text>
        </View>
      </FadeInView>

      <View style={[styles.searchWrap, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, email or GSTIN..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCompanies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>No companies yet. Create one!</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCompany')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={theme.accentGradient}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>+ Add Company</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    paddingBottom: 100,
  },
  card: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  companyDetail: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 4,
  },
  companyGstin: {
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fabGradient: {
    padding: 18,
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
