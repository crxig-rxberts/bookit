import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {colours} from '../../styles/colours';
import {getClientBookings} from '../../clients/bookingClient';
import {getProvider} from '../../clients/providerClient';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AppointmentItem = ({date, service, location, bookingId, clientId, status}) => {
  const navigation = useNavigation();

  const handleManage = () => {
    navigation.navigate('ManageAppointment', {bookingId, clientId});
  };

  return (
    <View style={[styles.itemContainer, status === 'pending' && styles.pendingContainer]}>
      <View style={[styles.indicatorBar, status === 'pending' && styles.pendingIndicator]} />
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.serviceLocationContainer}>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.service}>{service}</Text>
          </View>
          <TouchableOpacity onPress={handleManage} style={styles.manageButton}>
            <Text style={styles.manage}>Manage</Text>
            <Icon name="chevron-right" size={20} color={colours.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AppointmentList = ({appointments, title}) => (
  <View style={styles.listContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {appointments.length > 0 ? (
      <FlatList data={appointments} renderItem={({item}) => <AppointmentItem {...item} />} keyExtractor={(item, index) => `${item.bookingId}-${index}`} />
    ) : (
      <Text style={styles.noAppointmentsText}>No {title.toLowerCase()}</Text>
    )}
  </View>
);

const Appointments = ({userSub, refreshTrigger}) => {
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, [userSub, refreshTrigger, fetchAppointments]);

  const fetchAppointments = useCallback(async () => {
    try {
      const bookingsResponse = await getClientBookings(userSub);
      const formattedAppointments = await Promise.all(
        bookingsResponse.data.map(async booking => {
          const providerResponse = await getProvider(booking.providerUserSub);
          const provider = providerResponse.data;
          const service = provider.services.find(s => s.id === booking.serviceId);

          const date = new Date(booking.timeslotId.split('-').slice(0, 3).join('-'));
          const time = booking.timeslotId.split('-')[3];
          const formattedDate = `${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}, ${time}`;

          return {
            date: formattedDate,
            service: service ? service.name : 'Unknown Service',
            location: provider.providerName,
            bookingId: booking.id,
            clientId: userSub,
            status: booking.status || 'confirmed',
          };
        }),
      );

      setConfirmedAppointments(formattedAppointments.filter(app => app.status === 'confirmed'));
      setPendingAppointments(formattedAppointments.filter(app => app.status === 'pending'));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }, [userSub]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Appointments</Text>
      <AppointmentList appointments={confirmedAppointments} title="Confirmed Appointments" />
      <AppointmentList appointments={pendingAppointments} title="Pending Appointments" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colours.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colours.text,
  },
  listContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: colours.text,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colours.success,
  },
  pendingContainer: {
    backgroundColor: '#ffffff',
    borderColor: colours.warning,
  },
  indicatorBar: {
    width: 6,
    backgroundColor: colours.successMuted,
  },
  pendingIndicator: {
    backgroundColor: colours.warning,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  date: {
    color: colours.text,
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLocationContainer: {
    flex: 1,
  },
  service: {
    color: colours.textLight,
    fontSize: 14,
  },
  location: {
    color: colours.text,
    fontSize: 15,
    marginBottom: 2,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.lightPrimary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  manage: {
    color: colours.text,
    fontWeight: '600',
    marginRight: 4,
  },
  noAppointmentsText: {
    color: colours.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default Appointments;
