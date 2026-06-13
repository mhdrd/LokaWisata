import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../storage/tokenStorage';
import * as authApi from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check secure store on startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getToken();
        if (token) {
          setUserToken(token);
          // Fetch profile since we have a token
          const profileRes = await authApi.getProfile();
          // Adjust for API output structure
          setUserProfile(profileRes.data || profileRes);
        }
      } catch (e) {
        console.error('Failed to load token or profile from secure store:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      // Expected structure: { data: { accessToken } } or direct response
      const token = response.data?.accessToken || response.accessToken;
      if (token) {
        await setToken(token);
        setUserToken(token);
        // Load user profile
        const profileRes = await authApi.getProfile();
        setUserProfile(profileRes.data || profileRes);
        return { success: true };
      } else {
        throw new Error('Token tidak ditemukan dalam respon login');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      const message = error.response?.data?.message || error.message || 'Login gagal';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      // Auto login after registration
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      const message = error.response?.data?.message || error.message || 'Pendaftaran gagal';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await removeToken();
      setUserToken(null);
      setUserProfile(null);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileState = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userProfile,
        login,
        register,
        logout,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

