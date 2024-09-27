import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {getProviderData, updateProviderData} from '../../../clients/providerService';
import {colours} from '../../../styles/colours';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [providerData, setProviderData] = useState(null);
  const userSub = useSelector(state => state.auth.userSub);
  const categories = ['Barber', 'Spa', 'Home Services', 'Pet Care', 'Other'];

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await getProviderData(userSub);
        if (response.success) {
          setProviderData(response.data);
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
      }
    };

    fetchProviderData();
  }, [userSub]);

  const handleSaveChanges = async () => {
    try {
      await updateProviderData(userSub, providerData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating provider data:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setProviderData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

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

  if (!providerData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Provider Name</Text>
            <TextInput
              style={styles.input}
              value={providerData.providerName}
              onChangeText={text => handleInputChange('providerName', text)}
              placeholder="Enter provider name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={providerData.category} onValueChange={itemValue => handleInputChange('category', itemValue)} style={styles.picker}>
                {categories.map(category => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {providerData.providerImage ? (
              <View style={styles.imageContainer}>
                <Image source={{uri: providerData.providerImage}} style={styles.providerImage} />
                <View style={styles.editButtonContainer}>
                  <Icon name="pencil" size={20} color="#FFFFFF" />
                  <Text style={styles.editText}>Edit</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Icon name="cloud-upload" size={48} color="#4F6F52" />
                <Text style={styles.uploadText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colours.backgroundDark,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  imageUploadContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: colours.black,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  providerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EDF2',
    width: '100%',
    height: '100%',
  },
  uploadText: {
    marginTop: 12,
    color: '#4F6F52',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colours.black,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colours.black,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
