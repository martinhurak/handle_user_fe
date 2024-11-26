// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Alert, Spinner } from 'react-bootstrap';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // reset error state before each attempt

    try {
      await login(username, password);
      navigate('/account-settings');
    } catch (error) {
      setError('Nesprávne prihlasovacie údaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Prihlásenie</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Používateľské meno</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Heslo</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Prihlásiť sa'}
      </button>
      
      {/* Odkaz na obnovenie hesla */}
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate('/forgot-password')}
        >
          Zabudol som heslo
        </button>
      </div>
    </form>
  );
}

export default Login;
