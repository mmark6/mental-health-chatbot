import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from 'firebase/auth';

import { auth, googleProvider } from './firebase.js';
import { getAuthErrorMessage } from './Autherrors.jsx';
import Icon from './Icon.jsx';
import AuthLayout, { GoogleButton } from './AuthLayout.jsx';

export default function Signup({ theme, onToggleTheme }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate('/dashboard', { replace: true });

      sendEmailVerification(result.user).catch((error) => {
        console.error('Verification email error:', error);
      });
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setAuthError('');
    setAuthLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <AuthLayout
      theme={theme}
      onToggleTheme={onToggleTheme}
      heading={<>A little space<br />just for you.</>}
      subtitle="Create an account to begin your wellbeing journey."
    >
      <form className="sign-in-form" onSubmit={handleSignUp}>
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
        </div>

        <input
          id="password"
          type="password"
          placeholder="Create a password (at least 6 characters)"
          autoComplete="new-password"
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
          {authLoading ? 'Please wait...' : 'Create account'}
          <Icon name="arrow" size={17} />
        </button>
      </form>

      <div className="divider"><span />or continue with<span /></div>

      <GoogleButton onClick={handleGoogleSignIn} disabled={authLoading} />

      {authError && <p className="auth-notice" role="alert">{authError}</p>}

      <p className="auth-signup">
        Already have an account?{' '}
        <button
          type="button"
          className="text-button"
          onClick={() => navigate('/login')}
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
