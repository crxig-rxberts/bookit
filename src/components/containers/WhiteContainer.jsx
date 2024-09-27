import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colours} from '../../styles/colours';

const WhiteContainer = ({children}) => <View style={styles.container}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: colours.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
  },
});

export default WhiteContainer;
