import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateBookingStatus, getBookingDetails} from '../../clients/bookingClient';
import {getProviderData} from '../../clients/providerService';
import {colours} from '../../styles/colours';

const ManageAppointmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {bookingId, clientId} = route.params;
  const [booking, setBooking] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingAndProviderData = async () => {
      try {
        const bookingResponse = await getBookingDetails(bookingId, clientId);
        setBooking(bookingResponse.data);

        const providerResponse = await getProviderData(bookingResponse.data.providerUserSub);
        setProvider(providerResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking and provider data:', error);
        setLoading(false);
      }
    };

    fetchBookingAndProviderData();
  }, [bookingId, clientId]);

  const handleCancelBooking = async () => {
    try {
      await updateBookingStatus(bookingId, clientId, 'cancelled');
      navigation.goBack();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleCancelAndRebook = async () => {
    try {
      await updateBookingStatus(bookingId, clientId, 'cancelled');
      navigation.navigate('BookAppointment', {providerUserSub: booking.providerUserSub});
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colours.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Appointment</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Appointment Details</Text>
          <Text style={styles.infoText}>Provider: {provider.providerName}</Text>
          <Text style={styles.infoText}>Date: {new Date(booking.timeslotId.split('-').slice(0, 3).join('-')).toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Time: {booking.timeslotId.split('-')[3]}</Text>
          <Text style={styles.infoText}>Service: {provider.services.find(s => s.id === booking.serviceId).name}</Text>
          <Text style={styles.infoText}>Status: {booking.status}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
            <Text style={styles.buttonText}>Cancel Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rebookButton} onPress={handleCancelAndRebook}>
            <Text style={styles.buttonText}>Cancel and Rebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colours.black,
    backgroundColor: colours.backgroundDark,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colours.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.black,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colours.text,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colours.error,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  rebookButton: {
    flex: 1,
    backgroundColor: colours.black,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageAppointmentScreen;
