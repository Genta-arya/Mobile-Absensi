import {View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import {getAgenda} from '../../Service/API/Agenda/Service_Agenda';
import Container from '../../Components/Container';
import {Colors, Icons} from '../../Constant/Constant';
import useErrorHandler from '../../Hooks/useErrorHandler';
import Loading from '../../Components/Loading';
import CustomBottomSheet from '../../Components/BottomSheet';
import DetailAgenda from './DetailAgenda';
import useClaimAgenda from '../../Hooks/useClaimAgenda';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

const AgendaScreen = () => {
  const route = useRoute();
  const {grupId} = route.params;
  const {user} = useAuthStore();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigation();
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [kegiatanId, setKegiatanId] = useState(null);
  const [filteredAgendas, setFilteredAgendas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const HandleError = useErrorHandler();
  const {claim} = useClaimAgenda();
  const [expired, setExpired] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAgenda({
        groupId: grupId,
        userId: user.id,
      });

      if (response && response.agendas) {
        setAgendas(response.agendas);
        setExpired(response.expired);
        setFilteredAgendas(response.agendas);

        const kegiatanIds = response.agendas
          .filter(agenda => agenda.idUser === user.id)
          .map(agenda => agenda.group.kegiatanId);

        console.log('kegiatanId yang sesuai dengan user.id:', kegiatanIds);
        setKegiatanId(kegiatanIds[0]);
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log('Agendas:', expired);

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = agendas.filter(agenda =>
      agenda.nama.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredAgendas(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  const handleKegiatan = async item => {
    if (!item.status) {
      await claim(item.id);
      fetchData();
    }
  };

  const renderAgendaItem = ({item, index}) => (
    <View
      style={{
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (!visible) {
            setSelectedAgenda(item);
            setVisible(true);
          }
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
          {index + 1}. {item.nama}
        </Text>
      </TouchableOpacity>
      {!expired ? (
        <>
          {
            <TouchableOpacity
              onPress={() => {
                item.idUser === user.id
                  ? navigate.navigate('Form', {
                      agendaId: item.id,
                      kegiatanId: kegiatanId,
                      name: item.nama,
                    })
                  : handleKegiatan(item);
              }}
              activeOpacity={0.9}
              style={{
                backgroundColor:
                  item.idUser === user.id
                    ? '#37AFE1'
                    : item.status
                    ? 'red'
                    : '#4CAF50',
                padding: 8,
                alignItems: 'center',
                width: 120,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>
                {item.idUser === user.id ? (
                  <Text style={{color: 'white'}}>Lihat</Text>
                ) : item.status ? (
                  'Sudah Diambil'
                ) : (
                  'Ambil Agenda'
                )}
              </Text>
            </TouchableOpacity>
          }
        </>
      ) : (
        <View
          style={{
            backgroundColor: 'green',
            padding: 7,
            alignItems: 'center',
            width: 100,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white'}}>Agenda selesai</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Container>
        <View style={{position: 'relative', marginBottom: 10}}>
          <FontAwesomeIcon
            icon={faSearch}
            size={20}
            color="#ccc"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: [{translateY: -10}],
            }}
          />
          <TextInput
            style={{
              padding: 10,
              width: '100%',
              paddingLeft: 40, // Memberi jarak untuk ikon di sebelah kiri
              borderWidth: 1,
              borderColor: '#ddd',
              color: '#333',
              borderRadius: 5,
            }}
            placeholder="Cari agenda..."
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          data={filteredAgendas}
          renderItem={renderAgendaItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', color: 'black'}}>
              Agenda tidak ditemukan
            </Text>
          }
        />
      </Container>
      {visible && (
        <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
          <CustomBottomSheet
            onClose={() => setVisible(false)}
            visible={visible}
            children={
              <View style={{padding: 16}}>
                {selectedAgenda && (
                  <DetailAgenda selectedAgenda={selectedAgenda} />
                )}
              </View>
            }
          />
        </View>
      )}
    </>
  );
};

export default AgendaScreen;
