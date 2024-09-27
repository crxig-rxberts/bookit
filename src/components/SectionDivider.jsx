import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colours} from '../styles/colours';

const SectionDivider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colours.text,
  },
});

export default SectionDivider;
