import {View, Text, StatusBar, SafeAreaView} from 'react-native';
import React from 'react';

const Container = ({props, children}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <SafeAreaView>{children}</SafeAreaView>
    </View>
  );
};

export default Container;
