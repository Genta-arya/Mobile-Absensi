import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {Colors, Icons, pathScreen} from '../../../Constant/Constant';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Header = ({user}) => {
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
       source={{ uri: user?.avatar ? user.avatar : 'https://via.placeholder.com/150' }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: Colors.green,
              }}
            />
          </Pressable>

          <View>
            <Text
              style={{fontWeight: '800', fontSize: 18, color: Colors.green}}>
              Selamat Datang
            </Text>

            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              Hi, {user?.name || '-'}
            </Text>
            <View style={{fontSize: 12, color: 'gray', fontWeight: 'bold' , flexDirection: 'row' , gap: 5 , marginTop: 5 , alignItems: 'center'}}>
              <Icons.FontAwesome5 name="play" size={12} color="gray" />
              <Text>{user?.nim}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;
