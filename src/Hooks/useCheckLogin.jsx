import React, {useEffect, useState} from 'react';
import {CheckSession} from '../Service/API/Authentikasi/Service_Authentikasi';
import {useAuthStore} from '../Library/Zustand/AuthStore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {pathScreen} from '../Constant/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useModalStore } from '../Library/Zustand/modalStore';

const useCheckLogin = () => {
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useAuthStore();
  const path = useRoute();
  const navigate = useNavigation();
  const {isOpen , onOpen, onClose} = useModalStore();
  const fetchData = async () => {
    const tokenString = await AsyncStorage.getItem('token');
    const token = tokenString ? JSON.parse(tokenString) : null;

  

    setLoading(true);
    try {
      const response = await CheckSession(token);

      setUser(response.data);

      if (response.data.name === null) {
        onOpen();
        navigate.navigate(pathScreen.Profile);
      }
      if (path.name === 'Login') {
        navigate.navigate(pathScreen.Home);
      }
    } catch (error) {
      console.log(error);
      navigate.navigate(pathScreen.Login);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    loading,
    user,
  };
};

export default useCheckLogin;
