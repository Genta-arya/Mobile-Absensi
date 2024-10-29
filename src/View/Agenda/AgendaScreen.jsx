import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import {getAgenda} from '../../Service/API/Agenda/Service_Agenda';
import Container from '../../Components/Container';
import {Colors} from '../../Constant/Constant';
import {showMessage} from 'react-native-flash-message';
import useErrorHandler from '../../Hooks/useErrorHandler';
import Loading from '../../Components/Loading';
import CustomBottomSheet from '../../Components/BottomSheet';
import DetailAgenda from './DetailAgenda';

const AgendaScreen = () => {
  const route = useRoute();
  const {grupId} = route.params;
  const {user} = useAuthStore();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null); // State untuk menyimpan agenda yang dipilih
  const HandleError = useErrorHandler();

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleKegiatan = item => {
    if (!item.status) {
      // Logika untuk mengambil kegiatan
      console.log(`Mengambil kegiatan: ${item.id}`);
      showMessage({
        message: 'Agenda Berhasil Diambil',
        type: 'success',
        icon: 'success',
      });
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
        onPress={() => {
          setSelectedAgenda(item); // Simpan agenda yang dipilih
          setVisible(true); // Tampilkan bottom sheet
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
          {item.nama}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleKegiatan(item)}
        disabled={item.status}
        style={{
          backgroundColor: item.status ? 'red' : Colors.green,
          padding: 10,
          borderRadius: 5,
        }}>
        <Text style={{color: 'white'}}>
          {item.status ? 'Agenda Sudah Diambil' : 'Ambil Agenda'}
        </Text>
      </TouchableOpacity>
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
