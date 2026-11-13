import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase';

import Login from './login.jsx';
import Signup from './Signup.jsx';
import Dashboard from './dashboard.jsx';
import './App.css';

function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('kindred-theme') === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.warn('Could not read the saved theme preference:', error);
      return 'light';
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('kindred-theme', nextTheme);
    } catch (error) {
      console.warn('Could not save the theme preference:', error);
    }
  }

  if (!authReady) {
    return <div className="auth-page">Loading Kindred...</div>;
  }

  const activeUser = firebaseUser || auth.currentUser;
  const isSignedIn = Boolean(activeUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isSignedIn
              ? <Navigate to="/dashboard" replace />
              : <Login theme={theme} onToggleTheme={toggleTheme} />
          }
        />

        <Route
          path="/signup"
          element={
            isSignedIn
              ? <Navigate to="/dashboard" replace />
              : <Signup theme={theme} onToggleTheme={toggleTheme} />
          }
        />

        <Route
          path="/dashboard"
          element={
            isSignedIn
              ? <Dashboard firebaseUser={activeUser} theme={theme} onToggleTheme={toggleTheme} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="*"
          element={<Navigate to={isSignedIn ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
