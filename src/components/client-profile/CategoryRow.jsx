import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import CategoryCircle from './CategoryCircle';
import {colours} from '../../styles/colours';

const CategoryRow = ({categories}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Service Categories</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {categories.map((category, index) => (
        <CategoryCircle key={index} image={category.image} onPress={category.onPress} title={category.title} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colours.background,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  title: {
    paddingLeft: 20,
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: colours.text,
  },
});

export default CategoryRow;
