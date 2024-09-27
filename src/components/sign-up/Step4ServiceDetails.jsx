import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';
import Input from '../Input';

const Step4ServiceDetails = ({providerData, handleInputChange, errors}) => {
  const [services, setServices] = useState(providerData.services || []);

  const addService = () => {
    setServices([...services, {name: '', cost: ''}]);
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
    handleInputChange('services', updatedServices);
  };

  const removeService = index => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    handleInputChange('services', updatedServices);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.stepTitle}>Service Details</Text>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceContainer}>
          <Input placeholder="Service Name" value={service.name} onChangeText={text => updateService(index, 'name', text)} />
          <Input placeholder="Service Cost" value={service.cost} onChangeText={text => updateService(index, 'cost', text)} keyboardType="numeric" />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeService(index)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addService}>
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>
      {errors.services && <Text style={styles.errorText}>{errors.services}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepTitle: {
    ...fontStyles.subtitle,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  serviceContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colours.inputBackground,
    paddingBottom: 10,
  },
  addButton: {
    backgroundColor: colours.black,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: colours.inputBackground,
    ...fontStyles.body,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: colours.error,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 2,
    borderColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButtonText: {
    color: colours.white,
    fontWeight: 'bold',
    ...fontStyles.body,
  },
  errorText: {
    color: colours.error,
    ...fontStyles.caption,
    marginTop: 5,
  },
});

export default Step4ServiceDetails;
