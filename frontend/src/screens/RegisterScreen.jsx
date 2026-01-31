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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ButtonLoader } from '../components/Loader.jsx';
import { FadeInView, SlideDownView } from '../components/AnimatedView';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email.');
      return;
    }
    if (!password) {
      Alert.alert('Required', 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Could not create account');
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
          <Text style={[styles.title, { color: theme.accent }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textHint }]}>Register to manage your invoices</Text>
        </FadeInView>

        <SlideDownView delay={400} style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="Full Name"
            placeholderTextColor={theme.textHint}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
            placeholder="Password (min 6 characters)"
            placeholderTextColor={theme.textHint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.textHint}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ButtonLoader />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.linkText, { color: theme.textHint }]}>Already have an account? Sign In</Text>
          </TouchableOpacity>
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
    marginBottom: 40,
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  form: {
    gap: 14,
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
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 14,
  },
});
