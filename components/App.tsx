import AsyncStorage from '@react-native-community/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import WebView from 'react-native-webview';
import {SERVER_URI_NETLIFYLISD5} from '../constants';
import Loading from './Loading';

const styles = StyleSheet.create({
  App: {
    flex: 1,
    backgroundColor: 'green',
  },
  Overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'grey',

    alignItems: 'center',
    justifyContent: 'center',
  },
  OverlayEmojiText: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  OverlayEmoji: {
    fontSize: 150,
  },
  OverlayText: {
    marginTop: 10,
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
});

const ErrorPage = () => {
  const netInfo = useNetInfo();

  return (
    <View style={styles.Overlay}>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={styles.Overlay.backgroundColor}
      />
      {netInfo.isConnected && (
        <View style={styles.OverlayEmojiText}>
          <Text style={styles.OverlayEmoji}>🤦🏽</Text>
          <Text style={styles.OverlayText}>Bubbles down?</Text>
        </View>
      )}
      {!netInfo.isConnected && (
        <View style={styles.OverlayEmojiText}>
          <Text style={styles.OverlayEmoji}>🧘🏽‍♀️</Text>
          <Text style={styles.OverlayText}>You are offline!</Text>
        </View>
      )}
    </View>
  );
};

const App = (props: any) => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [shouldLoadWeb, setShouldLoadWeb] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [meteorLoginToken, setMeteorLoginToken] = useState<string | null>();
  const [isAppReady, setIsAppReady] = useState(false);

  const webviewRef = useRef<WebView>(null);

  console.log('App', {props});

  // SPLASH SCREEN

  useEffect(() => {
    console.log('url', props.url);
    console.log(`ReactNativeWebView.receiveIntentUrl("${props.url}")`);
    // webviewRef.current.injectJavaScript(
    //   'ReactNativeWebView.backButtonWasPressed()',
    // );

    if (!webviewRef || webviewRef.current === null) {
      return;
    }

    if (!isAppReady) {
      return;
    }

    if (props.url === null) {
      return;
    }

    webviewRef.current.injectJavaScript(
      `ReactNativeWebView.receiveIntentUrl("${props.url}")`,
    );
  }, [props.url, isAppReady]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // BACK BUTTON 1
  const handleBackButtonClick = useCallback(() => {
    if (!webviewRef || webviewRef.current === null) {
      return;
    }

    // if (canGoBack) {
    //   webviewRef.current.goBack();
    // }

    webviewRef.current.injectJavaScript(
      'ReactNativeWebView.backButtonWasPressed()',
    );
    return true;
  }, []);

  // BACK BUTTON 2
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
  }, [handleBackButtonClick]);

  // LOGIN/TOKEN SYNCHRONIZATION 1
  useEffect(() => {
    async function tryToGetToken() {
      const token: string | null = await AsyncStorage.getItem(
        'meteorLoginToken',
      );
      console.log('tryToGetToken', {token});
      setMeteorLoginToken(token);
      setShouldLoadWeb(true);
    }
    tryToGetToken();
  }, []);

  // LOGIN/TOKEN SYNCHRONIZATION 2
  const runFirst = (() => {
    const run: string[] = [];
    if (meteorLoginToken !== null) {
      run.push(
        `window.ReactNativeWebView.meteorLoginToken="${meteorLoginToken}`,
      );
    }
    run.push(
      `window.ReactNativeWebView.statusBarCurrentHeight=${StatusBar.currentHeight}`,
    );
    run.push('true');

    return run.join(';') + ';';
  })();

  // LOGIN/TOKEN SYNCHRONIZATION 3
  const onMessage = (e: any) => {
    const webViewData = JSON.parse(e.nativeEvent.data);
    if (webViewData.meteorLoginToken !== undefined) {
      AsyncStorage.setItem('meteorLoginToken', webViewData.meteorLoginToken);
    }

    if (webViewData.isAppReady) {
      setIsAppReady(true);
    }
  };

  return (
    <View style={styles.App}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="blue"
        translucent={false}
      />

      {hasLoadingError && <ErrorPage />}

      {!hasLoadingError && shouldLoadWeb && (
        <WebView
          source={{uri: SERVER_URI_NETLIFYLISD5}}
          geolocationEnabled={true}
          scalesPageToFit={false}
          ref={webviewRef}
          //onLoad={() => setIsLoadingWeb(false)}
          onError={syntheticEvent => {
            console.log(syntheticEvent);
            setHasLoadingError(true);
          }}
          onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
          onMessage={onMessage}
          injectedJavaScriptBeforeContentLoaded={runFirst}
          mediaPlaybackRequiresUserAction={false}
        />
      )}

      <Loading doHide={isAppReady} />
    </View>
  );
};

export default App;
