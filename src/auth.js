import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({ user: null, signin: null, signout: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signin = (newUser) => {
    setUser(newUser);
    window.localStorage.setItem('user', newUser);
  };

  const signout = () => {
    setUser(null);
    window.localStorage.removeItem('user');
  };

  const value = { user, signin, signout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  if (auth.user === null) {
    return <Navigate to="/login" />;
  }
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
