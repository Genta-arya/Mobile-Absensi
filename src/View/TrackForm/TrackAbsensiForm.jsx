import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const TrackAbsensiForm = () => {
  const [userForms, setUserForms] = useState([]);
  const {user} = useAuthStore();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const existingData = await AsyncStorage.getItem('formData');
        const formArray = existingData ? JSON.parse(existingData) : [];

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
    return (filledFields.length / fields.length) * 100;
  };

  const handleNavigate = (agendaId, kegiatanId, name) => {
    navigation.navigate('Form', {agendaId, kegiatanId, name});
  };

  // Handle Submit Function
  const handleSubmit = () => {
    const completedForms = userForms.filter(
      data => calculateFillPercentage(data) === 100,
    );

    // Log completed forms to the console
    console.log('Data Absensi Lengkap:', completedForms);
  };

  const renderItem = ({item}) => {
    const fillPercentage = calculateFillPercentage(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          handleNavigate(item.agendaId, item.kegiatanId, item.name)
        }>
        <View
          style={{
            width: 200,
            marginRight: 10,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: 'black',
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            {item.name}
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
          <Text
            style={{
              textAlign: 'right',
              fontSize: 12,
              color: 'black',
              marginTop: 5,
            }}>
            {Math.round(fillPercentage)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const completedForms = userForms.filter(
    data => calculateFillPercentage(data) === 100,
  );

  return (
    userForms.length > 0 && (
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

        <View>
          {completedForms.length > 0 && (
            <View
              style={{
                borderRadius: 5,
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSubmit} // Attach the handleSubmit function here
                style={{
                  backgroundColor: 'white',
                  borderColor: '#4CAF50',
                  borderWidth: 2,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Kirim Absensi
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text
            style={{
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {completedForms.length} dari {userForms.length} form absensi sudah
            lengkap
          </Text>
        </View>
      </View>
    )
  );
};

export default TrackAbsensiForm;
