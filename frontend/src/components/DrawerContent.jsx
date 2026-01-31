import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

export default function DrawerContent(props) {
  const { logout } = useAuth();
  const { navigation } = props;
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    logout();
  };

  const menuItems = [
    { name: 'Dashboard', screen: 'Dashboard', icon: '🏠' },
    { name: 'Invoices', screen: 'InvoiceList', icon: '📄' },
    { name: 'Create Invoice', screen: 'CreateInvoice', icon: '➕' },
    { name: 'Companies', screen: 'CompanyList', icon: '🏢' },
    { name: 'Create Company', screen: 'CreateCompany', icon: '➕' },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>📄</Text>
        <Text style={styles.title}>Easy Invoice</Text>
      </View>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Main', { screen: item.screen });
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.logoutItem}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={logoutVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutVisible(false)}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c0c14',
  },
  content: {
    paddingTop: 56,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  logo: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e94560',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
    marginHorizontal: 24,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  logoutText: {
    fontSize: 16,
    color: '#f87171',
    fontWeight: '600',
  },
});
