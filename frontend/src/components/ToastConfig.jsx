import React from 'react';
import { Dimensions } from 'react-native';
import Toast, { BaseToast } from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DARK_THEME = {
  success: { bg: '#0d2818', border: '#22c55e', icon: '#22c55e' },
  error: { bg: '#1c0a0a', border: '#ef4444', icon: '#ef4444' },
  info: { bg: '#0f172a', border: '#3b82f6', icon: '#3b82f6' },
};

const CustomToast = (props) => {
  const type = props.type || 'info';
  const colors = DARK_THEME[type] || DARK_THEME.info;
  return (
    <BaseToast
      {...props}
      style={{
        width: SCREEN_WIDTH,
        alignSelf: 'stretch',
        borderLeftColor: colors.border,
        backgroundColor: colors.bg,
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
      }}
      text2Style={{
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
      }}
    />
  );
};

export const toastConfig = {
  success: (props) => <CustomToast {...props} type="success" />,
  error: (props) => <CustomToast {...props} type="error" />,
  info: (props) => <CustomToast {...props} type="info" />,
};
