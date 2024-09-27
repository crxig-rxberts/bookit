import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Input from '../Input';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';

const Step1AccountInfo = ({providerData, handleInputChange, errors}) => {
  return (
    <View>
      <Text style={styles.stepTitle}>Account Information</Text>
      <Input
        placeholder="Email"
        value={providerData.email}
        onChangeText={text => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        textContentType="emailAddress"
        inputMode="email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <Input placeholder="Password" value={providerData.password} onChangeText={text => handleInputChange('password', text)} secureTextEntry />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Input
        placeholder="Confirm Password"
        value={providerData.confirmPassword}
        onChangeText={text => handleInputChange('confirmPassword', text)}
        secureTextEntry
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  stepTitle: {
    ...fontStyles.subtitle,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colours.error,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Step1AccountInfo;
