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

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name.', 'Required');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email.', 'Required');
      return;
    }
    if (!password) {
      toast.error('Please enter a password.', 'Required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.', 'Invalid');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', 'Mismatch');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error || 'Could not create account', 'Registration Failed');
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
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textHint }]}>Register to manage your invoices</Text>
          </FadeInView>

          <SlideDownView delay={400} style={[styles.formCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>Get started</Text>
            <Text style={[styles.formSubtitle, { color: theme.textHint }]}>Fill in your details below</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="John Doe"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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
                placeholder="Min 6 characters"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Confirm Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="Re-enter password"
                placeholderTextColor={theme.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonWrap, loading && styles.buttonDisabled]}
              onPress={handleRegister}
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
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={[styles.linkText, { color: theme.textHint }]}>Already have an account? </Text>
              <Text style={[styles.linkLink, { color: theme.accent }]}>Sign In</Text>
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
    padding: 24,
    paddingTop: 48,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: { fontSize: 36 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
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
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
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
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 8,
  },
  linkText: { fontSize: 15 },
  linkLink: { fontSize: 15, fontWeight: '700' },
});
