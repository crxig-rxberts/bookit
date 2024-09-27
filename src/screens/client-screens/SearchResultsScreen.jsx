import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {searchProviders, searchProvidersByCategory} from '../../clients/searchClient';
import {getProviderData} from '../../clients/providerService';
import {colours} from '../../styles/colours';

const SearchResultsScreen = () => {
  const [searchResults, setSearchResults] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const {searchQuery, category} = route.params;

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let results;
        if (searchQuery) {
          results = await searchProviders(searchQuery);
        } else if (category) {
          results = await searchProvidersByCategory(category);
        }
        const providersWithData = await Promise.all(
          results.hits.map(async provider => {
            const providerData = await getProviderData(provider.userSub);
            return {...provider, ...providerData.data};
          }),
        );
        setSearchResults(providersWithData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [searchQuery, category]);

  const getOpenDays = availability => {
    const days = Object.keys(availability).map(day => day.slice(0, 3));
    return days.join(', ');
  };

  const handleBookNow = provider => {
    navigation.navigate('BookAppointment', {
      providerUserSub: provider.userSub,
      providerName: provider.providerName,
    });
  };
  const renderProviderItem = ({item}) => (
    <View style={styles.providerCard}>
      <View style={styles.providerInfoContainer}>
        <Image source={{uri: item.providerImage}} style={styles.providerImage} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.providerName}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
          <View style={styles.servicesContainer}>
            <View style={styles.serviceItem}>
              <Icon name="briefcase-outline" size={16} color={colours.text} />
              <Text style={styles.serviceText}>{item.services[0].name}</Text>
              {item.services.length > 1 && <Text style={styles.moreServicesText}>and {item.services.length - 1} more...</Text>}
            </View>
          </View>
          <View style={styles.availabilityContainer}>
            <Icon name="calendar-range" size={16} color={colours.black} />
            <Text style={styles.availabilityText}>Open: {getOpenDays(item.availability)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.bookNowButton} onPress={() => handleBookNow(item)}>
        <Text style={styles.bookNowText}>Book Here</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colours.text} />
        </TouchableOpacity>
        <Text style={styles.resultsText}>
          {searchResults.length} results for {searchQuery ? `"${searchQuery}"` : category}
        </Text>
      </View>
      <FlatList data={searchResults} renderItem={renderProviderItem} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer} />
    </View>
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
  backButton: {
    marginRight: 16,
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
  },
  listContainer: {
    padding: 16,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  providerInfoContainer: {
    flexDirection: 'row',
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colours.text,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colours.text,
    marginBottom: 8,
  },
  servicesContainer: {
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 14,
    color: colours.text,
    marginLeft: 8,
  },
  moreServicesText: {
    fontSize: 14,
    color: colours.black,
    marginLeft: 24,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 14,
    color: colours.text,
    marginLeft: 8,
  },
  bookNowButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colours.black,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SearchResultsScreen;
