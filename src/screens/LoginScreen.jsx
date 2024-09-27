import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {colours} from '../styles/colours';
import {fonts, fontStyles} from '../styles/fonts';
import Input from '../components/Input';
import Button from '../components/Button';
import SubtitleContainer from '../components/containers/SubtitleContainer';
import WhiteContainer from '../components/containers/WhiteContainer';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../clients/userService';
import {setAuthData} from '../store/authSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);

      if (response.success) {
        dispatch(setAuthData(response.data));

        // Navigate based on user type
        const userType = response.data.userAttributes.userType;
        if (userType === 'SERVICE_PROVIDER') {
          navigation.navigate('ProviderDashboard');
        } else if (userType === 'CLIENT') {
          navigation.navigate('ClientLandingPage');
        } else {
          Alert.alert('Error', 'Invalid user type');
        }
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <SubtitleContainer subtitle="Log in">
          <WhiteContainer>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Text style={styles.forgotPassword}>Forgotten password?</Text>
              <Button title="Log in →" onPress={handleLogin} />
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={styles.signUpText}>
                  New here? <Text style={styles.signUpLink}>Sign up now →</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </WhiteContainer>
        </SubtitleContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.black,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  forgotPassword: {
    ...fontStyles.body,
    color: colours.text,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 20,
  },
  signUpText: {
    ...fontStyles.body,
    color: colours.text,
    textAlign: 'center',
    marginTop: 20,
  },
  signUpLink: {
    ...fontStyles.body,
    fontFamily: fonts.medium,
    fontWeight: 'bold',
    color: colours.text,
  },
});

export default LoginScreen;
