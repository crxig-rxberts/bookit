import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {colours} from '../../styles/colours';
import {fontStyles} from '../../styles/fonts';
import {generateDailyTimeSlots} from '../../utils/timeSlotUtils';

const ProviderTile = ({name, image}) => (
  <TouchableOpacity style={styles.itemContainer}>
    <Image source={{uri: image}} style={styles.backgroundImage} />
    <View style={styles.overlay}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bookAgain}>Book now →</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const TimeSlotRow = ({day, slots}) => (
  <View style={styles.timeSlotRowContainer}>
    <Text style={styles.dayText}>{day}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {slots.map((slot, index) => (
        <TouchableOpacity key={index} style={styles.timeSlotButton}>
          <Text style={styles.timeSlotText}>{slot}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const ServiceItem = ({name, cost}) => (
  <View style={styles.serviceItem}>
    <Text style={styles.serviceName}>{name}</Text>
    <Text style={styles.serviceCost}>£{cost}</Text>
  </View>
);

const Step5AccountReview = ({providerData}) => {
  const dailyTimeSlots = generateDailyTimeSlots(providerData.availability, providerData.timeSlotLength);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.stepTitle}>Review Your Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider Profile</Text>
        <ProviderTile name={providerData.providerName} image={providerData.providerImage} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider Details</Text>
        <View style={styles.detailsContainer}>
          <DetailItem label="Name" value={providerData.providerName} />
          <DetailItem label="Email" value={providerData.email} />
          <DetailItem label="Category" value={providerData.category} />
          <DetailItem label="Time Slot Length" value={`${providerData.timeSlotLength} minutes`} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        {Object.entries(providerData.availability).map(([day, times]) => (
          <View key={day} style={styles.availabilityItem}>
            <Text style={styles.dayText}>{day}</Text>
            <Text style={styles.timeText}>
              {times.start} - {times.end}
              {times.lunchBreak.enabled && `\nLunch: ${times.lunchBreak.start} - ${times.lunchBreak.end}`}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        {providerData.services.map((service, index) => (
          <ServiceItem key={index} name={service.name} cost={service.cost} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        {Object.entries(dailyTimeSlots).map(([day, slots]) => (
          <TimeSlotRow key={day} day={day} slots={slots} />
        ))}
      </View>
    </ScrollView>
  );
};

const DetailItem = ({label, value}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  section: {
    marginBottom: 30,
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: colours.text,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...fontStyles.subtitle,
    color: colours.black,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailsContainer: {
    backgroundColor: colours.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colours.text,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  detailValue: {
    ...fontStyles.body,
    color: colours.text,
  },
  availabilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colours.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colours.text,
  },
  dayText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.black,
  },
  timeText: {
    ...fontStyles.body,
    color: colours.text,
    textAlign: 'right',
  },
  itemContainer: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.text,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '33%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  name: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  bookAgain: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colours.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colours.text,
  },
  serviceName: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  serviceCost: {
    ...fontStyles.body,
    color: colours.text,
  },
  timeSlotRowContainer: {
    marginBottom: 15,
  },
  timeSlotButton: {
    backgroundColor: colours.background,
    padding: 10,
    borderWidth: 2,
    borderColor: colours.text,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 5,
  },
  timeSlotText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.black,
  },
});

export default Step5AccountReview;
