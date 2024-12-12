import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import useCheckLogin from '../Hooks/useCheckLogin';
import {useNavigation} from '@react-navigation/native';
import {pathScreen, WEBVIEW_URL} from '../Constant/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WebVIew = () => {
  const {user, setUser} = useCheckLogin();
  const navigation = useNavigation();
  const token = user?.token || '';

  console.log(token);

  const webViewUrl = `${WEBVIEW_URL}${token}`;

  const handleNavigationChange = navState => {
    const {url} = navState;

    if (url.includes('/login')) {
 
      AsyncStorage.removeItem('token');
      navigation.navigate(pathScreen.Login);
    }
  };

  return (
    <View style={styles.container}>
      {token ? (
        <WebView
          source={{uri: webViewUrl}}
          style={styles.webview}
          onNavigationStateChange={handleNavigationChange}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text></Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WebVIew;
