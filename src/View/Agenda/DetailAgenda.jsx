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
          borderBottomColor: '#ddd', // Border bawah untuk nama
          paddingBottom: 4, // Jarak antara teks dan border
        }}>
        {selectedAgenda.nama}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd', // Border bawah untuk grup
          paddingBottom: 4, // Jarak antara teks dan border
        }}>
        {selectedAgenda.group?.nama_grup || 'Tidak ada grup.'}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: '#333',
          marginBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd', // Border bawah untuk deskripsi
          paddingBottom: 4, // Jarak antara teks dan border
        }}>
        Deskripsi: {'\n'}{selectedAgenda.deskripsi || '-'}
      </Text>
     
    </View>
  );
};

export default DetailAgenda;
