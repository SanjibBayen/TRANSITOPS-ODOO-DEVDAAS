import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';
import { loginUser, logout, updateProfile, fetchCurrentUser, User } from '../store/slices/authSlice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password })).unwrap();
    return result;
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleUpdateProfile = useCallback((profileData: Partial<User>) => {
    dispatch(updateProfile(profileData));
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();
    } catch {
      // Session expired
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    handleLogout,
    handleUpdateProfile,
    refreshUser,
  };
};