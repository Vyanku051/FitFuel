import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/Final_Logo-removebg-preview.png';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = isRegister
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';
      const payload = isRegister ? formData : { email: formData.email, password: formData.password };
      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Space Grotesk', sans-serif",
      background: '#080808'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet" />

      {/* Left Side */}
      <div style={{
        flex: 1,
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Background glow */}
        <div style={{
          position: 'absolute',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(166,248,130,0.07) 0%, transparent 70%)',
          top: '-150px', right: '-100px',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(166,248,130,0.04) 0%, transparent 70%)',
          bottom: '-80px', left: '-60px',
          pointerEvents: 'none'
        }} />

        {/* Logo + Name */}
        <div style={{ marginBottom: '52px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '10px' }}>
            <img
              src={logo}
              alt="FitFuel Logo"
              style={{
                width: '96px',
                height: '96px',
                objectFit: 'contain',
                borderRadius: '16px',
                background: '#111'
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '80px',
                letterSpacing: '3px',
                color: '#A6F882',
                lineHeight: '1'
              }}>FITFUEL</div>
              <div style={{
                fontSize: '14px',
                letterSpacing: '3px',
                color: '#B2BEB5',
                textTransform: 'uppercase',
                marginTop: '8px'
              }}>Fuel Your Power</div>
            </div>
          </div>
        </div>

        

      </div>

      {/* Right Side */}
      <div style={{
        width: '460px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: '#060606',
        borderLeft: '1px solid #111'
      }}>

        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: '700',
            color: 'white', margin: '0 0 8px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {isRegister ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{ color: '#B2BEB5', margin: 0, fontSize: '14px' }}>
            {isRegister ? 'Start your fitness journey today' : 'Log in to continue your journey'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '10px', padding: '12px 16px',
            color: '#f87171', fontSize: '14px', marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ color: '#FFFFFF', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%', background: '#111',
                  border: '1.5px solid #1f1f1f',
                  borderRadius: '12px', padding: '14px 16px',
                  color: 'white', fontSize: '15px',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              />
            </div>
          )}

          <div>
            <label style={{ color: '#FFFFFF', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%', background: '#111',
                border: '1.5px solid #1f1f1f',
                borderRadius: '12px', padding: '14px 16px',
                color: 'white', fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            />
          </div>

          <div>
            <label style={{ color: '#FFFFFF', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%', background: '#111',
                border: '1.5px solid #1f1f1f',
                borderRadius: '12px', padding: '14px 16px',
                color: 'white', fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#4a7a2a' : '#A6F882',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '6px',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.5px'
            }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none', border: 'none',
              color: '#A6F882', fontWeight: '600',
              cursor: 'pointer', marginLeft: '6px',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;