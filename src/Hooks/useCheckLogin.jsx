import React, {useEffect, useState} from 'react';
import {CheckSession} from '../Service/API/Authentikasi/Service_Authentikasi';
import {useAuthStore} from '../Library/Zustand/AuthStore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {pathScreen} from '../Constant/Constant';

const useCheckLogin = () => {
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useAuthStore();
  const path = useRoute();
  const navigate = useNavigation();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await CheckSession();
     
      setUser(response.data);
      if (path.name === 'Login') {
        navigate.navigate(pathScreen.Home);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return {
    loading,
    user
  };
};

export default useCheckLogin;
