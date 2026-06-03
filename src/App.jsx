import { Routes, Route, Navigate, NavLink, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelector from './pages/auth/RoleSelector';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoginReceptor from './pages/auth/LoginReceptor';
import RegisterReceptor from './pages/auth/RegisterReceptor';
import BuscadorPuntos from './pages/ciudadano/BuscadorPuntos';
import RegistroEntrega from './pages/ciudadano/RegistroEntrega';
import HistorialEntregas from './pages/ciudadano/HistorialEntregas';
import DashboardReceptor from './pages/receptor/DashboardReceptor';
import GestionMateriales from './pages/receptor/GestionMateriales';
import BandejaEntregas from './pages/receptor/BandejaEntregas';
import Inventario from './pages/receptor/Inventario';
import './App.css';

/* ── Protected wrapper with role validation ── */
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requiredRole && currentUser?.rol !== requiredRole) return <Navigate to="/" replace />;
  return children;
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

/* ── Receptor layout with navbar ── */
function ReceptorLayout() {
  const { logout, theme, toggleTheme } = useAuth();

  return (
    <>
      <nav className="navbar" id="main-nav">
        <div className="navbar-brand">
          <span>EcoSincro - Centro de Acopio</span>
        </div>

        <div className="navbar-links">
          <NavLink
            to="/receptor/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/receptor/bandeja"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Bandeja de Entregas
          </NavLink>
          <NavLink
            to="/receptor/materiales"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Materiales
          </NavLink>
          <NavLink
            to="/receptor/inventario"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Inventario
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
          <button className="btn-logout" onClick={() => { logout(); window.location.href = '/receptor/login'; }}>
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
        {/* Main */}
        <Route path="/" element={<RoleSelector />} />

        {/* Ciudadano Routes */}
        <Route path="/ciudadano/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/ciudadano"
          element={
            <ProtectedRoute requiredRole="ciudadano">
              <CiudadanoLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="buscar" replace />} />
          <Route path="buscar" element={<BuscadorPuntos />} />
          <Route path="registro-entrega" element={<RegistroEntrega />} />
          <Route path="historial" element={<HistorialEntregas />} />
        </Route>

        {/* Receptor Routes */}
        <Route path="/receptor/login" element={<LoginReceptor />} />
        <Route path="/receptor/register" element={<RegisterReceptor />} />
        <Route
          path="/receptor"
          element={
            <ProtectedRoute requiredRole="receptor">
              <ReceptorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardReceptor />} />
          <Route path="bandeja" element={<BandejaEntregas />} />
          <Route path="materiales" element={<GestionMateriales />} />
          <Route path="inventario" element={<Inventario />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
