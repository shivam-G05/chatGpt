import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Plain CSS styles (mobile-first)
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2d2f36',
    padding: '16px',
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#26282d',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.4)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
    fontSize: '20px',
    fontWeight: 700
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '16px',
    color: '#cfcfcf',
    fontSize: '14px'
  },
  formGroup: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', color: '#bdbdbd' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #3a3c40',
    background: '#313338',
    color: '#fff',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    background: '#12b76a',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer'
  },
  footerText: { textAlign: 'center', marginTop: '14px', color: '#bdbdbd', fontSize: '13px' },
  error: { color: '#ff6b6b', marginBottom: '12px', textAlign: 'center' }
};

export default function RegisterPlain() {
  // Prefilled data per your request
  const [form, setForm] = useState({
    fullName: { firstName: 'Shivam', lastName: 'Goel' },
    email: 'shivamkgjj2005@gmail.com',
    password: 'hello',
    confirmPassword: 'hello'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName') {
      setForm((prev) => ({ ...prev, fullName: { ...prev.fullName, [name]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.firstName || !form.fullName.lastName) {
      setError('Please provide your first and last name.');
      return;
    }
    if (!form.email) {
      setError('Email is required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const payload = {
      fullName: {
        firstName: form.fullName.firstName,
        lastName: form.fullName.lastName
      },
      email: form.email,
      password: form.password
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      // registration succeeded; backend sets cookie token
      // navigate to chat or login
      navigate('/chat');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>ChatGPT Clone</div>
        <div style={styles.subtitle}>Create your account</div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              value={form.fullName.firstName}
              onChange={handleChange}
              style={styles.input}
              autoComplete="given-name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              value={form.fullName.lastName}
              onChange={handleChange}
              style={styles.input}
              autoComplete="family-name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div style={styles.footerText}>
          Already have an account? <a href="/login" style={{ color: '#7ee787' }}>Log in</a>
        </div>
      </div>
    </div>
  );
}
