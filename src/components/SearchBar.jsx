import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colours} from '../styles/colours';

const SearchBar = ({onChangeText}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      onChangeText(searchQuery.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color={colours.textLight} style={styles.icon} />
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder="Search services or a business"
        placeholderTextColor={colours.textLight}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Icon name="close-circle" size={18} color={colours.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colours.text,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colours.text,
    fontSize: 16,
    paddingVertical: 2,
  },
  inputFocused: {
    color: colours.text,
  },
  clearButton: {
    padding: 2,
  },
});

export default SearchBar;
