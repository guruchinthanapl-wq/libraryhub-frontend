import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('librarian');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      await register({ username, email, password, role });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>Create an Account</h2>
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="librarian">Librarian</option>
          <option value="assistant">Assistant</option>
        </select>
        <button type="submit">Register</button>
        <p className="switch-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;