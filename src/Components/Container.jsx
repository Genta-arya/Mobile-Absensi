import {View, Text, StatusBar, SafeAreaView} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../Constant/Constant';

const Container = ({props, children}) => {
  return (
    <LinearGradient
      colors={['#f5f5f5', '#eaeaea', '#ffffff']}
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderTopColor: 'gray',
        borderTopWidth: 0,
      }}>
      <View>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <SafeAreaView>{children}</SafeAreaView>
      </View>
    </LinearGradient>
  );
};

export default Container;
