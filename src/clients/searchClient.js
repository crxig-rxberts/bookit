import createAxiosWithAuth from './axiosWithAuth';

const API_URL = 'http://10.0.2.2:3002/api/search/';
const searchInstance = createAxiosWithAuth(API_URL);

export const submitSearchData = async providerData => {
  try {
    const response = await searchInstance.post('submit-provider', providerData);
    console.log(`POST ${API_URL}submit-provider - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response;
  } catch (error) {
    console.error('Error submitting provider data:', error);
    throw error;
  }
};

export const searchProviders = async query => {
  try {
    const response = await searchInstance.get('search-providers', {
      params: {query},
    });
    console.log(`GET ${API_URL}search-providers?query=${query} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error searching providers:', error);
    throw error;
  }
};

export const searchProvidersByCategory = async category => {
  try {
    const response = await searchInstance.get('search-providers', {
      params: {category},
    });
    console.log(`GET ${API_URL}search-providers?category=${category} - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    return response.data;
  } catch (error) {
    console.error('Error searching providers by category:', error);
    throw error;
  }
};
