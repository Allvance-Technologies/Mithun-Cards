import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const LoginCard = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        return localStorage.getItem('rememberMe') === 'true';
    });
    const [formData, setFormData] = useState({
        username: 'Mithun',
        password: 'password',
        name: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [logoError, setLogoError] = useState(false);
    const navigate = useNavigate();
    const { login } = useData();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', formData.username);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberedUsername');
                    localStorage.setItem('rememberMe', 'false');
                }
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <div className="login-card">
            <div className="login-header">
                <div className="logo-container">
                    {!logoError ? (
                        <img
                            src="/logo.png"
                            alt="Logo"
                            style={{
                                width: '140px',
                                height: 'auto',
                                marginBottom: '15px',
                                mixBlendMode: 'multiply',
                                transform: 'scale(1.6)'
                            }}
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="logo-icon">
                            <Lock size={32} color="#2563EB" />
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className={`auth-error ${error.includes('successful') ? 'success' : ''}`}>
                    {error}
                </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-wrapper">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>


                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {isLogin && (
                    <div className="remember-me-container" onClick={() => setRememberMe(!rememberMe)}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span>Remember Me</span>
                    </div>
                )}

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginCard;
