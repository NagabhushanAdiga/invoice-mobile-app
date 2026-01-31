import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ButtonLoader } from '../components/Loader.jsx';
import { FadeInView, SlideDownView } from '../components/AnimatedView';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [email, setEmail] = useState('user@invoice.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  return (
    <LinearGradient
      colors={theme.gradientAuth}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <FadeInView delay={200} duration={600} style={styles.header}>
          <Text style={styles.logo}>📄</Text>
          <Text style={[styles.title, { color: theme.accent }]}>Easy Invoice</Text>
          <Text style={[styles.subtitle, { color: theme.textHint }]}>Manage your invoices with ease</Text>
        </FadeInView>

        <SlideDownView delay={400} style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="Email"
            placeholderTextColor={theme.textHint}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="Password"
            placeholderTextColor={theme.textHint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ButtonLoader />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.registerText, { color: theme.accent }]}>Don't have an account? Register</Text>
          </TouchableOpacity>
          <Text style={[styles.hint, { color: theme.textHint }]}>Demo: user@invoice.com / password123</Text>
        </SlideDownView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  input: {
    borderRadius: 6,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 6,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
