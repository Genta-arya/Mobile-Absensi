import {Endpoint} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';

export const HandleLogin = async (username, password) => {
  try {
    const response = await AxiosConfig.post(Endpoint.Login, {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
