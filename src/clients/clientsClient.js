import axios from 'axios';
import {store} from '../store/store';

const API_URL = 'http://10.0.2.2:3010/api/';
const clientInstance = axios.create({
  baseURL: API_URL,
});

clientInstance.interceptors.request.use(
  async config => {
    const state = store.getState().auth;
    const token = state.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export const createClient = async clientData => {
  try {
    const response = await clientInstance.post('clients', clientData);
    console.log(`POST ${API_URL}clients - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const getClient = async userSub => {
  try {
    const response = await clientInstance.get(`clients/${userSub}`);
    console.log(`GET ${API_URL}clients/${userSub} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
};

export default clientInstance;
