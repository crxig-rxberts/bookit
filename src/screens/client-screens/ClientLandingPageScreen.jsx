import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Button, View, FlatList} from 'react-native';
import {colours} from '../../styles/colours';
import SearchBar from '../../components/SearchBar';
import CategoryRow from '../../components/client-profile/CategoryRow';
import PreviouslyVisited from '../../components/client-profile/PreviouslyVisited';
import Appointments from '../../components/client-profile/Appointments';
import BasicContainer from '../../components/containers/BasicContainer';
import SectionDivider from '../../components/SectionDivider';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {clearAuthData} from '../../store/authSlice';

const ClientLandingPageScreen = () => {
  const [previouslyVisited, setPreviouslyVisited] = useState([]);
  const [refreshAppointments, setRefreshAppointments] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userSub = useSelector(state => state.auth.userSub);

  useEffect(() => {
    // Fetch previously visited data (unchanged)
    setPreviouslyVisited([
      {
        name: 'Stamford Barber Shop',
        image: require('../../../assets/img/StamfordBarber.jpg'),
        onPress: () => {},
      },
      // Add more items as needed
    ]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // This effect runs when the screen comes into focus
      setRefreshAppointments(prev => !prev);
    }, []),
  );

  const handleCategoryPress = category => {
    navigation.navigate('SearchResults', {category});
  };

  const categories = [
    {
      image: require('../../../assets/img/category1.jpg'),
      onPress: () => handleCategoryPress('Barber'),
      title: 'Barber',
    },
    {
      image: require('../../../assets/img/category2.jpg'),
      onPress: () => handleCategoryPress('Spa'),
      title: 'Spa',
    },
    {
      image: require('../../../assets/img/category3.jpg'),
      onPress: () => handleCategoryPress('Home Services'),
      title: 'Home Services',
    },
    {
      image: require('../../../assets/img/category4.jpg'),
      onPress: () => handleCategoryPress('Pet Care'),
      title: 'Pet Care',
    },
  ];

  const handleLogout = () => {
    dispatch(clearAuthData());
    navigation.navigate('Login');
  };

  const handleSearch = searchQuery => {
    navigation.navigate('SearchResults', {searchQuery});
  };

  const renderItem = ({item}) => {
    switch (item.type) {
      case 'search':
        return <SearchBar onChangeText={handleSearch} />;
      case 'categories':
        return <CategoryRow categories={categories} />;
      case 'previouslyVisited':
        return <PreviouslyVisited items={previouslyVisited} />;
      case 'appointments':
        return <Appointments userSub={userSub} refreshTrigger={refreshAppointments} />;
      case 'divider':
        return <SectionDivider />;
      default:
        return null;
    }
  };

  const data = [
    {type: 'search', key: 'search'},
    {type: 'divider', key: 'divider1'},
    {type: 'categories', key: 'categories'},
    {type: 'divider', key: 'divider2'},
    {type: 'previouslyVisited', key: 'previouslyVisited'},
    {type: 'divider', key: 'divider3'},
    {type: 'appointments', key: 'appointments'},
  ];

  return (
    <BasicContainer>
      <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.key} style={styles.container} />
      <SectionDivider />
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} color={colours.text} />
      </View>
    </BasicContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  logoutContainer: {
    margin: 20,
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default ClientLandingPageScreen;
