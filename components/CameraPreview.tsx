import {faCamera} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useCallback, useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function CameraPreview() {
  const cameraRef = useRef<RNCamera>(null);

  const takePicture = useCallback(async () => {
    if (cameraRef && cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      console.log({uri: data?.uri});
    }
  }, []);

  const styles = StyleSheet.create({
    CameraPreview: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    Camera: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ContentWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    CameraIcon: {
      opacity: 0.75,
    },
  });

  return (
    <Pressable style={styles.CameraPreview} onPress={takePicture}>
      <RNCamera
        ref={cameraRef}
        style={styles.Camera}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          console.log(barcodes);
        }}
      />
      <View style={styles.ContentWrapper}>
        <FontAwesomeIcon
          icon={faCamera}
          size={50}
          style={styles.CameraIcon}
          color="white"
        />
      </View>
    </Pressable>
  );
}
