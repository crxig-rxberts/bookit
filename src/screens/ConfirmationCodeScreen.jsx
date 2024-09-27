import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colours} from '../styles/colours';
import ConfirmationCode from '../components/ConfirmationCode';
const ConfirmationCodeScreen = ({route}) => {
  const {email} = route.params;
  const navigation = useNavigation();

  const handleConfirmationSuccess = () => {
    navigation.navigate('Login');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationCode email={email} onConfirmationSuccess={handleConfirmationSuccess} onNavigateToLogin={handleNavigateToLogin} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    justifyContent: 'center',
  },
});

export default ConfirmationCodeScreen;
