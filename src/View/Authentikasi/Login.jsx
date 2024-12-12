import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HandleLogin} from '../../Service/API/Authentikasi/Service_Authentikasi';
import {useAuthStore} from '../../Library/Zustand/AuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pathScreen} from '../../Constant/Constant';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk mengatur visibilitas password
  const {user, setUser} = useAuthStore();
  const navigate = useNavigation();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      const token = tokenString ? JSON.parse(tokenString) : null;
      setToken(token);
    } catch (error) {
      console.log('Error mengambil token:', error);
    }
  };

  const saveToken = async tokenData => {
    try {
      await AsyncStorage.setItem('token', JSON.stringify(tokenData));
    } catch (error) {
      console.error('Error menyimpan token:', error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token !== null) {
      navigate.reset({
        index: 0,
        routes: [{name: pathScreen.Home}],
      });
    }
  }, [token]);

  const HandleLogins = async () => {
    try {
      if (nim === '' || password === '') {
        showMessage({
          message: 'Username atau password tidak boleh kosong',
          type: 'info',
          icon: 'danger',
          position: 'bottom',
        });
        return;
      }
      setLoading(true);
      const response = await HandleLogin(nim, password);
      showMessage({
        message: response.message,
        type: 'success',
        icon: 'success',
        position: 'bottom',
      });

      setUser(response.data);

      saveToken(response.data.token);

      navigate.reset({
        index: 0,
        routes: [{name: pathScreen.Home}],
      });
    } catch (error) {
      showMessage({
        message: error.response?.data.message || 'Gagal terhubung ke server , coba lagi',
        type: 'danger',
        icon: 'danger',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={'#f5f5f5'} />
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 30,
          color: 'black',
        }}>
        Login to Your Account
      </Text>

      <TextInput
        placeholder="NIM"
        value={nim}
        placeholderTextColor={'#ccc'}
        onChangeText={text => setNim(text)}
        style={{
          width: '100%',
          height: 50,
          borderColor: '#ccc',
          color: 'black',
          borderWidth: 1,
          borderRadius: 8,
          paddingLeft: 15,
          marginBottom: 20,
          backgroundColor: '#fff',
        }}
      />

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 30,
        }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={!showPassword}
          placeholderTextColor={'#ccc'}
          style={{
            flex: 1,
            height: 50,
            paddingLeft: 15,
            color: 'black',
          }}
        />
        <TouchableOpacity
        activeOpacity={0.9}
          onPress={() => setShowPassword(!showPassword)}
          style={{
            paddingHorizontal: 10,
          }}>
          <Text style={{color: showPassword ? '#4CAF50' : '#ccc'}}>
            {showPassword ? <FontAwesomeIcon  icon={faEye} /> : <FontAwesomeIcon  icon={faEyeSlash}/>}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        disabled={loading}
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#4CAF50',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
        onPress={() => {
          HandleLogins();
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;
