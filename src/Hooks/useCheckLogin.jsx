import React, {useEffect, useState} from 'react';

import {useAuthStore} from '../Library/Zustand/AuthStore';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import useUserStore from '../Library/Zustand/SessionStore';
import useErrorHandler from './useErrorHandler';
import {API_URL} from '../Constant/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useCheckLogin = () => {
  const {user, setUser} = useAuthStore();
  const route = useRoute();
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const {fetchData, isFetching} = useUserStore();
  const handleError = useErrorHandler();
  const path = route.name;

  const checkStatusForm = async () => {
    console.log('Checking status...');

    try {
      const existingData = await AsyncStorage.getItem('formData');
      const formArray = existingData ? JSON.parse(existingData) : [];
      const userForms = formArray.filter(data => data.userId === user?.id);

      if (userForms.length === 0) {
        console.log('Tidak ada formulir untuk diperiksa.');
        return;
      }

      const agendaIds = userForms.map(form => form.agendaId);

      const response = await axios.post(`${API_URL}/check/form`, {
        id: agendaIds,
      });

      console.log('Response dari API:', response.data);

      if (response.status === 200 && response.data.status) {
        console.log('Status OK, agenda ID akan dihapus.');

        const updatedForms = formArray.filter(
          form => !response.data.ids.includes(form.agendaId),
        );

        await AsyncStorage.setItem('formData', JSON.stringify(updatedForms));
        console.log('Data berhasil diperbarui di localStorage.');
      } else {
        console.warn('Status tidak OK atau tidak ada data valid.');
      }
    } catch (err) {
      console.error('Kesalahan saat memeriksa status berkas:', err.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('Checking login...');
      checkStatusForm();
      fetchData(navigation, setUser, path, handleError);
    }, []),
  );

  return {
    loading: isFetching,
    user,
    setUser,
    fetchData,
    error,
  };
};

export default useCheckLogin;
