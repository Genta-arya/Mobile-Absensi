import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import HeaderBack from '../../Components/HeaderBack';
import Container from '../../Components/Container';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const NotifikasiScreen = () => {
  // Sample data untuk notifikasi
  const notifications = [
    {
      id: '1',
      title: 'Pemberitahuan Pembayaran',
      message: 'Pembayaran Anda telah berhasil diproses.',
      time: '2 menit yang lalu',
      icon: 'credit-card', // Ikon FontAwesome
    },
    {
      id: '2',
      title: 'Pembaruan Aplikasi',
      message: 'Aplikasi Anda telah diperbarui ke versi terbaru.',
      time: '1 jam yang lalu',
      icon: 'sync', // Ikon FontAwesome
    },
    {
      id: '3',
      title: 'Pesan Baru',
      message: 'Anda memiliki pesan baru dari Admin.',
      time: '3 jam yang lalu',
      icon: 'envelope', // Ikon FontAwesome
    },
  ];

  // Render item notifikasi
  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
      <FontAwesome5 name={item.icon} size={40} color="#4CAF50" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: '#666' }}>{item.message}</Text>
        <Text style={{ fontSize: 12, color: '#999' }}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderBack title={'Notifikasi'} />
      <Container>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </Container>
    </>
  );
};

export default NotifikasiScreen;
