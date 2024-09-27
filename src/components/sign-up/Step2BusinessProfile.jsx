import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Input from '../Input';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';

const Step2BusinessProfile = ({providerData, handleInputChange, errors}) => {
  const categories = ['Barber', 'Spa', 'Home Services', 'Pet Care', 'Other'];

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 300,
      maxWidth: 400,
      quality: 0.5,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const base64Image = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
        handleInputChange('providerImage', base64Image);
      }
    });
  };

  return (
    <View>
      <Text style={styles.stepTitle}>Business Profile</Text>
      <Input placeholder="Provider Name" value={providerData.providerName} onChangeText={text => handleInputChange('providerName', text)} />
      {errors.providerName && <Text style={styles.errorText}>{errors.providerName}</Text>}

      <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
        {providerData.providerImage ? (
          <Image source={{uri: providerData.providerImage}} style={styles.providerImage} />
        ) : (
          <Text style={styles.uploadText}>Upload Provider Image</Text>
        )}
      </TouchableOpacity>
      {errors.providerImage && <Text style={styles.errorText}>{errors.providerImage}</Text>}

      <Text style={styles.labelText}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={providerData.category} onValueChange={itemValue => handleInputChange('category', itemValue)} style={styles.picker}>
          <Picker.Item label="Select a category" value="" />
          {categories.map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  stepTitle: {
    ...fontStyles.subtitle,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: colours.text,
    backgroundColor: colours.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadText: {
    color: colours.text,
    fontSize: 16,
  },
  labelText: {
    ...fontStyles.body,
    color: colours.text,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colours.text,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: colours.error,
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Step2BusinessProfile;
