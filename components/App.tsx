import AsyncStorage from '@react-native-community/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
        // backgroundColor={styles.Overlay.backgroundColor}
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
  const [isCameraRollerHidden, setIsCameraRollerHidden] = useState(false);

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

    if (webViewData.showCameraRoller) {
      setIsCameraRollerHidden(false);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.App}>
        <StatusBar
          barStyle="light-content"
          //backgroundColor="blue"
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
            onNavigationStateChange={navState =>
              setCanGoBack(navState.canGoBack)
            }
            onMessage={onMessage}
            injectedJavaScriptBeforeContentLoaded={runFirst}
            mediaPlaybackRequiresUserAction={false}
          />
        )}

        <Loading doHide={isAppReady} />
        {/* <ImageUploadButton webviewRef={webviewRef} /> */}

        {/* <CameraRoller
          isHidden={isCameraRollerHidden}
          setIsHidden={setIsCameraRollerHidden}
          onSelect={(imageUrls: string[]) => {
            console.log('onSelect', imageUrls);
          }}
        /> */}
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

// function ImageUploadButton({
//   webviewRef,
// }: {
//   webviewRef: React.RefObject<WebView<{}>>;
// }) {
//   const uploadImage = () => {
//     const base64 =
//       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';
//     webviewRef.current?.injectJavaScript(
//       `ReactNativeWebView.receiveImageBase64("${base64}")`,
//     );
//   };

//   const style = StyleSheet.create({
//     ImageUploadButton: {
//       backgroundColor: 'red',
//       position: 'absolute',
//       bottom: 10,
//       padding: 10,
//     },
//   });
//   return (
//     <View style={style.ImageUploadButton}>
//       <Button onPress={uploadImage} title="Button" />
//     </View>
//   );
// }
