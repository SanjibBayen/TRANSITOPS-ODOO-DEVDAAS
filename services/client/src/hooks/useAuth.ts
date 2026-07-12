import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { loginSuccess, logout, setActiveScope, updateProfile, User } from '../store/slices/authSlice.ts';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, activeScope, isLoading, error } = useSelector((state: RootState) => state.auth);

  const switchScope = (scope: 'fleet-manager' | 'dispatcher') => {
    dispatch(setActiveScope(scope));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = (profileData: Partial<User>) => {
    dispatch(updateProfile(profileData));
  };

  const handleLogin = (name: string, email: string, role: any, scope: 'fleet-manager' | 'dispatcher') => {
    dispatch(loginSuccess({
      user: {
        id: 'usr_' + Math.random().toString(36).substr(2, 5),
        name,
        email,
        role,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYBkw3LHcTwmizgJ3i8YKR18fYqElE3Mg9j2KIiAk20JcN3_h5fi77C0J2BvviOW_QR2oyHcQ1XeYxnzmkweobMewYAuRyAzEJWCwz1f8yi2isPQCNymxtX7N0ODA2q72p8krMwTYMqNCrLU0kY2W6SZhU8o4L_fBJxZlYDMT_ZRzWlderTFed7dQY7vdEiknxiWpdbu7Khs7Et6zBYfdMI_lfWSWZaqHVYJvvx84zfuptWyJN5g9-',
      },
      scope
    }));
  };

  return {
    user,
    isAuthenticated,
    activeScope,
    isLoading,
    error,
    switchScope,
    handleLogout,
    handleLogin,
    handleUpdateProfile
  };
};
