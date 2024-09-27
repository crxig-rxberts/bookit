import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colours} from '../styles/colours';

const Button = ({title, onPress, style}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colours.black,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: colours.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
