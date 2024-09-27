import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getProviderData} from '../../clients/providerService';
import {clearAuthData} from '../../store/authSlice';
import {colours} from '../../styles/colours';
import BasicContainer from '../../components/containers/BasicContainer';
import {getProviderBookings} from '../../clients/bookingClient';
import {format} from 'date-fns';

const DashboardCard = ({title, value, icon, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Icon name={icon} size={24} color={'#000000'} />
    <Text style={styles.cardValue}>{value}</Text>
    <View>
      {title.map((line, index) => (
        <Text key={index} style={styles.cardTitle}>
          {line}
        </Text>
      ))}
    </View>
  </TouchableOpacity>
);

const QuickAccessButton = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.quickAccessButton} onPress={onPress}>
    <Icon name={icon} size={24} color={'#000000'} />
    <Text style={styles.quickAccessText}>{title}</Text>
  </TouchableOpacity>
);

const ProviderDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [providerData, setProviderData] = useState(null);
  const [todayBookings, setTodayBookings] = useState(0);
  const userSub = useSelector(state => state.auth.userSub);

  const fetchData = useCallback(async () => {
    try {
      const providerResponse = await getProviderData(userSub);
      if (providerResponse.success) {
        setProviderData(providerResponse.data);
      }

      const bookingsResponse = await getProviderBookings(userSub);
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayBookingsCount = bookingsResponse.data.filter(
        booking => ['confirmed', 'pending'].includes(booking.status) && booking.timeslotId.startsWith(today),
      ).length;
      setTodayBookings(todayBookingsCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [userSub]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const navigateTo = screen => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    navigation.navigate('Login');
  };

  const isValidImageData = data => {
    return data && data.startsWith('data:image/');
  };

  return (
    <BasicContainer>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.providerName}>{providerData?.providerName || 'Provider'}</Text>
            </View>
            {isValidImageData(providerData?.providerImage) && <Image source={{uri: providerData.providerImage}} style={styles.profileImage} />}
          </View>

          <View style={styles.statsSection}>
            <DashboardCard
              title={['Today', 'View Schedule']}
              value={todayBookings}
              icon="calendar-clock"
              onPress={() => navigation.navigate('UpcomingBookings')}
            />
            <DashboardCard
              title={['Active', 'View Services']}
              value={providerData?.services?.length || 0}
              icon="briefcase-outline"
              onPress={() => navigation.navigate('ActiveServices')}
            />
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <QuickAccessButton title="Edit Profile" icon="account-edit" onPress={() => navigateTo('EditProfile')} />
              <QuickAccessButton title="Manage Services" icon="cog-outline" onPress={() => navigateTo('ManageServices')} />
              <QuickAccessButton title="Manage Schedule" icon="calendar-edit" onPress={() => navigateTo('ManageSchedule')} />
              <QuickAccessButton title="View Bookings" icon="book-open-variant" onPress={() => navigateTo('ViewBookings')} />
            </View>
          </View>

          <View style={styles.quickAccessSection}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigateTo('TodaySchedule')}>
              <Icon name="clock-outline" size={24} color="#000" />
              <Text style={styles.quickAccessItemText}>Today's Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessItem} onPress={() => navigateTo('RecentBookings')}>
              <Icon name="history" size={24} color="#000" />
              <Text style={styles.quickAccessItemText}>Recent Bookings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color={colours.text} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </BasicContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#000',
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 16,
    marginRight: 25,
    borderWidth: 1,
    borderColor: colours.black,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: colours.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: colours.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 14,
    color: '#212529',
  },
  quickAccessSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  quickAccessItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#212529',
  },
  bottomBar: {
    backgroundColor: colours.backgroundDark,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  logoutText: {
    color: colours.text,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default ProviderDashboard;
