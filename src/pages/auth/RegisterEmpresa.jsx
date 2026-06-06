import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SECTORES_PRODUCTIVOS } from '../../services/empresaService';

export default function RegisterEmpresa() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [razonSocial, setRazonSocial]     = useState('');
    const [responsable, setResponsable]     = useState('');
    const [email, setEmail]                 = useState('');
    const [password, setPassword]           = useState('');
    const [cedula, setCedula]               = useState('');
    const [sector, setSector]               = useState('');
    const [error, setError]                 = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!razonSocial || !responsable || !email || !password || !cedula || !sector) {
            setError('Por favor completa todos los campos obligatorios.');
            return;
        }

        try {
            register(razonSocial, email, password, 'empresa', {
                responsable,
                cedula,
                sector,
            });
            navigate('/empresa/residuos');
        } catch (err) {
            setError(err.message);
        }
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--gray-600)',
        marginBottom: 'var(--sp-1)',
    };

    const inputStyle = { margin: 0 };

    return (
        <div className="login-page">
            <div className="login-card" style={{ maxWidth: '480px', width: '90%' }}>
                <div className="login-icon">🏢</div>
                <h1>Crear Cuenta Empresa</h1>
                <p className="subtitle">Registra tu empresa generadora de residuos</p>

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

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

                    <div className="form-group">
                        <label style={labelStyle}>Razón Social *</label>
                        <input type="text" placeholder="Empresa S.A." value={razonSocial}
                               onChange={(e) => setRazonSocial(e.target.value)} required className="search-input" style={inputStyle} />
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Nombre del Responsable Ambiental *</label>
                        <input type="text" placeholder="Ana Rodríguez" value={responsable}
                               onChange={(e) => setResponsable(e.target.value)} required className="search-input" style={inputStyle} />
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Correo Corporativo *</label>
                        <input type="email" placeholder="empresa@corporativo.com" value={email}
                               onChange={(e) => setEmail(e.target.value)} required className="search-input" style={inputStyle} />
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Contraseña *</label>
                        <input type="password" placeholder="••••••••" value={password}
                               onChange={(e) => setPassword(e.target.value)} required className="search-input" style={inputStyle} />
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Cédula Jurídica *</label>
                        <input type="text" placeholder="3-101-000000" value={cedula}
                               onChange={(e) => setCedula(e.target.value)} required className="search-input" style={inputStyle} />
                    </div>

                    <div className="form-group">
                        <label style={labelStyle}>Sector Productivo *</label>
                        <select value={sector} onChange={(e) => setSector(e.target.value)} required
                                className="search-input"
                                style={{ ...inputStyle, cursor: 'pointer', background: 'var(--white)', color: sector ? 'var(--gray-800)' : 'var(--gray-400)' }}>
                            <option value="">Selecciona un sector...</option>
                            {SECTORES_PRODUCTIVOS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rol badge */}
                    <div className="form-group" style={{ marginBottom: 'var(--sp-2)' }}>
                        <label style={labelStyle}>Rol Asignado</label>
                        <div style={{
                            background: 'var(--eco-50)', color: 'var(--eco-700)',
                            padding: 'var(--sp-3)', borderRadius: 'var(--r-md)',
                            border: '1px solid var(--eco-200)', fontSize: '0.85rem', fontWeight: '700',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span>🏢 Empresa Generadora</span>
                            <span style={{ fontSize: '0.72rem', fontWeight: '600', background: 'var(--white)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--eco-300)' }}>Automático</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-enter">
                        Registrarse y Entrar
                    </button>
                </form>

                <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/empresa/login" style={{ color: 'var(--eco-600)', fontWeight: '600', textDecoration: 'underline' }}>
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}