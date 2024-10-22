import { Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { HandleLogin } from '../../Service/API/Authentikasi/Service_Authentikasi';
import Icon from 'react-native-vector-icons/FontAwesome';
const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

  const HandleLogins = async () => {
    try {

        const  response = await HandleLogin(nim, password);
        showMessage({
            message: response.message,
            type: 'success',
            icon: 'success',
            position: 'bottom',
        })
        
    } catch (error) {

        console.log(error);
       showMessage({
           message: error.message,
           type: 'danger',
       })
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20
    }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#f5f5f5'}  />
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'black'
      }}>

        Login to Your Account
      </Text>

      <TextInput
        placeholder="NIM"
        value={nim}
        placeholderTextColor={'#ccc'}
        onChangeText={(text) => setNim(text)}
        style={{
          width: '100%',
          height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingLeft: 15,
          marginBottom: 20,
          backgroundColor: '#fff'
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor={'#ccc'}
        style={{
          width: '100%',
          height: 50,
          borderColor: '#ccc',
          
          borderWidth: 1,
          borderRadius: 8,
          paddingLeft: 15,
          marginBottom: 30,
          backgroundColor: '#fff'
        }}
      />

      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#4CAF50',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8
        }}
        onPress={() => {
          // Handle login logic here
          HandleLogins();
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
