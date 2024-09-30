import createAxiosWithAuth from './axiosWithAuth';

const API_URL = 'http://10.0.2.2:3008/api/bookings/';
const bookingInstance = createAxiosWithAuth(API_URL);

export const createBooking = async bookingData => {
  try {
    const response = await bookingInstance.post('', bookingData);
    console.log(`POST ${API_URL} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getClientBookings = async userSub => {
  try {
    const response = await bookingInstance.get(`client/${userSub}`);
    console.log(`GET ${API_URL}client/${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error getting client bookings:', error);
    throw error;
  }
};

export const getProviderBookings = async userSub => {
  try {
    const response = await bookingInstance.get(`provider/${userSub}`);
    console.log(`GET ${API_URL}provider/${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error getting provider bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, clientId, status) => {
  try {
    const response = await bookingInstance.put(`id/${bookingId}/${clientId}/status`, {status});
    console.log(`PUT ${API_URL}id/${bookingId}/${clientId}/status - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getBookingDetails = async (bookingId, clientId) => {
  try {
    const response = await bookingInstance.get(`id/${bookingId}/${clientId}`);
    console.log(`GET ${API_URL}id/${bookingId}/${clientId} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw error;
  }
};
