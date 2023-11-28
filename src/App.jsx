import './App.css';
import { Create } from './views/Create/Create';
import { Home } from './views/Home/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Update } from './views/Update/Update';
import { Signin } from './components/auth/Signin/Signin';
import { SignUp } from './components/Signup/Signup';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { fetchUserList } from './state/UsersSlice';
import { useDispatch } from 'react-redux';
import { Layout } from './components/Layout/Layout';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const dispatch = useDispatch()

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

  }, [dispatch]);


  return (
    <Routes>
      {authUser ? (
        <>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/edit/:id' element={<Update />} />
            <Route path='/signin' element={<Signin />} />
          </Route>
        </>
      ) : (
        <>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<Signin />} />
          {/* Redirect to /signin if not authenticated */}
          <Route element={<Navigate to='/signin' />} />
        </>
      )}
    </Routes>
  );
}

export default App;
