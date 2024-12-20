import {API_URL} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';

export const getAgenda = async data => {
  try {
    const response = await AxiosConfig.post(API_URL + `/find/agenda`, {
      groupId: data.groupId,
      userId: data.userId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const claimAgenda = async data => {
  try {
    const response = await AxiosConfig.post(API_URL + `/claim/agenda`, {
      idAgenda: data.idAgenda,
      idUser: data.idUser,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const historyAgenda = async data => {
  console.log('id:' + data);

  try {
    const response = await AxiosConfig.post(API_URL + `/history/agenda`, {
      id: data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAgenda = async id => {
  try {
    const response = await AxiosConfig.get(API_URL + `/history/agenda/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getForm = async id => {
  console.log(id);
  try {
    const response = await AxiosConfig.get(API_URL + `/form/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
