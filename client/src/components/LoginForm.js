import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
          const response = await fetch('/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          login(data.access_token, data.user_id); // Update to include user_id
          navigate('/manage-reservation'); // Redirect to a reservations management page
      } catch (error) {
          setError(error.message);
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  return (
      <form onSubmit={handleSubmit}>
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error">{error}</p>}
      </form>
  );
};

export default LoginForm;
