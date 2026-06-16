export default function AlertBanner({ message, type = 'warning', onClose }) {
  const isDanger = type === 'danger';
  const bgColor = isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)';
  const borderColor = isDanger ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)';
  const icon = isDanger ? '🚨' : '⚠️';

  return (
    <div 
      className="animate-slide-in"
      style={{ 
        background: bgColor, 
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {message}
        </span>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-secondary)', 
            cursor: 'pointer', fontSize: '1.2rem' 
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
