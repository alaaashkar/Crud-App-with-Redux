import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { useEffect, useState } from "react";
import { Home } from "../../views/Home/Home";
import { Create } from "../../views/Create/Create";
import { Update } from "../../views/Update/Update";
import { Signin } from "../auth/Signin/Signin";
import { SignUp } from "../Signup/Signup";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { ClimbingBoxLoader } from "react-spinners";
import './AnimatedRoutes.css'

export const AnimatedRoutes = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  // If authentication state is still being determined, show a loading indicator
  if (authLoading) {
    return <ClimbingBoxLoader className="loader-climber" color="#000000" />
  }

  return (
    <Routes >
      {authUser ? (
        <>
          {/* Authenticated routes */}
          <Route
            path="/"
            element={<Layout />}
          >
            <Route index element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Update />} />
          </Route>
        </>
      ) : (
        <>
          {/* Unauthenticated routes */}
          <Route
            path="/"
            element={<Navigate to="/signin" />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
        </>
      )}
    </Routes>
  );
};
