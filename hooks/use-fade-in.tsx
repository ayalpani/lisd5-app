import {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

export default function useFadeIn() {
  const animOpacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animOpacityValue, {
      useNativeDriver: true,
      toValue: 100,
      duration: 250,
    }).start();
  }, [animOpacityValue]);

  return animOpacityValue;
}
