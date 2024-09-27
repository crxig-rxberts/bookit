import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {colours} from './src/styles/colours';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/client-screens/SignUpScreen';
import ClientLandingPageScreen from './src/screens/client-screens/ClientLandingPageScreen';
import ProviderDashboard from './src/screens/provider-screens/ProviderDashboard';
import ProviderSignUpScreen from './src/screens/provider-screens/ProviderSignUpScreen';
import ConfirmationCodeScreen from './src/screens/ConfirmationCodeScreen';
import ManageScheduleScreen from './src/screens/provider-screens/dashboard/ManageScheduleScreen';
import ManageServicesScreen from './src/screens/provider-screens/dashboard/ManageServicesScreen';
import EditProfileScreen from './src/screens/provider-screens/dashboard/EditProfileScreen';
import ProviderManageBookingScreen from './src/screens/provider-screens/dashboard/ProviderManageBookingScreen';
import ViewBookingsScreen from './src/screens/provider-screens/dashboard/ViewBookingsScreen';
import ScheduleScreen from './src/screens/provider-screens/dashboard/ScheduleScreen';
import ActiveServicesScreen from './src/screens/provider-screens/dashboard/ActiveServicesScreen';
import SearchResultsScreen from './src/screens/client-screens/SearchResultsScreen';
import BookAppointmentScreen from './src/screens/client-screens/BookAppointmentScreen';
import ManageAppointmentScreen from './src/screens/client-screens/ManageAppointmentScreen';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={colours.text} />
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmationCode" component={ConfirmationCodeScreen} />
            <Stack.Screen name="ClientLandingPage" component={ClientLandingPageScreen} />
            <Stack.Screen name="ProviderDashboard" component={ProviderDashboard} />
            <Stack.Screen name="ProviderSignUp" component={ProviderSignUpScreen} />
            <Stack.Screen name="ManageSchedule" component={ManageScheduleScreen} />
            <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="ManageAppointment" component={ManageAppointmentScreen} />
            <Stack.Screen name="ViewBookings" component={ViewBookingsScreen} />
            <Stack.Screen name="UpcomingBookings" component={ScheduleScreen} />
            <Stack.Screen name="ActiveServices" component={ActiveServicesScreen} />
            <Stack.Screen name="ProviderManageBooking" component={ProviderManageBookingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
