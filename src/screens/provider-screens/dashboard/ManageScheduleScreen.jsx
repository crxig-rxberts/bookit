import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getProviderData, updateProviderData} from '../../../clients/providerService';
import {colours} from '../../../styles/colours';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ManageScheduleScreen = () => {
  const navigation = useNavigation();
  const [providerData, setProviderData] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentTimeType, setCurrentTimeType] = useState('');
  const userSub = useSelector(state => state.auth.userSub);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await getProviderData(userSub);
        if (response.success) {
          setProviderData(response.data);
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
      }
    };

    fetchProviderData();
  }, [userSub]);

  const handleSaveChanges = async () => {
    try {
      await updateProviderData(userSub, providerData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating provider data:', error);
    }
  };

  const toggleDay = day => {
    const updatedAvailability = {...providerData.availability};
    if (updatedAvailability[day]) {
      delete updatedAvailability[day];
    } else {
      updatedAvailability[day] = {
        start: '09:00',
        end: '17:00',
        lunchBreak: {enabled: false, start: '12:00', end: '13:00'},
      };
    }
    setProviderData({...providerData, availability: updatedAvailability});
  };

  const setTime = (event, selectedTime) => {
    const currentValue = selectedTime || new Date();
    const hours = currentValue.getHours().toString().padStart(2, '0');
    const minutes = currentValue.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const updatedAvailability = {...providerData.availability};
    if (currentTimeType === 'lunchStart' || currentTimeType === 'lunchEnd') {
      updatedAvailability[currentDay].lunchBreak[currentTimeType.replace('lunch', '').toLowerCase()] = timeString;
    } else {
      updatedAvailability[currentDay][currentTimeType] = timeString;
    }
    setProviderData({...providerData, availability: updatedAvailability});
    setShowTimePicker(false);
  };

  const toggleLunchBreak = day => {
    const updatedAvailability = {...providerData.availability};
    updatedAvailability[day].lunchBreak.enabled = !updatedAvailability[day].lunchBreak.enabled;
    setProviderData({...providerData, availability: updatedAvailability});
  };

  const renderTimePicker = () => {
    if (!showTimePicker) {
      return null;
    }

    let currentTime;
    if (currentTimeType === 'lunchStart' || currentTimeType === 'lunchEnd') {
      currentTime = providerData.availability[currentDay].lunchBreak[currentTimeType.replace('lunch', '').toLowerCase()];
    } else {
      currentTime = providerData.availability[currentDay][currentTimeType];
    }
    const [hours, minutes] = currentTime.split(':');
    const dateValue = new Date();
    dateValue.setHours(parseInt(hours, 10));
    dateValue.setMinutes(parseInt(minutes, 10));

    return <DateTimePicker value={dateValue} mode="time" is24Hour={true} display="default" onChange={setTime} />;
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
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Schedule</Text>
        </View>

        <View style={styles.daysContainer}>
          {daysOfWeek.map(day => (
            <TouchableOpacity key={day} style={[styles.dayButton, providerData.availability[day] && styles.selectedDayButton]} onPress={() => toggleDay(day)}>
              <Text style={[styles.dayButtonText, providerData.availability[day] && styles.selectedDayButtonText]}>{day.slice(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {Object.entries(providerData.availability).map(([day, times]) => (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayText}>{day}</Text>
            <View style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  setCurrentDay(day);
                  setCurrentTimeType('start');
                  setShowTimePicker(true);
                }}>
                <Text style={styles.timeLabel}>Start</Text>
                <Text style={styles.timeValue}>{times.start}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  setCurrentDay(day);
                  setCurrentTimeType('end');
                  setShowTimePicker(true);
                }}>
                <Text style={styles.timeLabel}>End</Text>
                <Text style={styles.timeValue}>{times.end}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lunchBreakContainer}>
              <Text style={styles.lunchBreakText}>Lunch Break</Text>
              <Switch
                value={times.lunchBreak.enabled}
                onValueChange={() => toggleLunchBreak(day)}
                trackColor={{false: colours.error, true: colours.success}}
                thumbColor={times.lunchBreak.enabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            {times.lunchBreak.enabled && (
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    setCurrentDay(day);
                    setCurrentTimeType('lunchStart');
                    setShowTimePicker(true);
                  }}>
                  <Text style={styles.timeLabel}>Lunch Start</Text>
                  <Text style={styles.timeValue}>{times.lunchBreak.start}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    setCurrentDay(day);
                    setCurrentTimeType('lunchEnd');
                    setShowTimePicker(true);
                  }}>
                  <Text style={styles.timeLabel}>Lunch End</Text>
                  <Text style={styles.timeValue}>{times.lunchBreak.end}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {renderTimePicker()}
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
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colours.error,
    borderWidth: 1,
    borderColor: colours.black,
  },
  selectedDayButton: {
    backgroundColor: colours.successMuted,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colours.white,
  },
  selectedDayButtonText: {
    color: colours.white,
  },
  dayCard: {
    backgroundColor: colours.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: colours.black,
    marginHorizontal: 20,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeButton: {
    backgroundColor: colours.background,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colours.black,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  lunchBreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  lunchBreakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageScheduleScreen;
