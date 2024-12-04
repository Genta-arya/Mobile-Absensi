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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'; 
import {faArrowRight, faInfoCircle} from '@fortawesome/free-solid-svg-icons'; 
import {Colors, Icons, pathScreen} from '../../../Constant/Constant';
import {SearchBar} from 'react-native-screens';
import SearchComponent from '../../../Components/Search';
import {useSearchStore} from '../../../Library/Zustand/SearchStore';
import Container from '../../../Components/Container';
import { formatDate } from '../../../Utils/Utils';
import { useGroupStore } from '../../../Library/Zustand/GrupStore';

const ListGrup = () => {
  const navigation = useNavigation();
  const {user} = useAuthStore();
  const {searchTerm} = useSearchStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
const {setGroupName} = useGroupStore()
  const showModal = kegiatan => {
    setSelectedKegiatan(kegiatan);
    setModalVisible(true);
  };

  const handlePress = (item) => { 
    navigation.navigate(pathScreen.ListAgenda, {grupId: item.id});
    setGroupName(item.nama_grup)
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        paddingLeft:5,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={() => {
        handlePress(item);
      }}>
      <View
        style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <FontAwesomeIcon icon={faArrowRight} size={15} color={Colors.green} />
        <Text style={{fontSize: 16, fontWeight: '800' , color: 'black'}}>{item.nama_grup}</Text>
      </View>

      <TouchableOpacity
        accessibilityActions={[{name: 'info', label: 'info'}]}
        activeOpacity={0.9}
        onPress={() => showModal(item.kegiatan)}>
        <FontAwesomeIcon icon={faInfoCircle} size={20} color={Colors.green} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredData = user.Group?.filter(item =>
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
          ListEmptyComponent={() => (
            <Text style={{textAlign: 'center' , color: 'gray'}}>Grup tidak ditemukan</Text>
          )}
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
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: 'absolute',
                width: '100%',
                height: '25%',
                bottom: 0,
                left: 0,
                right: 0,
                margin: 0,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '900',
                  color: "gray",
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
                  {/* hilangkan jam nya
                   */}

                  <Text style={{color: '#666'}}>
                    Mulai:{' '}
                    {formatDate(selectedKegiatan.waktumulai)}
                  </Text>
                  <Text style={{color: '#666'}}>
                    Selesai:{' '}
                    {formatDate(selectedKegiatan.waktuselesai)}
                  </Text>
                </View>
              ) : (
                <Text>Tidak ada kegiatan untuk ditampilkan.</Text>
              )}
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  marginTop: 10,
                  position: 'absolute',
                  bottom: 15,
                  width: '100%',
                  left: 20,
                  right: 20,
                  backgroundColor: Colors.green,
                  padding: 10,
                  borderRadius:25,
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
