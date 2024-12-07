import {StatusBar, SafeAreaView} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../Constant/Constant';

const Container = ({props, children}) => {
  return (
    <LinearGradient
      colors={['#f5f5f5', '#eaeaea', '#ffffff']}
      style={{
        flex: 1,

        position: 'relative',
        paddingBottom: 70,
        padding: 15,
        borderTopColor: 'gray',
        borderTopWidth: 0,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <SafeAreaView>{children}</SafeAreaView>
    </LinearGradient>
  );
};

export default Container;
