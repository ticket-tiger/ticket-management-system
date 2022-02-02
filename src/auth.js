import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({
  user: { email: null, role: null },
  signin: null,
  signout: null,
});

export const AuthProvider = ({ children }) => {
  // Get initial user state from cookie
  const [user, setUser] = useState(
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='))
      ? JSON.parse(document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='))
        .split('=')[1])
      : { email: null, role: null },
  );

  const signin = (email, role) => {
    setUser({ email, role });
  };

  const signout = () => {
    setUser({ email: null, role: null });
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

// Restrict certain routes if the user is not signed in
export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  if (!auth.user.email) {
    return <Navigate to="/create-ticket" />;
  }
  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
