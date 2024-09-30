import createAxiosWithAuth from './axiosWithAuth';

const API_URL = 'http://10.0.2.2:3006/api/timeslots/';
const timeslotInstance = createAxiosWithAuth(API_URL);

export const getTimeSlots = async providerUserSub => {
  try {
    const response = await timeslotInstance.get(`${providerUserSub}`);
    console.log(`GET ${API_URL}${providerUserSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

export const updateTimeSlot = async (providerUserSub, timeslotId, updateData) => {
  try {
    const response = await timeslotInstance.put(`${providerUserSub}/${timeslotId}`, updateData);
    console.log(`PUT ${API_URL}${providerUserSub}/${timeslotId} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error updating time slot:', error);
    throw error;
  }
};
