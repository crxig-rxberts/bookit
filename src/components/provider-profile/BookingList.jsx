import React from 'react';
import {FlatList, Text, StyleSheet, RefreshControl} from 'react-native';
import BookingItem from './BookingItem'; // Create this component separately
import {colours} from '../../styles/colours';

const BookingList = ({bookings, onRefresh, onConfirm, navigation}) => {
  return (
    <FlatList
      data={bookings}
      renderItem={({item}) => (
        <BookingItem
          booking={item}
          onPress={() => navigation.navigate('ProviderManageBooking', {bookingId: item.id, clientId: item.clientId})}
          onConfirm={() => onConfirm(item.id, item.clientId)}
        />
      )}
      keyExtractor={item => item.id}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      ListEmptyComponent={<Text style={styles.noBookingsText}>No bookings in this category</Text>}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colours.background,
  },
  noBookingsText: {
    fontSize: 16,
    color: colours.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default BookingList;
