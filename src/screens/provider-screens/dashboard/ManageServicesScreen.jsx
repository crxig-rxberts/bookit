import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getProviderData, updateProviderData} from '../../../clients/providerService';
import {colours} from '../../../styles/colours';

const ManageServicesScreen = () => {
  const navigation = useNavigation();
  const [providerData, setProviderData] = useState(null);
  const [services, setServices] = useState([]);
  const userSub = useSelector(state => state.auth.userSub);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await getProviderData(userSub);
        if (response.success) {
          setProviderData(response.data);
          setServices(response.data.services || []);
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
      }
    };

    fetchProviderData();
  }, [userSub]);

  const handleSaveChanges = async () => {
    try {
      await updateProviderData(userSub, {...providerData, services});
      navigation.goBack();
    } catch (error) {
      console.error('Error updating provider data:', error);
    }
  };

  const addService = () => {
    setServices([...services, {name: '', cost: ''}]);
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const removeService = index => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
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
          <Text style={styles.headerTitle}>Manage Services</Text>
        </View>

        {services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <TextInput style={styles.input} placeholder="Service Name" value={service.name} onChangeText={text => updateService(index, 'name', text)} />
            <TextInput
              style={styles.input}
              placeholder="Service Cost"
              value={service.cost}
              onChangeText={text => updateService(index, 'cost', text)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeService(index)}>
              <Icon name="trash-can-outline" size={25} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addService}>
          <Icon name="plus" size={20} color="#000000" />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: colours.black,
  },
  input: {
    flex: 1,
    backgroundColor: colours.background,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colours.black,
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundDark,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: colours.black,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageServicesScreen;
