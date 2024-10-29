import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors, images } from '../Constant/Constant';
import useUserStore from '../Library/Zustand/SessionStore';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

const ErrorScreen = () => {
  const { fetchData, hasError, isFetching } = useUserStore();

  if (isFetching) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Image source={images.ErrorNetwork} style={styles.image} />
     
      <TouchableOpacity style={styles.button} onPress={fetchData} activeOpacity={0.8}>
        <FontAwesomeIcon icon={faRefresh} size={24} color="white" />
        <Text style={styles.buttonText}>Coba lagi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  image: {
    width: 250,
    height:300,
    marginBottom: 20,
    borderRadius: 10, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
 
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10, 
  },
};

export default ErrorScreen;
