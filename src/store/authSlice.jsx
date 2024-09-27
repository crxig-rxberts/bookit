import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userAttributes: null,
  accessToken: null,
  expiresIn: null,
  tokenType: null,
  refreshToken: null,
  idToken: null,
  isAuthenticated: false,
  userSub: null,
};

const getCurrentTimeInSeconds = () => Math.floor(Date.now() / 1000);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const {userAttributes, AccessToken, ExpiresIn, TokenType, RefreshToken, IdToken} = action.payload;
      const currentTime = getCurrentTimeInSeconds();
      state.userAttributes = userAttributes;
      state.accessToken = AccessToken;
      state.expiresIn = currentTime + ExpiresIn;
      state.tokenType = TokenType;
      state.refreshToken = RefreshToken;
      state.idToken = IdToken;
      state.isAuthenticated = true;
      state.userSub = userAttributes.username;
    },
    clearAuthData: state => {
      Object.assign(state, initialState);
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    updateExpirationTime: (state, action) => {
      state.expiresIn = action.payload;
    },
  },
});

export const {setAuthData, clearAuthData, updateAccessToken, setRefreshToken, updateExpirationTime} = authSlice.actions;
export default authSlice.reducer;
