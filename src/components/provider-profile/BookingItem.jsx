import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colours} from '../../styles/colours';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookingItem = ({booking, onPress, onConfirm}) => (
  <TouchableOpacity style={styles.bookingItem} onPress={onPress}>
    <View style={styles.bookingHeader}>
      <View style={styles.timeContainer}>
        <Icon name="clock-outline" size={18} color={colours.text} style={styles.icon} />
        <Text style={styles.bookingTime}>{booking.timeslotId.split('-')[3]}</Text>
      </View>
      <Text style={[styles.bookingStatus, {color: getStatusColor(booking.status)}]}>{booking.status || 'Confirmed'}</Text>
    </View>
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Icon name="calendar" size={16} color={colours.textLight} style={styles.icon} />
        <Text style={styles.bookingDate}>{new Date(booking.timeslotId.split('-').slice(0, 3).join('-')).toLocaleDateString()}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="briefcase-outline" size={16} color={colours.textLight} style={styles.icon} />
        <Text style={styles.bookingService}>{booking.serviceName || 'Unknown Service'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="cash-multiple" size={16} color={colours.textLight} style={styles.icon} />
        <Text style={styles.bookingCost}>£{booking.serviceCost || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="account" size={16} color={colours.textLight} style={styles.icon} />
        <Text style={styles.bookingClient}>{booking.clientName || 'Unknown Client'}</Text>
      </View>
    </View>
    {booking.status === 'pending' && (
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

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
  bookingItem: {
    backgroundColor: colours.surface,
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colours.text,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  bookingDate: {
    fontSize: 14,
    color: colours.text,
  },
  bookingService: {
    fontSize: 14,
    color: colours.text,
    fontWeight: '500',
  },
  bookingCost: {
    fontSize: 14,
    color: colours.text,
    fontWeight: '500',
  },
  bookingClient: {
    fontSize: 14,
    color: colours.text,
  },
  confirmButton: {
    backgroundColor: colours.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  confirmButtonText: {
    color: colours.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BookingItem;
