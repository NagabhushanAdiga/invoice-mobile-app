import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export function FadeInView({ children, delay = 0, duration = 400, style }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}

export function SlideUpView({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function SlideDownView({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function FadeInItem({ children, index = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    const delay = index * 80;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function SlideInItem({ children, index = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

export function ScalePressable({ children, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  };

  return (
    <Animated.View
      style={[style, { transform: [{ scale }] }]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
}

export function PulseView({ children, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
