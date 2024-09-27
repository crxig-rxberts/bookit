import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colours} from '../../styles/colours';
import {fonts, fontSizes, fontStyles} from '../../styles/fonts';

const SubtitleContainer = ({children, subtitle}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>bookit</Text>
    </View>
    <Text style={styles.subtitle}>{subtitle}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  header: {
    padding: 20,
  },
  title: {
    ...fontStyles.title,
    color: colours.text,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.extraLarge * 2,
    color: colours.text,
    paddingTop: 40,
    marginBottom: 10,
    paddingLeft: 20,
  },
});

export default SubtitleContainer;
