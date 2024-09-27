import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateBookingStatus, getBookingDetails} from '../../../clients/bookingClient';
import {getProviderData} from '../../../clients/providerService';
import {getClient} from '../../../clients/clientsClient';

import {colours} from '../../../styles/colours';

const ProviderManageBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {bookingId, clientId} = route.params;
  const [booking, setBooking] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const bookingResponse = await getBookingDetails(bookingId, clientId);

        if (bookingResponse.success) {
          setBooking(bookingResponse.data);

          // Fetch service details
          const providerResponse = await getProviderData(bookingResponse.data.providerUserSub);
          if (providerResponse.success) {
            const service = providerResponse.data.services.find(s => s.id === bookingResponse.data.serviceId);
            setServiceDetails(service);
          }

          // Fetch client details
          const clientResponse = await getClient(clientId);
          if (clientResponse.success) {
            setClientDetails(clientResponse.data);
          }
        } else {
          console.error('Failed to fetch booking details:', bookingResponse.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [bookingId, clientId]);

  const handleUpdateBookingStatus = async status => {
    try {
      setLoading(true);
      await updateBookingStatus(bookingId, clientId, status);
      Alert.alert('Success', `Booking ${status} successfully.`);
      navigation.goBack();
    } catch (error) {
      console.error(`Error ${status} booking:`, error);
      Alert.alert('Error', `Failed to ${status} booking. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = () => {
    Alert.alert('Complete Booking', 'Are you sure you want to mark this booking as completed?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Complete', onPress: () => handleUpdateBookingStatus('completed')},
    ]);
  };

  const handleCancelBooking = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', onPress: () => handleUpdateBookingStatus('cancelled')},
    ]);
  };

  const handleConfirmBooking = () => {
    Alert.alert('Confirm Booking', 'Are you sure you want to confirm this booking?', [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', onPress: () => handleUpdateBookingStatus('confirmed')},
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  if (!booking) {
    console.log('Booking data is null or undefined');
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load booking information.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colours.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Booking</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Booking Details</Text>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color={colours.text} style={styles.icon} />
            <Text style={styles.infoText}>
              {booking.timeslotId ? new Date(booking.timeslotId.split('-').slice(0, 3).join('-')).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={20} color={colours.text} style={styles.icon} />
            <Text style={styles.infoText}>{booking.timeslotId ? booking.timeslotId.split('-')[3] : 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="tag-outline" size={20} color={colours.text} style={styles.icon} />
            <Text style={styles.infoText}>{serviceDetails ? serviceDetails.name : 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="cash-multiple" size={20} color={colours.text} style={styles.icon} />
            <Text style={styles.infoText}>£{serviceDetails ? serviceDetails.cost : 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="flag" size={20} color={getStatusColor(booking.status)} style={styles.icon} />
            <Text style={[styles.infoText, {color: getStatusColor(booking.status)}]}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1) || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Client Information</Text>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={colours.text} style={styles.icon} />
            <Text style={styles.infoText}>{clientDetails ? clientDetails.clientName : 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {booking.status === 'confirmed' && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteBooking}>
              <Text style={styles.buttonText}>Complete Booking</Text>
            </TouchableOpacity>
          )}
          {['pending', 'confirmed'].includes(booking.status) && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
          {booking.status === 'pending' && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
              <Text style={styles.buttonText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return colours.warning;
    case 'confirmed':
      return colours.success;
    case 'cancelled':
      return colours.error;
    case 'completed':
      return colours.info;
    default:
      return colours.text;
  }
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
    borderBottomColor: colours.text,
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
    backgroundColor: colours.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colours.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colours.text,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colours.text,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: colours.info,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: colours.error,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: colours.successMuted,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: colours.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: colours.error,
    textAlign: 'center',
  },
});

export default ProviderManageBookingScreen;
