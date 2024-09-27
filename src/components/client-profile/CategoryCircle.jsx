import React from 'react';
import {TouchableOpacity, Image, Text, View, StyleSheet} from 'react-native';
import {colours} from '../../styles/colours';

const CategoryCircle = ({image, onPress, title}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.imageContainer}>
      <Image source={image} style={styles.image} />
    </View>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colours.text,
    overflow: 'hidden',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: colours.text,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default CategoryCircle;
