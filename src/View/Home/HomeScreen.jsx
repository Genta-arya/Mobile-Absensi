import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import useCheckLogin from '../../Hooks/useCheckLogin';
import Loading from '../../Components/Loading';
import Container from '../../Components/Container';
import Header from './components/Header';

const HomeScreen = () => {
  const {loading, user} = useCheckLogin();

  if (loading) return <Loading />;
  return (
    <Container>
      <View style={{flexDirection: "column"}}>
        <Header user={user} />
      </View>
    </Container>
  );
};
 
export default HomeScreen;

const styles = StyleSheet.create({});
