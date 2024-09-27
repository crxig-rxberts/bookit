import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Calendar} from 'react-native-calendars';
import {getTimeSlots, updateTimeSlot} from '../../clients/timeslotClient';
import {createBooking} from '../../clients/bookingClient';
import {getProviderData} from '../../clients/providerService';
import {Checkbox} from 'react-native-paper';
import {ScrollView as GestureHandlerScrollView} from 'react-native-gesture-handler';
import {colours} from '../../styles/colours';

const BookAppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const {providerUserSub, providerName} = route.params;
  const clientUserSub = useSelector(state => state.auth.userSub);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timeSlotsResponse, providerData] = await Promise.all([getTimeSlots(providerUserSub), getProviderData(providerUserSub)]);
        setTimeSlots(timeSlotsResponse.data.timeSlots);
        setServices(providerData.data.services);
        updateMarkedDates(timeSlotsResponse.data.timeSlots);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [providerUserSub]);

  const updateMarkedDates = slots => {
    const marked = {};
    slots.forEach(slot => {
      if (slot.status === 'available') {
        marked[slot.date] = {marked: true, dotColor: colours.success};
      } else {
        marked[slot.date] = {disabled: true, disableTouchEvent: true};
      }
    });
    setMarkedDates(marked);
  };

  useEffect(() => {
    if (selectedDate) {
      const slots = timeSlots.filter(slot => slot.date === selectedDate && slot.status === 'available');
      setAvailableSlots(slots);
    }
  }, [selectedDate, timeSlots]);

  const handleDateSelect = day => {
    setSelectedDate(day.dateString);
    setSelectedSlot(null);
    setIsConfirmed(false);
  };

  const handleSlotSelect = slot => {
    setSelectedSlot(slot);
    setIsConfirmed(false);
  };

  const handleServiceSelect = service => {
    setSelectedService(service);
    setIsConfirmed(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedService || !isConfirmed) {
      return;
    }

    try {
      await updateTimeSlot(providerUserSub, selectedSlot.id, {
        status: 'booked',
        serviceId: selectedService.id,
      });

      await createBooking({
        clientId: clientUserSub,
        providerUserSub: providerUserSub,
        timeslotId: selectedSlot.id,
        serviceId: selectedService.id,
        notes: '',
        status: 'pending',
      });

      navigation.navigate('ClientLandingPage');
    } catch (error) {
      console.error('Error booking appointment with ' + providerName + ': ', error);
      // Handle error (show error message to user)
    }
  };

  const renderBookingSummary = () => {
    if (selectedSlot && selectedService) {
      return (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>Date: {selectedDate}</Text>
          <Text style={styles.summaryText}>Time: {selectedSlot.startTime}</Text>
          <Text style={styles.summaryText}>Service: {selectedService.name}</Text>
          <Text style={styles.summaryText}>Price: £{selectedService.cost}</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox status={isConfirmed ? 'checked' : 'unchecked'} onPress={() => setIsConfirmed(!isConfirmed)} color={colours.success} />
            <Text style={styles.checkboxLabel}>I confirm the booking details</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colours.black} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colours.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book an appointment</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: colours.black,
            },
          }}
          theme={{
            backgroundColor: colours.white,
            calendarBackground: colours.white,
            textSectionTitleColor: colours.text,
            selectedDayBackgroundColor: colours.text,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colours.text,
            dayTextColor: colours.text,
            textDisabledColor: colours.textLight,
            dotColor: colours.success,
            selectedDotColor: '#ffffff',
            arrowColor: colours.text,
            monthTextColor: colours.text,
            textMonthFontColor: colours.text,
            textMonthFontWeight: 'bold',
            indicatorColor: colours.text,
          }}
        />
      </View>

      {selectedDate && (
        <View style={styles.slotsContainer}>
          <Text style={styles.sectionTitle}>Available time slots</Text>
          <View style={styles.slotsWrapper}>
            {availableSlots.length > 0 ? (
              <GestureHandlerScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsRow}>
                {availableSlots.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.slotButton, selectedSlot?.id === item.id ? styles.selectedSlot : styles.unselectedSlot]}
                    onPress={() => handleSlotSelect(item)}>
                    <Text style={[styles.slotText, selectedSlot?.id === item.id ? styles.selectedSlotText : styles.unselectedSlotText]}>{item.startTime}</Text>
                  </TouchableOpacity>
                ))}
              </GestureHandlerScrollView>
            ) : (
              <Text style={styles.noSlotsText}>No available time slots for this date.</Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesWrapper}>
          {services.map(service => {
            const isSelected = selectedService?.id === service.id;
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceButton, isSelected ? styles.selectedService : styles.unselectedService]}
                onPress={() => handleServiceSelect(service)}>
                <Text style={[styles.serviceName, isSelected ? styles.selectedServiceText : styles.unselectedServiceText]}>{service.name}</Text>
                <Text style={[styles.servicePrice, isSelected ? styles.selectedServiceText : styles.unselectedServiceText]}>£{service.cost}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {renderBookingSummary()}

      <TouchableOpacity
        style={[styles.bookButton, (!selectedSlot || !selectedService || !isConfirmed) && styles.disabledButton]}
        onPress={handleBookAppointment}
        disabled={!selectedSlot || !selectedService || !isConfirmed}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
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
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 12,
  },
  slotsContainer: {
    padding: 16,
  },
  slotsWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotsRow: {
    flexDirection: 'row',
    // Remove flexWrap: 'wrap',
  },
  slotButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    // Remove marginBottom: 8,
    borderWidth: 2,
  },
  unselectedSlot: {
    backgroundColor: 'transparent',
    borderColor: colours.text,
  },
  selectedSlot: {
    backgroundColor: colours.text,
    borderColor: colours.text,
  },
  slotText: {
    fontWeight: '500',
  },
  noSlotsText: {
    color: colours.text,
    fontSize: 16,
    textAlign: 'center',
    padding: 6,
  },
  unselectedSlotText: {
    color: colours.text,
  },
  selectedSlotText: {
    color: '#ffffff',
  },
  servicesContainer: {
    padding: 16,
  },
  servicesWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
  },
  unselectedService: {
    backgroundColor: 'transparent',
    borderColor: colours.text,
  },
  selectedService: {
    backgroundColor: colours.text,
    borderColor: colours.text,
  },
  serviceName: {
    fontSize: 16,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unselectedServiceText: {
    color: colours.text,
  },
  selectedServiceText: {
    color: '#ffffff',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: colours.text,
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: colours.text,
  },
  bookButton: {
    backgroundColor: colours.text,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookAppointmentScreen;
