import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Contador de notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.leida).length;

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Formatear fecha de forma legible
  const formatDate = (fecha) => {
    if (typeof fecha === 'string') {
      fecha = new Date(fecha);
    }
    
    const now = new Date();
    const diffMs = now - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;

    // Formato: HH:MM (si es hoy) o DD/MM (si es otro día)
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0');

    const isToday =
      now.getDate() === fecha.getDate() &&
      now.getMonth() === fecha.getMonth() &&
      now.getFullYear() === fecha.getFullYear();

    return isToday ? `${hours}:${minutes}` : `${day}/${month}`;
  };

  // Obtener color del indicador según tipo y estado de lectura
  const getDotColor = (notif) => {
    if (notif.leida) return 'var(--gray-400)';
    if (notif.tipo === 'success') return 'var(--success)';
    if (notif.tipo === 'warning') return 'var(--warning)';
    if (notif.tipo === 'danger') return 'var(--danger)';
    return 'var(--info)'; // 'info' tipo por defecto
  };

  // Notificaciones ordenadas de más reciente a más antigua
  const sortedNotifications = [...notifications].sort((a, b) => b.fecha - a.fecha);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          padding: 'var(--sp-2)',
          borderRadius: 'var(--r-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-500)',
          transition: 'all var(--ease-fast)',
          position: 'relative',
          '&:hover': {
            backgroundColor: 'var(--gray-100)'
          }
        }}
        title="Notificaciones"
      >
        🔔
        
        {/* Badge con conteo */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: 'var(--danger)',
              color: 'var(--white)',
              borderRadius: 'var(--r-full)',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '700',
              border: '2px solid var(--white)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 'var(--sp-2)',
            width: '320px',
            maxHeight: '400px',
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          {/* Header con botón "Marcar todas como leídas" */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: 'var(--sp-3) var(--sp-4)',
                borderBottom: '1px solid var(--gray-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  color: 'var(--gray-800)'
                }}
              >
                Notificaciones
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--eco-600)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0',
                    transition: 'color var(--ease-fast)',
                    textDecoration: 'underline'
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--eco-700)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--eco-600)')}
                >
                  Marcar como leídas
                </button>
              )}
            </div>
          )}

          {/* Lista de notificaciones */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              maxHeight: '340px'
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: 'var(--sp-6) var(--sp-4)',
                  textAlign: 'center',
                  color: 'var(--gray-500)',
                  fontSize: '0.9rem'
                }}
              >
                No tienes notificaciones nuevas.
              </div>
            ) : (
              sortedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.leida) {
                      markAsRead(notif.id);
                    }
                  }}
                  style={{
                    padding: 'var(--sp-3) var(--sp-4)',
                    borderBottom: '1px solid var(--gray-100)',
                    cursor: 'pointer',
                    transition: 'background-color var(--ease-fast)',
                    background: notif.leida ? 'transparent' : 'var(--eco-50)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--sp-3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = notif.leida
                      ? 'var(--gray-50)'
                      : 'var(--eco-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notif.leida
                      ? 'transparent'
                      : 'var(--eco-50)';
                  }}
                >
                  {/* Punto indicador */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--r-full)',
                      backgroundColor: getDotColor(notif),
                      marginTop: '4px',
                      flexShrink: 0
                    }}
                  />

                  {/* Contenido */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--gray-800)',
                        marginBottom: 'var(--sp-1)',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        fontWeight: notif.leida ? '400' : '500'
                      }}
                    >
                      {notif.mensaje}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--gray-500)'
                      }}
                    >
                      {formatDate(notif.fecha)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
