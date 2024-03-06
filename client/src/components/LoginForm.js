import React, { useState } from 'react';
import { useUser } from './UserContext';

const LoginForm = () => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
      event.preventDefault();
      // Example: Post credentials to your backend
      try {
          const response = await fetch('/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          });
          if (!response.ok) throw new Error('Login failed');
          const { access_token } = await response.json();
          login(access_token); // Use the login function from context
      } catch (error) {
          setError('Failed to login');
          console.error(error);
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
          <button type="submit">Login</button>
          {error && <p>{error}</p>}
      </form>
  );
};

export default LoginForm;