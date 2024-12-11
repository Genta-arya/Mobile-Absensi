import {View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {useState} from 'react';
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
import {
  faClipboard,
  faPencilAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {showMessage} from 'react-native-flash-message';

const AgendaScreen = () => {
  const route = useRoute();
  const {grupId} = route.params;
  const {user} = useAuthStore();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigation();
  const [selectedAgenda, setSelectedAgenda] = useState(null);
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


        setKegiatanId(kegiatanIds[0]);
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

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
        <Text
          ellipsizeMode="tail"
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: 'black',
            width: 200,
          }}>
          {index + 1}. {item.nama}
        </Text>
      </TouchableOpacity>
      {!expired ? (
        <>
          {item.status_berkas === true && item.idUser === user.id ? (
            <>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigate.navigate('EditForm', {
                    agendaId: item.id,
                    kegiatanId: kegiatanId,
                    name: item.nama,
                  })
                }>
                <Text
                  style={{
                    backgroundColor: 'orange',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    padding: 8,
                    alignItems: 'center',
                    color: 'white',
                    width: 125,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      justifyContent: 'center',
                    }}>
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      size={10}
                      color="white"
                    />
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Edit Absensi
                    </Text>
                  </View>
                </Text>
              </TouchableOpacity>
            </>
          ) : (
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
                    width: 130,
                    borderRadius: 5,
                  }}>
                  <Text style={{color: 'white'}}>
                    {item.idUser === user.id ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          justifyContent: 'center',
                        }}>
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size={15}
                          color="white"
                        />
                        <Text style={{color: 'white'}}>Form Absensi</Text>
                      </View>
                    ) : item.status ? (
                      <Text style={{color: 'white'}}>Sudah Diambil</Text>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          justifyContent: 'center',
                        }}>
                        <FontAwesomeIcon
                          icon={faClipboard}
                          size={15}
                          color="white"
                        />
                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                          Ambil Agenda
                        </Text>
                      </View>
                    )}
                  </Text>
                </TouchableOpacity>
              }
            </>
          )}
        </>
      ) : (
        <View
          style={{
            backgroundColor: 'green',
            padding: 7,
            alignItems: 'center',
            width: 120,
            borderRadius: 5,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              showMessage({
                message: 'Kegiatan ini telah selesai',
                type: 'success',
                icon: 'info',
              })
            }>
            <Text style={{color: 'white'}}>Agenda selesai</Text>
          </TouchableOpacity>
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
              paddingLeft: 40,
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
          style={{paddingBottom: 50}}
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
