export default function SummaryCard({ title, value, icon, trend, trendLabel, type }) {
  const color = type === 'income'
    ? 'var(--color-income)'
    : type === 'expense'
      ? 'var(--color-expense)'
      : 'var(--color-primary-light)';

  return (
    <div className="glass glass-hover animate-fade-in-up" style={{ padding: '1.25rem 1.5rem', cursor: 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color }}>
            ₹{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : value}
          </p>
          {trendLabel && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
              {trend > 0 ? '▲' : trend < 0 ? '▼' : '●'} {trendLabel}
            </p>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>
          {typeof icon === 'string' && icon.endsWith('.png') ? (
            <img src={icon} alt={title} className="dark-invert" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  );
}
