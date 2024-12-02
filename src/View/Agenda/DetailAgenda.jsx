import {View, Text} from 'react-native';
import React from 'react';

const DetailAgenda = ({selectedAgenda}) => {
  return (
    <View>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 22,
          color: '#333',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd', 
          paddingBottom: 4, 
        }}>
        {selectedAgenda.nama}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd', 
          paddingBottom: 4, 
        }}>
        {selectedAgenda.group?.nama_grup || 'Tidak ada grup.'}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#333',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd', 
          paddingBottom: 4, 
        }}>
        Deskripsi: {'\n'}{selectedAgenda.deskripsi || '-'}
      </Text>
     
    </View>
  );
};

export default DetailAgenda;
