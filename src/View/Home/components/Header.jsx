import {View, Text, Image} from 'react-native';
import React from 'react';

const Header = ({user}) => {
  console.log(user);
  return (
    <>
      <View
        style={{
          borderColor: 'black',
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row' , gap:5 , alignItems: 'center'}}>
          <Image
            source={{uri: user?.avatar}}
            style={{width: 50, height: 50, borderRadius: 50}}
          />
          <Text>{user?.name || '-'}</Text>
        </View>
      </View>
    </>
  );
};

export default Header;
