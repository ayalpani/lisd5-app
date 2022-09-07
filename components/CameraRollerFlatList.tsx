import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import ImgToBase64 from 'react-native-image-base64-png';
import {useExternalStoragePermission} from '../hooks/use-external-storage-permission';
import useInfiniteData from '../hooks/use-infinite-data';
import FlatListImageItem from './FlatListImageItem';

type CameraRollImageType = {
  uri: string;
};

const IMAGE_MARGIN = 5;
const LIST_PADDING = 5;
// Flatlist Configuration
const flatListConfig = {
  pageSize: 300,
  numColumns: 3,
  windowSize: 21,
  onEndReachedTreshold: 10,
};

async function fetchData(
  page: number,
  pageSize: number,
): Promise<CameraRollImageType[]> {
  console.log('fetchData', {page});
  const images: CameraRollImageType[] = [];
  const promise: Promise<CameraRollImageType[]> = new Promise(
    (resolve /*, reject*/) => {
      CameraRoll.getPhotos({
        first: pageSize,
        after: ((page - 1) * pageSize).toString(),
        assetType: 'Photos',
      })
        .then(data => {
          data.edges.forEach(edge => {
            images.push({uri: edge.node.image.uri});
          });
          resolve(images);
        })
        .catch(err => {
          console.error(err);
          resolve([]);
        });
    },
  );

  const result = await promise;
  return result;
}

const styles = StyleSheet.create({
  FlatList: {
    flexDirection: 'column',
    padding: LIST_PADDING,
  },
});

const keyExtractor = (image: CameraRollImageType) => image.uri;

const CameraRollerFlatList = ({
  maxSelections = 1,
  onSelect,
}: {
  maxSelections: number;
  onSelect: (imageUrls: string[]) => void;
}) => {
  const {data, fetchMore} = useInfiniteData<CameraRollImageType>(
    fetchData,
    flatListConfig.pageSize,
  );
  const windowWidth = useWindowDimensions().width;
  const innerEdgeSize = useMemo(
    () =>
      Math.floor(
        (windowWidth -
          2 * LIST_PADDING -
          2 * IMAGE_MARGIN * flatListConfig.numColumns) /
          flatListConfig.numColumns,
      ),
    [windowWidth],
  );

  // const getItemLayout = useCallback(
  //   (_data, index) => {
  //     const outerEdgeSize = 2 * IMAGE_MARGIN + innerEdgeSize;
  //     console.log(`getItemLayout(${index})`, { outerEdgeSize });
  //     return {
  //       length: outerEdgeSize,
  //       offset: outerEdgeSize * Math.floor(index / flatListConfig.numColumns),
  //       index,
  //     };
  //   },
  //   [innerEdgeSize]
  // );

  const selectedImagesByIdxRef = useRef<number[]>([]);
  const [selectedImagesByIdx, setSelectedImagesByIdx] = useState<number[]>([]);
  const {hasPermission} = useExternalStoragePermission();

  const onSelectImage = useCallback(
    (idx: number) => {
      //console.time('onSelectImage');
      if (
        selectedImagesByIdxRef.current &&
        selectedImagesByIdxRef.current.length > 0
      ) {
        const fileUri = data[selectedImagesByIdxRef.current[0]].uri;
        ImgToBase64.getBase64String(fileUri)
          .then((base64String: string) => {
            onSelect([base64String]);
          })
          .catch(err => console.error(err));
      }
      const _selectedImagesByIdx = [...selectedImagesByIdxRef.current];

      const indexOf = selectedImagesByIdxRef.current.indexOf(idx);
      if (indexOf >= 0) {
        // item is selected already
        _selectedImagesByIdx.splice(indexOf, 1);
      } else {
        // item is no selected yet and might not be because of maxSelections
        if (selectedImagesByIdxRef.current.length < maxSelections) {
          _selectedImagesByIdx.push(idx);
        }
      }
      // console.log({
      //   idx,
      //   indexOf,
      //   selectedImagesByIdxRefCurrent: selectedImagesByIdxRef.current,
      //   _selectedImagesByIdx,
      // });

      selectedImagesByIdxRef.current = _selectedImagesByIdx;
      setSelectedImagesByIdx(_selectedImagesByIdx);
      //console.timeEnd('onSelectImage');
    },
    [data, maxSelections, onSelect],
  );

  const renderItem = useCallback(
    ({item, index}: {item: CameraRollImageType; index: number}) => {
      const isSelected = selectedImagesByIdxRef.current.includes(index);
      //console.log('renderItem', { index, isSelected });
      return (
        <FlatListImageItem
          imageUri={item.uri}
          index={index}
          key={item.uri}
          onSelect={onSelectImage}
          isSelected={isSelected}
          innerEdgeSize={innerEdgeSize}
          imageMargin={IMAGE_MARGIN}
        />
      );
    },
    [innerEdgeSize, onSelectImage, selectedImagesByIdxRef],
  );

  const onEndReached = useCallback(fetchMore, [fetchMore]);

  if (!hasPermission || data.length === 0) {
    return null;
  }

  console.log('redrawing flatList', {selectedImagesByIdx, data: data.length});
  return (
    <BottomSheetFlatList
      data={data}
      extraData={selectedImagesByIdx.length}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={flatListConfig.numColumns}
      windowSize={flatListConfig.windowSize}
      initialNumToRender={0}
      onEndReached={onEndReached}
      onEndReachedThreshold={flatListConfig.onEndReachedTreshold}
      //getItemLayout={getItemLayout}
      style={styles.FlatList}
      // eslint-disable-next-line react-native/no-inline-styles
      // contentContainerStyle={{ height: '100%' }} // https://github.com/facebook/react-native/issues/17944
    />
  );
};

export default React.memo(CameraRollerFlatList);
