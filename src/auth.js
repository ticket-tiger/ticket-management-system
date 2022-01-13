import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({
  user: { email: null, role: null },
  signin: null,
  signout: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: window.localStorage.getItem('email'),
    role: window.localStorage.getItem('role'),
  });

  const signin = (newUser) => {
    setUser(newUser);
    window.localStorage.setItem('email', newUser.email);
    window.localStorage.setItem('role', newUser.role);
  };

  const signout = () => {
    setUser({ email: null, role: null });
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('role');
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
  if (auth.user.email === null) {
    return <Navigate to="/create-ticket" />;
  }
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
