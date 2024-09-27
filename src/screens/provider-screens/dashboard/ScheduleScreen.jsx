import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getProviderBookings} from '../../../clients/bookingClient';
import {format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, setHours, setMinutes, parse, differenceInMinutes, addMinutes} from 'date-fns';
import {colours} from '../../../styles/colours';

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const userSub = useSelector(state => state.auth.userSub);
  const [bookings, setBookings] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const fetchBookings = useCallback(async () => {
    try {
      const response = await getProviderBookings(userSub);
      setBookings(
        response.data.filter(
          booking =>
            ['confirmed', 'pending'].includes(booking.status) &&
            new Date(booking.timeslotId.split('-').slice(0, 3).join('-')) >= startOfWeek(currentWeek) &&
            new Date(booking.timeslotId.split('-').slice(0, 3).join('-')) <= endOfWeek(currentWeek),
        ),
      );
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [userSub, currentWeek]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings]),
  );
  const getBookingTime = booking => {
    const timeslotParts = booking.timeslotId.split('-');
    return timeslotParts.length > 3 ? timeslotParts[3] : null;
  };

  const getBookingEndTime = booking => {
    // Assume each booking is 30 minutes long
    const startTime = parse(getBookingTime(booking), 'HH:mm', new Date());
    return format(addMinutes(startTime, 30), 'HH:mm');
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek),
  });

  const renderWeekDay = date => {
    const isSelected = isSameDay(date, selectedDay);
    return (
      <TouchableOpacity key={date.toISOString()} style={[styles.dayButton, isSelected && styles.selectedDayButton]} onPress={() => setSelectedDay(date)}>
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{format(date, 'EEE')}</Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>{format(date, 'd')}</Text>
      </TouchableOpacity>
    );
  };

  const renderHourlySchedule = () => {
    const dayBookings = bookings.filter(booking => {
      if (!booking || !booking.timeslotId) {
        return false;
      }
      const bookingDate = booking.timeslotId.split('-').slice(0, 3).join('-');
      return isSameDay(new Date(bookingDate), selectedDay);
    });

    if (dayBookings.length === 0) {
      return <Text style={styles.noBookingsText}>No bookings for this day.</Text>;
    }

    const sortedBookings = dayBookings.sort((a, b) => {
      const timeA = parse(getBookingTime(a), 'HH:mm', new Date());
      const timeB = parse(getBookingTime(b), 'HH:mm', new Date());
      return timeA.getTime() - timeB.getTime();
    });

    const firstBookingTime = parse(getBookingTime(sortedBookings[0]), 'HH:mm', new Date());
    const lastBookingTime = parse(getBookingTime(sortedBookings[sortedBookings.length - 1]), 'HH:mm', new Date());

    const startHour = firstBookingTime.getHours();
    const endHour = lastBookingTime.getHours() + 1;

    const hours = Array.from({length: endHour - startHour}, (_, i) => startHour + i);

    return (
      <ScrollView style={styles.scheduleContainer}>
        {hours.map(hour => {
          const time = setMinutes(setHours(selectedDay, hour), 0);
          const bookingsInHour = sortedBookings.filter(booking => {
            const bookingTime = parse(getBookingTime(booking), 'HH:mm', new Date());
            return bookingTime.getHours() === hour;
          });

          return (
            <View key={hour} style={styles.hourRow}>
              <Text style={styles.hourText}>{format(time, 'h:mm a')}</Text>
              <View style={styles.bookingsContainer}>
                {bookingsInHour.map(booking => {
                  const startTime = parse(getBookingTime(booking), 'HH:mm', new Date());
                  const endTime = parse(getBookingEndTime(booking), 'HH:mm', new Date());
                  const duration = differenceInMinutes(endTime, startTime);
                  const height = (duration / 60) * 80; // Increased from 60 to 80

                  return (
                    <TouchableOpacity
                      key={booking.id}
                      style={[
                        styles.bookingItem,
                        {
                          height,
                          backgroundColor: booking.status === 'confirmed' ? colours.success : colours.warning,
                        },
                      ]}
                      onPress={() =>
                        navigation.navigate('ProviderManageBooking', {
                          bookingId: booking.id,
                          clientId: booking.clientId,
                        })
                      }>
                      <Text style={styles.bookingTime}>
                        {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                      </Text>
                      <Text style={styles.bookingStatus}>{booking.status}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={() => setCurrentWeek(addWeeks(currentWeek, -1))}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.weekText}>{format(currentWeek, 'MMMM d, yyyy')}</Text>
        <TouchableOpacity onPress={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.daysContainer}>{weekDays.map(day => renderWeekDay(day))}</View>
      {renderHourlySchedule()}
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
    borderBottomColor: colours.black,
    backgroundColor: colours.backgroundDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colours.background,
    borderBottomWidth: 1,
    borderBottomColor: colours.black,
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: colours.background,
    borderBottomWidth: 1,
    borderBottomColor: colours.black,
  },
  dayButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: colours.info,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colours.text,
  },
  dateText: {
    fontSize: 16,
    color: colours.textLight,
  },
  selectedDayText: {
    color: colours.white,
  },
  selectedDateText: {
    color: colours.white,
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colours.surface,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 100,
    borderTopWidth: 1,
    borderColor: colours.textLight,
  },
  hourText: {
    width: 80,
    fontSize: 14,
    color: colours.text,
    paddingTop: 8,
  },
  bookingsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 4,
  },
  bookingItem: {
    borderRadius: 8,
    marginBottom: 4,
    padding: 10,
    justifyContent: 'center',
  },
  bookingTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colours.white,
  },
  bookingStatus: {
    fontSize: 12,
    color: colours.white,
    marginTop: 2,
  },
  noBookingsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ScheduleScreen;
