import React, {useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {historyAgenda} from '../../Service/API/Agenda/Service_Agenda';

import {Colors} from '../../Constant/Constant';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../../Components/Loading';

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
      }}>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 4}}>
        {item.nama}
      </Text>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 4}}>
        {item.status ? 'Selesai' : ''}
      </Text>
      <Text style={{fontSize: 14, color: 'black'}}>
        Dosen: {item.creatorName || '-'}
      </Text>
    </View>
  );

  return (
    <>
      {agendaList.length !== 0 && (
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '900',

              color: 'black',
              marginBottom: 16,
            }}>
            Histori Absensi
          </Text>
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
            <Text style={{fontSize: 16, color: 'black'}}>No agenda found</Text>
          )}
        </View>
      )}
    </>
  );
};

export default HistoryScreen;
