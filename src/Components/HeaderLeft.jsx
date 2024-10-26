import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import {Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const HeaderLefts = ({navigation}) => {

  return (
    <View>
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
    </View>
  );
};

export default HeaderLefts;
