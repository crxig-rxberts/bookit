import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';
import SectionDivider from '../SectionDivider';

const BasicContainer = ({children}) => (
  <View style={styles.container}>
    <Text style={styles.title}>bookit</Text>
    <SectionDivider />
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  title: {
    ...fontStyles.title,
    color: colours.text,
    paddingVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BasicContainer;
