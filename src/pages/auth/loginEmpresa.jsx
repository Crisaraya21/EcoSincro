import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginEmpresa() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            login(email, password, 'empresa');
            navigate('/empresa/residuos');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-icon">🏢</div>
                <h1>Acceso Empresa</h1>
                <p className="subtitle">Panel de gestión de residuos</p>

                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c',
                        padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)',
                        fontSize: '0.82rem', fontWeight: '500', textAlign: 'left',
                        marginBottom: 'var(--sp-4)',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', textAlign: 'left' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
                            Correo Corporativo
                        </label>
                        <input type="email" placeholder="empresa@corporativo.com" value={email}
                               onChange={(e) => setEmail(e.target.value)} required className="search-input" style={{ margin: 0 }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
                            Contraseña
                        </label>
                        <input type="password" placeholder="••••••••" value={password}
                               onChange={(e) => setPassword(e.target.value)} required className="search-input" style={{ margin: 0 }} />
                    </div>

                    <button type="submit" className="btn-enter" style={{ marginTop: 'var(--sp-2)' }}>
                        Iniciar Sesión
                    </button>
                </form>

                {/* Demo hint */}
                <div style={{
                    marginTop: 'var(--sp-5)', padding: 'var(--sp-3)', background: 'var(--eco-50)',
                    borderRadius: 'var(--r-md)', border: '1px solid var(--eco-200)', fontSize: '0.78rem', color: 'var(--gray-600)',
                }}>
                    <strong>Demo:</strong> empresa@eco.com / 123
                </div>

                <p style={{ marginTop: 'var(--sp-4)', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/empresa/register" style={{ color: 'var(--eco-600)', fontWeight: '600', textDecoration: 'underline' }}>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}