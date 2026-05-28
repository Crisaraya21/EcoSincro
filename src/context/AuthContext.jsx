import { createContext, useContext, useState, useEffect } from 'react';

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

  // ── Authentication Actions ──
  const login = (email, password) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('El correo electrónico o la contraseña ingresados no coinciden con ningún registro existente.');
    }
    // Only citizens allowed in citizen portal (extensible in the future)
    if (user.rol !== 'ciudadano') {
      throw new Error('Esta cuenta no pertenece al perfil Ciudadano.');
    }
    setCurrentUser(user);
    return user;
  };

  const register = (nombre, email, password, distrito = 'Ubicación en vivo') => {
    const yaExiste = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (yaExiste) {
      throw new Error('El correo electrónico ya está registrado por otra cuenta en la plataforma.');
    }
    const nuevoUsuario = {
      nombre,
      email,
      password,
      distrito,
      rol: 'ciudadano' // Automatic Citizen Role assignment
    };
    
    setUsers((prev) => [...prev, nuevoUsuario]);
    setCurrentUser(nuevoUsuario); // Redirect and login directly
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        theme,
        toggleTheme,
        deliveries,
        addDelivery,
        login,
        register,
        logout
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
