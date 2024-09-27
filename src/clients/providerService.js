import {createProvider, updateProvider, getProvider, deleteProvider} from './providerClient';
import {submitSearchData} from './searchClient';

export const createProviderAndSubmitToSearch = async (providerData, userSub) => {
  try {
    // Submit provider data to the search service
    const searchResponse = await submitSearchData({
      category: providerData.category,
      providerName: providerData.providerName,
      services: providerData.services,
      userSub: userSub,
    });

    // Create provider in the provider service
    const createdProvider = await createProvider({
      ...providerData,
      userSub,
      searchId: searchResponse.data.id,
    });

    return createdProvider;
  } catch (error) {
    console.error('Error creating and submitting provider data:', error);
    throw error;
  }
};

export const getProviderData = async userSub => {
  try {
    return await getProvider(userSub);
  } catch (error) {
    console.error('Error getting provider data:', error);
    throw error;
  }
};

export const updateProviderAndSearchData = async (userSub, providerData) => {
  try {
    const updatedProvider = await updateProvider(userSub, providerData);

    // Update provider data in the search service, needs refactor to update rather than submit new
    await submitSearchData({
      category: providerData.category,
      providerName: providerData.providerName,
      services: providerData.services,
      userSub: userSub,
    });

    return updatedProvider;
  } catch (error) {
    console.error('Error updating provider data: ', error);
    throw error;
  }
};

export const updateProviderData = async (userSub, providerData) => {
  try {
    const updatedProvider = await updateProvider(userSub, providerData);
    return updatedProvider;
  } catch (error) {
    console.error('Error updating provider data: ', error);
    throw error;
  }
};

export const deleteProviderData = async userSub => {
  try {
    return await deleteProvider(userSub);
  } catch (error) {
    console.error('Error deleting provider data:', error);
    throw error;
  }
};
