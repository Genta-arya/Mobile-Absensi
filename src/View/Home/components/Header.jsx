import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import { pathScreen } from '../../../Constant/Constant';
import { useNavigation } from '@react-navigation/native';

const Header = ({user }) => {
  const navigate = useNavigation();
  return (
    <>
      <View
        style={{
          borderColor: 'gray',
          borderWidth: 1.5,
          padding: 5,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row-reverse',

            padding: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 0,
          }}>
          <Pressable onPress={() => navigate.navigate(pathScreen.Profile)}>
            <Image
              source={{uri: user?.avatar || 'https://via.placeholder.com/150'}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          </Pressable>

          <View>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Selamat Datang
            </Text>

            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              Hi, {user?.name || '-'}
            </Text>
            <Text style={{fontSize: 12, color: 'gray', fontWeight: 'bold'}}>
              {user?.nim}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;
