import BottomSheet from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Pressable, StyleSheet, useWindowDimensions} from 'react-native';
import CameraRollerFlatList from './CameraRollerFlatList';

function CameraRoller({
  isHidden,
  setIsHidden,
  onSelect,
}: {
  isHidden: boolean;
  setIsHidden: Function;
  onSelect: (imageUrls: string[]) => void;
}) {
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [0, '30%', windowHeight], [windowHeight]);

  useEffect(() => {
    //console.log('useEffect', { isHidden });
    if (isHidden) {
      sheetRef.current?.snapTo(0);
    } else {
      sheetRef.current?.snapTo(1);
    }
  }, [isHidden]);

  // callbacks
  const handleSheetChange = useCallback(
    (index: number) => {
      console.log('handleSheetChange', {index});
      if (index === 0) {
        setIsHidden(true);
      }
    },
    [setIsHidden],
  );

  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      console.log('handleAnimate', {fromIndex, toIndex});
      if (toIndex === 0) {
        setIsHidden(true);
      }
    },
    [setIsHidden],
  );

  console.log('render CameraRoller', {isHidden});

  const styles = StyleSheet.create({
    CameraRoller: {
      zIndex: 1000000,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: isHidden ? windowWidth : 0,
      right: 0,
      opacity: isHidden ? 0 : 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
  });

  return (
    <Pressable
      style={styles.CameraRoller}
      onPress={() => {
        sheetRef.current?.snapTo(0);
      }}>
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        animateOnMount={true}
        onAnimate={handleSheetAnimate}
        onChange={handleSheetChange}>
        {!isHidden && (
          <CameraRollerFlatList maxSelections={3} onSelect={onSelect} />
        )}
      </BottomSheet>
    </Pressable>
  );
}

export default React.memo(CameraRoller);
