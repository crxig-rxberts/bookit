import createAxiosWithAuth from './axiosWithAuth';

const API_URL = 'http://10.0.2.2:3004/api/providers/';
const providerInstance = createAxiosWithAuth(API_URL);

export const createProvider = async providerData => {
  try {
    const response = await providerInstance.post('', providerData);
    console.log(`POST ${API_URL} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error creating provider:', error);
    throw error;
  }
};

export const getProvider = async userSub => {
  try {
    const response = await providerInstance.get(`${userSub}`);
    console.log(`GET ${API_URL}${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error getting provider:', error);
    throw error;
  }
};

export const updateProvider = async (userSub, providerData) => {
  try {
    const response = await providerInstance.put(`${userSub}`, providerData);
    console.log(`PUT ${API_URL}${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error updating provider:', error);
    throw error;
  }
};

export const deleteProvider = async userSub => {
  try {
    const response = await providerInstance.delete(`${userSub}`);
    console.log(`DELETE ${API_URL}${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw error;
  }
};

export default providerInstance;
