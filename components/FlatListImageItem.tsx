import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import config from '../lib/config';
import SuperImage from './SuperImage';

const styles = StyleSheet.create({
  // CameraPreview: {
  //   borderColor: 'yellow',
  //   borderWidth: 1,
  //   margin: 2 * imageMargin,
  //   width: styleImageEdgeLength - 2 * imageMargin,
  //   height: styleImageEdgeLength - 2 * imageMargin,
  //   overflow: 'hidden',
  // },
  Pressable: {
    flex: 1,
  },
});

function FlatListImageItem({
  imageUri,
  index,
  onSelect = () => null,
  isSelected,
  imageMargin,
  innerEdgeSize,
}: {
  imageUri: string;
  index: number;
  onSelect?: (index: number) => void;
  isSelected?: boolean;
  imageMargin: number;
  innerEdgeSize: number;
}) {
  console.log('render FlatListImageItem', {
    imageUri,
    index,
    isSelected,
  });

  // if (image.uri === 'camera_preview') {
  //   return (
  //     <View style={styles.CameraPreview}>
  //       <CameraPreview />
  //     </View>
  //   );
  // }

  return (
    <Pressable
      style={styles.Pressable}
      onPress={() => onSelect(index)}
      android_ripple={{color: config.colors.b125}}>
      <SuperImage
        uri={imageUri}
        innerEdgeSize={innerEdgeSize}
        isSelected={isSelected}
        margin={imageMargin}
      />
    </Pressable>
  );
}
export default React.memo(FlatListImageItem);
