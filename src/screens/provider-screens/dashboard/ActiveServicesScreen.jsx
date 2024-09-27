import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {getProviderData} from '../../../clients/providerService';
import {colours} from '../../../styles/colours';

const ServiceCard = ({name, cost}) => (
  <View style={styles.serviceCard}>
    <Icon name="briefcase-outline" size={24} color={colours.text} style={styles.serviceIcon} />
    <View style={styles.serviceInfo}>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.serviceCost}>${cost}</Text>
    </View>
  </View>
);

const ActiveServicesScreen = () => {
  const navigation = useNavigation();
  const [providerData, setProviderData] = useState(null);
  const userSub = useSelector(state => state.auth.userSub);

  const fetchProviderData = useCallback(async () => {
    try {
      const response = await getProviderData(userSub);
      if (response.success) {
        setProviderData(response.data);
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  }, [userSub]);

  useFocusEffect(
    useCallback(() => {
      fetchProviderData();
    }, [fetchProviderData]),
  );

  const navigateToEditServices = () => {
    navigation.navigate('ManageServices');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colours.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Services</Text>
        </View>

        {providerData?.services && providerData.services.length > 0 ? (
          providerData.services.map((service, index) => <ServiceCard key={index} name={service.name} cost={service.cost} />)
        ) : (
          <Text style={styles.noServicesText}>No active services found.</Text>
        )}

        <TouchableOpacity style={styles.editButton} onPress={navigateToEditServices}>
          <Icon name="pencil" size={20} color={colours.background} />
          <Text style={styles.editButtonText}>Edit Services</Text>
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
    color: colours.text,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colours.black,
  },
  serviceIcon: {
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 4,
  },
  serviceCost: {
    fontSize: 16,
    color: colours.textLight,
  },
  noServicesText: {
    fontSize: 16,
    color: colours.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.black,
    borderRadius: 12,
    padding: 16,
    margin: 20,
  },
  editButtonText: {
    color: colours.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ActiveServicesScreen;
