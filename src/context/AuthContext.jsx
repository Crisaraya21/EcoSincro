import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const FAKE_TOKEN = 'eco-dev-token-ciudadano-2024';

export function AuthProvider({ children }) {
  // ── Theme State ──
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('eco-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Deliveries State ──
  const [deliveries, setDeliveries] = useState(() => {
    const migrated = localStorage.getItem('eco-deliveries-migrated');
    if (!migrated) {
      localStorage.removeItem('eco-deliveries');
      localStorage.setItem('eco-deliveries-migrated', 'true');
      return [];
    }
    const saved = localStorage.getItem('eco-deliveries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eco-deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  // ── Mock Users Database ──
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('eco-users');
    if (saved) return JSON.parse(saved);
    return [
      {
        nombre: 'Juan Pérez',
        email: 'ciudadano@eco.com',
        password: '123',
        distrito: 'San José',
        rol: 'ciudadano'
      },
      {
        nombre: 'EcoPunto Central',
        email: 'receptor@eco.com',
        password: '123',
        direccion: 'Av. Central #45, San José Centro',
        lat: 9.9340,
        lng: -84.0870,
        rol: 'receptor',
        certificado: true,
        materiales: ['plastico', 'vidrio', 'carton'],
        horario: 'Lun–Vie 8:00–17:00',
        telefono: '2222-3344'
      },
      {
        nombre: 'Industrias EcoDemo S.A.',
        email: 'empresa@eco.com',
        password: '123',
        rol: 'empresa',
        responsable: 'Ana Rodríguez',
        cedula: '3-101-000001',
        sector: 'Manufactura',
        perfilResiduos: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eco-users', JSON.stringify(users));
  }, [users]);

  // ── Current Logged-in User ──
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eco-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eco-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eco-current-user');
    }
  }, [currentUser]);

  const isAuthenticated = !!currentUser;

  // ── Notifications State ──
  const [notifications, setNotifications] = useState([]);

  // ── Authentication Actions ──
  const login = (email, password, rolEsperado = null) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('El correo electrónico o la contraseña ingresados no coinciden con ningún registro existente.');
    }
    // Validate role if specified
    if (rolEsperado && user.rol !== rolEsperado) {
      throw new Error(`Esta cuenta no pertenece al perfil ${rolEsperado === 'ciudadano' ? 'Ciudadano' : 'Receptor'}.`);
    }
    setCurrentUser(user);
    return user;
  };

  const register = (nombre, email, password, rol = 'ciudadano', datosAdicionales = {}) => {
    const yaExiste = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (yaExiste) {
      throw new Error('El correo electrónico ya está registrado por otra cuenta en la plataforma.');
    }

    let nuevoUsuario = {
      nombre,
      email,
      password,
      rol
    };

    // Add role-specific data
    if (rol === 'ciudadano') {
      nuevoUsuario.distrito = datosAdicionales.distrito || 'Ubicación en vivo';
    } else if (rol === 'receptor') {
      nuevoUsuario.direccion = datosAdicionales.direccion || '';
      nuevoUsuario.lat = datosAdicionales.lat || 0;
      nuevoUsuario.lng = datosAdicionales.lng || 0;
      nuevoUsuario.certificado = false;
      nuevoUsuario.materiales = [];
      nuevoUsuario.horario = 'Lun–Vie 8:00–17:00';
      nuevoUsuario.telefono = datosAdicionales.telefono || '';
    } else if (rol === 'empresa') {
      nuevoUsuario.responsable = datosAdicionales.responsable || '';
      nuevoUsuario.cedula = datosAdicionales.cedula || '';
      nuevoUsuario.sector = datosAdicionales.sector || '';
      nuevoUsuario.perfilResiduos = [];
    }

    setUsers((prev) => [...prev, nuevoUsuario]);
    setCurrentUser(nuevoUsuario);
    return nuevoUsuario;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addDelivery = (delivery) => {
    setDeliveries((prev) => [delivery, ...prev]);
  };

  const getReceptores = () => {
    return users.filter((u) => u.rol === 'receptor');
  };

  const updateEmpresaResiduos = (perfilResiduos) => {
    setUsers((prev) =>
        prev.map((u) =>
            u.email === currentUser?.email ? { ...u, perfilResiduos } : u
        )
    );
    setCurrentUser((prev) => ({ ...prev, perfilResiduos }));
  };

  // ── Notification Actions ──
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, leida: true }))
    );
  }, []);

  return (
      <AuthContext.Provider
          value={{
            isAuthenticated,
            currentUser,
            theme,
            toggleTheme,
            deliveries,
            addDelivery,
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            login,
            register,
            logout,
            getReceptores,
            updateEmpresaResiduos
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}