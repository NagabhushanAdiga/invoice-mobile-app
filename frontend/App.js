import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CompanyProvider } from './src/context/CompanyContext';
import { InvoiceProvider } from './src/context/InvoiceContext';
import { MenuProvider } from './src/context/MenuContext';
import { AppLoader } from './src/components/Loader.jsx';
import MenuModal from './src/components/MenuModal.jsx';
import LoginScreen from './src/screens/LoginScreen.jsx';
import RegisterScreen from './src/screens/RegisterScreen.jsx';
import DashboardScreen from './src/screens/DashboardScreen.jsx';
import InvoiceListScreen from './src/screens/InvoiceListScreen.jsx';
import InvoiceDetailScreen from './src/screens/InvoiceDetailScreen.jsx';
import CreateInvoiceScreen from './src/screens/CreateInvoiceScreen.jsx';
import CompanyListScreen from './src/screens/CompanyListScreen.jsx';
import CreateCompanyScreen from './src/screens/CreateCompanyScreen.jsx';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen.jsx';
import { toastConfig } from './src/components/ToastConfig.jsx';

const Stack = createNativeStackNavigator();

function MainStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
      <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      <Stack.Screen name="CompanyList" component={CompanyListScreen} />
      <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator({ navigationRef }) {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainStack} />
      </Stack.Navigator>
      <MenuModal navigationRef={navigationRef} />
    </>
  );
}

function AppContent() {
  const navigationRef = useRef(null);

  return (
    <AuthProvider>
      <CompanyProvider>
        <InvoiceProvider>
          <MenuProvider>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator navigationRef={navigationRef} />
              <StatusBar style="dark" />
            </NavigationContainer>
          </MenuProvider>
        </InvoiceProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <>
        <AppContent />
        <Toast config={toastConfig} />
      </>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
