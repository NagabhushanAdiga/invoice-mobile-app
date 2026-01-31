import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

// Full-page loader for screens (Dashboard, InvoiceList, CompanyList, etc.)
export function PageLoader({ text = 'Loading...' }) {
  const { theme } = useTheme();
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.8)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnim = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.8, duration: 600, useNativeDriver: true }),
      ])
    );
    const dotAnim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    spinAnim.start();
    pulseAnim.start();
    dotAnim(dot1, 0).start();
    dotAnim(dot2, 150).start();
    dotAnim(dot3, 300).start();
    return () => {
      spinAnim.stop();
      pulseAnim.stop();
    };
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dotOpacity = (dot) =>
    dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

  return (
    <View style={[styles.pageLoader, { backgroundColor: theme.bg }]}>
      <View style={styles.pageLoaderContent}>
        <View style={styles.ringWrapper}>
          <Animated.View
            style={[
              styles.ringOuter,
              {
                borderColor: theme.surfaceAlt,
                borderTopColor: theme.accent,
                transform: [{ rotate }, { scale: pulse }],
              },
            ]}
          />
          <View style={[styles.iconCircle, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
        </View>
        <Text style={[styles.pageLoaderText, { color: theme.text }]}>{text}</Text>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.loaderDot, { backgroundColor: theme.accent, opacity: dotOpacity(dot1) }]} />
          <Animated.View style={[styles.loaderDot, { backgroundColor: theme.accent, opacity: dotOpacity(dot2) }]} />
          <Animated.View style={[styles.loaderDot, { backgroundColor: theme.accent, opacity: dotOpacity(dot3) }]} />
        </View>
      </View>
    </View>
  );
}

// App initial loading screen
const DOTS = [0, 1, 2];

export function AppLoader() {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={theme.gradientAuth}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logo}>📄</Text>
        </View>
        <Text style={[styles.brand, { color: theme.text }]}>Easy Invoice</Text>
        <View style={styles.dotsRow}>
          {DOTS.map((i) => (
            <Dot key={i} index={i} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

function Dot({ index }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const bounce = Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.3, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.6, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 400, useNativeDriver: true }),
      ]),
    ]);
    const anim = Animated.loop(Animated.sequence([Animated.delay(index * 300), bounce]));
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[styles.dot, { transform: [{ scale }], opacity }]}>
      <LinearGradient
        colors={theme.accentGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dotGradient}
      />
    </Animated.View>
  );
}

// Button loader (Login, Register, PDF download)
export function ButtonLoader({ size = 'default' }) {
  const { theme } = useTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizeStyle = size === 'small' ? styles.smallLoader : styles.defaultLoader;

  return (
    <View style={[styles.buttonLoader, sizeStyle]}>
      <Animated.View
        style={[
          sizeStyle,
          styles.spinnerRing,
          {
            borderColor: theme.surfaceAlt,
            borderTopColor: theme.accent,
            transform: [{ rotate }],
          },
        ]}
      />
    </View>
  );
}

// Inline loader for modals/overlays
export function InlineLoader({ text = 'Loading...' }) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={styles.inlineLoader}>
      <ButtonLoader size="small" />
      <Animated.Text style={[styles.inlineText, { color: theme.text, opacity }]}>{text}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pageLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pageLoaderContent: {
    alignItems: 'center',
  },
  ringWrapper: {
    position: 'relative',
    width: 88,
    height: 88,
    marginBottom: 24,
  },
  ringOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
  },
  iconCircle: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIcon: {
    fontSize: 36,
  },
  pageLoaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 72,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dotGradient: {
    flex: 1,
    borderRadius: 6,
  },
  buttonLoader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultLoader: {
    width: 28,
    height: 28,
  },
  smallLoader: {
    width: 20,
    height: 20,
  },
  spinnerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 3,
  },
  inlineLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inlineText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
