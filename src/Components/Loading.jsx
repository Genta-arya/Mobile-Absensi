import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

const Loading = ({ loading }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      onRequestClose={() => {}} // Agar modal tidak tertutup saat menekan tombol back
    >
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#4CAF50" />
         
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Warna latar belakang transparan gelap
  },
  loadingBox: {
    width: 150,
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