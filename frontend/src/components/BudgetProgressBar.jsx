export default function BudgetProgressBar({ budget, onDelete }) {
  const { category_icon, category_name, category_color, limit_amount, spent_amount, percentage, exceeded } = budget;
  
  const width = Math.min(percentage, 100);
  const isWarning = percentage >= 90 && !exceeded;
  
  let trackColor = 'var(--text-muted)';
  if (exceeded) trackColor = 'var(--color-expense)';
  else if (isWarning) trackColor = 'var(--color-warning)';
  else trackColor = category_color;

  return (
    <div className="glass" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{category_icon}</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{category_name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: 700, color: exceeded ? 'var(--color-expense)' : 'var(--text-primary)' }}>
              ₹{spent_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {' '} / ₹{limit_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--destructive)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.625rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.target.style.background = 'var(--destructive)'; e.target.style.color = 'var(--destructive-foreground)'; e.target.style.borderColor = 'var(--destructive)'; }}
              onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--destructive)'; e.target.style.borderColor = 'var(--border)'; }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${width}%`, 
            background: trackColor,
            transition: 'width 0.5s ease-out, background 0.3s'
          }} 
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{percentage.toFixed(1)}% used</span>
        {exceeded && <span style={{ color: 'var(--color-expense)', fontWeight: 600 }}>Budget Exceeded!</span>}
        {isWarning && <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Nearing Limit</span>}
      </div>
    </div>
  );
}
