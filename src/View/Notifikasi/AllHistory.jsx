import {Text, View, FlatList, TextInput, TouchableOpacity, useColorScheme} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderBack from '../../Components/HeaderBack';
import {getAllAgenda} from '../../Service/API/Agenda/Service_Agenda';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import Loading from '../../Components/Loading';
import {Colors} from '../../Constant/Constant';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheckCircle, faSearch} from '@fortawesome/free-solid-svg-icons';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const HistoryAbsensi = () => {
  const [loading, setLoading] = useState(false);
  const [agendaData, setAgendaData] = useState([]);
  const [filteredAgenda, setFilteredAgenda] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const {user} = useAuthStore();
 const navigate = useNavigation();
 const colorScheme = useColorScheme();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchText, statusFilter, agendaData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllAgenda(user?.id);
      setAgendaData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filteredData = [...agendaData];

    if (searchText) {
      filteredData = filteredData.filter(item =>
        item.nama.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(
        item => item.status.toString() === statusFilter,
      );
    }

    setFilteredAgenda(filteredData);
  };
  
  

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HeaderBack title="History Absensi" />
      <View style={{flex: 1, paddingHorizontal: 10}}>
      <View>

        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            position: 'relative',
            paddingLeft: 45,
          }}
          placeholder="Cari Nama Agenda..."
          placeholderTextColor={'#ccc'}
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={{position: 'absolute', left: 20, top: 12}}>
          <FontAwesomeIcon icon={faSearch} />
        </View>
      </View>

        <View
          style={{
            marginBottom: 10,
            // DETECT SISTEM JIKA TEMA GELAP MAKA WARNA PUTIH BG NYA
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            borderRadius: 10,
         
          }}>
          <Picker selectedValue={statusFilter} onValueChange={setStatusFilter}>
            <Picker.Item label="Semua Status" value="all" />
            <Picker.Item label="Selesai" value="true" />
            <Picker.Item label="Tidak Hadir" value="false" />
          </Picker>
        </View>

        <FlatList
          data={filteredAgenda}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                
              }}>
              <Text style={{color: 'black'}}>Histori Tidak Ditemukan</Text>
            </View>
          )}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: '#fff',
                padding: 12,
                marginVertical: 4,
                borderLeftColor: item.status === true ? 'green' : 'red',
                borderLeftWidth: 4,
                borderRadius: 8,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
                {item.nama}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}>
                <Text style={{color: '#777'}}>
                  {item.status === true ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <Text style={{color: 'green', fontWeight: 'bold'}}>
                        Selesai
                      </Text>
                    </View>
                  ) : (
                    'Tidak Hadir'
                  )}
                </Text>

                {item.status === true && (
                  <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigate.navigate('DetailForm', {id: item.id})}
                    style={{
                      backgroundColor: Colors.green,
                      padding: 8,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{color: 'white', fontSize: 12, fontWeight: '700'}}>
                      Lihat Detail
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default HistoryAbsensi;
