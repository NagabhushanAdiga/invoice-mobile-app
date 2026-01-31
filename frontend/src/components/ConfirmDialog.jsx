import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const VARIANTS = {
  danger: {
    icon: '🚪',
    accent: '#ef4444',
    gradient: ['#ef4444', '#dc2626'],
    iconBg: 'rgba(239, 68, 68, 0.2)',
  },
  success: {
    icon: '✓',
    accent: '#22c55e',
    gradient: ['#22c55e', '#16a34a'],
    iconBg: 'rgba(34, 197, 94, 0.2)',
  },
  error: {
    icon: '!',
    accent: '#ef4444',
    gradient: ['#ef4444', '#dc2626'],
    iconBg: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    icon: '⚠',
    accent: '#f59e0b',
    gradient: ['#f59e0b', '#d97706'],
    iconBg: 'rgba(245, 158, 11, 0.2)',
  },
  info: {
    icon: 'ℹ',
    accent: '#3b82f6',
    gradient: ['#3b82f6', '#2563eb'],
    iconBg: 'rgba(59, 130, 246, 0.2)',
  },
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  showCancel = true,
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const v = VARIANTS[variant] || VARIANTS.info;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.8);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]} pointerEvents="none" />
        <Pressable style={styles.backdropTouch} onPress={handleCancel} />
        <View style={styles.dialogWrap} pointerEvents="box-none">
          <Pressable onPress={() => {}}>
            <Animated.View
            style={[
              styles.dialog,
              {
                backgroundColor: theme.dialogBg,
                borderColor: theme.border,
                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: v.iconBg }]}>
              <Text style={styles.icon}>{v.icon}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
            <View style={[styles.buttons, !showCancel && styles.buttonsSingle]}>
              {showCancel && (
                <Pressable
                  style={[styles.cancelBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
                  onPress={handleCancel}
                  android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
                >
                  <Text style={[styles.cancelText, { color: theme.textSecondary }]}>{cancelText}</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.confirmBtnWrap, !showCancel && styles.confirmBtnFull]}
                onPress={handleConfirm}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <LinearGradient
                  colors={v.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  dialogWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    width: width - 48,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  buttonsSingle: {
    justifyContent: 'center',
  },
  confirmBtnFull: {
    flex: 1,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtnWrap: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
