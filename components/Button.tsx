import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export default function Button({
  moreWrapperStyle = {},
  moreButtonStyle = {},
  moreButtonTextStyle = {},
  text,
  hasShadow = true,
  action,
  isActive = true,
  isDisabled = false,
  color = 'white',
  backgroundColor = 'black',
}: {
  moreWrapperStyle?: ViewStyle;
  moreButtonStyle?: ViewStyle;
  moreButtonTextStyle?: TextStyle;

  text?: string;
  hasShadow?: boolean;
  action: Function;
  isActive?: boolean;
  isDisabled?: boolean;

  color?: string;
  backgroundColor?: string;
}) {
  const onPress = () => {
    if (!isDisabled) {
      action();
    }
  };

  const styles = stylesFunction(color, backgroundColor);
  const disabledStyle = isDisabled ? {opacity: 0.5} : {};
  let mergedWrapperStyle = {
    ...styles.ButtonWrapper,
    ...moreWrapperStyle,
    opacity: isActive ? 1 : 0.5,
  };

  if (hasShadow) {
    mergedWrapperStyle = {...mergedWrapperStyle /*, ...DROP_SHADOW*/};
  }

  const mergedButtonStyle: ViewStyle = {
    ...{
      paddingHorizontal: text ? 20 : 10,
      justifyContent: text ? 'flex-start' : 'center',
    },
    ...styles.Button,
    ...moreButtonStyle,
    ...disabledStyle,
  };

  const mergedButtonTextStyle: TextStyle = {
    ...styles.ButtonText,
    ...(moreButtonTextStyle as {}),
  };

  const androidRipple = isDisabled
    ? {color: backgroundColor}
    : styles.RippleEffect;

  return (
    <View style={mergedWrapperStyle}>
      <Pressable
        style={mergedButtonStyle}
        onPress={onPress}
        android_ripple={androidRipple}>
        {typeof text === 'string' && (
          <Text style={mergedButtonTextStyle}>{text}</Text>
        )}
      </Pressable>
    </View>
  );
}

const stylesFunction = (color: string, backgroundColor: string) =>
  StyleSheet.create({
    ButtonWrapper: {
      overflow: 'hidden',
      borderRadius: 10,
    },
    Button: {
      backgroundColor: backgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 50,
      minHeight: 50,
      padding: 10,
    },
    ButtonText: {
      color: color,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
    },

    RippleEffect: {
      color: color,
    },
  });
