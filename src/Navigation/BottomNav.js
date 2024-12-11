import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../View/Home/HomeScreen';
import ProfileScreen from '../View/Profile/ProfileScreen';
import {Colors} from '../Constant/Constant';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, Image, View} from 'react-native';
import {useAuthStore} from '../Library/Zustand/AuthStore';
import ListGrup from '../View/GrupKegiatan/components/ListGrup';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHistory} from '@fortawesome/free-solid-svg-icons';
import HistoryAbsensi from '../View/Notifikasi/AllHistory';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const {user} = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.grey,
      }}>
      <Tab.Screen
        name={'Homes'}
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesome5
              name="home"
              size={24}
              color={focused ? Colors.green : Colors.grey}
            />
          ),
          title: 'Home',
        }}
      />

      <Tab.Screen
        name={'ListGrups'}
        component={ListGrup}
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesome5
              name="list"
              size={24}
              color={focused ? Colors.green : Colors.grey}
            />
          ),
          title: 'Groups',
        }}
      />

      <Tab.Screen
        name={'History'}
        component={HistoryAbsensi}
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesomeIcon
              icon={faHistory}
              size={24}
              color={focused ? Colors.green : Colors.grey}
            />
          ),
          title: 'History Absensi',
        }}
      />

      <Tab.Screen
        name={'Profiles'}
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{uri: user.avatar}} style={styles.avatar} />
              ) : (
                <FontAwesome5 name="user" size={24} color={Colors.grey} />
              )}
            </View>
          ),
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    backgroundColor: '#ffffff',

    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  tabBarItem: {
    padding: 5,
    margin: 0,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderColor: Colors.green,
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});
