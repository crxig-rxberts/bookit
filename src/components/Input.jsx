import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {colours} from '../styles/colours';

const Input = ({placeholder, secureTextEntry, ...props}) => (
  <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={colours.textLight} secureTextEntry={secureTextEntry} {...props} />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colours.white,
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: colours.text,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Input;
