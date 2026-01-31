import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from './ConfirmDialog';

const MENU_ITEMS = [
  { name: 'Dashboard', screen: 'Dashboard', icon: '🏠' },
  { name: 'Invoices', screen: 'InvoiceList', icon: '📄' },
  { name: 'Create Invoice', screen: 'CreateInvoice', icon: '➕' },
  { name: 'Companies', screen: 'CompanyList', icon: '🏢' },
  { name: 'Create Company', screen: 'CreateCompany', icon: '➕' },
];

export default function MenuModal({ navigationRef }) {
  const { logout } = useAuth();
  const { visible, closeMenu } = useMenu();
  const { theme } = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleNavigate = (screen) => {
    closeMenu();
    // MainStack screens are nested under 'Main'
    navigationRef.current?.navigate('Main', { screen });
  };

  const handleLogout = () => {
    closeMenu();
    // Show confirm dialog after menu closes so it's visible on top
    setTimeout(() => setLogoutVisible(true), 300);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    closeMenu();
    logout();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <Pressable style={[styles.menu, { backgroundColor: theme.menuBg }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Text style={styles.logo}>📄</Text>
              <Text style={[styles.title, { color: theme.accent }]}>Easy Invoice</Text>
            </View>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.screen}
                  style={styles.menuItem}
                  onPress={() => handleNavigate(item.screen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={[styles.menuText, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <TouchableOpacity
                style={styles.logoutItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: 280,
    height: '100%',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  logo: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
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
    fontWeight: '500',
  },
  divider: {
    height: 1,
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
