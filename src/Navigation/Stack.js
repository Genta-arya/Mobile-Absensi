import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors, pathScreen} from '../Constant/Constant';
import Login from '../View/Authentikasi/Login';
import ProfileScreen from '../View/Profile/ProfileScreen';
import MyTabs from './BottomNav';
import ListGrup from '../View/GrupKegiatan/components/ListGrup';
import HeaderLefts from '../Components/HeaderLeft';
import AgendaScreen from '../View/Agenda/AgendaScreen';
import {useGroupStore} from '../Library/Zustand/GrupStore';
import ErrorScreen from '../Components/ErrorScreen';
import FormKegiatan from '../View/Form/FormKegiatan';
import EditForm from '../View/Form/EditForm';
const Stack = createNativeStackNavigator();

const MyStack = () => {
  const {groupName} = useGroupStore();
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

        <Stack.Screen
          name={pathScreen.ListAgenda}
          component={AgendaScreen}
          options={({navigation}) => ({
            title: groupName,
            headerShown: true,
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: Colors.white,
            },
            statusBarAnimation: 'slide',
            headerLeft: () => <HeaderLefts navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name={'Error'}
          component={ErrorScreen}
          options={({navigation}) => ({
            title: groupName,
            headerShown: false,
            statusBarAnimation: 'slide',
          })}
        />
        <Stack.Screen
          name={'Form'}
          component={FormKegiatan}
          options={({navigation}) => ({
            title: 'Form Absensi',
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors.white,
            },
            statusBarAnimation: 'slide',
            headerLeft: () => <HeaderLefts navigation={navigation} />,
          })}
        />
         <Stack.Screen
          name={'EditForm'}
          component={EditForm}
          options={({navigation}) => ({
            title: 'Kembali',
            headerShown: true,
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
