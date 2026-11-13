import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { auth, googleProvider } from './firebase.js';
import { getAuthErrorMessage } from './Autherrors.jsx';
import Icon from './Icon.jsx';
import AuthLayout, { GoogleButton } from './AuthLayout.jsx';

export default function Login({ theme, onToggleTheme }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  async function handleEmailSignIn(e) {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');
    setAuthLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // App.jsx listens to onAuthStateChanged and redirects to /dashboard
    } catch (error) {
      console.error('Email sign-in error:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setAuthError('');
    setAuthNotice('');
    setAuthLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handlePasswordReset() {
    setAuthError('');
    setAuthNotice('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setAuthError('Please enter your email address first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setAuthNotice('Password reset instructions have been sent to your email.');
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError(getAuthErrorMessage(error));
    }
  }

  return (
    <AuthLayout
      theme={theme}
      onToggleTheme={onToggleTheme}
      heading={<>Let’s make room<br />for how you’re feeling.</>}
      subtitle="Sign in to pick up where you left off."
    >
      <form className="sign-in-form" onSubmit={handleEmailSignIn}>
        <label htmlFor="email">Email address</label>

        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-label">
          <label htmlFor="password">Password</label>

          <button
            type="button"
            className="text-button"
            onClick={handlePasswordReset}
          >
            Forgot password?
          </button>
        </div>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button
          type="submit"
          className="primary-button sign-in-button"
          disabled={authLoading}
        >
          {authLoading ? 'Please wait...' : 'Sign in'}
          <Icon name="arrow" size={17} />
        </button>
      </form>

      <div className="divider"><span />or continue with<span /></div>

      <GoogleButton onClick={handleGoogleSignIn} disabled={authLoading} />

      {authError && <p className="auth-notice" role="alert">{authError}</p>}
      {authNotice && <p className="auth-notice" role="status">{authNotice}</p>}

      <p className="auth-signup">
        New to Kindred?{' '}
        <button
          type="button"
          className="text-button"
          onClick={() => navigate('/signup')}
        >
          Create an account
        </button>
      </p>
    </AuthLayout>
  );
}
