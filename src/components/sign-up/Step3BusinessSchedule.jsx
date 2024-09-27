import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Step3BusinessSchedule = ({providerData, handleInputChange, errors}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentTimeType, setCurrentTimeType] = useState('');

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
    handleInputChange('availability', updatedAvailability);
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
    handleInputChange('availability', updatedAvailability);
    setShowTimePicker(false);
  };

  const toggleLunchBreak = day => {
    const updatedAvailability = {...providerData.availability};
    updatedAvailability[day].lunchBreak.enabled = !updatedAvailability[day].lunchBreak.enabled;
    handleInputChange('availability', updatedAvailability);
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

    return <DateTimePicker value={dateValue} mode="time" is24Hour={true} display="default" onChange={(event, selectedTime) => setTime(event, selectedTime)} />;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.stepTitle}>Business Schedule</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map(day => (
          <TouchableOpacity key={day} style={[styles.dayButton, providerData.availability[day] && styles.selectedDayButton]} onPress={() => toggleDay(day)}>
            <Text style={[styles.dayButtonText, providerData.availability[day] && styles.selectedDayButtonText]}>{day.slice(0, 3)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {Object.entries(providerData.availability).map(([day, times]) => (
        <View key={day} style={styles.dayTimeContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => {
              setCurrentDay(day);
              setCurrentTimeType('start');
              setShowTimePicker(true);
            }}>
            <Text style={styles.timeButtonText}>Start: {times.start}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => {
              setCurrentDay(day);
              setCurrentTimeType('end');
              setShowTimePicker(true);
            }}>
            <Text style={styles.timeButtonText}>End: {times.end}</Text>
          </TouchableOpacity>
          <View style={styles.lunchBreakContainer}>
            <Text style={styles.lunchBreakText}>Lunch Break</Text>
            <Switch
              value={times.lunchBreak.enabled}
              onValueChange={() => toggleLunchBreak(day)}
              trackColor={{
                false: colours.error,
                true: colours.success,
              }}
              thumbColor={times.lunchBreak.enabled ? colours.background : colours.text}
            />
          </View>
          {times.lunchBreak.enabled && (
            <View style={styles.lunchBreakTimesContainer}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  setCurrentDay(day);
                  setCurrentTimeType('lunchStart');
                  setShowTimePicker(true);
                }}>
                <Text style={styles.timeButtonText}>Lunch Start: {times.lunchBreak.start}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  setCurrentDay(day);
                  setCurrentTimeType('lunchEnd');
                  setShowTimePicker(true);
                }}>
                <Text style={styles.timeButtonText}>Lunch End: {times.lunchBreak.end}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      {renderTimePicker()}
      <View style={styles.timeSlotContainer}>
        <Text style={styles.labelText}>Time Slot Length (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={providerData.timeSlotLength.toString()}
          onChangeText={text => handleInputChange('timeSlotLength', parseInt(text, 10) || 30)}
        />
      </View>
      {errors.availability && <Text style={styles.errorText}>{errors.availability}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  stepTitle: {
    ...fontStyles.subtitle,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colours.text,
    backgroundColor: colours.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayButton: {
    backgroundColor: colours.text,
  },
  dayButtonText: {
    ...fontStyles.body,
    color: colours.text,
  },
  selectedDayButtonText: {
    color: colours.background,
  },
  dayTimeContainer: {
    marginBottom: 15,
    paddingBottom: 15,
  },
  dayText: {
    ...fontStyles.subtitle,
    color: colours.text,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  timeButton: {
    backgroundColor: colours.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: colours.text,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeButtonText: {
    ...fontStyles.body,
    color: colours.text,
  },
  lunchBreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  lunchBreakText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  lunchBreakTimesContainer: {
    marginLeft: 20,
  },
  timeSlotContainer: {
    marginTop: 20,
  },
  labelText: {
    ...fontStyles.subtitle,
    color: colours.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.text,
    borderRadius: 5,
    padding: 10,
    ...fontStyles.body,
    color: colours.text,
    backgroundColor: colours.white,
  },
  errorText: {
    color: 'red',
    ...fontStyles.caption,
    marginTop: 5,
  },
});

export default Step3BusinessSchedule;
