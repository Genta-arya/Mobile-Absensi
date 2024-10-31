import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import {getAgenda} from '../../Service/API/Agenda/Service_Agenda';
import Container from '../../Components/Container';
import {Colors} from '../../Constant/Constant';
import useErrorHandler from '../../Hooks/useErrorHandler';
import Loading from '../../Components/Loading';
import CustomBottomSheet from '../../Components/BottomSheet';
import DetailAgenda from './DetailAgenda';
import useClaimAgenda from '../../Hooks/useClaimAgenda';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AgendaScreen = () => {
  const route = useRoute();
  const {grupId} = route.params;
  const {user} = useAuthStore();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigation();
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const HandleError = useErrorHandler();
  const {claim} = useClaimAgenda();

  // State untuk menampilkan tombol kirim absensi
  const [showAbsensiButton, setShowAbsensiButton] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAgenda({
        groupId: grupId,
        userId: user.id,
      });

      if (response && response.agendas) {
        setAgendas(response.agendas);
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Gunakan useEffect untuk memanggil fetchData saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Cek untuk menampilkan tombol kirim absensi
  const checkForAbsensiButton = async () => {
    const existingData = await AsyncStorage.getItem('formData');
    const formArray = existingData ? JSON.parse(existingData) : [];

    // Cek apakah ada agendaId dan semua data tidak kosong
    const shouldShow = agendas.some(agenda =>
      formArray.some(
        data =>
          data.agendaId === agenda.id &&
          data.detail &&
          data.gps &&
          data.tanggal &&
          data.gambar1 &&
          data.gambar2,
      ),
    );
    setShowAbsensiButton(shouldShow);
  };

  useFocusEffect(
    React.useCallback(() => {
      checkForAbsensiButton(); 
    }, [agendas]) 
  );
  if (loading) {
    return <Loading />;
  }

  const handleKegiatan = async item => {
    if (!item.status) {
      await claim(item.id);
      fetchData();
    }
  };

  const renderAgendaItem = ({item}) => (
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
          {item.nama}
        </Text>
      </TouchableOpacity>

      { (
        <TouchableOpacity
          onPress={() => handleKegiatan(item)}
          disabled={item.status}
          style={{
            backgroundColor:
              item.idUser === user.id
                ? '#37AFE1'
                : item.status
                ? 'red'
                : '#4CAF50',
            padding: 10,
            alignItems: 'center',
            width: 110,
            borderRadius: 5,
          }}>
          <Text style={{color: 'white'}}>
            {item.idUser === user.id ? (
              <View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigate.navigate('Form', {agendaId: item.id})
                  }>
                  <Text style={{color: 'white'}}>Absensi Agenda</Text>
                </TouchableOpacity>
              </View>
            ) : item.status ? (
              'Sudah Diambil'
            ) : (
              'Ambil Agenda'
            )}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <Container>
        <FlatList
          data={agendas}
          renderItem={renderAgendaItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', color: 'black'}}>
              No agenda found.
            </Text>
          }
        />
        {showAbsensiButton && (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.green,
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              margin: 20,
            }}
            onPress={() => navigate.navigate('KirimAbsensi')}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Kirim Absensi
            </Text>
          </TouchableOpacity>
        )}
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
