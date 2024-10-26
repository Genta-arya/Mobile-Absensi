import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import HeaderBack from '../../../Components/HeaderBack';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../../../Library/Zustand/AuthStore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'; // Import FontAwesomeIcon
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'; // Import ikon info
import {Colors, Icons} from '../../../Constant/Constant';
import {SearchBar} from 'react-native-screens';
import SearchComponent from '../../../Components/Search';
import {useSearchStore} from '../../../Library/Zustand/SearchStore';
import Container from '../../../Components/Container';

const ListGrup = () => {
  const navigation = useNavigation();
  const {user} = useAuthStore();
  const {searchTerm} = useSearchStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  const showModal = kegiatan => {
    setSelectedKegiatan(kegiatan);
    setModalVisible(true);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={() => {
        navigation.navigate('DetailGrup', {grupId: item.id});
      }}>
      <View
        style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Icons.FontAwesome5 name="list" size={20} color={Colors.green} />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.nama_grup}</Text>
      </View>

      <TouchableOpacity onPress={() => showModal(item.kegiatan)}>
        <FontAwesomeIcon icon={faInfoCircle} size={20} color={Colors.green} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredData = user.Group.filter(item =>
    item.nama_grup.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <HeaderBack title={'Daftar Grup'} />
      <Container>
        <SearchComponent />
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <StatusBar
            backgroundColor="rgba(0, 0, 0, 0.5)"
            barStyle="light-content"
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '80%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  alignSelf: 'center',
                }}>
                Detail Kegiatan
              </Text>
              {selectedKegiatan ? (
                <View>
                  <Text style={{fontSize: 16}}>
                    {selectedKegiatan.nama || 'Kegiatan Tanpa Nama'}
                  </Text>

                  <Text style={{color: '#666'}}>
                    Mulai:{' '}
                    {new Date(selectedKegiatan.waktumulai).toLocaleString()}
                  </Text>
                  <Text style={{color: '#666'}}>
                    Selesai:{' '}
                    {new Date(selectedKegiatan.waktuselesai).toLocaleString()}
                  </Text>
                </View>
              ) : (
                <Text>Tidak ada kegiatan untuk ditampilkan.</Text>
              )}
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: Colors.green,
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Container>
    </>
  );
};

export default ListGrup;
