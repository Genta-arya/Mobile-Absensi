import React, {useEffect} from 'react';
import {View, Animated, StyleSheet, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import logo from '../../Assets/Image/logos.png';

const Splash = () => {
  const navigate = useNavigation();
  const fadeAnim = new Animated.Value(0); 
  const scaleAnim = new Animated.Value(0.5); 

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

  
    const timer = setTimeout(() => {
      navigate.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="light-content" />
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]}, 
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
  },
  logo: {
    width: 150, 
    height: 150,
  },
});

export default Splash;
