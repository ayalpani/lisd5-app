import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  Loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'deepskyblue',
  },
});

export default function Loading({doHide}: {doHide: boolean}) {
  const animValueHide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (doHide) {
      Animated.timing(animValueHide, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [animValueHide, doHide]);

  const opacity = animValueHide.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      style={[styles.Loading, {opacity}]}
      pointerEvents={doHide ? 'none' : 'auto'}>
      <View>
        <ActivityIndicator size={100} color="rgba(255,255,255,0.5)" />
      </View>
    </Animated.View>
  );
}
