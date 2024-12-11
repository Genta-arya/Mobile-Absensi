import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import useCheckLogin from '../Hooks/useCheckLogin';
import { useNavigation } from '@react-navigation/native';
import { pathScreen, WEBVIEW_URL } from '../Constant/Constant';

const WebVIew = () => {
  const { user } = useCheckLogin();
  const navigation = useNavigation();
  const token = user?.token || '';

  const webViewUrl = `${WEBVIEW_URL}${token}`; 

  const handleNavigationChange = (navState) => {
    const { url } = navState;
   
    if (url.includes('/login')) {
      navigation.navigate(pathScreen.Login); 
    }
  };

  return (
    <View style={styles.container}>
      {token ? (
        <WebView
          source={{ uri: webViewUrl }}
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
