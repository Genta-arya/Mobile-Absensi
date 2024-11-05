import {View, Text, FlatList} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import {useFocusEffect} from '@react-navigation/native';

const TrackAbsensiForm = () => {
  const [userForms, setUserForms] = useState([]);
  const {user} = useAuthStore();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const existingData = await AsyncStorage.getItem('formData');
        const formArray = existingData ? JSON.parse(existingData) : [];

        // Filter form yang sesuai dengan userId
        const filteredForms = formArray.filter(
          data => data.userId === user?.id,
        );
        setUserForms(filteredForms);
      };

      fetchData();
    }, [user?.id]),
  );

  const calculateFillPercentage = item => {
    const fields = ['detail', 'gps', 'tanggal', 'gambar1', 'gambar2'];
    const filledFields = fields.filter(field => item[field]);
    return (filledFields.length / fields.length) * 100; // Persentase field yang sudah terisi
  };

  const renderItem = ({item, index}) => {
    const fillPercentage = calculateFillPercentage(item);

    return (
      <View style={{width: 200, marginRight: 10}}>
        <Text style={{fontSize: 16, color: 'black', marginBottom: 5}}>
          Absensi {index + 1} -{' '}
          {fillPercentage === 100 ? 'Sudah Diisi' : 'Belum Lengkap'}
        </Text>
        <View
          style={{
            height: 20,
            width: '100%',
            backgroundColor: '#ddd',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <View
            style={{
              height: '100%',
              width: `${fillPercentage}%`,
              backgroundColor: fillPercentage === 100 ? '#4CAF50' : '#FF5722',
            }}
          />
        </View>
        <Text style={{textAlign: 'right', fontSize: 12, color: 'black'}}>
          {Math.round(fillPercentage)}%
        </Text>
      </View>
    );
  };

  return (
    userForms.length > 0 && (
      <>
        <View style={{padding: 1, marginTop: 20}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
              marginBottom: 10,
            }}>
            Absensi saya
          </Text>

          <FlatList
            data={userForms}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 5}}
          />

          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontWeight: 'bold',
              borderBottomWidth: 1,
              paddingBottom: 5,
              borderBottomColor: 'gray',
              color: 'black',
            }}>
            {
              userForms.filter(data => calculateFillPercentage(data) === 100)
                .length
            }{' '}
            dari {userForms.length} form absensi sudah lengkap
          </Text>
        </View>
      </>
    )
  );
};

export default TrackAbsensiForm;
