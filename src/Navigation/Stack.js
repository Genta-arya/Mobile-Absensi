import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../View/Home/HomeScreen';
import {pathScreen} from '../Constant/Constant';
import Login from '../View/Authentikasi/Login';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={pathScreen.Login}
          component={Login}
          options={{title: 'Welcome', headerShown: false}}
        />
        <Stack.Screen
          name={pathScreen.Home}
          component={HomeScreen}
          options={{title: 'Welcome', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
