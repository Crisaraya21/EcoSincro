import { Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BuscadorPuntos from './pages/ciudadano/BuscadorPuntos';
import RegistroEntrega from './pages/ciudadano/RegistroEntrega';
import HistorialEntregas from './pages/ciudadano/HistorialEntregas';
import './App.css';

/* ── Protected wrapper ── */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

/* ── Ciudadano layout with navbar ── */
function CiudadanoLayout() {
  const { logout, theme, toggleTheme } = useAuth();

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="navbar-brand">
          <span>EcoSincro</span>
        </div>

        <div className="navbar-links">
          <NavLink
            to="/ciudadano/buscar"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Buscar Puntos
          </NavLink>
          <NavLink
            to="/ciudadano/registro-entrega"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Registrar Entrega
          </NavLink>
          <NavLink
            to="/ciudadano/historial"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Historial
          </NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <button 
            className="btn-theme" 
            onClick={toggleTheme} 
            title="Cambiar tema"
            style={{
              padding: 'var(--sp-2)',
              borderRadius: 'var(--r-md)',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-500)',
              transition: 'all var(--ease-fast)'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn-logout" onClick={() => { logout(); window.location.href = '/'; }}>
            Salir
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

/* ── App ── */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/ciudadano"
          element={
            <ProtectedRoute>
              <CiudadanoLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="buscar" replace />} />
          <Route path="buscar" element={<BuscadorPuntos />} />
          <Route path="registro-entrega" element={<RegistroEntrega />} />
          <Route path="historial" element={<HistorialEntregas />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
