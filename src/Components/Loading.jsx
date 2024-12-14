import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import React from 'react';
import {Colors} from '../Constant/Constant';

const Loading = ({loading}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      onRequestClose={() => {}}>
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.8)"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <View style={{flexDirection: 'row', alignItems: 'center' , gap: 12}}>
            <ActivityIndicator size="large" color={Colors.green} />
            <Text style={{color: Colors.green , fontWeight: 'bold'}}>Tunggu sebentar...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingBox: {
    width: 200,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default Loading;
