import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useMemo} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import useFadeIn from '../hooks/use-fade-in';
import config from '../lib/config';

const stylesImageSelectionOrder = StyleSheet.create({
  ImageSelectionOrder: {
    position: 'absolute',
    right: 10,
    top: 10,

    width: 30,
    height: 30,

    borderWidth: 5,
    borderRadius: 15,
    color: config.colors.w100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageSelectionOrderText: {color: 'rgba(255,255,255,1)'},
});

function ImageSelectionOrder({
  isSelected,
  order,
}: {
  isSelected: boolean;
  order: number | undefined;
}) {
  const styleSelected = {
    borderColor: isSelected ? config.colors.y100 : config.colors.w100,
    backgroundColor: isSelected ? config.colors.b5 : 'transparent',
  };

  return (
    <View
      style={[stylesImageSelectionOrder.ImageSelectionOrder, styleSelected]}>
      {(isSelected || order) && (
        <Text style={stylesImageSelectionOrder.ImageSelectionOrderText}>
          {order || (
            <FontAwesomeIcon
              icon={faCheck}
              color={config.colors.y100}
              size={10}
            />
          )}
        </Text>
      )}
    </View>
  );
}

function SuperImage({
  uri,
  innerEdgeSize,
  isSelected = false,
  selectionOrder,
  margin = 5,
}: {
  uri: string;
  innerEdgeSize: number;
  isSelected?: boolean;
  selectionOrder?: number;
  margin?: number;
}) {
  const animOpacityValue = useFadeIn();

  // TODO check if render triggers children to rerender too
  const styles = StyleSheet.create({
    SuperImageWrapper: {margin},
    SuperImage: {
      borderWidth: margin,
      borderRadius: 2 * margin,
      borderColor: isSelected ? config.colors.y100 : 'transparent',
      backgroundColor: config.colors.b25,
    },
    Image: {
      borderRadius: margin,
      width: innerEdgeSize - 2 * margin,
      height: innerEdgeSize - 2 * margin,
      overflow: 'hidden',
    },
  });

  const styleAnimated = useMemo(
    () => ({
      opacity: animOpacityValue.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
      }),
    }),
    [animOpacityValue],
  );

  console.log({uri, size: innerEdgeSize - 2 * margin});
  return (
    <Animated.View style={[styles.SuperImageWrapper /*, styleAnimated*/]}>
      <View style={styles.SuperImage}>
        <Image style={styles.Image} source={{uri}} resizeMode={'cover'} />
      </View>
      <ImageSelectionOrder order={selectionOrder} isSelected={isSelected} />
    </Animated.View>
  );
}

export default React.memo(SuperImage);
