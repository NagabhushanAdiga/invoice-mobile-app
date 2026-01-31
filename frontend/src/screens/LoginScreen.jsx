import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ButtonLoader } from '../components/Loader.jsx';
import { FadeInView, SlideDownView } from '../components/AnimatedView';
import { toast } from '../utils/toast';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error || 'Invalid credentials', 'Login Failed');
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInView delay={200} duration={600} style={styles.header}>
            <View style={[styles.logoWrapper, { backgroundColor: theme.accentMuted }]}>
              <Text style={styles.logo}>📄</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Easy Invoice</Text>
            <Text style={[styles.subtitle, { color: theme.textHint }]}>Manage your invoices with ease</Text>
          </FadeInView>

          <SlideDownView delay={400} style={[styles.formCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>Welcome back</Text>
            <Text style={[styles.formSubtitle, { color: theme.textHint }]}>Sign in to continue</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonWrap, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={theme.accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {loading ? (
                  <ButtonLoader />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={[styles.registerText, { color: theme.textHint }]}>Don't have an account? </Text>
              <Text style={[styles.registerLink, { color: theme.accent }]}>Register</Text>
            </TouchableOpacity>
          </SlideDownView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoWrapper: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: { fontSize: 44 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonWrap: { marginTop: 8 },
  button: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 8,
  },
  registerText: { fontSize: 15 },
  registerLink: { fontSize: 15, fontWeight: '700' },
});
