import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getProviderBookings, updateBookingStatus} from '../../../clients/bookingClient';
import {getProviderData} from '../../../clients/providerService';
import {getClient} from '../../../clients/clientsClient';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colours} from '../../../styles/colours';
import BookingList from '../../../components/provider-profile/BookingList';

const Tab = createMaterialTopTabNavigator();

const TabScreen = ({status, bookings, onRefresh, onConfirm, navigation, renderItem}) => (
  <View style={styles.tabContent}>
    <BookingList bookings={bookings} onRefresh={onRefresh} onConfirm={onConfirm} navigation={navigation} renderItem={renderItem} />
  </View>
);

const ViewBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const userSub = useSelector(state => state.auth.userSub);
  const navigation = useNavigation();

  const fetchProviderData = useCallback(async () => {
    try {
      const response = await getProviderData(userSub);
      if (response.success) {
        setProviderData(response.data);
      } else {
        console.error('Failed to fetch provider data');
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  }, [userSub]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setScreenError(null);
      const response = await getProviderBookings(userSub);
      if (response.success) {
        const bookingsWithDetails = await Promise.all(
          response.data.map(async booking => {
            const clientResponse = await getClient(booking.clientId);
            const serviceDetails = providerData.services.find(service => service.id === booking.serviceId);
            return {
              ...booking,
              clientName: clientResponse.success ? clientResponse.data.clientName : 'Unknown Client',
              serviceName: serviceDetails ? serviceDetails.name : 'Unknown Service',
              serviceCost: serviceDetails ? serviceDetails.cost : 'N/A',
            };
          }),
        );
        setBookings(bookingsWithDetails);
      } else {
        setScreenError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setScreenError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  }, [userSub, providerData]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  useEffect(() => {
    if (providerData) {
      fetchBookings();
    }
  }, [fetchBookings, providerData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (providerData) {
        fetchBookings();
      }
    });
    return unsubscribe;
  }, [navigation, fetchBookings, providerData]);

  const confirmBooking = async (bookingId, clientId) => {
    try {
      await updateBookingStatus(bookingId, clientId, 'confirmed');
      await fetchBookings();
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const filterBookings = useCallback(
    status => {
      return bookings.filter(booking => {
        if (status === 'upcoming') {
          return booking.status === 'confirmed' && isUpcoming(booking.timeslotId);
        }
        return booking.status === status;
      });
    },
    [bookings],
  );

  const isUpcoming = timeslotId => {
    const [year, month, day, time] = timeslotId.split('-');
    const bookingDate = new Date(`${year}-${month}-${day}T${time}:00`);
    return bookingDate >= new Date();
  };

  const renderBookingItem = ({item}) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTime}>{item.timeslotId.split('-')[3]}</Text>
        <Text style={[styles.bookingStatus, {color: item.status === 'confirmed' ? colours.success : colours.warning}]}>{item.status}</Text>
      </View>
      <Text style={styles.bookingDate}>{`${item.timeslotId.split('-')[2]}/${item.timeslotId.split('-')[1]}/${item.timeslotId.split('-')[0]}`}</Text>
      <Text style={styles.bookingService}>{`Service: ${item.serviceName || 'Unknown Service'}`}</Text>
      <Text style={styles.bookingCost}>{`Cost: $${item.serviceCost || 'N/A'}`}</Text>
      <Text style={styles.bookingClient}>{`Client: ${item.clientName || 'Unknown Client'}`}</Text>
      {item.status === 'pending' && (
        <TouchableOpacity style={styles.confirmButton} onPress={() => confirmBooking(item.id, item.clientId)}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (screenError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{screenError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBookings}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colours.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Bookings</Text>
      </View>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.tabIndicator,
          }}>
          <Tab.Screen name="Pending">
            {() => (
              <TabScreen
                status="pending"
                bookings={filterBookings('pending')}
                onRefresh={fetchBookings}
                onConfirm={confirmBooking}
                navigation={navigation}
                renderItem={renderBookingItem}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Upcoming">
            {() => (
              <TabScreen
                status="upcoming"
                bookings={filterBookings('upcoming')}
                onRefresh={fetchBookings}
                onConfirm={confirmBooking}
                navigation={navigation}
                renderItem={renderBookingItem}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Cancelled">
            {() => (
              <TabScreen
                status="cancelled"
                bookings={filterBookings('cancelled')}
                onRefresh={fetchBookings}
                onConfirm={confirmBooking}
                navigation={navigation}
                renderItem={renderBookingItem}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Completed">
            {() => (
              <TabScreen
                status="completed"
                bookings={filterBookings('completed')}
                onRefresh={fetchBookings}
                onConfirm={confirmBooking}
                navigation={navigation}
                renderItem={renderBookingItem}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
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
  tabContainer: {
    flex: 1,
    backgroundColor: colours.background,
  },
  tabContent: {
    flex: 1,
    backgroundColor: colours.background,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    color: colours.text,
  },
  tabBar: {
    backgroundColor: colours.backgroundDark,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colours.text,
  },
  tabIndicator: {
    backgroundColor: colours.text,
    height: 3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.background,
  },
  errorText: {
    fontSize: 18,
    color: colours.error,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colours.text,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colours.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bookingItem: {
    backgroundColor: colours.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: colours.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
  },
  bookingDate: {
    fontSize: 16,
    color: colours.textLight,
    marginBottom: 8,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  bookingService: {
    fontSize: 14,
    color: colours.textLight,
    marginBottom: 4,
  },
  bookingCost: {
    fontSize: 14,
    color: colours.text,
    marginBottom: 4,
  },
  bookingClient: {
    fontSize: 14,
    color: colours.textLight,
    marginBottom: 8,
  },
  noBookingsText: {
    fontSize: 16,
    color: colours.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
  },
  confirmButton: {
    backgroundColor: colours.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  confirmButtonText: {
    color: colours.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ViewBookingsScreen;
