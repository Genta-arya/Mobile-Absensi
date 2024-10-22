import { Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';

const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

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
          console.log(`NIM: ${nim}, Password: ${password}`);
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
