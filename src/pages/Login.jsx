import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login to Library Hub</h2>

        {error && <p className="form-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p className="switch-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
      </form>
    </div>
  );
}

export default Login;