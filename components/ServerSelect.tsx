import React, {useState} from 'react';
import {LayoutChangeEvent, StatusBar, StyleSheet, View} from 'react-native';
import {
  SERVER_URI_ARASH,
  SERVER_URI_LAPTOP,
  SERVER_URI_LIVE,
  SERVER_URI_NETLIFYLISD5,
} from '../constants';
import Button from './Button';

function ServerSelect({onSelect}: {onSelect: (serverUri: string) => void}) {
  //console.log('render ServerSelect');

  const [isLandscape, setIsLandscape] = useState(false);
  const onLayout = (layoutChangeEvent: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: {width, height},
      },
    } = layoutChangeEvent;
    setIsLandscape(width > height);
  };

  const styles = StyleSheet.create({
    ServerSelect: {
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
      backgroundColor: 'black',
      margin: 0,
    },
    ServerSelectButtonWrapper: {
      margin: 20,
      flex: 1,
    },
    ServerSelectButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      padding: 0,
    },
    ServerSelectText: {
      fontSize: 80,
      marginLeft: 0,
      transform: [{scale: 1.2}],
    },
  });

  return (
    <View style={styles.ServerSelect} onLayout={onLayout}>
      <StatusBar backgroundColor={'black'} />
      <Button
        moreWrapperStyle={styles.ServerSelectButtonWrapper}
        moreButtonStyle={styles.ServerSelectButton}
        moreButtonTextStyle={styles.ServerSelectText}
        color="black"
        backgroundColor="pink"
        text="NETLIFY/LISD5"
        action={() => {
          onSelect(SERVER_URI_NETLIFYLISD5);
        }}
      />
      <Button
        moreWrapperStyle={styles.ServerSelectButtonWrapper}
        moreButtonStyle={styles.ServerSelectButton}
        moreButtonTextStyle={styles.ServerSelectText}
        color="black"
        backgroundColor="pink"
        text="LAP"
        action={() => {
          onSelect(SERVER_URI_LAPTOP);
        }}
      />
      <Button
        moreWrapperStyle={styles.ServerSelectButtonWrapper}
        moreButtonStyle={styles.ServerSelectButton}
        moreButtonTextStyle={styles.ServerSelectText}
        color="black"
        backgroundColor="yellow"
        text="DEV"
        action={() => {
          onSelect(SERVER_URI_ARASH);
        }}
      />
      <Button
        moreWrapperStyle={styles.ServerSelectButtonWrapper}
        moreButtonStyle={styles.ServerSelectButton}
        moreButtonTextStyle={styles.ServerSelectText}
        color="black"
        backgroundColor="cyan"
        text="LIVE"
        action={() => onSelect(SERVER_URI_LIVE)}
      />
    </View>
  );
}

export default ServerSelect;
