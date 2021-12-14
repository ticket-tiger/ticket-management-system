import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({ email: null, signin: null, signout: null });

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(() => window.localStorage.getItem('email'));

  const signin = (newUser) => {
    setEmail(newUser);
    window.localStorage.setItem('email', newUser);
  };

  const signout = () => {
    setEmail(null);
    window.localStorage.removeItem('email');
  };

  const value = { email, signin, signout };

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
  if (auth.email === null) {
    return <Navigate to="/login" />;
  }
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
