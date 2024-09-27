import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {colours} from '../styles/colours';
import {fonts, fontStyles} from '../styles/fonts';
import {confirmRegistration} from '../clients/userService';

const {height, width} = Dimensions.get('window');

const ConfirmationCode = ({email, onConfirmationSuccess, onNavigateToLogin, userType}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleConfirmation = async () => {
    const confirmationCode = code.join('');
    if (confirmationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    try {
      const response = await confirmRegistration(email, confirmationCode);
      if (response.success) {
        Alert.alert('Success', 'Registration confirmed successfully');
        onConfirmationSuccess();
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleResendCode = () => {
    Alert.alert('Resend Code', 'A new code has not been sent to your email.');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Your Email</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit code to {email}. Enter it below to confirm your account.</Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirmation}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNavigateToLogin} style={styles.loginContainer}>
          <Text style={styles.loginText}>Already confirmed? </Text>
          <Text style={styles.loginLink}>Log in →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colours.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    height: height * 0.75,
  },
  title: {
    ...fontStyles.title,
    color: colours.text,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    ...fontStyles.body,
    color: colours.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30,
  },
  codeInput: {
    width: width * 0.11,
    height: 55,
    borderWidth: 1,
    margin: width * 0.01,
    borderColor: colours.text,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: colours.text,
  },
  button: {
    backgroundColor: colours.black,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.buttonText,
  },
  resendText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  },
});

export default ConfirmationCode;
