import { Link } from 'react-router-dom';

const roles = [
    {
        to: '/ciudadano/login',
        icono: '👤',
        titulo: 'Ciudadano',
        desc: 'Recicla y contribuye',
    },
    {
        to: '/receptor/login',
        icono: '🏭',
        titulo: 'Centro de Acopio',
        desc: 'Gestiona tu centro',
    },
    {
        to: '/empresa/login',
        icono: '🏢',
        titulo: 'Empresa',
        desc: 'Gestiona tus residuos',
    },
];

export default function RoleSelector() {
    return (
        <div className="login-page" style={{ background: 'linear-gradient(135deg, var(--eco-50), var(--eco-100))' }}>
            <div style={{ maxWidth: '640px', width: '90%', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 'var(--sp-3)' }}>🌍</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-2)', color: 'var(--eco-700)' }}>EcoSincro</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-8)' }}>
                    Plataforma de Reciclaje Inteligente
                </p>

                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--sp-5)', fontWeight: '500' }}>
                    ¿Con qué perfil deseas ingresar?
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                    {roles.map((r) => (
                        <Link
                            key={r.to}
                            to={r.to}
                            style={{
                                padding: 'var(--sp-6) var(--sp-4)',
                                border: '2px solid var(--eco-300)',
                                borderRadius: 'var(--r-xl)',
                                background: 'var(--white)',
                                textDecoration: 'none',
                                color: 'var(--eco-700)',
                                transition: 'all 0.18s',
                                display: 'block',
                                boxShadow: 'var(--shadow-xs)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--eco-600)';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = 'var(--eco-600)';
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-green)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--white)';
                                e.currentTarget.style.color = 'var(--eco-700)';
                                e.currentTarget.style.borderColor = 'var(--eco-300)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)' }}>{r.icono}</div>
                            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: 'var(--sp-1)' }}>{r.titulo}</div>
                            <div style={{ fontSize: '0.82rem', opacity: 0.75 }}>{r.desc}</div>
                        </Link>
                    ))}
                </div>

                <div style={{
                    padding: 'var(--sp-4)', background: 'var(--white)',
                    borderRadius: 'var(--r-md)', border: '1px solid var(--gray-200)',
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
                        💡 <strong>Selecciona tu perfil</strong> para acceder a las funcionalidades que corresponden a tu cuenta.
                    </p>
                </div>
            </div>
        </div>
    );
}