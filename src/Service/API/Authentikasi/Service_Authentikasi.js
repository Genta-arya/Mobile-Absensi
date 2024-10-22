import {Endpoint} from '../../../Constant/Constant';
import {AxiosConfig} from '../../AxiosConfig';

export const HandleLogin = async (username, password) => {

    console.log(Endpoint.Login)
  try {
    const response = await AxiosConfig.post(Endpoint.Login, {
      nim: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
