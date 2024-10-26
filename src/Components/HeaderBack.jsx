import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../Constant/Constant';

const HeaderBack = ({title}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        elevation: 5,
        marginBottom: 10,
      }}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 20,
        }}
        accessible={true}
        accessibilityLabel="Kembali ke halaman sebelumnya"
        onPress={() => {
          navigation.goBack();
        }}>
        <FontAwesome5 name="angle-left" size={30} color="black" />
      </Pressable>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
        }}>
        {title}
      </Text>
    </View>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({});
