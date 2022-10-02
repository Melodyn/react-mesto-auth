import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export const ProtectedRoute = ({ children }) => {
  const currentUser = useContext(CurrentUserContext);
  return currentUser.isAuth
    ? children
    : (<Navigate to="/sign-in" replace />);
};
