import client from './userClient';
import {setAuthData, updateAccessToken} from '../store/authSlice';
import {createProviderAndSubmitToSearch} from './providerService';
import {createClient} from './clientsClient';

const API_URL = 'http://10.0.2.2:3000/api/auth';
export const refreshToken = async (dispatch, refreshTokenValue) => {
  try {
    const response = await client.post(`${API_URL}/refresh-token`, {
      refreshToken: refreshTokenValue,
    });

    if (response.data.success) {
      const {AccessToken, ExpiresIn, TokenType, IdToken, userAttributes} = response.data.data;
      const currentTime = Math.floor(Date.now() / 1000);

      dispatch(updateAccessToken(AccessToken));
      dispatch(
        setAuthData({
          accessToken: AccessToken,
          expiresIn: currentTime + ExpiresIn,
          tokenType: TokenType,
          idToken: IdToken,
          refreshToken: refreshTokenValue,
          userAttributes,
        }),
      );
      return true;
    } else {
      // Handle token refresh failure
      return false;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await client.post(`${API_URL}/login`, {
      username,
      password,
    });
    console.log(`POST ${API_URL}/login - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during login',
    };
  }
};

export const signUpUser = async (username, password, email, userType, providerData = null, clientName = '') => {
  try {
    let requestBody = {
      username,
      password,
      email,
      userType,
    };

    const response = await client.post(`${API_URL}/register`, requestBody);
    console.log(`POST ${API_URL}/register - Response:` + JSON.stringify(response).substring(0, 100) + '...');
    if (response.data.success) {
      if (userType === 'SERVICE_PROVIDER') {
        await createProviderAndSubmitToSearch(providerData, response.data.data.UserSub);
      }
      if (userType === 'CLIENT') {
        await createClient({clientName: clientName, userSub: response.data.data.UserSub});
      }
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during sign-up',
    };
  }
};

export const confirmRegistration = async (username, confirmationCode) => {
  try {
    const response = await client.post(`${API_URL}/confirm-registration`, {
      username,
      confirmationCode,
    });

    console.log(`POST ${API_URL}/confirm-registration - Response` + JSON.stringify(response).substring(0, 100) + '...');
    if (response.data.success) {
      const userData = response.data.data;

      return {
        success: true,
        message: response.data.message,
        data: userData,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during confirmation',
    };
  }
};
