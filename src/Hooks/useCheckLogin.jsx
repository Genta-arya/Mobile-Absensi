import React, {useEffect, useState} from 'react';

import {useAuthStore} from '../Library/Zustand/AuthStore';
import {useNavigation, useRoute} from '@react-navigation/native';

import {useModalStore} from '../Library/Zustand/modalStore';

import useUserStore from '../Library/Zustand/SessionStore';
import useErrorHandler from './useErrorHandler';

const useCheckLogin = () => {
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useAuthStore();
  const route = useRoute();
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const {fetchData, isFetching} = useUserStore();
  const handleError = useErrorHandler();
  const path = route.name
  useEffect(() => {
    fetchData(navigation, setUser, path , handleError);
  }, [navigation, setUser, path ]);

  return {
    loading: isFetching,
    user,
    fetchData,
    error,
  };
};

export default useCheckLogin;
