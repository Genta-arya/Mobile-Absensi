import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../View/Home/HomeScreen';
import {Colors, pathScreen} from '../Constant/Constant';
import Login from '../View/Authentikasi/Login';
import ProfileScreen from '../View/Profile/ProfileScreen';
import {Pressable, Text} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MyTabs from './BottomNav';
import ListGrup from '../View/GrupKegiatan/components/ListGrup';
import HeaderLefts from '../Components/HeaderLeft';
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
          component={MyTabs}
          options={{title: 'Welcome', headerShown: false}}
        />
        <Stack.Screen
          name={pathScreen.Profile}
          component={ProfileScreen}
          options={({navigation}) => ({
            title: 'Profile',
            headerShown: true,
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: Colors.white,
            },
            statusBarAnimation: 'slide',
            headerLeft: () => (
              <>
                <HeaderLefts navigation={navigation} />
              </>
            ),
          })}
        />

        <Stack.Screen
          name={pathScreen.ListGrups}
          component={ListGrup}
          options={({navigation}) => ({
            title: 'Daftar Grup',
            headerShown: false,
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: Colors.white,
            },
            statusBarAnimation: 'slide',
            headerLeft: () => <HeaderLefts navigation={navigation} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
