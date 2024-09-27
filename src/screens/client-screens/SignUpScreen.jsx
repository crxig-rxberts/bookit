import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, View, TouchableOpacity, Alert} from 'react-native';
import {colours} from '../../styles/colours';
import {fonts, fontStyles} from '../../styles/fonts';
import Input from '../../components/Input';
import Button from '../../components/Button';
import SubtitleContainer from '../../components/containers/SubtitleContainer';
import WhiteContainer from '../../components/containers/WhiteContainer';
import {useNavigation} from '@react-navigation/native';
import {signUpUser} from '../../clients/userService';

const SignUpScreen = () => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await signUpUser(email, password, email, 'CLIENT', null, clientName);

      if (response.success) {
        navigateToConfirmationCode(email);
      } else {
        Alert.alert('Sign-Up Failed', response.message);
      }
    } catch (error) {
      console.error('Sign-Up error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToProviderSignUp = () => {
    navigation.navigate('ProviderSignUp');
  };

  const navigateToConfirmationCode = clientEmail => {
    navigation.navigate('ConfirmationCode', {email: clientEmail});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <SubtitleContainer subtitle="Sign up">
          <WhiteContainer>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.clientRegistration}>Client registration</Text>
              <TouchableOpacity onPress={navigateToProviderSignUp}>
                <View>
                  <Text style={styles.providerLink}>To be a bookit service provider click here →</Text>
                </View>
              </TouchableOpacity>
              <Input placeholder="Full Name" value={clientName} onChangeText={setClientName} autoCapitalize="none" />
              <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Input placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              <TouchableOpacity onPress={navigateToLogin}>
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account?</Text>
                  <Text style={styles.loginLink}>Log in →</Text>
                </View>
              </TouchableOpacity>
              <Button title="Register →" onPress={handleSignUp} />
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
    backgroundColor: colours.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
  },
  clientRegistration: {
    ...fontStyles.subtitle,
    color: colours.text,
    marginBottom: 20,
  },
  providerLink: {
    ...fontStyles.body,
    fontWeight: 'bold',
    fontSize: 17,
    color: colours.text,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    ...fontStyles.body,
    color: colours.text,
  },
  loginLink: {
    ...fontStyles.body,
    fontFamily: fonts.medium,
    fontWeight: 'bold',
    color: colours.text,
    marginLeft: 5,
  },
});

export default SignUpScreen;
