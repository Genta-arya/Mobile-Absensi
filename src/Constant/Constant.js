import NetWrokError from "../Assets/Image/NetworkError.png"
import Empty from "../Assets/Image/empty.png"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



// export const API_URL = 'https://dev-absensi.hkks.shop/api/v1';
export const API_URL = 'http://192.168.0.3:3008/api/v1';


export const Endpoint = {
  Login: `${API_URL}/login`,
  Session: `${API_URL}/session`,
  Logout: `${API_URL}/logout`,
};



export const Icons = {
  FontAwesome5: FontAwesome5,
}


export const Colors = {
  red: '#b9c1c',
  green: '#15803d',
  grey: '#374151',
  blue: '#1e40af',
  primary: '#001238',
  white: '#f5f5f5',
};

export const pathScreen = {
  Login: 'Login',
  Home: 'Home',
  Profile: 'Profile',
  ListGrups : "ListGrup",
  ListAgenda : "ListAgenda",
}

export const images = {
  ErrorNetwork : NetWrokError,
  Empty : Empty
}