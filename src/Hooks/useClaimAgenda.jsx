import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useAuthStore} from '../Library/Zustand/AuthStore';
import useErrorHandler from './useErrorHandler';
import {claimAgenda} from '../Service/API/Agenda/Service_Agenda';
import {showMessage} from 'react-native-flash-message';

const useClaimAgenda = () => {
  const {user} = useAuthStore();
  const [loading, setLoading] = useState(false);
  const handleError = useErrorHandler();

  const claim = async idAgenda => {
    setLoading(true);
    try {
      await claimAgenda({
        idAgenda: idAgenda,
        idUser: user.id,
      });
      showMessage({
        message: 'Berhasil',
        description: 'Agenda berhasil di claim',
        type: 'success',
        icon: 'success',
      });
    } catch (error) {
      if (error.response.status === 400) {
        showMessage({
         message: 'Notifikasi',
          description: error.response.data.message,
          type: 'info',
          icon: 'info',
        });
      } else {
        handleError(error, '*');
      }
 
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    claim,
  };
};

export default useClaimAgenda;
