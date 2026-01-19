import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui/Base';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import './Auth.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role: authRole } = useAuth();
  const [role, setRole] = useState('FARMER'); // always uppercase
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && authRole) {
      navigate(`/${authRole}`); // direct match to route
    }
  }, [isAuthenticated, authRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // send role as uppercase
      const res = await login(formData.email, formData.password, role.toUpperCase());

      if (res.success) {
        navigate(`/${res.user.role}`); // redirect based on backend role
      } else {
        if (res.message.includes('sign up')) alert('You do not have an account. Please sign up first!');
        else setError(res.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon">🌾</div>
          <span>KrishiSetu</span>
        </div>

        <Card className="auth-card">
          <h2>Welcome Back</h2>
          <p>Login to manage your agricultural contracts.</p>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <div className="role-selector">
            <button className={role === 'FARMER' ? 'active' : ''} onClick={() => setRole('FARMER')}>Farmer</button>
            <button className={role === 'BUYER' ? 'active' : ''} onClick={() => setRole('BUYER')}>Buyer</button>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input
                type="email"
                placeholder="name@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="auth-btn">
              Login to {role} Portal <LogIn size={18} />
            </Button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, role: authRole } = useAuth();
  const [role, setRole] = useState('FARMER'); // uppercase
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && authRole) {
      navigate(`/${authRole}`);
    }
  }, [isAuthenticated, authRole, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // send role as uppercase
      const res = await signup(formData.name, formData.email, formData.password, role.toUpperCase());

      if (res.success) {
        navigate(`/${res.user.role}`); // redirect based on backend role
      } else {
        setError(res.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon">🌾</div>
          <span>KrishiSetu</span>
        </div>

        <Card className="auth-card">
          <h2>Create Account</h2>
          <p>Join the future of contract farming in India.</p>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

          <div className="role-selector">
            <button className={role === 'FARMER' ? 'active' : ''} onClick={() => setRole('FARMER')}>Farmer</button>
            <button className={role === 'BUYER' ? 'active' : ''} onClick={() => setRole('BUYER')}>Buyer</button>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label><UserPlus size={16} /> Full Name</label>
              <input
                type="text"
                placeholder="Jai Singh"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input
                type="email"
                placeholder="name@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="auth-btn">
              Sign Up as {role} <UserPlus size={18} />
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
