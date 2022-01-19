import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({
  user: { email: null, role: null },
  signin: null,
  signout: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='))
      ? document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='))
        .split('=')[1]
      : null,
  );

  const signin = (newUser) => {
    setUser(newUser);
  };

  const signout = () => {
    setUser(null);
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
  if (!auth.user) {
    return <Navigate to="/create-ticket" />;
  }
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
