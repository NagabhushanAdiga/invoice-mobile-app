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
import { useMenu } from '../context/MenuContext';
import { ButtonLoader } from '../components/Loader.jsx';
import { FadeInView, SlideDownView } from '../components/AnimatedView';
import { toast } from '../utils/toast';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { changePassword } = useAuth();
  const { openMenu } = useMenu();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields', 'Change Password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters', 'Change Password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match', 'Change Password');
      return;
    }
    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);
    if (result.success) {
      toast.success('Password updated successfully', 'Change Password');
      navigation.goBack();
    } else {
      toast.error(result.error || 'Failed to change password', 'Change Password');
    }
  };

  return (
    <LinearGradient
      colors={theme.gradientAuth}
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrap}>
          <Text style={[styles.backBtn, { color: theme.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Change Password</Text>
      </FadeInView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SlideDownView delay={200} style={[styles.formCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.formTitle, { color: theme.text }]}>Update your password</Text>
            <Text style={[styles.formSubtitle, { color: theme.textHint }]}>Enter your current password and choose a new one</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Current Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>New Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textHint }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonWrap, loading && styles.buttonDisabled]}
              onPress={handleChangePassword}
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
                  <Text style={styles.buttonText}>Update Password</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </SlideDownView>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: { fontSize: 22, fontWeight: '600' },
  backBtnWrap: { marginLeft: 12 },
  backBtn: { fontSize: 16, fontWeight: '600' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', marginLeft: 12 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
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
});
