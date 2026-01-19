import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '../../components/ui/Base';
import { useAuth } from '../../contexts/AuthContext';
import { IndianRupee, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import './Auth.css';

export const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, role: authRole } = useAuth();
    const [role, setRole] = useState('farmer'); // UI side role for selection
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated && authRole) {
            navigate(`/${authRole}`);
        }
    }, [isAuthenticated, authRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // Passing 'role' state to mock login so it can set the user role
        const res = await login(formData.email, formData.password, role);
        if (res.success) {
            navigate(`/${res.user.role}`);
        } else {
            setError(res.message || 'Login failed');
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
                        <button
                            className={role === 'farmer' ? 'active' : ''}
                            onClick={() => setRole('farmer')}
                        >
                            Farmer
                        </button>
                        <button
                            className={role === 'buyer' ? 'active' : ''}
                            onClick={() => setRole('buyer')}
                        >
                            Buyer
                        </button>
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
                            Login to {role.charAt(0).toUpperCase() + role.slice(1)} Portal <LogIn size={18} />
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
    const [role, setRole] = useState('farmer');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated && authRole) {
            navigate(`/${authRole}`);
        }
    }, [isAuthenticated, authRole, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        const res = await signup(formData.name, formData.email, formData.password, role);
        if (res.success) {
            // Redirect based on the ACTUAL role returned by backend
            const userRole = res.user.role;
            navigate(`/${userRole}`);
        } else {
            setError(res.message || 'Signup failed');
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
                        <button
                            className={role === 'farmer' ? 'active' : ''}
                            onClick={() => setRole('farmer')}
                        >
                            Farmer
                        </button>
                        <button
                            className={role === 'buyer' ? 'active' : ''}
                            onClick={() => setRole('buyer')}
                        >
                            Buyer
                        </button>
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
                            Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)} <UserPlus size={18} />
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
