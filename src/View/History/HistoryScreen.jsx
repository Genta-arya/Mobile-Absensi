import React, {useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {historyAgenda} from '../../Service/API/Agenda/Service_Agenda';
import {Colors} from '../../Constant/Constant';
import {useFocusEffect} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {  faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const HistoryScreen = ({user}) => {
  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const response = await historyAgenda(user?.id);

        const slicedData = response.data.slice(0, 5);

        setAgendaList(slicedData);
      }
    } catch (error) {
      console.error('Error fetching agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const renderAgendaItem = ({item}) => (
    <View
      style={{
        marginRight: 15,
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        width: 250,
        borderLeftColor: Colors.green,
        borderLeftWidth: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-between',
      }}>
    
      <Text
        style={{
          fontSize: 18,
          fontWeight: '900',
          marginBottom: 4,
          color: 'black',
        }}>
        {item.nama}
      </Text>

   
      <Text style={{fontSize: 14, color: 'black'}}>
        By {item.creatorName || '-'}
      </Text>

  
      <Text
        style={{
          fontSize: 15,
          fontWeight: '900',
          marginTop: 8, 
          color: item.status ? 'green' : 'red',
          textAlign: 'right', 
        }}>
        {item.status ? (
          <View style={{flexDirection: 'row', alignItems: 'center' , gap: 5}}>
          
            <FontAwesomeIcon
              icon={faCircleCheck}
              size={15}
              color={Colors.green}
            />
            <Text style={{color: Colors.green , fontWeight: '900'}}>Selesai</Text>
          </View>
        ) : (
          <Text>Belum Selesai</Text>
        )}
      </Text>
    </View>
  );

  return (
    <>
      {agendaList.length !== 0 && (
        <View style={{marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '900',

                color: 'black',
                marginBottom: 16,
              }}>
              Histori Absensi
            </Text>
            <Text
              style={{fontSize: 14, color: Colors.green, fontWeight: '900'}}>
              Lihat semua
            </Text>
          </View>
          {loading ? (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <ActivityIndicator size="large" color={Colors.green} />
              </View>
            </>
          ) : agendaList.length > 0 ? (
            <FlatList
              data={agendaList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={renderAgendaItem}
            />
          ) : (
            <Text style={{fontSize: 16, color: 'black'}}>Tidak ada histori</Text>
          )}
        </View>
      )}
    </>
  );
};

export default HistoryScreen;
