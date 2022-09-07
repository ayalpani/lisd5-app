import BottomSheet from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ({children}: {children: React.ReactNode}) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['40%', '100%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animateOnMount={true}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>{children}</View>
      </BottomSheet>
    </View>
  );
};
