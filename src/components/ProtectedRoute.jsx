import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ element, ...props }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  if (!authUser) {
    return <Navigate to="/signin" />;
  }

  return <Route {...props} element={element} />;
};

export default ProtectedRoute;
