import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';
import { NOTIFICATIONS } from '../constants/messages';

import './Login.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signUpAllowed, setSignUpAllowed] = useState(true);
  const { login } = useAuth();

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/auth/signup-status');
        if (res.ok) {
          const data = await res.json();
          const allowed = data.signUpAllowed;
          setSignUpAllowed(allowed);
          if (!allowed) {
            setIsLogin(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch signup status", err);
      }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || NOTIFICATIONS.ERROR.AUTH_FAILED);
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand">
            <div className="login-logo-wrapper">
              <img src="/logo.png" alt="CarTracker Logo" className="login-logo-img" />
            </div>
            <h1 className="login-brand-text">
              <span className="text-car">Car</span>
              <span className="text-tracker">Tracker</span>
            </h1>
          </div>
          <h2 className="login-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="login-subtitle">
            {isLogin ? 'Sign in to manage your car tracker' : 'Sign up to get started today'}
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">
              Username
            </label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">
              Password
            </label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          {signUpAllowed ? (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="login-toggle-btn"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          ) : (
            <p className="registration-closed-text">
              Registration of new users is not allowed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
