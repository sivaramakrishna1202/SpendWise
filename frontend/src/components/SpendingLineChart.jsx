import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '0.75rem 1rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: 'var(--color-primary-light)', fontSize: '0.9rem', fontWeight: 700 }}>
          ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass animate-fade-in-up" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No spending data found</p>
      </div>
    );
  }

  return (
    <div className="glass animate-fade-in-up" style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Spending Over Time (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(str) => {
              const date = new Date(str);
              return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
            }}
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--color-primary-light)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--card)', stroke: 'var(--color-primary-light)', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
