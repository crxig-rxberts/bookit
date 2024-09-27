import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {colours} from '../../styles/colours';

const PreviouslyVisitedItem = ({name, image, onPress}) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Image source={image} style={styles.backgroundImage} />
    <View style={styles.overlay}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bookAgain}>Book again →</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const PreviouslyVisited = ({items}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Previously visited</Text>
    {items.map((item, index) => (
      <PreviouslyVisitedItem key={index} {...item} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colours.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colours.text,
  },
  itemContainer: {
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.text,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '33%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 16,
    color: colours.text,
    fontWeight: 'bold',
  },
  bookAgain: {
    color: colours.text,
    fontWeight: 'bold',
  },
});

export default PreviouslyVisited;
